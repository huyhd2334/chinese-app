"use client"

import React, { useState } from "react"
import { LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import styles from "@/app/sideBar.module.css"

interface UserMenuProps {
  compact?: boolean
}

export default function UserMenu({ compact = false }: UserMenuProps) {
  const { user, isLoading, openAuthModal, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  if (isLoading) {
    return (
      <div className={compact ? "h-7 w-20 bg-china-paper rounded-lg animate-pulse" : "h-10 mx-1 rounded-xl bg-china-paper/60 animate-pulse"} />
    )
  }

  // --- MOBILE COMPACT VERSION ---
  if (compact) {
    if (!user) {
      return (
        <button
          onClick={openAuthModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-border text-xs font-semibold text-china-ink hover:bg-china-paper transition-colors shadow-2xs active:scale-95"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Đăng nhập</span>
        </button>
      )
    }

    const displayName = user.email?.split("@")[0] || "Tài khoản"

    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(prev => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-border text-xs font-semibold text-china-ink shadow-2xs"
        >
          <span className="w-5 h-5 rounded-full bg-china-red/10 text-china-red font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
            {displayName[0]}
          </span>
          <span className="truncate max-w-[80px]">{displayName}</span>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
            <div className="absolute top-full mt-2 right-0 w-44 bg-card rounded-2xl border border-border shadow-xl p-2 z-40 space-y-1">
              <div className="px-2.5 py-1 text-[11px] text-muted truncate border-b border-border">
                {user.email}
              </div>
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
  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className={`${styles.option} justify-center lg:justify-start rounded-xl mx-1 w-[calc(100%-8px)] cursor-pointer text-left hover:text-china-ink hover:bg-white/60 transition-all`}
        title="Đăng nhập để đồng bộ dữ liệu"
      >
        <LogIn className="w-5 h-5 shrink-0 text-muted" />
        <span className="hidden lg:inline text-sm font-medium text-china-ink">
          Đăng nhập
        </span>
      </button>
    )
  }

  const displayName = user.email?.split("@")[0] || "Tài khoản"

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(prev => !prev)}
        className={`${styles.option} justify-center lg:justify-start rounded-xl mx-1 w-[calc(100%-8px)] cursor-pointer text-left hover:bg-white/70 transition-all`}
        title={user.email}
      >
        <div className="w-5 h-5 rounded-full bg-china-red/10 border border-china-red/30 text-china-red flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
          {displayName[0]}
        </div>
        <div className="hidden lg:flex flex-col min-w-0 leading-tight">
          <span className="text-sm font-semibold text-china-ink truncate max-w-[110px]">
            {displayName}
          </span>
          <span className="text-[10px] text-china-jade font-medium">Đã đồng bộ</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute bottom-full mb-2 left-2 w-48 bg-card rounded-2xl border border-border shadow-xl p-2 z-40 space-y-1">
            <div className="px-2.5 py-1.5 border-b border-border text-[11px] text-muted truncate">
              {user.email}
            </div>
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
