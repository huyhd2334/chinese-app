"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  Target, 
  Calendar, 
  Settings2,
  Trash2,
  Layers,
  ArrowLeft,
  Clock
} from "lucide-react"
import { useRoadmap } from "@/hooks/useRoadmap"
import { RoadmapWizardModal } from "@/components/roadmap/RoadmapWizardModal"
import { RoadmapDeficitGauge } from "@/components/roadmap/RoadmapDeficitGauge"
import { RoadmapJourneyMapWidget } from "@/components/roadmap/RoadmapJourneyMapWidget"
import { HSK_CUMULATIVE_STANDARDS } from "@/utils/roadmapStorage"

export default function RoadmapDetailPage() {
  const { roadmap, stats, loading, deleteRoadmap } = useRoadmap()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Đang tải dữ liệu lộ trình...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trang chủ</span>
        </Link>

        <div className="flex items-center gap-2">
          {stats?.hasRoadmap && (
            <>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-foreground text-xs font-medium border border-border/60 transition-colors flex items-center gap-1.5"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa lộ trình</span>
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      deleteRoadmap()
                      setConfirmDelete(false)
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
                  >
                    Xác nhận xóa
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1.5 rounded-lg text-muted-foreground text-xs hover:text-foreground"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  title="Xóa lộ trình để đặt lại"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* HEADER SECTION: SẠCH SẼ, HIỆN ĐẠI, KHÔNG MÀU MÈ */}
      <div className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kế hoạch học tập cá nhân
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {stats?.goalTitle || "Thiết lập lộ trình học"}
            </h1>
          </div>

          {stats?.hasRoadmap && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Cán đích: {stats.targetDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Clock className="w-3.5 h-3.5" />
                Còn {stats.daysRemaining} ngày
              </span>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Đo lường tiến độ thực tế giữa lượng bài học và từ vựng bạn đã tích lũy với chỉ tiêu kỳ thi HSK.
        </p>

        {!stats?.hasRoadmap && (
          <div className="pt-2">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-4 py-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Thiết lập lộ trình ngay
            </button>
          </div>
        )}
      </div>

      {/* CÁC KHUNG THỐNG KÊ CHI TIẾT */}
      {stats && stats.hasRoadmap && (
        <>
          {/* THƯỚC ĐO CÒN THIẾU GÌ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Mục tiêu cần hoàn thành
            </h2>
            <RoadmapDeficitGauge stats={stats} />
          </div>

          {/* LỘ TRÌNH CÁC CẤP ĐỘ */}
          <RoadmapJourneyMapWidget stats={stats} />

          {/* CHI TIẾT ĐỘ PHỦ TỪNG CẤP ĐỘ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Chi tiết độ phủ theo từng cấp độ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {stats.breakdown.map((item) => {
                const wordPct = Math.min(100, Math.round((item.learnedWords / item.targetWords) * 100))
                const lessonPct = Math.min(100, Math.round((item.completedLessons / item.targetLessons) * 100))

                return (
                  <div key={item.level} className="rounded-xl bg-card border border-border/80 p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">
                        HSK {item.level}
                      </span>
                      <span className="text-muted-foreground">
                        {item.targetWords} từ • {item.targetLessons} bài
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                          <span>Từ vựng:</span>
                          <span className="text-foreground font-medium">{item.learnedWords}/{item.targetWords} ({wordPct}%)</span>
                        </div>
                        <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-foreground h-full rounded-full" style={{ width: `${wordPct}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                          <span>Bài học:</span>
                          <span className="text-foreground font-medium">{item.completedLessons}/{item.targetLessons} ({lessonPct}%)</span>
                        </div>
                        <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${lessonPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Modal chỉnh sửa lộ trình */}
      <RoadmapWizardModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </div>
  )
}
