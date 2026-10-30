"use client"

import React from "react"
import { Check, Lock, ChevronRight } from "lucide-react"
import type { RoadmapStats, HskLevelNumber } from "@/types/roadmap"
import { HSK_CUMULATIVE_STANDARDS } from "@/utils/roadmapStorage"
import { LeafVineCornerSvg } from "./VineBorders"

interface RoadmapJourneyMapProps {
  stats: RoadmapStats
}

export function RoadmapJourneyMapWidget({ stats }: RoadmapJourneyMapProps) {
  const targetLevel = stats.targetLevel
  const levels: HskLevelNumber[] = [1, 2, 3, 4, 5, 6].filter((lvl) => lvl <= Math.max(targetLevel, 3)) as HskLevelNumber[]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-emerald-600/30 dark:border-emerald-500/30 p-5 sm:p-6 shadow-xs space-y-5">
      <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-8 h-8 sm:w-9 sm:h-9" />
      <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 sm:w-9 sm:h-9" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60 relative z-10">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Lộ trình từng cấp độ (HSK 1 – HSK {targetLevel})
          </h3>
          <p className="text-xs text-muted-foreground">
            Theo dõi tiến độ hoàn thành các mốc chuẩn kiến thức.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Đã hoàn thành <strong className="text-foreground">{stats.completedLessons}/{stats.totalTargetLessons}</strong> bài
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {levels.map((lvl, index) => {
          const standard = HSK_CUMULATIVE_STANDARDS[lvl]
          const breakdownItem = stats.breakdown.find((b) => b.level === lvl)

          const wordsLearned = breakdownItem?.learnedWords || 0
          const wordsTarget = breakdownItem?.targetWords || standard.words
          const lessonsCompleted = breakdownItem?.completedLessons || 0
          const lessonsTarget = breakdownItem?.targetLessons || standard.lessons

          const isCompleted = wordsLearned >= wordsTarget * 0.9 && lessonsCompleted >= lessonsTarget * 0.9
          const isCurrent = !isCompleted && (index === 0 || stats.breakdown[index - 1]?.learnedWords >= (stats.breakdown[index - 1]?.targetWords || 0) * 0.7)
          const isTarget = lvl === targetLevel

          return (
            <div
              key={lvl}
              className={`rounded-xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                isCompleted
                  ? "bg-muted/20 border-emerald-500/30 text-foreground"
                  : isCurrent
                  ? "bg-card border-foreground/30 shadow-xs ring-1 ring-border"
                  : "bg-muted/10 border-border/50 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                    isCompleted 
                      ? "bg-emerald-600 text-white" 
                      : isCurrent 
                      ? "bg-foreground text-background" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {lvl}
                  </span>
                  <span className="font-semibold text-sm text-foreground">
                    HSK {lvl}
                  </span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                      Đang học
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground/60" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Từ vựng:</span>
                  <span className="font-medium text-foreground">{wordsLearned}/{wordsTarget}</span>
                </div>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isCompleted ? "bg-emerald-600" : "bg-foreground"}`}
                    style={{ width: `${Math.min(100, Math.round((wordsLearned / wordsTarget) * 100))}%` }}
                  />
                </div>

                <div className="flex justify-between text-muted-foreground pt-1">
                  <span>Bài học:</span>
                  <span className="font-medium text-foreground">{lessonsCompleted}/{lessonsTarget}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                {isTarget ? (
                  <span className="font-semibold text-foreground">Mục tiêu hiện tại</span>
                ) : isCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Đã hoàn thành</span>
                ) : (
                  <span>Còn {Math.max(0, wordsTarget - wordsLearned)} từ</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
