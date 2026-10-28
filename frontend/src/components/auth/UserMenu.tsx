"use client"

import React, { useState, useEffect } from "react"
import { LogIn, LogOut, Crown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getLocalSubscription, triggerUpgradeModal } from "@/utils/subscription"
import styles from "@/app/sideBar.module.css"

interface UserMenuProps {
  compact?: boolean
}

export default function UserMenu({ compact = false }: UserMenuProps) {
  const { user, isLoading, openAuthModal, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isPro, setIsPro] = useState(false)

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

  if (isLoading) {
    return (
      <div className={compact ? "h-7 w-20 bg-china-paper rounded-lg animate-pulse" : "h-10 mx-1 rounded-xl bg-china-paper/60 animate-pulse"} />
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
          onClick={() => setShowDropdown(prev => !prev)}
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
            <div className="absolute top-full mt-2 right-0 w-48 bg-card rounded-2xl border border-border shadow-xl p-2 z-40 space-y-1">
              <div className="px-2.5 py-1 text-[11px] text-muted truncate border-b border-border">
                {user.email}
              </div>
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
        <Crown className={`w-5 h-5 shrink-0 ${isPro ? "text-china-gold" : "text-muted"}`} />
        <span className="hidden lg:inline text-sm font-semibold text-china-ink truncate">
          {isPro ? "Thành viên Pro" : "Nâng cấp Pro"}
        </span>
      </button>

      {!user ? (
        <button
          onClick={openAuthModal}
          className={`${styles.option} w-full justify-center lg:justify-start cursor-pointer text-left`}
          title="Đăng nhập để đồng bộ dữ liệu"
        >
          <LogIn className="w-5 h-5 shrink-0 text-muted" />
          <span className="hidden lg:inline text-sm font-semibold text-china-ink">
            Đăng nhập
          </span>
        </button>
      ) : (
        <div className="relative w-full">
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className={`${styles.option} w-full justify-center lg:justify-start cursor-pointer text-left`}
            title={user.email}
          >
            <div className="w-6 h-6 rounded-full bg-china-red/10 border border-china-red/30 text-china-red flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {displayName[0]}
            </div>
            <div className="hidden lg:flex flex-col min-w-0 leading-tight">
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
              <span className="text-[10px] text-china-jade font-semibold">Đã đồng bộ</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute bottom-full mb-2 left-0 w-52 bg-card rounded-2xl border border-border shadow-xl p-2 z-40 space-y-1">
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
