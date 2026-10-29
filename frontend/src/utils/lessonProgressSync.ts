import { supabase } from "@/lib/supabase"
import { isProUser } from "./subscription"
import {
  getAllProgressRecords,
  saveAllProgressRecords,
  type LessonProgressData,
} from "./lessonProgress"

export interface LessonProgressSyncResult {
  ok: boolean
  pulled: number
  pushed: number
  skipped?: "no_user" | "offline"
  error?: string
}

const LESSON_PROGRESS_SLUG = "_sys_lesson_progress"
const DEBOUNCE_MS = 3000

let isSyncing = false
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let hooksInstalled = false
let isApplyingRemote = false

/**
 * Kiểm tra xem bài học / giáo trình có được phép đồng bộ hay không:
 * - Người dùng thường (Free): Được phép đồng bộ tiến độ sách HSK 1 và HSK 2.
 * - Người dùng Pro: Được phép đồng bộ tiến độ của TẤT CẢ các cuốn sách (HSK 1 -> 6, sách tự tải).
 */
export function isAllowedToSyncLesson(bookId: string, isPro: boolean): boolean {
  if (isPro) return true
  const lower = (bookId || "").toLowerCase()
  return (
    lower.includes("hsk1") ||
    lower.includes("hsk2") ||
    lower.includes("hsk_1") ||
    lower.includes("hsk_2") ||
    lower.includes("hsk-1") ||
    lower.includes("hsk-2")
  )
}

/**
 * Đồng bộ tiến độ bài học hai chiều giữa LocalStorage và Supabase Cloud
 */
export async function syncLessonProgressWithCloud(userId: string): Promise<LessonProgressSyncResult> {
  if (!userId || userId === "guest") {
    return { ok: false, pulled: 0, pushed: 0, skipped: "no_user" }
  }
  if (typeof window === "undefined" || !navigator.onLine) {
    return { ok: false, pulled: 0, pushed: 0, skipped: "offline" }
  }
  if (isSyncing) {
    return { ok: true, pulled: 0, pushed: 0 }
  }

  isSyncing = true
  let pulled = 0
  let pushed = 0

  try {
    const isPro = isProUser()
    const localRecords = getAllProgressRecords()

    // 1. PULL: Lấy dữ liệu tiến độ từ Supabase Cloud
    const { data: cloudRows, error: pullError } = await supabase
      .from("bonus_collections")
      .select("id, title, subtitle, badge, description, created_at")
      .eq("user_id", userId)
      .eq("slug", LESSON_PROGRESS_SLUG)

    if (pullError) {
      console.warn("Lỗi PULL tiến độ bài học từ Supabase:", pullError.message)
      return { ok: false, pulled, pushed, error: pullError.message }
    }

    const cloudMap = new Map<string, LessonProgressData>()
    let hasLocalUpdates = false

    if (cloudRows && cloudRows.length > 0) {
      for (const row of cloudRows) {
        const lessonKey = row.title // ví dụ: "new_hsk1_standard__1"
        if (!lessonKey) continue

        const [bookId] = lessonKey.split("__")
        if (!isAllowedToSyncLesson(bookId, isPro)) continue

        let desc: { completedSections?: string[]; lastStudiedAt?: number } = {}
        try {
          if (row.description) {
            desc = JSON.parse(row.description)
          }
        } catch {
          // Parse fail fallback
        }

        const cloudItem: LessonProgressData = {
          percent: Math.min(100, Math.max(0, Number(row.subtitle) || 0)),
          timeSpentSeconds: Math.max(0, Number(row.badge) || 0),
          completedSections: Array.isArray(desc.completedSections) ? desc.completedSections : [],
          lastStudiedAt: desc.lastStudiedAt || (row.created_at ? new Date(row.created_at).getTime() : 0),
        }

        cloudMap.set(lessonKey, cloudItem)

        // So sánh với bản ghi local hiện tại
        const localItem = localRecords[lessonKey]
        if (!localItem || cloudItem.lastStudiedAt > (localItem.lastStudiedAt || 0)) {
          // Cloud mới hơn -> ghi đè vào local
          localRecords[lessonKey] = cloudItem
          hasLocalUpdates = true
          pulled++
        }
      }
    }

    if (hasLocalUpdates) {
      isApplyingRemote = true
      try {
        saveAllProgressRecords(localRecords)
      } finally {
        isApplyingRemote = false
      }
    }

    // 2. PUSH: Đẩy các bài học cục bộ mới hơn hoặc chưa có trên Cloud lên Supabase
    const toPushRows: Array<{
      id: string
      user_id: string
      slug: string
      title: string
      subtitle: string
      badge: string
      description: string
      language: string
    }> = []

    for (const [lessonKey, localItem] of Object.entries(localRecords)) {
      const [bookId] = lessonKey.split("__")
      if (!isAllowedToSyncLesson(bookId, isPro)) continue

      const cloudItem = cloudMap.get(lessonKey)
      // Nếu cloud chưa có hoặc local mới hơn cloud -> đẩy lên
      if (!cloudItem || (localItem.lastStudiedAt || 0) > cloudItem.lastStudiedAt) {
        toPushRows.push({
          id: `lp_${userId}_${lessonKey}`,
          user_id: userId,
          slug: LESSON_PROGRESS_SLUG,
          title: lessonKey,
          subtitle: String(localItem.percent || 0),
          badge: String(localItem.timeSpentSeconds || 0),
          description: JSON.stringify({
            completedSections: localItem.completedSections || [],
            lastStudiedAt: localItem.lastStudiedAt || Date.now(),
          }),
          language: "zh",
        })
      }
    }

    if (toPushRows.length > 0) {
      const CHUNK = 50
      for (let i = 0; i < toPushRows.length; i += CHUNK) {
        const chunk = toPushRows.slice(i, i + CHUNK)
        const { error: pushError } = await supabase
          .from("bonus_collections")
          .upsert(chunk, { onConflict: "id" })

        if (pushError) {
          console.warn("Lỗi PUSH tiến độ bài học lên Supabase:", pushError.message)
          return { ok: false, pulled, pushed, error: pushError.message }
        }
        pushed += chunk.length
      }
    }

    if (pulled > 0 || pushed > 0) {
      window.dispatchEvent(
        new CustomEvent("hsk-lesson-progress-synced", {
          detail: { pulled, pushed },
        })
      )
    }

    return { ok: true, pulled, pushed }
  } catch (err) {
    console.error("syncLessonProgressWithCloud error:", err)
    return { ok: false, pulled, pushed, error: (err as Error).message }
  } finally {
    isSyncing = false
  }
}

/**
 * Đặt lịch đồng bộ tiến độ bài học sau khi người dùng học / làm bài tập
 */
export function scheduleLessonProgressSync(userId?: string) {
  if (typeof window === "undefined" || isApplyingRemote) return
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    debounceTimer = null
    let targetUid = userId
    if (!targetUid) {
      const { data } = await supabase.auth.getSession()
      targetUid = data.session?.user?.id
    }
    if (targetUid) {
      void syncLessonProgressWithCloud(targetUid)
    }
  }, DEBOUNCE_MS)
}

/**
 * Cài đặt hook lắng nghe thay đổi tiến độ bài học trên toàn app để tự động đồng bộ lên mây
 */
export function installLessonProgressSyncHooks() {
  if (typeof window === "undefined" || hooksInstalled) return
  hooksInstalled = true

  window.addEventListener("lesson-progress-updated", () => {
    if (!isApplyingRemote) {
      scheduleLessonProgressSync()
    }
  })
}
