import { supabase } from "@/lib/supabase"
import type { UserRoadmap } from "@/types/roadmap"
import { getStoredRoadmap, saveRoadmapLocalOnly, clearRoadmapLocalOnly } from "./roadmapStorage"

const ROADMAP_SLUG = "_sys_roadmap"
let isSyncing = false

export interface RoadmapSyncResult {
  ok: boolean
  pulled: boolean
  pushed: boolean
  error?: string
}

/**
 * Đồng bộ lộ trình cá nhân giữa LocalStorage và Supabase Cloud (bảng bonus_collections)
 */
export async function syncRoadmapWithCloud(userId: string): Promise<RoadmapSyncResult> {
  if (!userId || userId === "guest") {
    return { ok: false, pulled: false, pushed: false }
  }
  if (typeof window === "undefined" || !navigator.onLine) {
    return { ok: false, pulled: false, pushed: false }
  }
  if (isSyncing) {
    return { ok: true, pulled: false, pushed: false }
  }

  isSyncing = true
  let pulled = false
  let pushed = false

  try {
    const localRoadmap = getStoredRoadmap(userId)

    // 1. PULL: Lấy dữ liệu lộ trình từ Cloud
    const { data: cloudRows, error: pullError } = await supabase
      .from("bonus_collections")
      .select("id, title, subtitle, badge, description, created_at")
      .eq("user_id", userId)
      .eq("slug", ROADMAP_SLUG)
      .limit(1)

    if (pullError) {
      console.warn("Lỗi PULL lộ trình từ Supabase:", pullError.message)
      return { ok: false, pulled, pushed, error: pullError.message }
    }

    const cloudRow = cloudRows && cloudRows.length > 0 ? cloudRows[0] : null
    let remoteRoadmap: UserRoadmap | null = null

    if (cloudRow && cloudRow.description) {
      try {
        remoteRoadmap = JSON.parse(cloudRow.description) as UserRoadmap
      } catch {
        remoteRoadmap = null
      }
    }

    // 2. So sánh và hòa giải xung đột (Last-Write-Wins)
    if (remoteRoadmap) {
      if (!localRoadmap || remoteRoadmap.updatedAt > (localRoadmap.updatedAt || 0)) {
        // Cloud mới hơn -> Cập nhật local
        saveRoadmapLocalOnly(remoteRoadmap, userId)
        pulled = true
        window.dispatchEvent(new CustomEvent("roadmap-updated", { detail: remoteRoadmap }))
      } else if (localRoadmap && (localRoadmap.updatedAt || 0) > remoteRoadmap.updatedAt) {
        // Local mới hơn -> Đẩy lên Cloud
        await pushRoadmapToCloud(userId, localRoadmap)
        pushed = true
      }
    } else if (localRoadmap) {
      // Cloud chưa có nhưng Local đã có -> Đẩy local lên Cloud
      await pushRoadmapToCloud(userId, localRoadmap)
      pushed = true
    }

    return { ok: true, pulled, pushed }
  } catch (err) {
    console.warn("Lỗi syncRoadmapWithCloud:", err)
    return { ok: false, pulled, pushed, error: (err as Error).message }
  } finally {
    isSyncing = false
  }
}

/**
 * Đẩy lộ trình của user lên Supabase Cloud
 */
export async function pushRoadmapToCloud(userId: string, roadmap: UserRoadmap): Promise<boolean> {
  if (!userId || userId === "guest" || typeof window === "undefined" || !navigator.onLine) {
    return false
  }

  try {
    const rowId = `${userId}_roadmap`
    const { error } = await supabase.from("bonus_collections").upsert(
      {
        id: rowId,
        user_id: userId,
        slug: ROADMAP_SLUG,
        title: roadmap.goalType,
        subtitle: String(roadmap.targetLevel),
        badge: roadmap.targetDate,
        description: JSON.stringify(roadmap),
        language: "zh",
      },
      { onConflict: "id" }
    )

    if (error) {
      console.warn("Lỗi pushRoadmapToCloud:", error.message)
      return false
    }

    return true
  } catch (err) {
    console.warn("Lỗi khi push roadmap:", err)
    return false
  }
}

/**
 * Xóa lộ trình trên Supabase Cloud
 */
export async function deleteRoadmapFromCloud(userId: string): Promise<boolean> {
  if (!userId || userId === "guest" || typeof window === "undefined" || !navigator.onLine) {
    return false
  }

  try {
    const rowId = `${userId}_roadmap`
    const { error } = await supabase
      .from("bonus_collections")
      .delete()
      .eq("id", rowId)
      .eq("user_id", userId)

    if (error) {
      console.warn("Lỗi deleteRoadmapFromCloud:", error.message)
      return false
    }

    return true
  } catch (err) {
    console.warn("Lỗi khi delete roadmap:", err)
    return false
  }
}
