"use client"

import React from "react"
import { BookOpen, Target, Clock, Zap } from "lucide-react"
import type { RoadmapStats } from "@/types/roadmap"

interface RoadmapDeficitGaugeProps {
  stats: RoadmapStats
}

export function RoadmapDeficitGauge({ stats }: RoadmapDeficitGaugeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. BÀI HỌC GIÁO TRÌNH */}
      <div className="rounded-xl bg-card border border-border/80 p-5 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Bài học Giáo trình
            </span>
            <span className="text-sm font-bold text-foreground">
              {stats.lessonProgressPercent}%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.completedLessons}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {stats.totalTargetLessons} bài
              </span>
            </div>
          </div>

          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Còn thiếu:</span>
          <span className="font-bold text-foreground">
            {stats.remainingLessons > 0 ? `${stats.remainingLessons} bài học` : "Đã hoàn thành"}
          </span>
        </div>
      </div>

      {/* 2. TỪ VỰNG CỐT LÕI */}
      <div className="rounded-xl bg-card border border-border/80 p-5 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Từ vựng Cốt lõi
            </span>
            <span className="text-sm font-bold text-foreground">
              {stats.wordProgressPercent}%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.learnedWords}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {stats.totalTargetWords} từ
              </span>
            </div>
          </div>

          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Còn thiếu:</span>
          <span className="font-bold text-foreground">
            {stats.remainingWords > 0 ? `${stats.remainingWords} từ (${stats.masteredWords} từ thuộc sâu)` : "Đã làm chủ"}
          </span>
        </div>
      </div>

      {/* 3. VẬN TỐC CẦN DUY TRÌ */}
      <div className="rounded-xl bg-card border border-border/80 p-5 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Vận tốc cần đạt
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted/50 text-foreground">
              {stats.paceStatus === "ahead" ? "Vượt hạn" : stats.paceStatus === "behind" ? "Cần tăng tốc" : "Đúng hạn"}
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              ~{stats.dailyPaceRequired}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                từ / ngày
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Duy trì học ~<strong className="text-foreground">{stats.weeklyLessonsRequired} bài/tuần</strong> để kịp ngày {stats.targetDate}.
          </div>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>Còn {stats.daysRemaining} ngày</span>
          <span className="font-medium text-foreground">{stats.dailyPlan.targetMinutes} phút/ngày</span>
        </div>
      </div>
    </div>
  )
}
