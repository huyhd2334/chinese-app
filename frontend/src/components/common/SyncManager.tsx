"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { installSrsSyncHooks, syncSrsNow } from "@/utils/srsCloudSync"
import { syncSubscriptionWithCloud } from "@/utils/subscription"

/**
 * Mount 1 lần trong layout: giữ gói cước + dữ liệu SRS luôn đồng bộ (đăng nhập, quay lại tab, có mạng lại, mỗi 5 phút).
 * Không render gì.
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
      await syncSubscriptionWithCloud(uid) // làm mới trạng thái Pro (hết hạn / gia hạn) từ server
      if (!cancelled) await syncSrsNow()
    }

    void run()
    const onVisible = () => {
      if (document.visibilityState === "visible") void run()
    }
    const onOnline = () => void run()
    const onSubUpdated = () => void syncSrsNow()

    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("online", onOnline)
    window.addEventListener("hsk-subscription-updated", onSubUpdated)
    const timer = setInterval(run, 5 * 60 * 1000)

    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("online", onOnline)
      window.removeEventListener("hsk-subscription-updated", onSubUpdated)
    }
  }, [uid])

  return null
}
