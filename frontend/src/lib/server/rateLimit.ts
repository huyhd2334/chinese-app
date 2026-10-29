import "server-only"
import type { NextRequest } from "next/server"

/**
 * Rate limiter phía SERVER (không thể bypass từ trình duyệt).
 *
 * - Có UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN  -> dùng Redis (chia sẻ giữa mọi instance serverless).
 * - Không có -> fallback bộ nhớ trong tiến trình (đủ cho 1 VPS / dev; có dọn rác chống tràn RAM).
 *
 * Thuật toán: fixed-window counter (INCR + EXPIRE) - rẻ, chính xác đủ để chống spam/DoS tầng ứng dụng.
 */

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSec: number
}

const memoryStore = new Map<string, { count: number; resetAt: number }>()
let lastSweep = 0
const MAX_MEMORY_KEYS = 50_000

function sweep(now: number) {
  if (now - lastSweep < 30_000 && memoryStore.size < MAX_MEMORY_KEYS) return
  lastSweep = now
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt <= now) memoryStore.delete(key)
  }
  // Bảo vệ cuối: nếu vẫn quá lớn (tấn công nhiều IP giả) -> xóa phần cũ nhất
  if (memoryStore.size >= MAX_MEMORY_KEYS) {
    let toDrop = Math.floor(MAX_MEMORY_KEYS / 4)
    for (const key of memoryStore.keys()) {
      memoryStore.delete(key)
      if (--toDrop <= 0) break
    }
  }
}

function memoryLimit(key: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now()
  sweep(now)
  const entry = memoryStore.get(key)
  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSec * 1000 })
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 }
  }
  entry.count += 1
  if (entry.count > limit) {
    return { allowed: false, remaining: 0, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
  }
  return { allowed: true, remaining: limit - entry.count, retryAfterSec: 0 }
}

async function redisLimit(key: string, limit: number, windowSec: number): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSec), "NX"],
        ["TTL", key],
      ]),
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    })
    if (!res.ok) return null
    const out = (await res.json()) as Array<{ result?: number }>
    const count = Number(out?.[0]?.result ?? 0)
    const ttl = Number(out?.[2]?.result ?? windowSec)
    if (count > limit) {
      return { allowed: false, remaining: 0, retryAfterSec: Math.max(1, ttl) }
    }
    return { allowed: true, remaining: Math.max(0, limit - count), retryAfterSec: 0 }
  } catch {
    // Redis lỗi -> không chặn người dùng thật, rơi về bộ nhớ trong
    return null
  }
}

export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`
  const viaRedis = await redisLimit(redisKey, limit, windowSec)
  return viaRedis ?? memoryLimit(redisKey, limit, windowSec)
}

/** IP thật của client (ưu tiên header do Cloudflare / proxy tin cậy đặt) */
export function getClientIp(req: NextRequest | Request): string {
  const h = req.headers
  const cf = h.get("cf-connecting-ip")
  if (cf) return cf.trim()
  const xff = h.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return h.get("x-real-ip")?.trim() || "unknown"
}

export function tooManyRequests(retryAfterSec: number, message = "Too many requests") {
  return new Response(JSON.stringify({ error: message, retryAfterSec }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSec),
      "Cache-Control": "no-store",
    },
  })
}
