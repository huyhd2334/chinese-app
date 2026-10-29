"use client"

import React, { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, BookOpen, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

function PumpkinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2.5C12.3 3.8 13.3 4.5 14.5 4.2"
        stroke="#2d6a4f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="7.8" cy="13.2" rx="4.8" ry="6.2" fill="#d9480f" />
      <ellipse cx="16.2" cy="13.2" rx="4.8" ry="6.2" fill="#d9480f" />
      <ellipse cx="12" cy="13.5" rx="5.5" ry="6.8" fill="#f76707" />
      <polygon points="9.5,12 11,10.5 11,12.5" fill="#1b002c" />
      <polygon points="14.5,12 13,10.5 13,12.5" fill="#1b002c" />
      <polygon points="12,13 11.4,13.8 12.6,13.8" fill="#1b002c" />
      <path
        d="M8.8 15.2C9.5 17 14.5 17 15.2 15.2C14.4 15.8 13.8 15 12 15.5C10.2 15 9.6 15.8 8.8 15.2Z"
        fill="#1b002c"
      />
    </svg>
  )
}

function formatName(raw?: string): string {
  if (!raw) return "Bạn"
  const clean = raw.trim()
  if (!clean) return "Bạn"
  // If ALL CAPS (like HUY QUOC), convert to Title Case
  if (clean === clean.toUpperCase()) {
    return clean
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ")
  }
  return clean
}

export default function HalloweenWelcomeModal() {
  const { isHalloweenModalOpen, closeHalloweenModal, isHalloweenTheme, user } = useAuth()

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isHalloweenModalOpen) {
        closeHalloweenModal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isHalloweenModalOpen, closeHalloweenModal])

  if (!isHalloweenModalOpen || !isHalloweenTheme) return null

  const rawName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    ""
  const formattedName = formatName(rawName)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-[420px] my-auto overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#1e072b] via-[#160422] to-[#0d0216] text-white shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_50px_rgba(230,81,0,0.2)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Background Warm Light Halo */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-amber-500/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeHalloweenModal}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-sm active:scale-95"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 px-5 pt-6 pb-5 sm:px-7 sm:pt-7 sm:pb-6 flex flex-col items-center text-center space-y-3.5">
          
          {/* Header Festival Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/15 border border-amber-400/30 text-amber-300">
            <span>🎃 万圣节狂欢 • HALLOWEEN 👻</span>
          </div>

          {/* Clean Mascot Display (No slop clutter, balanced height) */}
          <div className="relative py-0.5">
            <div className="w-40 h-40 sm:w-44 sm:h-44 mx-auto select-none transition-transform hover:scale-105 duration-300">
              <Image
                src="/chibi-halloween.svg"
                alt="Tiểu Lu Hóa Trang Halloween"
                width={176}
                height={176}
                priority
                className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(251,133,0,0.35)]"
              />
            </div>
          </div>

          {/* Title & Greeting Typography - Balanced & Clean */}
          <div className="space-y-1.5 w-full">
            <h2 className="text-lg sm:text-xl font-serif font-black text-white tracking-tight leading-snug">
              Tiểu Lu Chúc {formattedName} Học Tốt!
            </h2>

            {/* Couplet Banner - Refined Golden Style */}
            <div
              className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-amber-400/25 text-amber-300 text-xs font-chinese font-semibold tracking-wide"
              lang="zh"
            >
              “万圣狂欢 • 逢考必过 • 步步高升”
            </div>

            <p className="text-xs text-slate-300/90 max-w-sm mx-auto leading-relaxed pt-0.5">
              Hôm nay Tiểu Lu hóa trang thành Pháp Sư Bí Ngô đồng hành cùng bạn học tiếng Trung. Chúc bạn ghi nhớ từ vựng thần tốc và chinh phục HSK thật xuất sắc nhé!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 pt-1.5">
            <button
              type="button"
              onClick={closeHalloweenModal}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition-all shadow-[0_2px_12px_rgba(251,133,0,0.35)] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 group"
            >
              <PumpkinIcon className="w-4 h-4 shrink-0" />
              <span>Bắt đầu học cùng Tiểu Lu</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] text-slate-950 transition-transform group-hover:translate-x-0.5 shrink-0" />
            </button>

            <Link
              href="/books"
              onClick={closeHalloweenModal}
              className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Tủ Sách HSK</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
