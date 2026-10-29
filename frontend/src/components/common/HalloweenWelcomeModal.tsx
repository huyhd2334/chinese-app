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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Background Dim Dismiss click */}
      <div className="fixed inset-0" onClick={closeHalloweenModal} />

      {/* Hero Mascot Spotlight Modal */}
      <div
        className="relative w-full max-w-[420px] my-auto overflow-hidden rounded-[32px] border border-amber-500/25 bg-[#120d1a]/95 text-white shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_60px_rgba(251,133,0,0.22)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Light Glow Behind Mascot */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-amber-500/30 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Minimal Close Button */}
        <button
          onClick={closeHalloweenModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90 border border-white/10"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 px-5 sm:px-7 pt-4 pb-6 flex flex-col items-center text-center space-y-3">
          
          {/* Mascot Siêu To, Nổi Bật Trung Tâm */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 select-none flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <Image
              src="/chibi-halloween.svg"
              alt="Tiểu Lu Halloween"
              width={340}
              height={340}
              priority
              className="w-full h-full object-contain drop-shadow-[0_12px_32px_rgba(251,133,0,0.45)]"
            />
          </div>

          {/* Vài Chữ Ngắn Gọn, Tinh Tế */}
          <div className="space-y-1 w-full -mt-2">
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white">
              Chào <span className="text-amber-300">{formattedName}</span>! 🎃
            </h2>
            <p className="text-xs text-stone-300/80 font-medium">
              Cùng Tiểu Lu bứt phá mục tiêu hôm nay nhé!
            </p>
          </div>

          {/* Nút Hành Động Gọn Gàng */}
          <div className="w-full pt-1">
            <button
              type="button"
              onClick={closeHalloweenModal}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 text-sm font-extrabold tracking-wide transition-all shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
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
