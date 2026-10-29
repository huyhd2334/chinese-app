"use client"

import React from "react"
import { Sun, Moon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface ThemeToggleProps {
  variant?: "pill" | "icon" | "menu-row"
  className?: string
}

export default function ThemeToggle({ variant = "pill", className = "" }: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useAuth()

  if (variant === "menu-row") {
    return (
      <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-china-ink hover:bg-china-paper transition-colors ${className}`}>
        <div className="flex items-center gap-2">
          {isDarkMode ? (
            <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className="font-semibold">Giao diện Ban đêm</span>
        </div>
        <button
          type="button"
          onClick={toggleDarkMode}
          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
            isDarkMode ? "bg-amber-500 justify-end" : "bg-neutral-300 justify-start"
          }`}
          title={isDarkMode ? "Chuyển sang giao diện Sáng (Giấy Tuyên)" : "Chuyển sang giao diện Tối (Nghiên Mực)"}
          aria-label="Toggle dark mode"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs" />
        </button>
      </div>
    )
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleDarkMode}
        className={`p-2 rounded-xl text-china-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center ${className}`}
        title={isDarkMode ? "Đang là Tối — Bấm để chuyển sang Sáng (Giấy Tuyên)" : "Đang là Sáng — Bấm để chuyển sang Tối (Nghiên Mực)"}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-china-ink hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>
    )
  }

  // Segmented 2-state pill: ☀️ Sáng | 🌙 Tối (Rõ ràng 100%, không bao giờ hiểu nhầm)
  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl border border-border/80 bg-neutral-200/60 dark:bg-zinc-800/80 transition-colors select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => {
          if (isDarkMode) toggleDarkMode()
        }}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
          !isDarkMode
            ? "bg-white text-china-ink shadow-2xs"
            : "text-muted hover:text-china-ink"
        }`}
        title="Bấm để chọn Giao diện Sáng (Giấy Tuyên)"
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <span>Sáng</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (!isDarkMode) toggleDarkMode()
        }}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
          isDarkMode
            ? "bg-zinc-700 text-amber-300 shadow-2xs"
            : "text-muted hover:text-china-ink"
        }`}
        title="Bấm để chọn Giao diện Tối (Nghiên Mực)"
      >
        <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
        <span>Tối</span>
      </button>
    </div>
  )
}
