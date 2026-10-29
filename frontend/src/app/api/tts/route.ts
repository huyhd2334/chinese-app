import { NextRequest, NextResponse } from "next/server"
import { createHash } from "node:crypto"
import { BoundedQueue, QueueFullError, QueueTimeoutError } from "@/lib/server/concurrency"
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/server/rateLimit"

export const runtime = "nodejs"

/**
 * TTS proxy - thiết kế chống nghẽn & chống bị upstream chặn IP:
 *  1. Rate limit theo IP (server-side).
 *  2. CDN-first: nếu có AUDIO_CDN_BASE (Cloudflare R2 chứa audio pre-generate) -> 302 redirect, server không tốn băng thông.
 *  3. LRU cache trong RAM (giới hạn dung lượng) + gộp request trùng (request coalescing).
 *  4. Gọi upstream qua hàng đợi giới hạn đồng thời (backpressure -> 503 + Retry-After khi quá tải).
 *  5. Timeout cho mỗi upstream + negative cache khi upstream lỗi.
 *  6. Header Cache-Control dài hạn để Cloudflare/Browser tự cache, các request sau không chạm tới server.
 */

const MAX_TEXT_LENGTH = 200
const CACHE_MAX_BYTES = 64 * 1024 * 1024
const NEGATIVE_TTL_MS = 30_000
const UPSTREAM_TIMEOUT_MS = 4000
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

const upstreamQueue = new BoundedQueue(6, 60, 5000)

// LRU: Map giữ thứ tự chèn -> phần tử đầu là cũ nhất
const audioCache = new Map<string, ArrayBuffer>()
let audioCacheBytes = 0
const negativeCache = new Map<string, number>()
const inflight = new Map<string, Promise<ArrayBuffer | null>>()
const cdnExistsCache = new Map<string, { exists: boolean; at: number }>()

function cacheGet(key: string): ArrayBuffer | undefined {
  const hit = audioCache.get(key)
  if (hit) {
    audioCache.delete(key)
    audioCache.set(key, hit)
  }
  return hit
}

function cacheSet(key: string, buf: ArrayBuffer) {
  if (buf.byteLength > 2 * 1024 * 1024) return
  audioCache.set(key, buf)
  audioCacheBytes += buf.byteLength
  while (audioCacheBytes > CACHE_MAX_BYTES) {
    const oldest = audioCache.keys().next().value
    if (oldest === undefined) break
    audioCacheBytes -= audioCache.get(oldest)!.byteLength
    audioCache.delete(oldest)
  }
}

/** Khóa file audio trên CDN: sha1("{lang}:{text}") - script tools/pregenerate_audio.py dùng đúng công thức này */
function audioKey(lang: string, text: string): string {
  return createHash("sha1").update(`${lang}:${text}`).digest("hex")
}

async function cdnHas(base: string, key: string): Promise<boolean> {
  const cached = cdnExistsCache.get(key)
  if (cached && Date.now() - cached.at < 3600_000) return cached.exists
  try {
    const res = await fetch(`${base}/${key}.mp3`, { method: "HEAD", signal: AbortSignal.timeout(800) })
    const exists = res.ok
    if (cdnExistsCache.size > 20_000) cdnExistsCache.clear()
    cdnExistsCache.set(key, { exists, at: Date.now() })
    return exists
  } catch {
    return false
  }
}

async function fetchAudio(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    return buf.byteLength > 200 ? buf : null
  } catch {
    return null
  }
}

async function synthesize(text: string, lang: string): Promise<ArrayBuffer | null> {
  const youdao = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=${lang === "en" ? "en" : "zh"}`
  const first = await fetchAudio(youdao)
  if (first) return first
  const google = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${
    lang === "en" ? "en" : "zh-CN"
  }&client=tw-ob`
  return fetchAudio(google)
}

const AUDIO_HEADERS = {
  "Content-Type": "audio/mpeg",
  // Browser cache 7 ngày; CDN (Cloudflare) cache 1 năm -> hầu hết request không bao giờ tới server
  "Cache-Control": "public, max-age=604800, s-maxage=31536000, immutable",
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const text = (searchParams.get("text") || "").trim().slice(0, MAX_TEXT_LENGTH)
  const lang = searchParams.get("lang") === "en" ? "en" : "zh"

  if (!text) return new NextResponse("Missing text parameter", { status: 400 })

  const rl = await rateLimit(`tts:ip:${getClientIp(req)}`, 120, 60)
  if (!rl.allowed) return tooManyRequests(rl.retryAfterSec)

  const key = audioKey(lang, text)

  // 1) Audio pre-generate trên CDN (R2) -> redirect
  const cdnBase = process.env.AUDIO_CDN_BASE?.replace(/\/$/, "")
  if (cdnBase && (await cdnHas(cdnBase, key))) {
    return NextResponse.redirect(`${cdnBase}/${key}.mp3`, {
      status: 302,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    })
  }

  // 2) RAM cache
  const hit = cacheGet(key)
  if (hit) return new NextResponse(hit, { status: 200, headers: { ...AUDIO_HEADERS, "X-Cache": "HIT" } })

  // 3) Upstream đang lỗi gần đây -> trả nhanh, không dồn thêm tải
  const negUntil = negativeCache.get(key)
  if (negUntil && negUntil > Date.now()) {
    return new NextResponse("TTS audio unavailable", { status: 502, headers: { "Retry-After": "30" } })
  }

  // 4) Gộp các request giống nhau đang bay + đi qua hàng đợi giới hạn đồng thời
  let pending = inflight.get(key)
  if (!pending) {
    pending = upstreamQueue
      .run(() => synthesize(text, lang))
      .finally(() => inflight.delete(key))
    inflight.set(key, pending)
  }

  try {
    const audio = await pending
    if (audio) {
      cacheSet(key, audio)
      return new NextResponse(audio, { status: 200, headers: { ...AUDIO_HEADERS, "X-Cache": "MISS" } })
    }
    if (negativeCache.size > 5000) negativeCache.clear()
    negativeCache.set(key, Date.now() + NEGATIVE_TTL_MS)
    return new NextResponse("TTS audio unavailable", { status: 502 })
  } catch (err) {
    if (err instanceof QueueFullError || err instanceof QueueTimeoutError) {
      return new NextResponse("Server busy, please retry", { status: 503, headers: { "Retry-After": "3" } })
    }
    return new NextResponse("TTS audio unavailable", { status: 502 })
  }
}
