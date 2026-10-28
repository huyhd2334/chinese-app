"use client"

import React from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { LogIn, BookOpen, Brain, ShieldCheck } from "lucide-react"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading, openAuthModal } = useAuth()

  // 1. Đang kiểm tra phiên đăng nhập (Lazy Loading với Chibi)
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-china-paper p-6 select-none">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <Image
            src="/chibi-loading.svg"
            alt="Đang kiểm tra đăng nhập"
            width={220}
            height={220}
            priority
            className="object-contain drop-shadow-xs"
          />
        </div>
        <div className="mt-4 flex flex-col items-center space-y-2 animate-fade-in text-center">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-china-ink text-base">
              Tiểu Lu đang kiểm tra phiên học...
            </span>
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-china-red animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-china-gold animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-china-jade animate-bounce [animation-delay:0.3s]" />
            </span>
          </div>
          <p className="text-xs text-muted">
            Vui lòng chờ trong giây lát để tải dữ liệu tài khoản
          </p>
        </div>
      </div>
    )
  }

  // 2. Chưa đăng nhập: Giữ ở màn hình bên ngoài (Welcome Screen)
  if (!user) {
    return (
      <div className="relative min-h-dvh w-full overflow-y-auto bg-gradient-to-b from-[#faf8f5] via-[#f7f2ea] to-[#efe7d8] text-china-ink flex flex-col items-center justify-between p-4 sm:p-8 selection:bg-china-red selection:text-white">
        
        {/* Top Branding Bar */}
        <header className="w-full max-w-4xl flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <span className="text-white bg-china-red rounded-xl shadow-md shadow-china-red/20 py-1.5 px-3 font-serif font-bold text-lg">
              学
            </span>
            <div className="leading-tight">
              <div className="font-serif font-bold text-lg text-china-red tracking-wide">
                HSK <span className="text-china-ink font-sans text-base font-semibold">Learning</span>
              </div>
              <div className="text-[10px] text-muted tracking-wider uppercase">
                Chinese Study Platform
              </div>
            </div>
          </div>

          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 border border-border shadow-xs hover:bg-white text-xs font-semibold text-china-ink transition-all active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-china-red" />
            <span>Đăng nhập</span>
          </button>
        </header>

        {/* Main Center Stage */}
        <main className="w-full max-w-lg my-auto py-8 flex flex-col items-center text-center">
          {/* Chibi Animated SVG Illustration */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 select-none filter drop-shadow-sm transition-transform duration-500 hover:scale-105">
            <Image
              src="/chibi-loading.svg"
              alt="Tiểu Lu đợi đăng nhập"
              fill
              sizes="(max-width: 640px) 256px, 288px"
              priority
              className="object-contain"
            />
          </div>

          {/* Heading & Motivation */}
          <div className="space-y-2 mt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-china-red/10 text-china-red text-xs font-semibold tracking-wide border border-china-red/20">
              
              <span>千里之行，始于足下</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-china-ink tracking-tight pt-1">
              Tiểu Lu đang đợi bạn vào học!
            </h1>

            <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
              Bạn chưa đăng nhập vào hệ thống. Hãy đăng nhập tài khoản để lưu lại tiến độ bài học, điểm danh streak và ôn luyện từ vựng mỗi ngày nhé!
            </p>
          </div>

          {/* CTA Action Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs justify-center">
            <button
              onClick={openAuthModal}
              className="w-full py-3 px-6 rounded-2xl bg-china-red hover:bg-china-red-hover text-white text-sm font-bold shadow-lg shadow-china-red/25 hover:shadow-xl hover:shadow-china-red/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập ngay</span>
            </button>
          </div>

          {/* Value Props Mini Grid */}
          <div className="mt-8 grid grid-cols-3 gap-2.5 w-full text-left">
            <div className="p-3 rounded-2xl bg-white/70 border border-border/80 shadow-2xs backdrop-blur-xs flex flex-col items-center text-center">
              <BookOpen className="w-4 h-4 text-china-red mb-1.5" />
              <div className="text-[11px] font-bold text-china-ink">HSK 1 - HSK 6</div>
              <div className="text-[10px] text-muted">Hơn 5000+ từ vựng</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 border border-border/80 shadow-2xs backdrop-blur-xs flex flex-col items-center text-center">
              <Brain className="w-4 h-4 text-china-gold mb-1.5" />
              <div className="text-[11px] font-bold text-china-ink">Ôn tập SRS</div>
              <div className="text-[10px] text-muted">Ghi nhớ dài hạn</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 border border-border/80 shadow-2xs backdrop-blur-xs flex flex-col items-center text-center">
              <ShieldCheck className="w-4 h-4 text-china-jade mb-1.5" />
              <div className="text-[11px] font-bold text-china-ink">Đồng bộ Cloud</div>
              <div className="text-[10px] text-muted">Tiến độ an toàn</div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full text-center py-3 text-[11px] text-muted/80">
          <span>HSK Learning Platform • 每天学习一点点，每天进步一点点</span>
        </footer>
      </div>
    )
  }

  // 3. Đã đăng nhập: Vào bên trong ứng dụng chính
  return <>{children}</>
}
