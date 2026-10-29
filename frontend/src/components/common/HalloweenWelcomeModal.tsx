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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Background Dim Dismiss click */}
      <div className="fixed inset-0" onClick={closeHalloweenModal} />

      {/* Luxury Obsidian Velvet Modal */}
      <div
        className="relative w-full max-w-[400px] my-auto overflow-hidden rounded-[32px] border border-white/10 bg-[#0e0b14]/98 text-white shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Candlelight Ambient (Êm dịu, sang trọng, không chói neon) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-b from-amber-400/[0.08] via-orange-500/[0.03] to-transparent blur-3xl pointer-events-none" />

        {/* Minimal Close Button */}
        <button
          onClick={closeHalloweenModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90 border border-white/10 backdrop-blur-sm"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 px-6 pt-5 pb-7 flex flex-col items-center text-center space-y-4">
          
          {/* Mascot Tinh Tế, Đổ Bóng Nhung Sâu */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 select-none flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <Image
              src="/chibi-halloween.svg"
              alt="Tiểu Lu Halloween"
              width={300}
              height={300}
              priority
              className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
            />
          </div>

          {/* Typography Quý Tộc & Tinh Gọn */}
          <div className="space-y-1.5 w-full -mt-2">
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-stone-100 leading-snug">
              Chào <span className="text-[#f3e7c4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{formattedName}</span>! 🎃
            </h2>
            <p className="text-xs text-stone-400 font-medium">
              Cùng Tiểu Lu bứt phá mục tiêu hôm nay nhé!
            </p>
          </div>

          {/* Nút Vàng Kim Champagne (Luxury Gold Satin - KHÔNG CHÓI NEON) */}
          <div className="w-full pt-1.5">
            <button
              type="button"
              onClick={closeHalloweenModal}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#f3e7c4] via-[#e6cf92] to-[#c7a75c] hover:from-[#f8f0d8] hover:via-[#eedbb0] hover:to-[#d4b56c] text-stone-900 text-sm font-extrabold tracking-wide transition-all shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-amber-200/50 group"
            >
              <span>Vào Bàn Học Cùng Tiểu Lu</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] text-stone-900 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
