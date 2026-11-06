"use client"

import React, { useState } from "react"
import { 
  BarChart3, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Layers,
  Award
} from "lucide-react"

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

  const { total, newCount, learningCount, reviewCount, masteredCount, dueCount, accuracyRate } = distribution

  const newPct = total > 0 ? Math.round((newCount / total) * 100) : 0
  const learningPct = total > 0 ? Math.round((learningCount / total) * 100) : 0
  const reviewPct = total > 0 ? Math.round((reviewCount / total) * 100) : 0
  const masteredPct = total > 0 ? Math.round((masteredCount / total) * 100) : 0

  // Chiều cao tối đa cho biểu đồ cột
  const maxCount = Math.max(1, newCount, learningCount, reviewCount, masteredCount)

  const levels = [
    {
      id: "new" as const,
      name: "Mới nạp",
      subName: "Cấp 1 · Mới học",
      intervalDesc: "0 lượt ôn",
      count: newCount,
      percent: newPct,
      color: "bg-stone-400 dark:bg-stone-500",
      barColor: "bg-stone-300 dark:bg-stone-600 hover:bg-stone-400",
      activeBorder: "border-stone-400 dark:border-stone-500 ring-stone-300/40",
      textClass: "text-stone-600 dark:text-stone-300",
      badgeClass: "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300",
      barHeight: Math.max(12, Math.round((newCount / maxCount) * 100)),
    },
    {
      id: "learning" as const,
      name: "Đang học",
      subName: "Cấp 2 · Làm quen",
      intervalDesc: "1 – 3 ngày",
      count: learningCount,
      percent: learningPct,
      color: "bg-amber-500",
      barColor: "bg-amber-400 dark:bg-amber-500/80 hover:bg-amber-500",
      activeBorder: "border-amber-500 ring-amber-400/40",
      textClass: "text-amber-700 dark:text-amber-300",
      badgeClass: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
      barHeight: Math.max(12, Math.round((learningCount / maxCount) * 100)),
    },
    {
      id: "review" as const,
      name: "Đang củng cố",
      subName: "Cấp 3 · Trí nhớ tạm",
      intervalDesc: "4 – 20 ngày",
      count: reviewCount,
      percent: reviewPct,
      color: "bg-blue-500",
      barColor: "bg-blue-500 dark:bg-blue-500/80 hover:bg-blue-600",
      activeBorder: "border-blue-500 ring-blue-400/40",
      textClass: "text-blue-700 dark:text-blue-300",
      badgeClass: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
      barHeight: Math.max(12, Math.round((reviewCount / maxCount) * 100)),
    },
    {
      id: "mastered" as const,
      name: "Đã thuộc sâu",
      subName: "Cấp 4 · Trí nhớ dài hạn",
      intervalDesc: "≥ 21 ngày",
      count: masteredCount,
      percent: masteredPct,
      color: "bg-emerald-600",
      barColor: "bg-emerald-500 dark:bg-emerald-500/80 hover:bg-emerald-600",
      activeBorder: "border-emerald-500 ring-emerald-400/40",
      textClass: "text-emerald-700 dark:text-emerald-300",
      badgeClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
      barHeight: Math.max(12, Math.round((masteredCount / maxCount) * 100)),
    },
  ]

  return (
    <div className="w-full bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden transition-all">
      {/* Header bar của biểu đồ */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 bg-muted/20 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-china-red/10 border border-china-red/20 flex items-center justify-center text-china-red shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                Biểu đồ mức độ ghi nhớ từ vựng
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/60">
                {total.toLocaleString("vi-VN")} từ đang nạp
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Theo dõi sự dịch chuyển từ vựng từ lúc mới học tới khi ghi nhớ dài hạn (SRS Spaced Repetition)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {dueCount > 0 && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
              <Clock className="w-3.5 h-3.5" />
              <span>{dueCount} từ cần ôn</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/60 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? "Thu gọn" : "Xem biểu đồ"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Nội dung biểu đồ mở rộng */}
      {isExpanded && (
        <div className="p-3.5 sm:p-5 space-y-4 animate-fade-in">
          {/* 1. Dải phân bổ tỷ lệ liền mạch (Stacked Bar) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Phân bổ tổng thể:</span>
              <span className="text-[11px]">Bấm vào từng mức để lọc danh sách thẻ</span>
            </div>

            <div className="w-full h-3 rounded-full bg-muted/40 overflow-hidden flex shadow-inner">
              {newPct > 0 && (
                <div
                  style={{ width: `${newPct}%` }}
                  className="bg-stone-400 dark:bg-stone-500 transition-all duration-500 relative group cursor-pointer"
                  title={`Mới nạp: ${newCount} từ (${newPct}%)`}
                  onClick={() => onSelectFilter?.("new")}
                />
              )}
              {learningPct > 0 && (
                <div
                  style={{ width: `${learningPct}%` }}
                  className="bg-amber-500 transition-all duration-500 relative group cursor-pointer"
                  title={`Đang học: ${learningCount} từ (${learningPct}%)`}
                  onClick={() => onSelectFilter?.("learning")}
                />
              )}
              {reviewPct > 0 && (
                <div
                  style={{ width: `${reviewPct}%` }}
                  className="bg-blue-500 transition-all duration-500 relative group cursor-pointer"
                  title={`Đang củng cố: ${reviewCount} từ (${reviewPct}%)`}
                  onClick={() => onSelectFilter?.("review")}
                />
              )}
              {masteredPct > 0 && (
                <div
                  style={{ width: `${masteredPct}%` }}
                  className="bg-emerald-600 transition-all duration-500 relative group cursor-pointer"
                  title={`Đã thuộc sâu: ${masteredCount} từ (${masteredPct}%)`}
                  onClick={() => onSelectFilter?.("mastered")}
                />
              )}
            </div>
          </div>

          {/* 2. Biểu đồ 4 Cột Trực quan theo Mức độ Ghi nhớ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
            {levels.map((lvl) => {
              const isSelected = currentFilter === lvl.id

              return (
                <div
                  key={lvl.id}
                  onClick={() => onSelectFilter?.(lvl.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-sm ${
                    isSelected
                      ? `bg-muted/40 ${lvl.activeBorder} ring-2`
                      : "bg-muted/15 border-border/70 hover:border-border hover:bg-muted/25"
                  }`}
                >
                  {/* Top info */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${lvl.badgeClass}`}>
                        {lvl.name}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {lvl.percent}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-lg sm:text-xl font-extrabold text-foreground">
                        {lvl.count.toLocaleString("vi-VN")}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        từ
                      </span>
                    </div>
                  </div>

                  {/* Cột đồ thị cao thấp (Vertical Histogram Bar) */}
                  <div className="my-2.5 h-16 sm:h-20 flex items-end justify-center bg-muted/30 rounded-lg p-1.5 border border-border/40">
                    <div
                      className={`w-full max-w-[42px] rounded-md transition-all duration-500 ${lvl.barColor} shadow-xs flex items-center justify-center text-[10px] font-bold text-white`}
                      style={{ height: `${lvl.barHeight}%` }}
                      title={`${lvl.name}: ${lvl.count} từ`}
                    >
                      {lvl.count > 0 && lvl.barHeight >= 28 && lvl.count}
                    </div>
                  </div>

                  {/* Chu kỳ lặp lại Spaced Repetition */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Chu kỳ lặp:</span>
                    <span className="font-semibold text-foreground">{lvl.intervalDesc}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 3. Footer KPI Tóm tắt: Tỉ lệ Thuộc sâu, Tỉ lệ Chính xác & Thẻ Cần Ôn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/60 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block">Tỷ lệ thuộc sâu</span>
                <span className="font-bold text-foreground text-xs sm:text-sm">
                  {masteredPct}% <span className="font-normal text-[11px] text-muted-foreground">({masteredCount}/{total} từ)</span>
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/60 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block">Độ chính xác phản xạ</span>
                <span className="font-bold text-foreground text-xs sm:text-sm">
                  {accuracyRate}% <span className="font-normal text-[11px] text-muted-foreground">trong các lần lật thẻ</span>
                </span>
              </div>
            </div>

            <div 
              onClick={() => onSelectFilter?.("due")}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                dueCount > 0 
                  ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 hover:bg-rose-50 dark:hover:bg-rose-950/30" 
                  : "bg-muted/20 border-border/60"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                dueCount > 0 ? "bg-rose-600/15 text-rose-600 dark:text-rose-400" : "bg-emerald-600/15 text-emerald-600"
              }`}>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] text-muted-foreground block">Cần ôn hôm nay</span>
                <span className="font-bold text-foreground text-xs sm:text-sm flex items-center justify-between">
                  <span>{dueCount} từ</span>
                  {dueCount > 0 && <span className="text-[10px] text-rose-600 font-semibold underline">Ôn ngay</span>}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
