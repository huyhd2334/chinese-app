"use client"

import React from "react"
import Image from "next/image"
import { Check, Lock, Sparkles, Trophy, Star, Flag } from "lucide-react"
import type { RoadmapStats, HskLevelNumber } from "@/types/roadmap"
import { HSK_CUMULATIVE_STANDARDS } from "@/utils/roadmapStorage"
import { LeafVineCornerSvg, FoliageEdgeBorder } from "./VineBorders"

interface RoadmapJourneyMapProps {
  stats: RoadmapStats
}

export function RoadmapJourneyMapWidget({ stats }: RoadmapJourneyMapProps) {
  const targetLevel = stats.targetLevel
  const levels: HskLevelNumber[] = [1, 2, 3, 4, 5, 6].filter((lvl) => lvl <= Math.max(targetLevel, 3)) as HskLevelNumber[]

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-emerald-500/10 border-2 border-emerald-500/35 p-5 sm:p-7 shadow-xl">
      {/* Khung Dây Leo Lá Cây Tươi Sáng Bao Quanh Bản Đồ */}
      <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-14 h-14 sm:w-16 sm:h-16" />
      <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-14 h-14 sm:w-16 sm:h-16" />
      <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-12 h-12 sm:w-14 sm:h-14" />
      <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14" />
      <FoliageEdgeBorder position="top" className="h-3.5 opacity-60" />
      <FoliageEdgeBorder position="bottom" className="h-3.5 opacity-60" />

      {/* Background ambient dots & sparkles */}
      <div className="absolute top-2 right-4 text-amber-400/40 animate-pulse">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Bản đồ Hành trình Chinh phục
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">
            Con đường cán đích HSK {targetLevel}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Từng bước vượt ải – Hoàn thành bài học và tích lũy từ vựng để mở khóa rương tri thức!
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-card border border-border/80 shadow-xs text-xs font-bold text-foreground">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Đã hoàn thành {stats.completedLessons}/{stats.totalTargetLessons} bài</span>
        </div>
      </div>

      {/* Gamified Road Trail */}
      <div className="relative z-10 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 relative">
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
                className={`relative rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between ${
                  isCompleted
                    ? "bg-gradient-to-b from-emerald-500/15 to-emerald-600/5 border-2 border-emerald-500/40 shadow-sm"
                    : isCurrent
                    ? "bg-gradient-to-b from-amber-500/20 via-card to-rose-500/10 border-2 border-amber-500 ring-4 ring-amber-500/20 shadow-lg scale-[1.02]"
                    : "bg-card/60 border border-border/70 opacity-80"
                }`}
              >
                {/* Mascot Tiểu Lu đứng tại trạm hiện tại */}
                {isCurrent && (
                  <div className="absolute -top-7 right-3 z-20 flex flex-col items-center animate-bounce-gentle select-none">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                      Bạn ở đây!
                    </span>
                    <div className="relative w-12 h-12 -mt-1 drop-shadow-md">
                      <Image
                        src="/chibi-cheer.svg"
                        alt="Tiểu Lu cổ vũ"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Level Tag & Status Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shadow-xs ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {lvl}
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      HSK {lvl}
                    </span>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : isCurrent ? (
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs animate-spin-slow">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center text-xs">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Từ vựng:</span>
                    <span className="text-foreground font-bold">{wordsLearned}/{wordsTarget} từ</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-emerald-500"
                          : isCurrent
                          ? "bg-gradient-to-r from-amber-500 to-rose-500"
                          : "bg-muted-foreground/30"
                      }`}
                      style={{ width: `${Math.min(100, Math.round((wordsLearned / wordsTarget) * 100))}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-muted-foreground font-medium pt-1">
                    <span>Bài học:</span>
                    <span className="text-foreground font-bold">{lessonsCompleted}/{lessonsTarget} bài</span>
                  </div>
                </div>

                {/* Milestone Badge Footer */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                  {isTarget ? (
                    <span className="font-black text-rose-500 flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5 fill-rose-500" />
                      Đích đến mục tiêu!
                    </span>
                  ) : isCompleted ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      🏆 Đã làm chủ
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-medium">
                      Còn {Math.max(0, wordsTarget - wordsLearned)} từ cần nạp
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
