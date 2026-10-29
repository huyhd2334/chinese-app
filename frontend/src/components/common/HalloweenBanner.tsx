"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { X } from "lucide-react"
import { triggerSpookyConfetti } from "./HalloweenDecorations"

export default function HalloweenBanner() {
  const { isHalloweenTheme } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (typeof sessionStorage !== "undefined") {
      setIsDismissed(sessionStorage.getItem("hsk_dismiss_halloween_banner") === "1")
    }
  }, [])

  if (!isHalloweenTheme || isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("hsk_dismiss_halloween_banner", "1")
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-purple-950 dark:via-orange-950 dark:to-purple-900 border-b border-orange-500/30 text-white text-xs px-3 sm:px-4 py-2 flex items-center justify-between shadow-xs select-none relative z-20">
      <div className="flex items-center gap-2 truncate">
        <button
          type="button"
          onClick={triggerSpookyConfetti}
          className="text-base shrink-0 animate-bounce cursor-pointer hover:scale-125 transition-transform"
          title="Bấm để tung kẹo Halloween! 🍬"
        >
          🎃
        </button>
        <span className="font-bold tracking-wide truncate">
          <span className="hidden sm:inline">Sự kiện Vạn Thánh: </span>
          Bàn học Tiểu Lu ngập tràn không khí Halloween! 🍬
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-amber-200 hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
          title="Tắt thông báo này"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
