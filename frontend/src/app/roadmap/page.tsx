"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
  TrendingUp,
  Layers,
  Award,
  ArrowLeft,
  Flame,
  Trophy,
  ShieldCheck,
  Star
} from "lucide-react"
import { useRoadmap } from "@/hooks/useRoadmap"
import { RoadmapWizardModal } from "@/components/roadmap/RoadmapWizardModal"
import { RoadmapDeficitGauge } from "@/components/roadmap/RoadmapDeficitGauge"
import { RoadmapJourneyMapWidget } from "@/components/roadmap/RoadmapJourneyMapWidget"
import { 
  MountainSummitSvg, 
  TreasureChestSvg, 
  WisdomScrollSvg, 
  RocketPaceSvg 
} from "@/components/roadmap/RoadmapIllustrations"
import { LeafVineCornerSvg, FoliageEdgeBorder } from "@/components/roadmap/VineBorders"
import { HSK_CUMULATIVE_STANDARDS } from "@/utils/roadmapStorage"

export default function RoadmapDetailPage() {
  const { roadmap, stats, loading, deleteRoadmap } = useRoadmap()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-muted-foreground">Tiểu Lu đang mở bản đồ lộ trình...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-bold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Về Trang chủ</span>
        </Link>

        <div className="flex items-center gap-2">
          {stats?.hasRoadmap && (
            <>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-bold border border-border/70 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Settings2 className="w-4 h-4 text-indigo-500" />
                <span>Điều chỉnh lộ trình</span>
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      deleteRoadmap()
                      setConfirmDelete(false)
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-xs"
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
                  className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* HERO SECTION: MÀU SẮC TƯƠI SÁNG, MASCOT TIỂU LU & MINH HỌA SVG */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-emerald-600/30 dark:border-emerald-500/35 p-6 sm:p-9 shadow-sm">
        {/* Khung Dây Leo Lá Cây Thanh Mảnh Quấn Quanh Hero Banner */}
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-11 h-11 sm:w-13 sm:h-13" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-11 h-11 sm:w-13 sm:h-13" />
        <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-9 h-9 sm:w-11 sm:h-11" />
        <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-9 h-9 sm:w-11 sm:h-11" />
        <FoliageEdgeBorder position="top" className="h-3 opacity-60" />

        {/* SVG Decorative Artworks */}
        <div className="absolute top-2 right-4 sm:right-12 opacity-80 sm:opacity-100 pointer-events-none select-none hidden md:block">
          <MountainSummitSvg className="w-44 h-44 drop-shadow-md" />
        </div>

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-500/40 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
            Học Viện Lộ Trình HSK
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 p-1.5 bg-white/95 dark:bg-card/90 rounded-2xl border-2 border-amber-400 shadow-md flex items-center justify-center select-none">
              <Image
                src="/chibi-cheer.svg"
                alt="Tiểu Lu cổ vũ"
                width={70}
                height={70}
                priority
                className="object-contain hover:scale-105 transition-transform"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
                {stats?.goalTitle || "Chinh phục Tiếng Trung Cá Nhân Hóa"}
              </h1>
              {stats?.hasRoadmap && (
                <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm font-bold text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                    <Calendar className="w-4 h-4" />
                    Cán đích: {stats.targetDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                    <Clock className="w-4 h-4" />
                    Còn {stats.daysRemaining} ngày
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Hệ thống đo lường chính xác từng bài học và từ vựng bạn đã tích lũy, tính toán cụ thể <strong className="text-foreground">cần thêm bao nhiêu bài và từ</strong> để hoàn thành mục tiêu.
          </p>

          {!stats?.hasRoadmap && (
            <div className="pt-2">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-rose-500/30 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Bắt đầu thiết lập lộ trình 6 bước ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NẾU ĐÃ CÓ LỘ TRÌNH: HIỂN THỊ CÁC WIDGET SINH ĐỘNG */}
      {stats && stats.hasRoadmap && (
        <>
          {/* WIDGET 1: THƯỚC ĐO "CÒN THIẾU GÌ ĐỂ ĐẠT MỤC TIÊU" */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Đo Lường Năng Lượng: Còn thiếu gì để đạt HSK {stats.targetLevel}?
              </h2>
            </div>

            <RoadmapDeficitGauge stats={stats} />
          </div>

          {/* WIDGET 2: BẢN ĐỒ HÀNH TRÌNH LEO NÚI HSK (GAMIFIED PATH) */}
          <RoadmapJourneyMapWidget stats={stats} />

          {/* WIDGET 3: CHI TIẾT ĐỘ PHỦ THEO TỪNG CẤP ĐỘ HSK 1..6 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                Độ phủ Chi tiết theo Từng Cấp HSK (Breakdown)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats.breakdown.map((item) => {
                const wordPct = Math.min(100, Math.round((item.learnedWords / item.targetWords) * 100))
                const lessonPct = Math.min(100, Math.round((item.completedLessons / item.targetLessons) * 100))
                const isLevelCompleted = wordPct >= 90 && lessonPct >= 90

                return (
                  <div 
                    key={item.level}
                    className={`relative overflow-hidden rounded-3xl p-5 border-2 transition-all shadow-md ${
                      isLevelCompleted 
                        ? "bg-gradient-to-b from-emerald-500/15 to-emerald-600/5 border-emerald-500/40" 
                        : "bg-card border-border/80 hover:border-indigo-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center bg-indigo-600 text-white shadow-xs">
                          {item.level}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-foreground">
                            {HSK_CUMULATIVE_STANDARDS[item.level]?.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.targetWords} từ • {item.targetLessons} bài
                          </div>
                        </div>
                      </div>

                      {isLevelCompleted ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã vững
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          {wordPct}%
                        </span>
                      )}
                    </div>

                    <div className="space-y-3.5 text-xs">
                      {/* Vốn Từ vựng */}
                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1 font-semibold">
                          <span>Từ vựng:</span>
                          <span className="text-foreground">{item.learnedWords} / {item.targetWords} từ</span>
                        </div>
                        <div className="w-full bg-secondary/80 rounded-full h-2 p-0.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${wordPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Bài học giáo trình */}
                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1 font-semibold">
                          <span>Bài học giáo trình:</span>
                          <span className="text-foreground">{item.completedLessons} / {item.targetLessons} bài</span>
                        </div>
                        <div className="w-full bg-secondary/80 rounded-full h-2 p-0.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${lessonPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* WIDGET 4: CÁC MỐC CHẶNG ĐƯỜNG (MILESTONES) TƯƠI SÁNG */}
          {roadmap?.milestones && roadmap.milestones.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" />
                Các chặng bứt phá hàng tuần (Milestones)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {roadmap.milestones.map((m, idx) => (
                  <div 
                    key={m.id} 
                    className="p-4 rounded-2xl bg-gradient-to-br from-card to-secondary/30 border-2 border-border/70 hover:border-amber-400/50 transition-all space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-md font-black bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        Tuần {m.targetWeek}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">Mốc #{idx + 1}</span>
                    </div>
                    <div className="text-sm font-bold text-foreground">{m.title}</div>
                    <div className="text-xs text-muted-foreground">{m.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
