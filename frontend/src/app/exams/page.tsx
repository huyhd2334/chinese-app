"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { BookOpen, Clock, ArrowRight } from "lucide-react"
import { ALL_EXAMS } from "@/data/examsManifest"
import { LeafVineCornerSvg } from "@/components/roadmap/VineBorders"

const LEVELS = [
  { label: "Tất cả", value: "all" },
  { label: "HSK 1", value: "1" },
  { label: "HSK 2", value: "2" },
  { label: "HSK 3", value: "3" },
  { label: "HSK 4 (19 đề)", value: "4" },
  { label: "HSK 5", value: "5" },
  { label: "HSK 6", value: "6" },
]

export default function ExamsDashboard() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  const filteredExams = useMemo(() => {
    if (selectedLevel === "all") return ALL_EXAMS
    const lvlNum = parseInt(selectedLevel, 10)
    return ALL_EXAMS.filter((e) => e.level === lvlNum)
  }, [selectedLevel])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 space-y-6 text-foreground">
      {/* Header */}
      <header className="chibi-card relative overflow-hidden bg-card rounded-2xl border-emerald-600/20 dark:border-emerald-500/20 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-10 h-10" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-10 h-10" />

        <div className="space-y-1 max-w-2xl relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Đề thi thử HSK
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Luyện tập 24 bộ đề thi mô phỏng từ HSK 1 đến HSK 6 với đồng hồ bấm giờ tự động, chấm điểm trắc nghiệm và giải thích chi tiết.
          </p>
        </div>

        <div className="text-xs self-start md:self-auto relative z-10">
          <span className="px-3 py-1.5 rounded-xl bg-china-paper border border-border font-semibold text-foreground">
            {ALL_EXAMS.length} bộ đề chuẩn
          </span>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {LEVELS.map((lvl) => {
          const isActive = selectedLevel === lvl.value
          return (
            <button
              key={lvl.value}
              onClick={() => setSelectedLevel(lvl.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-card border border-border text-muted hover:text-foreground"
              }`}
            >
              {lvl.label}
            </button>
          )
        })}
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="chibi-card chibi-card-interactive group relative overflow-hidden rounded-2xl border-emerald-600/20 dark:border-emerald-500/20 bg-card p-5 hover:border-emerald-500/50 flex flex-col justify-between gap-5"
          >
            <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 bg-china-paper text-foreground text-xs font-semibold rounded-md border border-border">
                  HSK {exam.level}
                </span>
                <span className="text-xs text-muted font-mono">Mã: {exam.code}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-china-red transition-colors">
                {exam.title}
              </h2>

              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{exam.questions} câu hỏi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Thời lượng: {exam.timeMinutes} phút</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center text-xs">
                <div className="bg-china-paper/60 dark:bg-white/[0.02] rounded-lg py-2 px-1">
                  <p className="font-semibold text-foreground">{exam.sections.listening}</p>
                  <p className="text-[11px] text-muted">Nghe</p>
                </div>
                <div className="bg-china-paper/60 dark:bg-white/[0.02] rounded-lg py-2 px-1">
                  <p className="font-semibold text-foreground">{exam.sections.reading}</p>
                  <p className="text-[11px] text-muted">Đọc</p>
                </div>
                <div className="bg-china-paper/60 dark:bg-white/[0.02] rounded-lg py-2 px-1">
                  <p className="font-semibold text-foreground">{exam.sections.writing}</p>
                  <p className="text-[11px] text-muted">Viết</p>
                </div>
              </div>
            </div>

            <Link
              href={`/exams/${exam.id}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-china-red hover:bg-china-red-hover px-4 py-2.5 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>Làm bài thi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
