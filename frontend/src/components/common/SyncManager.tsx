"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { installSrsSyncHooks, syncSrsNow } from "@/utils/srsCloudSync"
import { syncSubscriptionWithCloud } from "@/utils/subscription"
import { syncCollectionsWithCloud } from "@/utils/bonusCloudSync"
import { installLessonProgressSyncHooks, syncLessonProgressWithCloud } from "@/utils/lessonProgressSync"

/**
 * Mount 1 lần trong layout: giữ gói cước, từ vựng SRS & bộ thẻ Bonus luôn đồng bộ
 * - Ngay khi đăng nhập (uid thay đổi)
 * - Tự động định kỳ mỗi 5 phút
 * - Khi quay lại tab (visibilitychange) hoặc mạng kết nối lại (online)
 * - Khi có yêu cầu đồng bộ thủ công từ UserMenu (hsk-request-sync)
 */
export default function SyncManager() {
  const { user } = useAuth()
  const uid = user?.id
  const lastRunTimeRef = useRef<number>(0)
  const isRunningRef = useRef<boolean>(false)

  useEffect(() => {
    installSrsSyncHooks()
    installLessonProgressSyncHooks()
  }, [])

  useEffect(() => {
    if (!uid) return
    let cancelled = false

    const run = async (force = false) => {
      if (cancelled) return
      const now = Date.now()

      // Debounce: Không chạy 2 lần trong vòng 20 giây trừ khi force
      if (!force && now - lastRunTimeRef.current < 20000) return
      if (isRunningRef.current) return

      isRunningRef.current = true
      lastRunTimeRef.current = now

      try {
        window.dispatchEvent(new CustomEvent("hsk-sync-status", { detail: { syncing: true } }))

        // 1. Làm mới trạng thái gói cước Pro từ server
        await syncSubscriptionWithCloud(uid)

        // 2. Đồng bộ tiến độ từ vựng SRS với Supabase (Free: 500 từ, Pro: Không giới hạn)
        if (!cancelled) {
          await syncSrsNow()
        }

        // 3. Đồng bộ tiến độ bài học giáo trình (Free: HSK 1 & 2, Pro: Toàn bộ sách)
        if (!cancelled) {
          await syncLessonProgressWithCloud(uid)
        }

        // 4. Đồng bộ bộ thẻ từ vựng mở rộng Bonus
        if (!cancelled) {
          await syncCollectionsWithCloud(uid)
        }

        if (!cancelled) {
          const timestamp = Date.now()
          if (typeof window !== "undefined") {
            localStorage.setItem("hsk_last_sync_time", String(timestamp))
          }
          window.dispatchEvent(
            new CustomEvent("hsk-cloud-synced", {
              detail: { time: timestamp, ok: true },
            })
          )
        }
      } catch (err) {
        console.warn("Lỗi khi tự động đồng bộ:", err)
      } finally {
        isRunningRef.current = false
        // Đảm bảo trạng thái hiển thị mượt mà, không nhấp nháy
        setTimeout(() => {
          if (!cancelled) {
            window.dispatchEvent(new CustomEvent("hsk-sync-status", { detail: { syncing: false } }))
          }
        }, 500)
      }
    }

    // Chạy đồng bộ ngay khi người dùng đăng nhập
    void run(true)

    const onVisible = () => {
      if (document.visibilityState === "visible") void run()
    }
    const onOnline = () => void run(true)
    const onRequestSync = () => void run(true)

    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("online", onOnline)
    window.addEventListener("hsk-request-sync", onRequestSync)

    // Tự động đồng bộ định kỳ mỗi 5 phút
    const timer = setInterval(() => void run(), 5 * 60 * 1000)

    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("online", onOnline)
      window.removeEventListener("hsk-request-sync", onRequestSync)
    }
  }, [uid])

  return null
}
