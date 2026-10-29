"use client"

import React, { useState } from "react"
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
  Settings2,
  Trash2,
  ChevronRight,
  TrendingUp,
  Layers,
  Award,
  ArrowLeft
} from "lucide-react"
import { useRoadmap } from "@/hooks/useRoadmap"
import { RoadmapWizardModal } from "@/components/roadmap/RoadmapWizardModal"
import { HSK_CUMULATIVE_STANDARDS, HSK_LEVEL_INCREMENTS } from "@/utils/roadmapStorage"

export default function RoadmapDetailPage() {
  const { roadmap, stats, loading, deleteRoadmap } = useRoadmap()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Đang tính toán tiến độ lộ trình...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ</span>
        </Link>

        <div className="flex items-center gap-2">
          {stats?.hasRoadmap && (
            <>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border/70 transition-colors flex items-center gap-1.5"
              >
                <Settings2 className="w-4 h-4 text-indigo-400" />
                <span>Điều chỉnh lộ trình</span>
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      deleteRoadmap()
                      setConfirmDelete(false)
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                  >
                    Xác nhận xóa
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs hover:text-foreground"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  title="Xóa lộ trình để đặt lại từ đầu"
                  className="p-2 rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/40 via-card/90 to-purple-950/30 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Compass className="w-4 h-4" />
            Lộ trình Chinh phục HSK & Tiếng Trung
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {stats?.goalTitle || "Thiết lập lộ trình học cá nhân"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Hệ thống tự động đối chiếu các bài học và từ vựng bạn đã tích lũy trong quá trình học để thống kê chính xác những gì còn thiếu, giúp bạn luôn đi đúng hướng và kịp thời hạn thi.
          </p>

          {!stats?.hasRoadmap && (
            <div className="pt-2">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Bắt đầu thiết lập lộ trình 6 bước</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Dashboard if Roadmap exists */}
      {stats && stats.hasRoadmap && (
        <>
          {/* Section 1: Thẻ đo lường "CẦN GÌ ĐỂ ĐẠT MỤC TIÊU" */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Đo lường: Còn thiếu gì để đạt HSK {stats.targetLevel}?
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                Hạn chót: <strong>{stats.targetDate}</strong> (Còn <strong>{stats.daysRemaining} ngày</strong>)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Box 1: Bài học */}
              <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                    Bài học giáo trình
                  </span>
                  <span className="font-bold text-foreground">{stats.lessonProgressPercent}%</span>
                </div>
                <div className="text-2xl font-black text-foreground">
                  {stats.completedLessons} <span className="text-sm font-normal text-muted-foreground">/ {stats.totalTargetLessons} bài</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.lessonProgressPercent}%` }} />
                </div>
                <div className="text-xs font-semibold text-emerald-400 pt-1">
                  {stats.remainingLessons > 0 ? `👉 Cần thêm ${stats.remainingLessons} bài học` : "🎉 Hoàn tất 100% bài học!"}
                </div>
              </div>

              {/* Box 2: Từ vựng */}
              <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-indigo-400">
                    <Target className="w-4 h-4" />
                    Từ vựng cốt lõi
                  </span>
                  <span className="font-bold text-foreground">{stats.wordProgressPercent}%</span>
                </div>
                <div className="text-2xl font-black text-foreground">
                  {stats.learnedWords} <span className="text-sm font-normal text-muted-foreground">/ {stats.totalTargetWords} từ</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${stats.wordProgressPercent}%` }} />
                </div>
                <div className="text-xs font-semibold text-indigo-400 pt-1">
                  {stats.remainingWords > 0 ? `👉 Cần nạp thêm ${stats.remainingWords} từ` : "🎉 Đã đủ vốn từ vựng!"}
                </div>
              </div>

              {/* Box 3: Tốc độ yêu cầu (Pace) */}
              <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <Zap className="w-4 h-4" />
                    Vận tốc cần đạt
                  </span>
                  <span className="text-xs font-bold text-amber-400 uppercase">{stats.paceStatus}</span>
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {stats.dailyPaceRequired} <span className="text-sm font-normal text-muted-foreground">từ / ngày</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tương đương ~<strong>{stats.weeklyLessonsRequired} bài/tuần</strong>
                </div>
                <div className="text-xs text-muted-foreground pt-1">
                  Thời lượng: <strong>{roadmap?.minutesPerDay || 30} phút / ngày</strong>
                </div>
              </div>

              {/* Box 4: Độ thuần thục & Thời gian */}
              <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-purple-400">
                    <Award className="w-4 h-4" />
                    Độ chuẩn xác
                  </span>
                  <span className="font-bold text-foreground">{stats.overallAccuracyRate}%</span>
                </div>
                <div className="text-2xl font-black text-foreground">
                  {stats.masteredWords} <span className="text-sm font-normal text-muted-foreground">từ thuộc sâu</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tổng thời gian: <strong>{stats.totalTimeSpentMinutes} phút</strong>
                </div>
                <div className="text-xs text-purple-400 pt-1 font-medium">
                  Trạng thái SRS hoạt động tốt
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Chi tiết theo từng Cấp độ HSK */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Chi tiết độ phủ theo từng Cấp HSK (Breakdown)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.breakdown.map((item) => {
                const wordPct = Math.min(100, Math.round((item.learnedWords / item.targetWords) * 100))
                const lessonPct = Math.min(100, Math.round((item.completedLessons / item.targetLessons) * 100))
                const isLevelCompleted = wordPct >= 90 && lessonPct >= 90

                return (
                  <div 
                    key={item.level}
                    className={`p-5 rounded-2xl border transition-all ${
                      isLevelCompleted 
                        ? "bg-emerald-500/5 border-emerald-500/30" 
                        : "bg-card border-border/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          HSK {item.level}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {HSK_CUMULATIVE_STANDARDS[item.level]?.name}
                        </span>
                      </div>
                      {isLevelCompleted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Đã vững
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Từ vựng */}
                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Từ vựng:</span>
                          <span className="font-semibold text-foreground">{item.learnedWords}/{item.targetWords} từ ({wordPct}%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${wordPct}%` }} />
                        </div>
                      </div>

                      {/* Bài học */}
                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Bài học giáo trình:</span>
                          <span className="font-semibold text-foreground">{item.completedLessons}/{item.targetLessons} bài ({lessonPct}%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${lessonPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 3: Các Chặng Đường (Milestones) */}
          {roadmap?.milestones && roadmap.milestones.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Các chặng bứt phá (Milestones)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {roadmap.milestones.map((m, idx) => (
                  <div key={m.id} className="p-4 rounded-xl bg-secondary/20 border border-border/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-400">Tuần {m.targetWeek}</span>
                      <span className="text-[11px] text-muted-foreground">Mốc {idx + 1}</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{m.title}</div>
                    <div className="text-xs text-muted-foreground">{m.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Roadmap Setup Modal */}
      <RoadmapWizardModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </div>
  )
}
