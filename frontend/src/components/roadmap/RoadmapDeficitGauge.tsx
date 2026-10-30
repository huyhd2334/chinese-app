"use client"

import React from "react"
import { BookOpen, Sparkles, Target, Zap, Clock, TrendingUp, Flame } from "lucide-react"
import type { RoadmapStats } from "@/types/roadmap"
import { RocketPaceSvg, TreasureChestSvg } from "./RoadmapIllustrations"

interface RoadmapDeficitGaugeProps {
  stats: RoadmapStats
}

export function RoadmapDeficitGauge({ stats }: RoadmapDeficitGaugeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Bình Năng Lượng: BÀI HỌC GIÁO TRÌNH */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-2 border-emerald-500/30 p-5 sm:p-6 shadow-md transition-all hover:shadow-lg hover:border-emerald-500/50 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              Bài học Giáo trình
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.lessonProgressPercent}%
            </span>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
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
          <div className="w-full bg-secondary/80 rounded-full h-3.5 p-0.5 border border-emerald-500/20 shadow-inner">
            <div
              className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>
        </div>

        {/* CÒN THIẾU BAO NHIÊU */}
        <div className="mt-4 pt-3.5 border-t border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Mục tiêu còn thiếu
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {stats.remainingLessons > 0 ? (
                <>👉 Cần thêm <span className="text-base text-foreground underline decoration-emerald-500 underline-offset-2">{stats.remainingLessons} bài</span></>
              ) : (
                <>🎉 Hoàn thành xuất sắc 100%!</>
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-sm">
            {stats.remainingLessons === 0 ? "✓" : `-${stats.remainingLessons}`}
          </div>
        </div>
      </div>

      {/* 2. Bình Năng Lượng: TỪ VỰNG CỐT LÕI */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border-2 border-amber-500/30 p-5 sm:p-6 shadow-md transition-all hover:shadow-lg hover:border-amber-500/50 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              Từ vựng Cốt lõi
            </span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {stats.wordProgressPercent}%
            </span>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
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
          <div className="w-full bg-secondary/80 rounded-full h-3.5 p-0.5 border border-amber-500/20 shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>
        </div>

        {/* CÒN THIẾU BAO NHIÊU */}
        <div className="mt-4 pt-3.5 border-t border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Mục tiêu còn thiếu
            </span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">
              {stats.remainingWords > 0 ? (
                <>👉 Cần thêm <span className="text-base text-foreground underline decoration-amber-500 underline-offset-2">{stats.remainingWords} từ</span></>
              ) : (
                <>🎉 Đã làm chủ toàn bộ từ vựng!</>
              )}
            </span>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              ({stats.masteredWords} từ đã thuộc lòng trí nhớ dài hạn)
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-sm">
            {stats.remainingWords === 0 ? "★" : `-${stats.remainingWords}`}
          </div>
        </div>
      </div>

      {/* 3. Bình Vận Tốc: TÊN LỬA TĂNG TỐC (PACE) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 border-2 border-indigo-500/30 p-5 sm:p-6 shadow-md transition-all hover:shadow-lg hover:border-indigo-500/50 flex flex-col justify-between">
        {/* Minh họa Tên Lửa Pastel ở góc */}
        <div className="absolute -top-3 -right-3 opacity-30 sm:opacity-40 pointer-events-none">
          <RocketPaceSvg className="w-24 h-24" />
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              Vận tốc Đề xuất
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-500">
              {stats.paceStatus === "ahead" ? "Vượt hạn" : stats.paceStatus === "behind" ? "Cần tăng tốc" : "Chuẩn nhịp"}
            </span>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
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
            <span className="font-bold text-foreground">{stats.targetDate}</span>.
          </div>
        </div>

        {/* Footer thời gian */}
        <div className="mt-4 pt-3.5 border-t border-indigo-500/20 flex items-center justify-between text-xs text-muted-foreground relative z-10">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Còn <strong>{stats.daysRemaining} ngày</strong></span>
          </div>
          <div className="font-bold text-indigo-500">
            {stats.dailyPlan.targetMinutes} phút/ngày
          </div>
        </div>
      </div>
    </div>
  )
}
