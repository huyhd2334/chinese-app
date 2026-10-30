"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Compass, 
  Target, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap, 
  Settings2,
  Trophy,
  Flame,
  Award
} from "lucide-react"
import { useRoadmap } from "@/hooks/useRoadmap"
import { MountainSummitSvg, TreasureChestSvg, RocketPaceSvg } from "./RoadmapIllustrations"

interface RoadmapCardProps {
  onOpenWizard: () => void
}

export function RoadmapCard({ onOpenWizard }: RoadmapCardProps) {
  const { stats, loading } = useRoadmap()

  if (loading) {
    return (
      <div className="w-full bg-card/60 backdrop-blur-md border-2 border-border/50 rounded-3xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded-xl mb-4" />
        <div className="h-4 w-full bg-muted rounded-xl mb-2" />
        <div className="h-4 w-2/3 bg-muted rounded-xl" />
      </div>
    )
  }

  // 1. TRẠNG THÁI CHƯA CÓ LỘ TRÌNH: Banner tươi sáng, mascot Tiểu Lu vẫy tay mời gọi
  if (!stats || !stats.hasRoadmap) {
    return (
      <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/15 border-2 border-amber-500/40 p-6 sm:p-7 shadow-xl backdrop-blur-md transition-all hover:border-amber-500/60">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-10 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Mascot & SVG Illustration */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 p-1 bg-white/90 dark:bg-card/90 rounded-2xl border-2 border-amber-400/50 shadow-md flex items-center justify-center select-none transform hover:scale-105 transition-transform">
              <Image
                src="/chibi-cheer.svg"
                alt="Tiểu Lu cổ vũ"
                width={80}
                height={80}
                priority
                className="object-contain"
              />
            </div>

            <div className="space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Lộ trình Cá nhân hóa Mới
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Chưa biết bắt đầu học từ đâu?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tạo lộ trình trong 1 phút! Hệ thống sẽ đo vốn từ vựng hiện có, phân tích bạn <strong className="text-foreground">còn thiếu bao nhiêu bài học & bao nhiêu từ</strong> để cán đích HSK đúng hạn.
              </p>
            </div>
          </div>

          {/* Call to action Button */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenWizard}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-rose-500/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>Thiết lập lộ trình ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 2. TRẠNG THÁI ĐÃ CÓ LỘ TRÌNH: Thẻ tươi sáng, đầy màu sắc với đo lường chi tiết
  const paceBadgeConfig = {
    ahead: { label: "Vượt tiến độ 🚀", color: "bg-emerald-500 text-white shadow-xs shadow-emerald-500/30" },
    on_track: { label: "Chuẩn nhịp ✨", color: "bg-indigo-500 text-white shadow-xs shadow-indigo-500/30" },
    behind: { label: "Cần tăng tốc ⚡", color: "bg-amber-500 text-slate-950 font-black shadow-xs shadow-amber-500/30" },
    danger: { label: "Chậm tiến độ ⚠️", color: "bg-rose-500 text-white shadow-xs shadow-rose-500/30" },
  }[stats.paceStatus]

  return (
    <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-br from-card/95 via-card/85 to-indigo-500/5 border-2 border-indigo-500/30 p-5 sm:p-7 shadow-xl backdrop-blur-md transition-all hover:border-indigo-500/50">
      {/* Decorative mountain background artwork */}
      <div className="absolute -top-6 -right-6 opacity-15 sm:opacity-20 pointer-events-none select-none">
        <MountainSummitSvg className="w-48 h-48" />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/60 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 p-1 rounded-2xl bg-white dark:bg-card border-2 border-indigo-400/50 shadow-sm shrink-0 flex items-center justify-center select-none">
            <Image
              src="/chibi-scholar-gold.svg"
              alt="Mascot Học giả"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider bg-indigo-600 text-white">
                HSK {stats.targetLevel}
              </span>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${paceBadgeConfig.color}`}>
                {paceBadgeConfig.label}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground mt-0.5 tracking-tight">
              {stats.goalTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/80 border border-border/80 text-xs font-bold text-foreground">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Còn <strong>{stats.daysRemaining} ngày</strong> ({stats.targetDate})</span>
          </div>

          <button
            onClick={onOpenWizard}
            title="Điều chỉnh mục tiêu"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2 Thước đo lớn: BÀI HỌC & TỪ VỰNG CÒN THIẾU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 relative z-10">
        {/* Box Bài học - Màu Xanh Ngọc Bích / Teal */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-2 border-emerald-500/30 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-black text-emerald-700 dark:text-emerald-300">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              BÀI HỌC GIÁO TRÌNH
            </span>
            <span className="font-black text-sm text-foreground">{stats.lessonProgressPercent}%</span>
          </div>

          <div className="w-full bg-secondary/80 rounded-full h-3 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <div className="text-sm font-bold text-foreground">
                Đã học {stats.completedLessons}/{stats.totalTargetLessons} bài
              </div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {stats.remainingLessons > 0 ? (
                  <>👉 Còn thiếu <span className="text-sm text-foreground underline decoration-emerald-500">{stats.remainingLessons} bài</span></>
                ) : (
                  <>🎉 Đã hoàn tất 100% bài học!</>
                )}
              </div>
            </div>

            <div className="text-right text-[11px] text-muted-foreground">
              ~{stats.weeklyLessonsRequired} bài/tuần
            </div>
          </div>
        </div>

        {/* Box Từ vựng - Màu Vàng Cam / Hổ Phách */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/5 border-2 border-amber-500/30 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-black text-amber-700 dark:text-amber-300">
              <Target className="w-4 h-4 text-amber-500" />
              TỪ VỰNG CỐT LÕI
            </span>
            <span className="font-black text-sm text-foreground">{stats.wordProgressPercent}%</span>
          </div>

          <div className="w-full bg-secondary/80 rounded-full h-3 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <div className="text-sm font-bold text-foreground">
                Đã nạp {stats.learnedWords}/{stats.totalTargetWords} từ
              </div>
              <div className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {stats.remainingWords > 0 ? (
                  <>👉 Còn thiếu <span className="text-sm text-foreground underline decoration-amber-500">{stats.remainingWords} từ</span></>
                ) : (
                  <>🎉 Đã nắm trọn vốn từ vựng!</>
                )}
              </div>
            </div>

            <div className="text-right text-[11px] text-muted-foreground">
              ~{stats.dailyPaceRequired} từ/ngày
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions: Tươi vui, nút bấm 3D mềm */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Hôm nay cần: <strong className="text-foreground">{stats.dailyPlan.newWordsTargetCount} từ mới</strong> & <strong className="text-foreground">{stats.dailyPlan.wordsToReviewCount} thẻ ôn</strong></span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {stats.dailyPlan.recommendedLesson && (
            <Link
              href={`/books/${stats.dailyPlan.recommendedLesson.bookId}/${stats.dailyPlan.recommendedLesson.lessonId}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition-all shadow-md shadow-indigo-500/25 active:scale-95"
            >
              <span>Vào học tiếp: {stats.dailyPlan.recommendedLesson.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {stats.dailyPlan.wordsToReviewCount > 0 && (
            <Link
              href="/review"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <span>Ôn tập ({stats.dailyPlan.wordsToReviewCount})</span>
            </Link>
          )}

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-bold border border-border/70 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Bản đồ lộ trình</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  )
}
