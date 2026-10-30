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
  CheckCircle2,
  MapPin
} from "lucide-react"
import { useRoadmap } from "@/hooks/useRoadmap"

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

  // 1. TRẠNG THÁI CHƯA CÓ LỘ TRÌNH: Giao diện tối giản, sạch sẽ, không icon slop / không gradient chói
  if (!stats || !stats.hasRoadmap) {
    return (
      <div className="relative overflow-hidden w-full rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
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
    <div className="relative w-full rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/60 text-xs font-medium text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Còn <strong className="text-foreground">{stats.daysRemaining} ngày</strong> ({stats.targetDate})</span>
          </div>

          <button
            onClick={onOpenWizard}
            title="Điều chỉnh mục tiêu"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/60"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2 Khung đo lường: BÀI HỌC & TỪ VỰNG (Tone màu sạch, phẳng, thanh lịch) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        {/* Khung 1: BÀI HỌC GIÁO TRÌNH */}
        <div className="rounded-xl bg-muted/20 border border-border/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              BÀI HỌC GIÁO TRÌNH
            </span>
            <span className="font-semibold text-foreground">{stats.lessonProgressPercent}%</span>
          </div>

          {/* Progress bar phẳng, màu solid mộc */}
          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between pt-0.5 text-xs">
            <div>
              <div className="font-medium text-foreground">
                Đã học {stats.completedLessons}/{stats.totalTargetLessons} bài
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                {stats.remainingLessons > 0 ? (
                  <>Còn thiếu <span className="font-bold text-foreground">{stats.remainingLessons} bài</span></>
                ) : (
                  <>Đã hoàn tất toàn bộ bài học</>
                )}
              </div>
            </div>

            <div className="text-muted-foreground text-[11px]">
              ~{stats.weeklyLessonsRequired} bài/tuần
            </div>
          </div>
        </div>

        {/* Khung 2: TỪ VỰNG CỐT LÕI */}
        <div className="rounded-xl bg-muted/20 border border-border/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              TỪ VỰNG CỐT LÕI
            </span>
            <span className="font-semibold text-foreground">{stats.wordProgressPercent}%</span>
          </div>

          {/* Progress bar phẳng */}
          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>

          <div className="flex items-end justify-between pt-0.5 text-xs">
            <div>
              <div className="font-medium text-foreground">
                Đã nạp {stats.learnedWords}/{stats.totalTargetWords} từ
              </div>
              <div className="text-amber-800 dark:text-amber-400 font-semibold mt-0.5">
                {stats.remainingWords > 0 ? (
                  <>Còn thiếu <span className="font-bold text-foreground">{stats.remainingWords} từ</span></>
                ) : (
                  <>Đã nắm trọn vốn từ</>
                )}
              </div>
            </div>

            <div className="text-muted-foreground text-[11px]">
              ~{stats.dailyPaceRequired} từ/ngày
            </div>
          </div>
        </div>
      </div>

      {/* Footer Hành động: Nút phẳng thanh lịch, không màu mè gradient */}
      <div className="pt-3.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-muted-foreground">
          Hôm nay cần: <strong className="text-foreground">{stats.dailyPlan.newWordsTargetCount} từ mới</strong> & <strong className="text-foreground">{stats.dailyPlan.wordsToReviewCount} thẻ ôn</strong>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {stats.dailyPlan.recommendedLesson && (
            <Link
              href={`/books/${stats.dailyPlan.recommendedLesson.bookId}/${stats.dailyPlan.recommendedLesson.lessonId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-medium transition-colors"
            >
              <span>Vào học: {stats.dailyPlan.recommendedLesson.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {stats.dailyPlan.wordsToReviewCount > 0 && (
            <Link
              href="/review"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 text-foreground font-medium border border-border/60 transition-colors"
            >
              <span>Ôn tập ({stats.dailyPlan.wordsToReviewCount})</span>
            </Link>
          )}

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-foreground hover:bg-muted/40 font-medium transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Chi tiết lộ trình</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
