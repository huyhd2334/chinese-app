"use client"

import React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { LogIn, BookOpen, Layers, Cloud, ArrowRight } from "lucide-react"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading, openAuthModal } = useAuth()

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 select-none">
        <div className="w-10 h-10 rounded-xl bg-china-red text-white flex items-center justify-center font-chinese font-bold text-xl mb-4" lang="zh">
          学
        </div>
        <div className="w-5 h-5 border-2 border-china-red border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-foreground">Đang tải phiên học tập...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-dvh w-full overflow-y-auto bg-background text-foreground flex flex-col justify-between px-4 sm:px-8 py-6">
        {/* Top Bar */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-china-red text-white flex items-center justify-center font-chinese font-bold text-base" lang="zh">
              学
            </span>
            <span className="font-bold text-base tracking-tight text-foreground">
              Học Cùng Tiểu Lu
            </span>
          </div>

          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-card border border-border hover:bg-china-paper text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
        </header>

        {/* Main Hero */}
        <main className="w-full max-w-2xl mx-auto my-auto py-12 space-y-8">
          <div className="space-y-4">
            <p className="font-chinese text-sm text-china-red font-semibold tracking-wide" lang="zh">
              千里之行，始于足下
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Học tiếng Trung bài bản theo chuẩn HSK 3.0
            </h1>
            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
              Kết hợp giáo trình chuẩn, từ điển hơn 11.400 mục từ kèm âm Hán-Việt và thuật toán lặp lại ngắt quãng (SRS) giúp ghi nhớ từ vựng bền vững mà không bị quá tải.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openAuthModal}
              className="px-5 py-2.5 rounded-lg bg-china-red hover:bg-china-red-hover text-white text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Bắt đầu học ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
              <BookOpen className="w-4 h-4 text-china-red" />
              <div className="text-sm font-semibold text-foreground">Giáo trình &amp; Đề thi</div>
              <p className="text-xs text-muted leading-relaxed">
                Bài khóa hội thoại có âm thanh từng câu, ngữ pháp và 24 đề thi thử HSK.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
              <Layers className="w-4 h-4 text-china-jade" />
              <div className="text-sm font-semibold text-foreground">Ôn tập ngắt quãng SRS</div>
              <p className="text-xs text-muted leading-relaxed">
                Tự động tính chu kỳ quên để nhắc ôn đúng thời điểm, tối ưu thời gian học.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
              <Cloud className="w-4 h-4 text-foreground" />
              <div className="text-sm font-semibold text-foreground">Đồng bộ đa thiết bị</div>
              <p className="text-xs text-muted leading-relaxed">
                Lưu tiến độ bài học, lộ trình thi và thẻ từ vựng an toàn trên đám mây.
              </p>
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
