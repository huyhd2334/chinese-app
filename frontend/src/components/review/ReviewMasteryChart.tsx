"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export interface MasteryDistribution {
  total: number
  newCount: number
  learningCount: number
  reviewCount: number
  masteredCount: number
  dueCount: number
  accuracyRate: number
}

interface ReviewMasteryChartProps {
  distribution: MasteryDistribution
  onSelectFilter?: (filter: "all" | "new" | "learning" | "review" | "mastered" | "due") => void
  currentFilter?: string
}

export function ReviewMasteryChart({
  distribution,
  onSelectFilter,
  currentFilter = "due",
}: ReviewMasteryChartProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const { total, newCount, learningCount, reviewCount, masteredCount, accuracyRate } = distribution

  const newPct = total > 0 ? Math.round((newCount / total) * 100) : 0
  const learningPct = total > 0 ? Math.round((learningCount / total) * 100) : 0
  const reviewPct = total > 0 ? Math.round((reviewCount / total) * 100) : 0
  const masteredPct = total > 0 ? Math.round((masteredCount / total) * 100) : 0

  const levels = [
    {
      id: "new" as const,
      name: "Mới nạp",
      intervalDesc: "Chưa ôn",
      count: newCount,
      percent: newPct,
      dotClass: "bg-zinc-400 dark:bg-zinc-500",
      barClass: "bg-zinc-400 dark:bg-zinc-500",
    },
    {
      id: "learning" as const,
      name: "Đang học",
      intervalDesc: "1–3 ngày",
      count: learningCount,
      percent: learningPct,
      dotClass: "bg-amber-500",
      barClass: "bg-amber-500",
    },
    {
      id: "review" as const,
      name: "Đang củng cố",
      intervalDesc: "4–20 ngày",
      count: reviewCount,
      percent: reviewPct,
      dotClass: "bg-blue-500",
      barClass: "bg-blue-500",
    },
    {
      id: "mastered" as const,
      name: "Đã thuộc sâu",
      intervalDesc: "≥ 21 ngày",
      count: masteredCount,
      percent: masteredPct,
      dotClass: "bg-emerald-600 dark:bg-emerald-500",
      barClass: "bg-emerald-600 dark:bg-emerald-500",
    },
  ]

  return (
    <div className="w-full bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <span className="font-bold text-foreground">Mức độ ghi nhớ (SRS)</span>
          <span className="text-muted">
            {total.toLocaleString("vi-VN")} từ · Chính xác {accuracyRate}%
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-china-paper transition-colors cursor-pointer"
        >
          <span>{isExpanded ? "Thu gọn" : "Chi tiết"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3.5 animate-fade-in">
          {/* Proportional Stacked Bar */}
          <div className="w-full h-2.5 rounded-full bg-china-paper overflow-hidden flex gap-0.5">
            {levels.map(
              (lvl) =>
                lvl.percent > 0 && (
                  <div
                    key={lvl.id}
                    style={{ width: `${lvl.percent}%` }}
                    className={`${lvl.barClass} h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 cursor-pointer hover:opacity-85`}
                    title={`${lvl.name}: ${lvl.count} từ (${lvl.percent}%)`}
                    onClick={() => onSelectFilter?.(lvl.id)}
                  />
                )
            )}
          </div>

          {/* 4 Compact Stage Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {levels.map((lvl) => {
              const isSelected = currentFilter === lvl.id
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectFilter?.(lvl.id)}
                  className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-china-paper border-foreground/40"
                      : "bg-china-paper/40 dark:bg-white/[0.02] border-border hover:border-foreground/25"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <span className={`w-2 h-2 rounded-full ${lvl.dotClass}`} />
                      {lvl.name}
                    </span>
                    <span className="text-[11px] text-muted">{lvl.percent}%</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-foreground">
                      {lvl.count.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-[11px] text-muted">{lvl.intervalDesc}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
