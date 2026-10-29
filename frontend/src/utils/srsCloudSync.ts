import { db, type ReviewItem } from "../../db/database"
import { supabase } from "@/lib/supabase"
import { isProUser, FREE_REVIEW_LIMIT } from "./subscription"

/**
 * Đồng bộ ôn tập từ vựng SRS đa thiết bị theo mô hình Local-First:
 *  - IndexedDB (Dexie) vẫn là nơi đọc/ghi chính -> học offline, độ trễ 0ms.
 *  - Nền: kéo thay đổi mới từ Supabase (pull) rồi đẩy thay đổi cục bộ lên (push).
 *  - Giải quyết xung đột: Last-Write-Wins theo `updatedAt` của từng thẻ.
 *  - Người dùng Thường (Free): Đồng bộ tối đa 500 từ vựng cốt lõi.
 *  - Người dùng Pro: Đồng bộ không giới hạn toàn bộ kho từ vựng.
 */

const PAGE_SIZE = 500
const PUSH_CHUNK = 250
const DEBOUNCE_MS = 4000

interface RemoteSrsRow {
  id: string
  user_id: string
  word_id: string
  status: ReviewItem["status"]
  due_at: number
  interval: number
  ease_factor: number
  repetitions: number
  correct_count: number
  wrong_count: number
  created_at: number
  updated_at: number
}

const pullKey = (uid: string) => `hsk_srs_pull_${uid}`
const pushKey = (uid: string) => `hsk_srs_push_${uid}`
const OWNER_KEY = "hsk_srs_owner"

let syncing: Promise<SyncResult> | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let hooksInstalled = false
let isApplyingRemote = false

export interface SyncResult {
  ok: boolean
  pulled: number
  pushed: number
  skipped?: "no_user" | "offline"
  error?: string
}

function readNumber(key: string): number {
  if (typeof window === "undefined") return 0
  const n = Number(localStorage.getItem(key))
  return Number.isFinite(n) ? n : 0
}

function toRow(uid: string, item: ReviewItem): RemoteSrsRow {
  return {
    id: `${uid}_${item.wordId}`,
    user_id: uid,
    word_id: item.wordId,
    status: item.status,
    due_at: Math.round(item.dueAt),
    interval: Math.round(item.interval),
    ease_factor: item.easeFactor,
    repetitions: item.repetitions,
    correct_count: item.correctCount,
    wrong_count: item.wrongCount,
    created_at: Math.round(item.createdAt),
    updated_at: Math.round(item.updatedAt),
  }
}

async function getSessionUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user?.id ?? null
}

async function runSync(uid: string, maxWords: number): Promise<SyncResult> {
  // Lần đầu một tài khoản dùng trình duyệt này: nếu máy đang giữ dữ liệu của tài khoản KHÁC,
  // không đẩy dữ liệu cũ đó lên tài khoản hiện tại (tránh lẫn dữ liệu giữa 2 người dùng).
  const owner = localStorage.getItem(OWNER_KEY)
  if (owner && owner !== uid && !localStorage.getItem(pushKey(uid))) {
    localStorage.setItem(pushKey(uid), String(Date.now()))
  }
  localStorage.setItem(OWNER_KEY, uid)

  let pulled = 0
  let pushed = 0
  const remoteUpdated = new Map<string, number>()

  // ---------- PULL ----------
  const lastPull = readNumber(pullKey(uid))
  let maxRemote = lastPull

  for (let from = 0; ; from += PAGE_SIZE) {
    if (Number.isFinite(maxWords) && pulled >= maxWords) break

    const limit = Number.isFinite(maxWords) ? Math.min(PAGE_SIZE, maxWords - pulled) : PAGE_SIZE

    const { data, error } = await supabase
      .from("review_items")
      .select("*")
      .eq("user_id", uid)
      .gt("updated_at", lastPull)
      .order("updated_at", { ascending: true })
      .order("word_id", { ascending: true })
      .range(from, from + limit - 1)

    if (error) {
      console.warn("Lỗi PULL review_items từ Supabase:", error.message)
      return { ok: false, pulled, pushed, error: error.message }
    }

    const rows = (data || []) as RemoteSrsRow[]
    if (rows.length === 0) break

    const locals = await db.reviewItems
      .where("wordId")
      .anyOf(rows.map((r) => r.word_id))
      .toArray()
    const localByWord = new Map(locals.map((l) => [l.wordId, l]))

    const toWrite: ReviewItem[] = []
    for (const r of rows) {
      maxRemote = Math.max(maxRemote, r.updated_at)
      remoteUpdated.set(r.word_id, r.updated_at)
      const local = localByWord.get(r.word_id)
      if (local && local.updatedAt >= r.updated_at) continue // local mới hơn hoặc bằng -> giữ local

      toWrite.push({
        id: local?.id ?? r.id ?? crypto.randomUUID(),
        wordId: r.word_id,
        status: r.status,
        dueAt: r.due_at,
        interval: r.interval,
        easeFactor: r.ease_factor,
        repetitions: r.repetitions,
        correctCount: r.correct_count,
        wrongCount: r.wrong_count,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })
    }

    if (toWrite.length > 0) {
      isApplyingRemote = true
      try {
        await db.reviewItems.bulkPut(toWrite)
      } finally {
        isApplyingRemote = false
      }
      pulled += toWrite.length
    }

    if (rows.length < limit) break
  }
  localStorage.setItem(pullKey(uid), String(maxRemote))

  // ---------- PUSH ----------
  const lastPush = readNumber(pushKey(uid))
  const allLocal = await db.reviewItems.toArray()
  const dirty = allLocal.filter((i) => {
    if (i.updatedAt <= lastPush) return false
    const remoteTs = remoteUpdated.get(i.wordId)
    return remoteTs === undefined || i.updatedAt > remoteTs
  })

  // Áp dụng giới hạn 500 từ cho người dùng thường, người dùng Pro không giới hạn
  const eligibleDirty = Number.isFinite(maxWords) ? dirty.slice(0, maxWords) : dirty

  let maxPushed = lastPush
  for (let i = 0; i < eligibleDirty.length; i += PUSH_CHUNK) {
    const chunk = eligibleDirty.slice(i, i + PUSH_CHUNK)
    const { error } = await supabase
      .from("review_items")
      .upsert(chunk.map((it) => toRow(uid, it)), { onConflict: "id" })

    if (error) {
      console.warn("Lỗi PUSH review_items lên Supabase:", error.message)
      if (maxPushed > lastPush) localStorage.setItem(pushKey(uid), String(maxPushed))
      return { ok: false, pulled, pushed, error: error.message }
    }

    pushed += chunk.length
    for (const it of chunk) maxPushed = Math.max(maxPushed, it.updatedAt)
  }

  if (maxPushed > lastPush) localStorage.setItem(pushKey(uid), String(maxPushed))

  return { ok: true, pulled, pushed }
}

/**
 * Đồng bộ ngay:
 * - Người dùng Free: Đồng bộ tối đa 500 từ vựng.
 * - Người dùng Pro: Đồng bộ không giới hạn toàn bộ từ vựng.
 */
export function syncSrsNow(): Promise<SyncResult> {
  if (typeof window === "undefined") return Promise.resolve({ ok: false, pulled: 0, pushed: 0 })
  if (syncing) return syncing

  syncing = (async () => {
    try {
      if (!navigator.onLine) return { ok: false, pulled: 0, pushed: 0, skipped: "offline" as const }
      const uid = await getSessionUserId()
      if (!uid) return { ok: false, pulled: 0, pushed: 0, skipped: "no_user" as const }

      const isPro = isProUser()
      const maxWords = isPro ? Infinity : FREE_REVIEW_LIMIT

      const result = await runSync(uid, maxWords)
      if (result.ok && (result.pulled > 0 || result.pushed > 0)) {
        window.dispatchEvent(new CustomEvent("hsk-srs-synced", { detail: result }))
      }
      return result
    } catch (err) {
      return { ok: false, pulled: 0, pushed: 0, error: (err as Error).message }
    } finally {
      syncing = null
    }
  })()
  return syncing
}

/** Đặt lịch đồng bộ sau một khoảng nghỉ (debounce) - gọi sau mỗi thao tác học để gom nhiều thay đổi */
export function scheduleSrsSync() {
  if (typeof window === "undefined") return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void syncSrsNow()
  }, DEBOUNCE_MS)
}

async function deleteRemote(wordId: string) {
  try {
    if (!navigator.onLine) return
    const uid = await getSessionUserId()
    if (!uid) return
    await supabase.from("review_items").delete().eq("user_id", uid).eq("word_id", wordId)
  } catch {
    // Best-effort: lần sau thẻ vẫn nằm trên cloud nhưng không ảnh hưởng dữ liệu local
  }
}

/**
 * Cài hook vào bảng Dexie: mọi thao tác thêm/sửa/xóa thẻ (ở bất kỳ đâu trong app) tự đặt lịch đồng bộ.
 * Nhờ vậy không cần sửa từng nơi gọi reviewRepository.
 */
export function installSrsSyncHooks() {
  if (hooksInstalled) return
  hooksInstalled = true

  db.reviewItems.hook("creating", () => {
    if (!isApplyingRemote) scheduleSrsSync()
  })
  db.reviewItems.hook("updating", () => {
    if (!isApplyingRemote) scheduleSrsSync()
  })
  db.reviewItems.hook("deleting", (_primKey, obj) => {
    if (isApplyingRemote) return
    void deleteRemote((obj as ReviewItem).wordId)
  })
}
