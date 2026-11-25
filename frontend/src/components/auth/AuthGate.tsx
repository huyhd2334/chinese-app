"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { LogIn, BookOpen, Layers, Cloud, ArrowRight } from "lucide-react"
import ChibiLoading from "@/components/common/ChibiLoading"
import { LeafVineCornerSvg, FoliageEdgeBorder } from "@/components/roadmap/VineBorders"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading, openAuthModal } = useAuth()

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 select-none">
        <ChibiLoading
          variant="loading"
          size="md"
          title="Tiểu Lu đang kiểm tra phiên học..."
          description="Vui lòng chờ trong giây lát nhé!"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-dvh w-full overflow-y-auto bg-background text-foreground flex flex-col justify-between px-4 sm:px-8 py-6">
        {/* Top Bar */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-card border border-border p-1 flex items-center justify-center">
              <Image src="/chibi-loading.svg" alt="Tiểu Lu" width={28} height={28} priority className="object-contain" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              Học Cùng Tiểu Lu
            </span>
          </div>

          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-china-paper text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
        </header>

        {/* Main Hero Card with Bamboo Vines & Tiểu Lu */}
        <main className="w-full max-w-3xl mx-auto my-auto py-8">
          <div className="chibi-card relative overflow-hidden rounded-3xl bg-card border-emerald-600/25 dark:border-emerald-500/25 p-6 sm:p-10 space-y-8">
            <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-11 h-11 sm:w-12 sm:h-12" />
            <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-11 h-11 sm:w-12 sm:h-12" />
            <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-9 h-9 opacity-80" />
            <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-9 h-9 opacity-80" />
            <FoliageEdgeBorder position="top" className="h-3 opacity-80" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                <p className="font-chinese text-sm text-china-jade font-bold tracking-wide" lang="zh">
                  千里之行，始于足下
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
                  Cùng Tiểu Lu chinh phục tiếng Trung HSK 3.0!
                </h1>
                <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md">
                  Kết hợp giáo trình chuẩn, từ điển hơn 11.400 mục từ kèm âm Hán-Việt và thuật toán lặp lại ngắt quãng (SRS) giúp bạn nhớ từ lâu mà không bị quá tải.
                </p>
                <div className="pt-1 flex justify-center md:justify-start">
                  <button
                    onClick={openAuthModal}
                    className="px-6 py-3 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-sm font-bold transition-all active:translate-y-0.5 shadow-[0_3px_0_0_#991b1b] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Bắt đầu học ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative w-44 h-44 sm:w-52 sm:h-52 shrink-0 select-none">
                <Image
                  src="/chibi-brush.svg"
                  alt="Tiểu Lu Thư Sinh"
                  fill
                  sizes="208px"
                  priority
                  className="object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-border relative z-10">
              <div className="p-3.5 rounded-2xl bg-china-paper/60 border border-border space-y-1">
                <BookOpen className="w-4 h-4 text-china-jade" />
                <div className="text-xs sm:text-sm font-bold text-foreground">Giáo trình &amp; Đề thi</div>
                <p className="text-xs text-muted leading-relaxed">
                  Hội thoại có audio từng câu, ngữ pháp và 24 đề thi thử HSK.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-china-paper/60 border border-border space-y-1">
                <Layers className="w-4 h-4 text-china-gold" />
                <div className="text-xs sm:text-sm font-bold text-foreground">Ôn tập ngắt quãng SRS</div>
                <p className="text-xs text-muted leading-relaxed">
                  Nhắc ôn đúng từ sắp quên theo chu kỳ trí nhớ, tiết kiệm thời gian.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-china-paper/60 border border-border space-y-1">
                <Cloud className="w-4 h-4 text-china-red" />
                <div className="text-xs sm:text-sm font-bold text-foreground">Đồng bộ đa thiết bị</div>
                <p className="text-xs text-muted leading-relaxed">
                  Lưu lộ trình thi và kho thẻ ôn tập an toàn trên đám mây.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-border text-xs text-muted">
          <span>© {new Date().getFullYear()} Học Cùng Tiểu Lu</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Bảo mật</Link>
            <Link href="/refund" className="hover:text-foreground transition-colors">Hoàn tiền</Link>
          </div>
        </footer>
      </div>
    )
  }

  return <>{children}</>
}
