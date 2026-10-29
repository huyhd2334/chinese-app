"use client"

import React, { useEffect } from "react"
import Image from "next/image"
import { X, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

function formatName(raw?: string): string {
  if (!raw) return "Bạn"
  const clean = raw.trim()
  if (!clean) return "Bạn"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Background Dim Dismiss click */}
      <div className="fixed inset-0" onClick={closeHalloweenModal} />

      {/* Clean Minimalist Modal */}
      <div
        className="relative w-full max-w-[360px] my-auto overflow-hidden rounded-3xl border border-amber-500/20 bg-[#120d1a]/95 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(251,133,0,0.15)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Light Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-amber-500/25 to-orange-500/5 blur-3xl pointer-events-none" />

        {/* Minimal Close Button */}
        <button
          onClick={closeHalloweenModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90 border border-white/10"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 px-6 pt-6 pb-6 flex flex-col items-center text-center space-y-3">
          
          {/* Mascot To Rõ, Nổi Bật Tự Do (Không bị đóng khung vòng tròn) */}
          <div className="relative w-56 h-56 sm:w-60 sm:h-60 select-none flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <Image
              src="/chibi-halloween.svg"
              alt="Tiểu Lu Halloween"
              width={240}
              height={240}
              priority
              className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(251,133,0,0.35)]"
            />
          </div>

          {/* Vài Chữ Ngắn Gọn, Tinh Tế */}
          <div className="space-y-1 w-full">
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white">
              Chào <span className="text-amber-300">{formattedName}</span>! 🎃
            </h2>
            <p className="text-xs text-stone-300/80 font-medium">
              Cùng Tiểu Lu bứt phá mục tiêu hôm nay nhé!
            </p>
          </div>

          {/* Nút Hành Động Gọn Gàng */}
          <div className="w-full pt-2">
            <button
              type="button"
              onClick={closeHalloweenModal}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 text-sm font-extrabold tracking-wide transition-all shadow-[0_4px_16px_rgba(245,158,11,0.35)] active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 group"
            >
              <span>Vào Bàn Học Cùng Tiểu Lu</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] text-stone-950 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
