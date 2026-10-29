"use client"

import React from "react"
import Link from "next/link"
import { 
  Compass, 
  Target, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap, 
  AlertCircle,
  TrendingUp,
  Settings2
} from "lucide-react"
import { useRoadmap } from "@/hooks/useRoadmap"

interface RoadmapCardProps {
  onOpenWizard: () => void
}

export function RoadmapCard({ onOpenWizard }: RoadmapCardProps) {
  const { stats, loading } = useRoadmap()

  if (loading) {
    return (
      <div className="w-full bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
    )
  }

  // 1. Chưa thiết lập lộ trình -> Hiện Banner Call-to-Action mời gọi tạo lộ trình
  if (!stats || !stats.hasRoadmap) {
    return (
      <div className="relative overflow-hidden w-full bg-gradient-to-br from-indigo-950/40 via-card/80 to-purple-950/30 border border-indigo-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Lộ trình học cá nhân hóa
            </div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              Chưa biết bắt đầu từ đâu?
              <span className="text-indigo-400 text-sm font-normal">Thiết lập lộ trình trong 1 phút</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hệ thống sẽ đo lường số bài học và số từ vựng bạn đã biết, sau đó tự động tính toán chi tiết <strong className="text-foreground">cần học bao nhiêu từ mỗi ngày và còn thiếu bao nhiêu bài</strong> để cán đích đúng hạn.
            </p>
          </div>

          <button
            onClick={onOpenWizard}
            className="group whitespace-nowrap px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 transform active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            Tạo lộ trình ngay
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    )
  }

  // 2. Đã có lộ trình -> Dashboard hiển thị chính xác "Còn thiếu gì để đạt mục tiêu"
  const paceBadgeConfig = {
    ahead: { label: "Vượt tiến độ 🚀", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    on_track: { label: "Đúng tiến độ ✨", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    behind: { label: "Cần tăng tốc ⚡", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    danger: { label: "Chậm tiến độ ⚠️", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
  }[stats.paceStatus]

  return (
    <div className="relative overflow-hidden w-full bg-card/75 backdrop-blur-md border border-border/70 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/40">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/50 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              HSK {stats.targetLevel}
            </span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${paceBadgeConfig.color}`}>
              {paceBadgeConfig.label}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            {stats.goalTitle}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/60 text-xs text-muted-foreground font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Còn <strong className="text-foreground">{stats.daysRemaining}</strong> ngày ({stats.targetDate})</span>
          </div>

          <button
            onClick={onOpenWizard}
            title="Điều chỉnh mục tiêu"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Đo lường tiến độ "CẦN GÌ ĐỂ ĐẠT MỤC TIÊU" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 relative z-10">
        {/* Card 1: Tiến độ Bài học */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Bài học giáo trình
            </span>
            <span className="font-semibold text-foreground">{stats.lessonProgressPercent}%</span>
          </div>

          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.lessonProgressPercent}%` }}
            />
          </div>

          <div className="text-sm">
            <div className="text-foreground font-semibold">
              Đã học {stats.completedLessons} / {stats.totalTargetLessons} bài
            </div>
            <div className="text-xs text-emerald-400/90 font-medium mt-0.5">
              {stats.remainingLessons > 0 ? (
                <>👉 Còn thiếu <strong className="text-foreground">{stats.remainingLessons} bài</strong> để cán đích</>
              ) : (
                <>🎉 Đã hoàn thành 100% bài học!</>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Tiến độ Từ vựng */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Target className="w-4 h-4 text-indigo-400" />
              Từ vựng cốt lõi
            </span>
            <span className="font-semibold text-foreground">{stats.wordProgressPercent}%</span>
          </div>

          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.wordProgressPercent}%` }}
            />
          </div>

          <div className="text-sm">
            <div className="text-foreground font-semibold">
              Đã nạp {stats.learnedWords} / {stats.totalTargetWords} từ
            </div>
            <div className="text-xs text-indigo-400/90 font-medium mt-0.5">
              {stats.remainingWords > 0 ? (
                <>👉 Còn thiếu <strong className="text-foreground">{stats.remainingWords} từ</strong> ({stats.masteredWords} từ đã thuộc sâu)</>
              ) : (
                <>🎉 Đã làm chủ toàn bộ từ vựng!</>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Vận tốc cần duy trì (Pace) */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-amber-400" />
              Vận tốc cần đạt
            </span>
            <span className="font-semibold text-amber-400">
              {stats.dailyPaceRequired} từ / ngày
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="text-2xl font-black text-foreground">
              ~{stats.weeklyLessonsRequired}
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              bài học / tuần<br />
              <span className="text-foreground font-medium">để kịp ngày thi</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span>Đã tích lũy {stats.totalTimeSpentMinutes} phút học</span>
          </div>
        </div>
      </div>

      {/* Footer: Kế hoạch hành động hôm nay (Actionable Tasks) */}
      <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Hôm nay bạn cần: <strong>{stats.dailyPlan.newWordsTargetCount} từ mới</strong> & <strong>{stats.dailyPlan.wordsToReviewCount} thẻ cần ôn</strong></span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {stats.dailyPlan.recommendedLesson && (
            <Link
              href={`/books/${stats.dailyPlan.recommendedLesson.bookId}/${stats.dailyPlan.recommendedLesson.lessonId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <span>Vào học: {stats.dailyPlan.recommendedLesson.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {stats.dailyPlan.wordsToReviewCount > 0 && (
            <Link
              href="/review"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border/70 transition-colors"
            >
              <span>Ôn tập ({stats.dailyPlan.wordsToReviewCount})</span>
            </Link>
          )}

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <span>Xem chi tiết lộ trình</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
