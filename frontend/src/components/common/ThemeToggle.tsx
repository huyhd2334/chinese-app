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
        title={isDarkMode ? "Chuyển sang giao diện Sáng (Giấy Tuyên)" : "Chuyển sang giao diện Tối (Nghiên Mực)"}
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

  // Default: sleek compact pill
  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/80 bg-white/70 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700/80 text-xs font-semibold text-china-ink transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer ${className}`}
      title={isDarkMode ? "Đang bật chế độ Ban đêm (Bấm để chuyển Sáng)" : "Đang bật chế độ Ban ngày (Bấm để chuyển Tối)"}
      aria-label="Toggle dark mode"
    >
      <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
        <Sun className="w-3.5 h-3.5 text-amber-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:opacity-0" />
        <Moon className="absolute w-3.5 h-3.5 text-amber-400 rotate-90 scale-0 opacity-0 transition-all dark:rotate-0 dark:scale-100 dark:opacity-100 fill-amber-400/20" />
      </div>
      <span className="text-[11px] font-bold text-china-ink select-none hidden sm:inline">
        {isDarkMode ? "Tối" : "Sáng"}
      </span>
    </button>
  )
}
