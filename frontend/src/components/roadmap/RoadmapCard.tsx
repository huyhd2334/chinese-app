"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Compass, 
  Target, 
  Calendar, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Settings2,
  MapPin
} from "lucide-react"
import { useRoadmap } from "@/hooks/useRoadmap"
import { LeafVineCornerSvg, FoliageEdgeBorder } from "./VineBorders"

interface RoadmapCardProps {
  onOpenWizard: () => void
}

export function RoadmapCard({ onOpenWizard }: RoadmapCardProps) {
  const { stats, loading } = useRoadmap()

  if (loading) {
    return (
      <div className="w-full bg-card rounded-2xl border border-border/80 p-5 animate-pulse">
        <div className="h-5 w-48 bg-muted rounded mb-3" />
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
    )
  }

  // 1. TRẠNG THÁI CHƯA CÓ LỘ TRÌNH
  if (!stats || !stats.hasRoadmap) {
    return (
      <div className="relative overflow-hidden w-full rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-xs">
        {/* Dây leo lá cây thanh mảnh uốn lượn theo viền */}
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-9 h-9 sm:w-10 sm:h-10" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-9 h-9 sm:w-10 sm:h-10" />
        <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-7 h-7 sm:w-8 sm:h-8" />
        <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8" />
        <FoliageEdgeBorder position="top" className="h-2 opacity-60" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 text-foreground" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Lộ trình học tập
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Xây dựng lộ trình cá nhân hóa
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                Hệ thống tự động đo lường số bài học và số từ vựng bạn đã tích lũy, giúp bạn biết chính xác cần nạp bao nhiêu từ mỗi ngày để đạt mục tiêu HSK.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWizard}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Thiết lập lộ trình</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // 2. TRẠNG THÁI ĐÃ CÓ LỘ TRÌNH: Tinh gọn, rõ ràng theo chuẩn thiết kế SaaS hiện đại
  const paceConfig = {
    ahead: { label: "Vượt tiến độ", className: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40" },
    on_track: { label: "Đúng tiến độ", className: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40" },
    behind: { label: "Cần tăng tốc", className: "text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40" },
    danger: { label: "Chậm tiến độ", className: "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40" },
  }[stats.paceStatus]

  return (
    <div className="relative overflow-hidden w-full rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-xs">
      {/* Sợi dây leo thanh mảnh uốn lượn theo viền card tự nhiên */}
      <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-9 h-9 sm:w-10 sm:h-10" />
      <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-9 h-9 sm:w-10 sm:h-10" />
      <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-7 h-7 sm:w-8 sm:h-8" />
      <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8" />
      <FoliageEdgeBorder position="top" className="h-2 opacity-60" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-foreground text-background">
              HSK {stats.targetLevel}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${paceConfig.className}`}>
              {paceConfig.label}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            {stats.goalTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-2xs text-xs font-medium text-slate-700 dark:text-stone-200">
            <Calendar className="w-3.5 h-3.5 text-china-red" />
            <span>Còn <strong className="text-china-red dark:text-amber-400 font-bold">{stats.daysRemaining} ngày</strong> ({stats.targetDate})</span>
          </div>

          <button
            onClick={onOpenWizard}
            title="Điều chỉnh mục tiêu"
            className="p-2 rounded-xl text-slate-600 dark:text-stone-300 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-border shadow-2xs cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2 Khung đo lường: BÀI HỌC & TỪ VỰNG (Tone màu sáng, tươi, tương phản cao, không xám đục) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        {/* Khung 1: BÀI HỌC GIÁO TRÌNH */}
        <div className="rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-950/25 border border-emerald-500/25 dark:border-emerald-700/40 p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold tracking-wide">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              BÀI HỌC GIÁO TRÌNH
            </span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">{stats.lessonProgressPercent}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-emerald-100/80 dark:bg-emerald-950/50 rounded-full h-2.5 overflow-hidden border border-emerald-200/50 dark:border-emerald-800/30">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between pt-0.5 text-xs gap-2">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-stone-100 text-sm sm:text-base">
                Đã tích lũy {stats.effectiveCompletedLessons}/{stats.totalTargetLessons} bài
              </div>
              {stats.alreadyKnownLessons > 0 && (
                <div className="text-[11px] text-slate-600 dark:text-stone-300 font-medium">
                  (Gồm {stats.completedLessons} bài đã học + {stats.alreadyKnownLessons} bài nền tảng HSK {stats.startLevel})
                </div>
              )}
              <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs pt-0.5">
                {stats.remainingLessons > 0 ? (
                  <>Còn thiếu <span className="font-bold text-slate-900 dark:text-white underline decoration-emerald-500/40">{stats.remainingLessons} bài</span></>
                ) : (
                  <>Đã hoàn tất toàn bộ bài học mục tiêu</>
                )}
              </div>
            </div>

            <div className="text-emerald-800 dark:text-emerald-300 text-xs font-bold bg-white dark:bg-emerald-900/40 border border-emerald-300/80 dark:border-emerald-700/60 px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
              ~{stats.weeklyLessonsRequired} bài/tuần
            </div>
          </div>
        </div>

        {/* Khung 2: TỪ VỰNG CỐT LÕI */}
        <div className="rounded-2xl bg-amber-500/[0.04] dark:bg-amber-950/25 border border-amber-500/25 dark:border-amber-700/40 p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold tracking-wide">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              TỪ VỰNG CỐT LÕI
            </span>
            <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm sm:text-base">{stats.wordProgressPercent}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-amber-100/80 dark:bg-amber-950/50 rounded-full h-2.5 overflow-hidden border border-amber-200/50 dark:border-amber-800/30">
            <div
              className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between pt-0.5 text-xs gap-2">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-stone-100 text-sm sm:text-base">
                Đã tích lũy {stats.effectiveLearnedWords.toLocaleString("vi-VN")}/{stats.totalTargetWords.toLocaleString("vi-VN")} từ
              </div>
              {stats.alreadyKnownWords > 0 && (
                <div className="text-[11px] text-slate-600 dark:text-stone-300 font-medium">
                  (Gồm {stats.learnedWords.toLocaleString("vi-VN")} từ đã học + {stats.alreadyKnownWords.toLocaleString("vi-VN")} từ nền tảng HSK {stats.startLevel})
                </div>
              )}
              <div className="text-amber-800 dark:text-amber-400 font-semibold text-xs pt-0.5">
                {stats.remainingWords > 0 ? (
                  <>Còn thiếu <span className="font-bold text-slate-900 dark:text-white underline decoration-amber-500/40">{stats.remainingWords.toLocaleString("vi-VN")} từ</span></>
                ) : (
                  <>Đã nắm trọn vốn từ mục tiêu</>
                )}
              </div>
            </div>

            <div className="text-amber-900 dark:text-amber-300 text-xs font-bold bg-white dark:bg-amber-900/40 border border-amber-300/80 dark:border-amber-700/60 px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
              ~{stats.dailyPaceRequired} từ/ngày
            </div>
          </div>
        </div>
      </div>

      {/* Footer Hành động */}
      <div className="pt-3.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 dark:text-stone-300 font-medium">
          Hôm nay cần: <strong className="text-china-red font-bold">{stats.dailyPlan.newWordsTargetCount} từ mới</strong> & <strong className="text-slate-900 dark:text-white font-bold">{stats.dailyPlan.wordsToReviewCount} thẻ ôn</strong>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {stats.dailyPlan.recommendedLesson && (
            <Link
              href={`/books/${stats.dailyPlan.recommendedLesson.bookId}/${stats.dailyPlan.recommendedLesson.lessonId}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white font-semibold transition-colors max-w-[260px] truncate shadow-xs"
              title={`Vào học: ${stats.dailyPlan.recommendedLesson.title}`}
            >
              <span className="truncate">Vào học: {stats.dailyPlan.recommendedLesson.title}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          )}

          {stats.dailyPlan.wordsToReviewCount > 0 && (
            <Link
              href="/review"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-card hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground font-semibold border border-border shadow-2xs transition-colors"
            >
              <span>Ôn tập ({stats.dailyPlan.wordsToReviewCount})</span>
            </Link>
          )}

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-china-red" />
            <span>Chi tiết lộ trình</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
