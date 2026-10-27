"use client"

import React, { useState } from "react"
import { LogIn, LogOut, User as UserIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface UserMenuProps {
  compact?: boolean
}

export default function UserMenu({ compact = false }: UserMenuProps) {
  const { user, isLoading, openAuthModal, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  if (isLoading) {
    return (
      <div className="h-9 w-full rounded-xl bg-china-paper/60 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className={`flex items-center gap-2 rounded-xl bg-china-ink hover:bg-china-ink/80 text-white font-semibold transition-all active:scale-95 shadow-xs ${
          compact ? "p-2 justify-center" : "px-3 py-2 text-xs w-full justify-center lg:justify-start"
        }`}
        title="Đăng nhập để đồng bộ dữ liệu"
      >
        <LogIn className="w-4 h-4 shrink-0" />
        <span className={compact ? "hidden" : "hidden lg:inline text-xs"}>
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
        className={`flex items-center gap-2 rounded-xl bg-white border border-border hover:bg-china-paper text-china-ink transition-all active:scale-95 shadow-2xs ${
          compact ? "p-1.5" : "px-2.5 py-1.5 w-full justify-center lg:justify-between"
        }`}
        title={user.email}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-china-red/10 border border-china-red/20 text-china-red flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {displayName[0]}
          </div>
          <div className={compact ? "hidden" : "hidden lg:block text-left min-w-0"}>
            <p className="text-xs font-bold text-china-ink truncate max-w-[90px]">
              {displayName}
            </p>
            <p className="text-[10px] text-china-jade font-medium">Đã đồng bộ</p>
          </div>
        </div>
        <UserIcon className={compact ? "w-4 h-4 text-muted shrink-0" : "w-3.5 h-3.5 text-muted shrink-0 hidden lg:block"} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute bottom-full mb-2 left-0 w-48 bg-card rounded-2xl border border-border shadow-xl p-2 z-40 space-y-1">
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
