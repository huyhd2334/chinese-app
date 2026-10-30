"use client"

import React from "react"
import { BookOpen, Sparkles, Target, Zap, Clock, TrendingUp, Flame } from "lucide-react"
import type { RoadmapStats } from "@/types/roadmap"
import { RocketPaceSvg, TreasureChestSvg } from "./RoadmapIllustrations"
import { LeafVineCornerSvg } from "./VineBorders"

interface RoadmapDeficitGaugeProps {
  stats: RoadmapStats
}

export function RoadmapDeficitGauge({ stats }: RoadmapDeficitGaugeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Bình Năng Lượng: BÀI HỌC GIÁO TRÌNH */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-emerald-600/20 dark:border-emerald-500/25 p-5 sm:p-6 shadow-sm transition-all hover:border-emerald-500/40 flex flex-col justify-between">
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-75" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Bài học Giáo trình
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.lessonProgressPercent}%
            </span>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Tiến độ tích lũy
            </div>
            <div className="text-3xl font-black text-foreground mt-0.5">
              {stats.completedLessons}{" "}
              <span className="text-base font-normal text-muted-foreground">
                / {stats.totalTargetLessons} bài
              </span>
            </div>
          </div>

          {/* Capsule Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2.5 p-0.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>
        </div>

        {/* CÒN THIẾU BAO NHIÊU */}
        <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Mục tiêu còn thiếu
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {stats.remainingLessons > 0 ? (
                <>👉 Cần thêm <span className="text-base text-foreground font-black">{stats.remainingLessons} bài</span></>
              ) : (
                <>🎉 Hoàn thành xuất sắc 100%!</>
              )}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            {stats.remainingLessons === 0 ? "✓" : `-${stats.remainingLessons}`}
          </div>
        </div>
      </div>

      {/* 2. Bình Năng Lượng: TỪ VỰNG CỐT LÕI */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-amber-600/20 dark:border-amber-500/25 p-5 sm:p-6 shadow-sm transition-all hover:border-amber-500/40 flex flex-col justify-between">
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-75" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Từ vựng Cốt lõi
            </span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {stats.wordProgressPercent}%
            </span>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Vốn từ đã nạp
            </div>
            <div className="text-3xl font-black text-foreground mt-0.5">
              {stats.learnedWords}{" "}
              <span className="text-base font-normal text-muted-foreground">
                / {stats.totalTargetWords} từ
              </span>
            </div>
          </div>

          {/* Capsule Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2.5 p-0.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>
        </div>

        {/* CÒN THIẾU BAO NHIÊU */}
        <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Mục tiêu còn thiếu
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {stats.remainingWords > 0 ? (
                <>👉 Cần thêm <span className="text-base text-foreground font-black">{stats.remainingWords} từ</span></>
              ) : (
                <>🎉 Đã làm chủ toàn bộ từ vựng!</>
              )}
            </span>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              ({stats.masteredWords} từ đã thuộc lòng trí nhớ dài hạn)
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
            {stats.remainingWords === 0 ? "★" : `-${stats.remainingWords}`}
          </div>
        </div>
      </div>

      {/* 3. Bình Vận Tốc: TÊN LỬA TĂNG TỐC (PACE) */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-indigo-600/20 dark:border-indigo-500/25 p-5 sm:p-6 shadow-sm transition-all hover:border-indigo-500/40 flex flex-col justify-between">
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-75" />

        {/* Minh họa Tên Lửa Pastel ở góc */}
        <div className="absolute -top-3 -right-3 opacity-20 pointer-events-none">
          <RocketPaceSvg className="w-20 h-20" />
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Vận tốc Đề xuất
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-secondary text-foreground">
              {stats.paceStatus === "ahead" ? "Vượt hạn" : stats.paceStatus === "behind" ? "Cần tăng tốc" : "Chuẩn nhịp"}
            </span>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Mục tiêu mỗi ngày
            </div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              ~{stats.dailyPaceRequired}{" "}
              <span className="text-base font-normal text-muted-foreground">
                từ mới / ngày
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed">
            Duy trì học <strong className="text-foreground">~{stats.weeklyLessonsRequired} bài/tuần</strong> để chắc chắn hoàn thành trước ngày{" "}
            <span className="font-semibold text-foreground">{stats.targetDate}</span>.
          </div>
        </div>

        {/* Footer thời gian */}
        <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground relative z-10">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Còn <strong>{stats.daysRemaining} ngày</strong></span>
          </div>
          <div className="font-semibold text-indigo-600 dark:text-indigo-400">
            {stats.dailyPlan.targetMinutes} phút/ngày
          </div>
        </div>
      </div>
    </div>
  )
}
