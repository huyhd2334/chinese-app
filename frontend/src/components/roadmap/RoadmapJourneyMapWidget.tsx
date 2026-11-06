"use client"

import React from "react"
import Link from "next/link"
import { Check, ArrowUpRight } from "lucide-react"
import type { RoadmapStats, HskLevelNumber } from "@/types/roadmap"
import { HSK_CUMULATIVE_STANDARDS } from "@/utils/roadmapStorage"
import { LeafVineCornerSvg } from "./VineBorders"

interface RoadmapJourneyMapProps {
  stats: RoadmapStats
}

export function RoadmapJourneyMapWidget({ stats }: RoadmapJourneyMapProps) {
  const targetLevel = Math.min(3, stats.targetLevel) as HskLevelNumber
  const levels: HskLevelNumber[] = ([1, 2, 3] as HskLevelNumber[]).filter((lvl) => lvl <= targetLevel)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
      <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-8 h-8 sm:w-9 sm:h-9" />
      <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 sm:w-9 sm:h-9" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60 relative z-10">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Lộ trình từng cấp độ (HSK 1 – HSK {targetLevel})
          </h3>
          <p className="text-xs text-muted-foreground">
            Bấm vào cấp độ bất kỳ để vào thẳng bài học giáo trình hoặc luyện từ vựng.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Đã tích lũy <strong className="text-foreground">{stats.effectiveCompletedLessons}/{stats.totalTargetLessons}</strong> bài
        </div>
      </div>

      {/* Grid 6 cấp độ cân đối - trên màn hình lớn 1 hàng 6 thẻ, không bị lệch hoặc cắt xén */}
      <div className={`grid gap-3 ${
        levels.length >= 6 
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" 
          : levels.length === 5 
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" 
          : levels.length === 4 
          ? "grid-cols-2 sm:grid-cols-4" 
          : "grid-cols-1 sm:grid-cols-3"
      }`}>
        {levels.map((lvl, index) => {
          const standard = HSK_CUMULATIVE_STANDARDS[lvl]
          const breakdownItem = stats.breakdown.find((b) => b.level === lvl)

          const wordsLearned = breakdownItem?.learnedWords || 0
          const wordsTarget = breakdownItem?.targetWords || standard.words
          const lessonsCompleted = breakdownItem?.completedLessons || 0
          const lessonsTarget = breakdownItem?.targetLessons || standard.lessons

          const isCompleted = wordsLearned >= wordsTarget * 0.9 && lessonsCompleted >= lessonsTarget * 0.9
          
          // Xác định cấp độ đang học: là cấp độ đầu tiên chưa hoàn thành
          const isCurrent = !isCompleted && (index === 0 || stats.breakdown.slice(0, index).every(b => b.learnedWords >= b.targetWords * 0.8))
          const isTarget = lvl === targetLevel

          return (
            <Link
              key={lvl}
              href={`/books/${standard.bookId}`}
              className={`rounded-xl p-3 sm:p-3.5 border transition-all flex flex-col justify-between space-y-2.5 group cursor-pointer hover:shadow-md ${
                isCompleted
                  ? "bg-muted/20 border-emerald-500/30 text-foreground hover:border-emerald-500"
                  : isCurrent
                  ? "bg-card border-indigo-500/60 shadow-xs ring-1 ring-indigo-500/30 hover:border-indigo-500"
                  : "bg-muted/10 border-border/60 hover:border-border hover:bg-muted/20"
              }`}
              title={`Bấm để vào học Giáo trình HSK ${lvl}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isCompleted 
                      ? "bg-emerald-600 text-white" 
                      : isCurrent 
                      ? "bg-indigo-600 text-white" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {lvl}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    HSK {lvl}
                  </span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                      Đang học
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-0.5 group-hover:text-foreground">
                      Vào học
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-[11px] sm:text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Từ:</span>
                  <span className="font-semibold text-foreground">{wordsLearned}/{wordsTarget}</span>
                </div>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCompleted ? "bg-emerald-600" : isCurrent ? "bg-indigo-600" : "bg-muted-foreground/60"
                    }`}
                    style={{ width: `${Math.min(100, Math.round((wordsLearned / wordsTarget) * 100))}%` }}
                  />
                </div>

                <div className="flex justify-between text-muted-foreground pt-0.5">
                  <span>Bài:</span>
                  <span className="font-semibold text-foreground">{lessonsCompleted}/{lessonsTarget}</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-border/50 text-[10px] sm:text-[11px] text-muted-foreground flex items-center justify-between">
                {isTarget ? (
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Đích đến HSK {targetLevel}</span>
                ) : isCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Đã đạt chuẩn</span>
                ) : (
                  <span>Còn {Math.max(0, wordsTarget - wordsLearned)} từ</span>
                )}
                <span className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground transition-opacity">
                  Học →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
