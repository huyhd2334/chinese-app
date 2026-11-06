"use client"

import React, { useState } from "react"
import { 
  BarChart3, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles
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

  // Tìm giá trị lớn nhất để chuẩn hóa chiều cao cột
  const maxCount = Math.max(1, newCount, learningCount, reviewCount, masteredCount)

  const levels = [
    {
      id: "new" as const,
      name: "Mới nạp",
      subName: "Cấp 1 · Mới học",
      intervalDesc: "0 lượt ôn",
      count: newCount,
      percent: newPct,
      color: "bg-indigo-500",
      barGradient: "from-indigo-500 to-indigo-400",
      activeRing: "ring-2 ring-indigo-500 border-indigo-300 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm",
      badgeClass: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/50",
      dotClass: "bg-indigo-500",
      trackBg: "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30",
    },
    {
      id: "learning" as const,
      name: "Đang học",
      subName: "Cấp 2 · Làm quen",
      intervalDesc: "1 – 3 ngày",
      count: learningCount,
      percent: learningPct,
      color: "bg-amber-500",
      barGradient: "from-amber-500 to-amber-400",
      activeRing: "ring-2 ring-amber-500 border-amber-300 dark:border-amber-600 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm",
      badgeClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50",
      dotClass: "bg-amber-500",
      trackBg: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30",
    },
    {
      id: "review" as const,
      name: "Đang củng cố",
      subName: "Cấp 3 · Trí nhớ tạm",
      intervalDesc: "4 – 20 ngày",
      count: reviewCount,
      percent: reviewPct,
      color: "bg-sky-500",
      barGradient: "from-sky-500 to-sky-400",
      activeRing: "ring-2 ring-sky-500 border-sky-300 dark:border-sky-600 bg-sky-50/40 dark:bg-sky-950/20 shadow-sm",
      badgeClass: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/50",
      dotClass: "bg-sky-500",
      trackBg: "bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30",
    },
    {
      id: "mastered" as const,
      name: "Đã thuộc sâu",
      subName: "Cấp 4 · Dài hạn",
      intervalDesc: "≥ 21 ngày",
      count: masteredCount,
      percent: masteredPct,
      color: "bg-emerald-500",
      barGradient: "from-emerald-500 to-emerald-400",
      activeRing: "ring-2 ring-emerald-500 border-emerald-300 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm",
      badgeClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50",
      dotClass: "bg-emerald-500",
      trackBg: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30",
    },
  ]

  return (
    <div className="w-full bg-white dark:bg-card rounded-2xl border border-border shadow-xs overflow-hidden transition-all">
      {/* Header bar của biểu đồ */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-50/60 dark:bg-white/[0.02] border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-china-red/10 border border-china-red/20 flex items-center justify-center text-china-red shrink-0 shadow-2xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-china-ink dark:text-white">
                Biểu đồ mức độ ghi nhớ từ vựng
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-border">
                {total.toLocaleString("vi-VN")} từ đang nạp
              </span>
            </div>
            <p className="text-[11px] text-muted hidden sm:block">
              Theo dõi sự dịch chuyển từ vựng từ lúc mới nạp tới khi ghi nhớ dài hạn (Spaced Repetition)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {dueCount > 0 && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{dueCount} từ cần ôn</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-muted hover:text-china-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-border transition-colors cursor-pointer"
          >
            <span>{isExpanded ? "Thu gọn" : "Xem biểu đồ"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Nội dung biểu đồ mở rộng */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 animate-fade-in">
          {/* 1. Dải phân bổ tỷ lệ liền mạch (Stacked Bar) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold text-china-ink dark:text-white">Phân bổ tổng thể:</span>
              <span className="text-[11px]">Bấm vào từng mức để lọc danh sách thẻ</span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-neutral-800/70 overflow-hidden flex shadow-inner border border-border/40 p-0.5 gap-0.5">
              {newPct > 0 && (
                <div
                  style={{ width: `${newPct}%` }}
                  className="bg-indigo-500 h-full rounded-sm transition-all duration-500 cursor-pointer hover:opacity-90"
                  title={`Mới nạp: ${newCount} từ (${newPct}%)`}
                  onClick={() => onSelectFilter?.("new")}
                />
              )}
              {learningPct > 0 && (
                <div
                  style={{ width: `${learningPct}%` }}
                  className="bg-amber-500 h-full rounded-sm transition-all duration-500 cursor-pointer hover:opacity-90"
                  title={`Đang học: ${learningCount} từ (${learningPct}%)`}
                  onClick={() => onSelectFilter?.("learning")}
                />
              )}
              {reviewPct > 0 && (
                <div
                  style={{ width: `${reviewPct}%` }}
                  className="bg-sky-500 h-full rounded-sm transition-all duration-500 cursor-pointer hover:opacity-90"
                  title={`Đang củng cố: ${reviewCount} từ (${reviewPct}%)`}
                  onClick={() => onSelectFilter?.("review")}
                />
              )}
              {masteredPct > 0 && (
                <div
                  style={{ width: `${masteredPct}%` }}
                  className="bg-emerald-500 h-full rounded-sm transition-all duration-500 cursor-pointer hover:opacity-90"
                  title={`Đã thuộc sâu: ${masteredCount} từ (${masteredPct}%)`}
                  onClick={() => onSelectFilter?.("mastered")}
                />
              )}
            </div>

            {/* Chú thích màu sắc */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-muted pt-0.5">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => onSelectFilter?.("new")}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span>Mới nạp ({newPct}%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFilter?.("learning")}
                  className="flex items-center gap-1.5 hover:text-amber-600 transition cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Đang học ({learningPct}%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFilter?.("review")}
                  className="flex items-center gap-1.5 hover:text-sky-600 transition cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span>Đang củng cố ({reviewPct}%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFilter?.("mastered")}
                  className="flex items-center gap-1.5 hover:text-emerald-600 transition cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Đã thuộc sâu ({masteredPct}%)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Biểu đồ 4 Cột Trực quan theo Mức độ Ghi nhớ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
            {levels.map((lvl) => {
              const isSelected = currentFilter === lvl.id
              const hasItems = lvl.count > 0
              const normalizedHeight = Math.max(20, Math.round((lvl.count / maxCount) * 100))

              return (
                <div
                  key={lvl.id}
                  onClick={() => onSelectFilter?.(lvl.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? lvl.activeRing
                      : "bg-slate-50/50 dark:bg-white/[0.02] border-border hover:border-slate-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/[0.04] hover:shadow-xs"
                  }`}
                >
                  {/* Top info */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvl.badgeClass}`}>
                        {lvl.name}
                      </span>
                      <span className="text-xs font-bold text-muted">
                        {lvl.percent}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xl sm:text-2xl font-black text-china-ink dark:text-white">
                        {lvl.count.toLocaleString("vi-VN")}
                      </span>
                      <span className="text-[11px] text-muted font-medium">
                        từ
                      </span>
                    </div>
                  </div>

                  {/* Cột đồ thị cao thấp trang nhã (Vertical Histogram Bar) */}
                  <div className={`my-2 h-14 sm:h-16 flex items-end justify-center rounded-xl p-1 border transition-all ${lvl.trackBg}`}>
                    {hasItems ? (
                      <div
                        className={`w-full max-w-[38px] rounded-lg transition-all duration-500 bg-gradient-to-t ${lvl.barGradient} shadow-xs flex items-center justify-center text-[10px] font-bold text-white`}
                        style={{ height: `${normalizedHeight}%` }}
                        title={`${lvl.name}: ${lvl.count} từ`}
                      >
                        {lvl.count}
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-muted/60 self-center">0 từ</span>
                    )}
                  </div>

                  {/* Chu kỳ lặp lại Spaced Repetition */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted">
                    <span>Chu kỳ lặp:</span>
                    <span className="font-semibold text-china-ink dark:text-slate-200">{lvl.intervalDesc}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 3. Footer KPI Tóm tắt: Tỉ lệ Thuộc sâu, Tỉ lệ Chính xác & Thẻ Cần Ôn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            {/* Tỷ lệ thuộc sâu */}
            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 block">Tỷ lệ thuộc sâu</span>
                <span className="font-extrabold text-china-ink dark:text-white text-xs sm:text-sm">
                  {masteredPct}% <span className="font-normal text-[11px] text-muted">({masteredCount}/{total} từ)</span>
                </span>
              </div>
            </div>

            {/* Độ chính xác phản xạ */}
            <div className="p-3 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-800/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-sky-800 dark:text-sky-300 block">Độ chính xác phản xạ</span>
                <span className="font-extrabold text-china-ink dark:text-white text-xs sm:text-sm">
                  {accuracyRate}% <span className="font-normal text-[11px] text-muted">trong các lần lật thẻ</span>
                </span>
              </div>
            </div>

            {/* Cần ôn hôm nay */}
            <div 
              onClick={() => onSelectFilter?.("due")}
              className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                dueCount > 0 
                  ? "bg-rose-50/70 dark:bg-rose-950/25 border-rose-300/80 dark:border-rose-800/50 hover:bg-rose-100/60 shadow-xs" 
                  : "bg-slate-50/60 dark:bg-white/[0.02] border-border hover:bg-slate-100/60"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                dueCount > 0 ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-emerald-500/15 text-emerald-600"
              }`}>
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-rose-800 dark:text-rose-300 block">Cần ôn hôm nay</span>
                <span className="font-extrabold text-china-ink dark:text-white text-xs sm:text-sm flex items-center justify-between">
                  <span>{dueCount} từ</span>
                  {dueCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold tracking-wide shadow-2xs hover:bg-rose-700 transition">
                      Ôn ngay →
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
