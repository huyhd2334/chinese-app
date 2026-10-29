"use client"

import React, { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, BookOpen, Sparkles, ChevronRight } from "lucide-react"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Background Dim Dismiss click */}
      <div className="fixed inset-0" onClick={closeHalloweenModal} />

      {/* Luxury Royal Card Modal */}
      <div
        className="relative w-full max-w-[400px] my-auto overflow-hidden rounded-[28px] border border-amber-500/25 bg-[#0f0b14]/95 text-white shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_60px_rgba(245,158,11,0.18)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Top Light Beam & Radial Gradients */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-b from-amber-400/20 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

        {/* Filigree Corner Accents (Hán phong chỉ vàng) */}
        <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-amber-400/40 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-amber-400/40 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-amber-400/40 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-amber-400/40 pointer-events-none" />

        {/* Minimal Close Button */}
        <button
          onClick={closeHalloweenModal}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer backdrop-blur-sm flex items-center justify-center active:scale-90 border border-white/10"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 px-6 pt-7 pb-6 flex flex-col items-center text-center space-y-4">
          
          {/* Header Festival Pill - Minimalist Gold */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400/30 text-amber-300 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>SỰ KIỆN VẠN THÁNH • 万圣夜</span>
          </div>

          {/* Luxury Mascot Crest (Đóng khung huy hiệu hoàng kim sơn mài) */}
          <div className="relative my-1">
            {/* Soft Ambient Golden Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-400/25 to-orange-500/5 blur-md" />
            
            <div className="relative w-36 h-36 rounded-full p-2 bg-gradient-to-b from-amber-400/30 via-purple-900/40 to-black/60 border border-amber-400/40 shadow-inner flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1c1226] to-[#0c0812] flex items-center justify-center overflow-hidden border border-amber-300/15">
                <Image
                  src="/chibi-halloween.svg"
                  alt="Tiểu Lu"
                  width={130}
                  height={130}
                  priority
                  className="w-[124px] h-[124px] object-contain drop-shadow-[0_4px_12px_rgba(251,133,0,0.4)]"
                />
              </div>
            </div>
          </div>

          {/* Typography - Elite & Balanced */}
          <div className="space-y-2 w-full pt-1">
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white leading-snug">
              Chúc <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent">{formattedName}</span> Bứt Phá HSK!
            </h2>

            {/* Traditional Couplet Scroll - Luxury Dark Gold Silk */}
            <div
              className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-chinese tracking-widest font-bold shadow-xs select-none"
              lang="zh"
            >
              “ 勤 学 苦 练 • 步 步 高 升 ”
            </div>

            <p className="text-xs text-stone-300/80 max-w-[320px] mx-auto leading-relaxed pt-0.5">
              Đồng hành cùng Tiểu Lu trong mùa lễ hội Vạn Thánh: chúc bạn phản xạ tự nhiên, ghi nhớ sâu sắc và chạm mốc điểm cao!
            </p>
          </div>

          {/* Action Buttons - Gold Leaf Button & Glass Action */}
          <div className="w-full flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={closeHalloweenModal}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 text-xs font-extrabold tracking-wide transition-all shadow-[0_4px_20px_rgba(245,158,11,0.35)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Vào Bàn Học Cùng Tiểu Lu</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] text-stone-950 transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              href="/books"
              onClick={closeHalloweenModal}
              className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-semibold transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Khám Phá Tủ Sách HSK</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
