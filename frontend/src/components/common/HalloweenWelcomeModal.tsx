"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Volume2, BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { playChineseAudio } from "@/utils/audioTts"

function PumpkinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green Stem */}
      <path
        d="M12 2.5C12.3 3.8 13.3 4.5 14.5 4.2"
        stroke="#2d6a4f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Pumpkin Body Segments */}
      <ellipse cx="7.8" cy="13.2" rx="4.8" ry="6.2" fill="#d9480f" />
      <ellipse cx="16.2" cy="13.2" rx="4.8" ry="6.2" fill="#d9480f" />
      <ellipse cx="12" cy="13.5" rx="5.5" ry="6.8" fill="#f76707" />
      {/* Carved Eyes & Smile */}
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

export default function HalloweenWelcomeModal() {
  const { isHalloweenModalOpen, closeHalloweenModal, user } = useAuth()
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

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

  if (!isHalloweenModalOpen) return null

  const handlePlayGreetingVoice = () => {
    setIsPlayingAudio(true)
    playChineseAudio("万圣节快乐！祝你学习进步，逢考必过！", {
      rate: 0.88,
      volume: 1.0,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    })
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "bạn"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#200533] via-[#1a0628] to-[#0c0214] text-white shadow-[0_0_60px_rgba(251,133,0,0.3)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Halloween Atmosphere Glow Aura Top */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-amber-500/25 via-purple-600/20 to-transparent blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeHalloweenModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-sm active:scale-95"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 px-6 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7 flex flex-col items-center text-center space-y-4">
          
          {/* Header Festival Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500/30 to-purple-500/30 border border-amber-400/50 text-amber-300 shadow-sm">
            <span>🎃 万圣节狂欢 • HALLOWEEN SPECIAL 👻</span>
          </div>

          {/* LARGE SCALE SVG: TIỂU LU HÓA TRANG CƯƠNG THI & PHÙ THỦY BÍ NGÔ */}
          <div className="relative py-1">
            <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto select-none transition-transform hover:scale-105 duration-300">
              <Image
                src="/chibi-halloween.svg"
                alt="Tiểu Lu Hóa Trang Halloween"
                width={320}
                height={320}
                priority
                className="w-full h-full object-contain drop-shadow-[0_12px_30px_rgba(251,133,0,0.4)]"
              />
            </div>

            {/* Floating Speech Bubble with Audio Action */}
            <button
              type="button"
              onClick={handlePlayGreetingVoice}
              className={`absolute -bottom-2 sm:bottom-0 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500/90 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-sm active:scale-95 ${
                isPlayingAudio ? "ring-2 ring-white animate-pulse" : ""
              }`}
              title="Bấm để nghe giọng Tiểu Lu chúc bạn"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-950" />
              <span>{isPlayingAudio ? "Tiểu Lu đang chúc..." : "Nghe Tiểu Lu chúc bạn 🔊"}</span>
            </button>
          </div>

          {/* Title & Greeting Text */}
          <div className="space-y-2 pt-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 tracking-tight leading-snug">
              Tiểu Lu Chúc {displayName} Học Tốt!
            </h2>

            {/* Couplet Banner */}
            <div className="inline-block px-4 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-amber-300 text-xs sm:text-sm font-chinese font-bold tracking-wide" lang="zh">
              “万圣狂欢，逢考必过 • 勤学苦练，步步高升”
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
              Chào mừng bạn đã trở lại! Hôm nay Tiểu Lu hóa trang thành <b>Cương Thi Học Bá &amp; Phù Thủy Đèn Lồng Bí Ngô</b> để cùng bạn học tiếng Trung. Chúc bạn một ngày tràn đầy hứng khởi, ghi nhớ từ vựng thần tốc và chinh phục HSK thật xuất sắc nhé!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              type="button"
              onClick={closeHalloweenModal}
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-[0_4px_20px_rgba(251,133,0,0.4)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <PumpkinIcon className="w-5 h-5 shrink-0" />
              <span>Bắt đầu học cùng Tiểu Lu 🚀</span>
            </button>

            <Link
              href="/books"
              onClick={closeHalloweenModal}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Vào Tủ Sách HSK</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
