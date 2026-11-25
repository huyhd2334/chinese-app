"use client"

import React from "react"
import Link from "next/link"
import {
  Compass,
  Target,
  Calendar,
  BookOpen,
  ArrowRight,
  Settings2,
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
      <div className="w-full bg-card rounded-2xl border border-border p-5 animate-pulse space-y-3">
        <div className="h-5 w-48 bg-china-paper rounded" />
        <div className="h-4 w-full bg-china-paper rounded" />
        <div className="h-4 w-2/3 bg-china-paper rounded" />
      </div>
    )
  }

  if (!stats || !stats.hasRoadmap) {
    return (
      <div className="chibi-card relative overflow-hidden w-full rounded-2xl bg-card border-emerald-600/25 dark:border-emerald-500/25 p-5 sm:p-6">
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-10 h-10 sm:w-11 sm:h-11" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-10 h-10 sm:w-11 sm:h-11" />
        <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-8 h-8 opacity-80" />
        <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-8 h-8 opacity-80" />
        <FoliageEdgeBorder position="top" className="h-3 opacity-75" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-5 h-5 text-china-jade" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Thiết lập lộ trình học cá nhân
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xl">
                Chọn cấp độ HSK mục tiêu và ngày dự thi để hệ thống tự động chia khối lượng bài học và số từ vựng cần nạp mỗi ngày.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWizard}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-semibold transition-all active:translate-y-0.5 shadow-[0_3px_0_0_#991b1b] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Tạo lộ trình</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const paceConfig = {
    ahead: {
      label: "Vượt tiến độ",
      className: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50",
    },
    on_track: {
      label: "Đúng tiến độ",
      className: "text-china-jade bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40",
    },
    behind: {
      label: "Cần tăng tốc",
      className: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
    },
    danger: {
      label: "Chậm tiến độ",
      className: "text-china-red bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50",
    },
  }[stats.paceStatus]

  return (
    <div className="chibi-card relative overflow-hidden w-full rounded-2xl bg-card border-emerald-600/25 dark:border-emerald-500/25 p-5 sm:p-6 space-y-5">
      <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-10 h-10 sm:w-11 sm:h-11" />
      <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-10 h-10 sm:w-11 sm:h-11" />
      <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-8 h-8 opacity-80" />
      <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-8 h-8 opacity-80" />
      <FoliageEdgeBorder position="top" className="h-3 opacity-75" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-china-jade text-white">
              HSK {stats.targetLevel}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${paceConfig.className}`}>
              {paceConfig.label}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {stats.goalTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-china-paper border border-border text-xs font-medium text-foreground">
            <Calendar className="w-3.5 h-3.5 text-china-red" />
            <span>
              Còn <strong className="font-bold text-china-red">{stats.daysRemaining} ngày</strong> ({stats.targetDate})
            </span>
          </div>

          <button
            onClick={onOpenWizard}
            title="Điều chỉnh lộ trình"
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-china-paper transition-colors border border-border cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2 Progress Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Lessons */}
        <div className="rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-950/20 border border-emerald-500/20 dark:border-emerald-800/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
              <BookOpen className="w-4 h-4 text-china-jade" />
              Bài học giáo trình
            </span>
            <span className="font-bold text-china-jade text-sm">{stats.lessonProgressPercent}%</span>
          </div>

          <div className="w-full bg-emerald-100/80 dark:bg-emerald-950/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-china-jade h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground">
                {stats.effectiveCompletedLessons}/{stats.totalTargetLessons} bài hoàn thành
              </div>
              <div className="text-muted">
                {stats.remainingLessons > 0
                  ? `Còn thiếu ${stats.remainingLessons} bài học`
                  : "Đã hoàn tất mục tiêu bài học"}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-card border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
              ~{stats.weeklyLessonsRequired} bài/tuần
            </span>
          </div>
        </div>

        {/* Vocabulary */}
        <div className="rounded-2xl bg-amber-500/[0.04] dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-800/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Từ vựng cốt lõi
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{stats.wordProgressPercent}%</span>
          </div>

          <div className="w-full bg-amber-100/80 dark:bg-amber-950/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground">
                {stats.effectiveLearnedWords.toLocaleString("vi-VN")}/{stats.totalTargetWords.toLocaleString("vi-VN")} từ đã tích lũy
              </div>
              <div className="text-muted">
                {stats.remainingWords > 0
                  ? `Còn thiếu ${stats.remainingWords.toLocaleString("vi-VN")} từ`
                  : "Đã đạt mục tiêu từ vựng"}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-card border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 font-semibold shrink-0">
              ~{stats.dailyPaceRequired} từ/ngày
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
        <div className="text-muted">
          Kế hoạch hôm nay:{" "}
          <strong className="text-china-red font-bold">{stats.dailyPlan.newWordsTargetCount} từ mới</strong>
          {" · "}
          <strong className="text-foreground font-bold">{stats.dailyPlan.wordsToReviewCount} thẻ ôn</strong>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {stats.dailyPlan.recommendedLesson && (
            <Link
              href={`/books/${stats.dailyPlan.recommendedLesson.bookId}/${stats.dailyPlan.recommendedLesson.lessonId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-china-red hover:bg-china-red-hover text-white font-semibold transition-all active:translate-y-0.5 shadow-[0_2px_0_0_#991b1b] max-w-[240px] truncate"
              title={`Vào học: ${stats.dailyPlan.recommendedLesson.title}`}
            >
              <span className="truncate">Học: {stats.dailyPlan.recommendedLesson.title}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          )}

          {stats.dailyPlan.wordsToReviewCount > 0 && (
            <Link
              href="/review"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-china-paper hover:bg-border/60 text-foreground font-semibold border border-border transition-colors"
            >
              <span>Ôn tập ({stats.dailyPlan.wordsToReviewCount})</span>
            </Link>
          )}

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-china-jade hover:underline font-semibold transition-colors"
          >
            <span>Chi tiết lộ trình</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
