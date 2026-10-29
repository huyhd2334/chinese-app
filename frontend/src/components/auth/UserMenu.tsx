"use client"

import React, { useState, useEffect } from "react"
import { LogIn, LogOut, Crown, RotateCw, Cloud, Bell } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getLocalSubscription, triggerUpgradeModal } from "@/utils/subscription"
import ThemeToggle from "@/components/common/ThemeToggle"
import styles from "@/app/sideBar.module.css"

interface UserMenuProps {
  compact?: boolean
}

export default function UserMenu({ compact = false }: UserMenuProps) {
  const {
    user,
    isLoading,
    openAuthModal,
    signOut,
    openHalloweenModal,
    isHalloweenTheme,
    toggleHalloweenTheme,
  } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncText, setLastSyncText] = useState("Vừa xong")

  useEffect(() => {
    const updateSub = () => {
      const sub = getLocalSubscription(user?.id || "guest")
      setIsPro(
        (sub.plan === "pro_monthly" || sub.plan === "pro_yearly") &&
          (!sub.expiresAt || sub.expiresAt > Date.now())
      )
    }
    updateSub()
    window.addEventListener("hsk-subscription-updated", updateSub)
    return () => window.removeEventListener("hsk-subscription-updated", updateSub)
  }, [user?.id])

  // Listen to sync events from SyncManager
  useEffect(() => {
    const handleSyncStatus = (e: Event) => {
      const detail = (e as CustomEvent)?.detail
      if (typeof detail?.syncing === "boolean") {
        setIsSyncing(detail.syncing)
      }
    }

    const handleSynced = () => {
      setLastSyncText("Vừa xong")
    }

    window.addEventListener("hsk-sync-status", handleSyncStatus)
    window.addEventListener("hsk-cloud-synced", handleSynced)

    return () => {
      window.removeEventListener("hsk-sync-status", handleSyncStatus)
      window.removeEventListener("hsk-cloud-synced", handleSynced)
    }
  }, [])

  const triggerManualSync = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hsk-request-sync"))
    }
  }

  if (isLoading) {
    return (
      <div
        className={
          compact
            ? "h-7 w-20 bg-china-paper rounded-lg animate-pulse"
            : "h-10 mx-1 rounded-xl bg-china-paper/60 animate-pulse"
        }
      />
    )
  }

  // --- MOBILE COMPACT VERSION ---
  if (compact) {
    if (!user) {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => triggerUpgradeModal("manual")}
            className="px-2.5 py-1.5 rounded-xl bg-china-paper border border-china-gold/40 text-[11px] font-bold text-china-ink hover:bg-china-gold/10 transition-colors"
          >
            {isPro ? "PRO" : "Nâng cấp"}
          </button>
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-border text-xs font-semibold text-china-ink hover:bg-china-paper transition-colors shadow-2xs active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
        </div>
      )
    }

    const displayName = user.email?.split("@")[0] || "Tài khoản"

    return (
      <div className="relative flex items-center gap-1.5">
        {!isPro && (
          <button
            onClick={() => triggerUpgradeModal("manual")}
            className="px-2 py-1 rounded-lg bg-china-red/10 text-china-red text-[10px] font-bold"
          >
            Nâng cấp Pro
          </button>
        )}
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-border text-xs font-semibold text-china-ink shadow-2xs"
        >
          <span className="w-5 h-5 rounded-full bg-china-red/10 text-china-red font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
            {displayName[0]}
          </span>
          <span className="truncate max-w-[75px]">{displayName}</span>
          {isPro && (
            <span className="px-1.5 py-0.2 bg-china-ink text-china-gold text-[9px] font-bold rounded">
              PRO
            </span>
          )}
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
            <div className="absolute top-full mt-2 right-0 w-52 bg-card rounded-2xl border border-border shadow-xl p-2 z-40 space-y-1">
              <div className="px-2.5 py-1 text-[11px] text-muted truncate border-b border-border">
                {user.email}
              </div>

              {/* Pro plan action */}
              <button
                onClick={() => {
                  setShowDropdown(false)
                  triggerUpgradeModal("manual")
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-china-ink hover:bg-china-paper transition-colors font-semibold text-left"
              >
                <Crown className="w-3.5 h-3.5 text-china-gold shrink-0" />
                <span>{isPro ? "Quản lý Gói Pro" : "Nâng cấp Gói Pro"}</span>
              </button>

              {/* Sync Status Button */}
              <button
                onClick={triggerManualSync}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-china-ink hover:bg-china-paper transition-colors font-medium text-left"
                title="Tự động đồng bộ mỗi 5 phút hoặc bấm để đồng bộ ngay"
              >
                <div className="flex items-center gap-2">
                  <Cloud className="w-3.5 h-3.5 text-china-jade shrink-0" />
                  <span>Đồng bộ đám mây</span>
                </div>
                <RotateCw
                  className={`w-3 h-3 text-muted ${isSyncing ? "animate-spin text-china-jade" : ""}`}
                />
              </button>

              {/* Dark Mode Toggle */}
              <ThemeToggle variant="menu-row" />

              {/* Halloween Event Toggle */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-china-ink hover:bg-china-paper transition-colors">
                <div className="flex items-center gap-2">
                  <span>🎃</span>
                  <span className="font-semibold">Sự kiện Vạn Thánh</span>
                </div>
                <button
                  type="button"
                  onClick={toggleHalloweenTheme}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    isHalloweenTheme ? "bg-amber-500 justify-end" : "bg-neutral-300 justify-start"
                  }`}
                  title={isHalloweenTheme ? "Tắt hiệu ứng Halloween" : "Bật hiệu ứng Halloween"}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs" />
                </button>
              </div>

              {/* Notification Modal Trigger (if event enabled) */}
              {isHalloweenTheme && (
                <button
                  onClick={() => {
                    setShowDropdown(false)
                    openHalloweenModal()
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors font-bold text-left"
                >
                  <span>🎃</span>
                  <span>Thông báo</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowDropdown(false)
                  signOut()
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  // --- DESKTOP SIDEBAR VERSION ---
  const displayName = user?.email?.split("@")[0] || "Tài khoản"

  return (
    <div className="space-y-1 w-full">
      {/* Nút Gói Pro căn đều với các mục Sidebar */}
      <button
        onClick={() => triggerUpgradeModal("manual")}
        className={`${styles.option} w-full justify-center lg:justify-start cursor-pointer text-left`}
        title={isPro ? "Đang sử dụng Gói Pro" : "Nâng cấp Pro để mở khóa không giới hạn từ"}
      >
        <Crown className="w-5 h-5 text-china-gold shrink-0" />
        <span className="hidden lg:inline font-bold text-china-ink truncate">
          {isPro ? "Tài khoản Pro" : "Nâng cấp Pro"}
        </span>
      </button>

      {/* Account Info Desktop */}
      {!user ? (
        <button
          onClick={openAuthModal}
          className={`${styles.option} w-full justify-center lg:justify-start cursor-pointer text-left`}
        >
          <LogIn className="w-5 h-5 shrink-0 text-china-ink" />
          <span className="hidden lg:inline font-semibold text-china-ink truncate">Đăng nhập</span>
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-china-paper transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-china-red/10 text-china-red font-black text-sm flex items-center justify-center uppercase shrink-0 border border-china-red/20 shadow-2xs">
              {displayName[0]}
            </div>

            <div className="hidden lg:flex flex-col min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-china-ink truncate max-w-[95px]">
                  {displayName}
                </span>
                {isPro && (
                  <span className="px-1 py-0.2 bg-china-ink text-china-gold text-[9px] font-bold rounded">
                    PRO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-china-jade font-semibold">
                <Cloud className="w-3 h-3 shrink-0" />
                <span>{isSyncing ? "Đang đồng bộ..." : "Đã đồng bộ"}</span>
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute bottom-full mb-2 left-0 w-56 bg-card rounded-2xl border border-border shadow-xl p-2 z-40 space-y-1">
                <div className="px-2.5 py-1.5 border-b border-border text-[11px] text-muted truncate">
                  {user.email}
                </div>

                <button
                  onClick={() => {
                    setShowDropdown(false)
                    triggerUpgradeModal("manual")
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-china-ink hover:bg-china-paper transition-colors font-semibold text-left cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-china-gold shrink-0" />
                  <span>{isPro ? "Thông tin Gói Pro" : "Nâng cấp Gói Pro"}</span>
                </button>

                {/* Manual Sync Cloud Button */}
                <button
                  onClick={triggerManualSync}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-china-ink hover:bg-china-paper transition-colors font-medium text-left cursor-pointer"
                  title="Tự động đồng bộ mỗi 5 phút hoặc bấm để đồng bộ ngay"
                >
                  <div className="flex items-center gap-2">
                    <Cloud className="w-3.5 h-3.5 text-china-jade shrink-0" />
                    <span>Đồng bộ đám mây</span>
                  </div>
                  <RotateCw
                    className={`w-3 h-3 text-muted ${isSyncing ? "animate-spin text-china-jade" : ""}`}
                  />
                </button>

                {/* Dark Mode Toggle */}
                <ThemeToggle variant="menu-row" />

                {/* Halloween Event Toggle */}
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-china-ink hover:bg-china-paper transition-colors">
                  <div className="flex items-center gap-2">
                    <span>🎃</span>
                    <span className="font-semibold">Sự kiện Vạn Thánh</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleHalloweenTheme}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      isHalloweenTheme ? "bg-amber-500 justify-end" : "bg-neutral-300 justify-start"
                    }`}
                    title={isHalloweenTheme ? "Tắt hiệu ứng Halloween" : "Bật hiệu ứng Halloween"}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs" />
                  </button>
                </div>

                {/* Notification Modal (if enabled) */}
                {isHalloweenTheme && (
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      openHalloweenModal()
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors font-bold text-left cursor-pointer"
                  >
                    <span>🎃</span>
                    <span>Thông báo</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowDropdown(false)
                    signOut()
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
