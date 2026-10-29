"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { installSrsSyncHooks, syncSrsNow } from "@/utils/srsCloudSync"
import { syncSubscriptionWithCloud } from "@/utils/subscription"
import { syncCollectionsWithCloud } from "@/utils/bonusCloudSync"

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

  useEffect(() => {
    installSrsSyncHooks()
  }, [])

  useEffect(() => {
    if (!uid) return
    let cancelled = false

    const run = async () => {
      if (cancelled) return
      try {
        window.dispatchEvent(new CustomEvent("hsk-sync-status", { detail: { syncing: true } }))

        // 1. Làm mới trạng thái gói cước Pro từ server
        await syncSubscriptionWithCloud(uid)

        // 2. Đồng bộ tiến độ từ vựng SRS với Supabase
        if (!cancelled) {
          await syncSrsNow()
        }

        // 3. Đồng bộ bộ thẻ từ vựng mở rộng Bonus
        if (!cancelled) {
          await syncCollectionsWithCloud(uid)
        }

        if (!cancelled) {
          const now = Date.now()
          if (typeof window !== "undefined") {
            localStorage.setItem("hsk_last_sync_time", String(now))
          }
          window.dispatchEvent(
            new CustomEvent("hsk-cloud-synced", {
              detail: { time: now, ok: true },
            })
          )
        }
      } catch (err) {
        console.warn("Lỗi khi tự động đồng bộ:", err)
      } finally {
        window.dispatchEvent(new CustomEvent("hsk-sync-status", { detail: { syncing: false } }))
      }
    }

    // Chạy đồng bộ ngay khi người dùng đăng nhập
    void run()

    const onVisible = () => {
      if (document.visibilityState === "visible") void run()
    }
    const onOnline = () => void run()
    const onSubUpdated = () => void run()
    const onRequestSync = () => void run()

    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("online", onOnline)
    window.addEventListener("hsk-subscription-updated", onSubUpdated)
    window.addEventListener("hsk-request-sync", onRequestSync)

    // Tự động đồng bộ định kỳ mỗi 5 phút
    const timer = setInterval(run, 5 * 60 * 1000)

    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("online", onOnline)
      window.removeEventListener("hsk-subscription-updated", onSubUpdated)
      window.removeEventListener("hsk-request-sync", onRequestSync)
    }
  }, [uid])

  return null
}
