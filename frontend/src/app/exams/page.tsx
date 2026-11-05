"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { GraduationCap, BookOpen, Clock, Play, Filter, Sparkles } from "lucide-react"
import { ALL_EXAMS } from "@/data/examsManifest"

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
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10 text-china-ink">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-full border border-china-red/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Thư viện đề thi chuẩn
            </span>
            <span className="text-xs text-muted">24 bộ đề hoàn chỉnh</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-china-red tracking-wide flex items-center gap-3">
            <GraduationCap className="w-9 h-9" /> HSK Mock Exams
          </h1>
          <p className="mt-2 text-sm text-muted max-w-2xl">
            Luyện tập thi thử theo đúng chuẩn đề thi HSK quốc tế (HSK 1 – HSK 6). Có tính giờ tự động, chấm điểm trắc nghiệm tức thì và xem giải thích chi tiết.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border">
        <Filter className="w-4 h-4 text-muted shrink-0 mr-1" />
        {LEVELS.map((lvl) => {
          const isActive = selectedLevel === lvl.value
          return (
            <button
              key={lvl.value}
              onClick={() => setSelectedLevel(lvl.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-china-red text-white"
                  : "bg-card border border-border text-muted hover:text-china-ink hover:border-slate-300 dark:hover:border-stone-600"
              }`}
            >
              {lvl.label}
            </button>
          )
        })}
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs hover:border-slate-400 dark:hover:border-stone-500 transition-colors flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 text-xs font-bold rounded-lg border border-border/80">
                  HSK {exam.level}
                </span>
                <span className="text-xs text-muted font-mono font-medium">Mã: {exam.code}</span>
              </div>

              <h2 className="text-xl font-serif font-bold text-china-ink mb-3 group-hover:text-china-red transition-colors">
                {exam.title}
              </h2>

              <div className="space-y-2 mb-6 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-china-jade" />
                  <span>{exam.questions} câu hỏi đầy đủ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-china-gold" />
                  <span>Thời gian làm bài: {exam.timeMinutes} phút</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Phần thi</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-border/30 rounded-xl p-2">
                    <p className="font-semibold text-china-ink">{exam.sections.listening}</p>
                    <p className="text-muted scale-90">Nghe</p>
                  </div>
                  <div className="bg-border/30 rounded-xl p-2">
                    <p className="font-semibold text-china-ink">{exam.sections.reading}</p>
                    <p className="text-muted scale-90">Đọc</p>
                  </div>
                  <div className="bg-border/30 rounded-xl p-2">
                    <p className="font-semibold text-china-ink">{exam.sections.writing}</p>
                    <p className="text-muted scale-90">Viết</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/exams/${exam.id}`}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-china-red px-5 py-3 text-white hover:bg-china-red-hover transition-colors shadow-md shadow-china-red/10 font-semibold group/btn"
            >
              <Play className="w-4 h-4 fill-white group-hover/btn:scale-110 transition-transform" />
              Bắt đầu làm bài
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
