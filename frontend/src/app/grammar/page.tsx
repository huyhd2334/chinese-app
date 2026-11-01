"use client"

import { useEffect, useState, useMemo } from "react"
import {
  BookOpen,
  Search,
  Filter,
  Volume2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { playChineseAudio } from "@/utils/audioTts"

export interface GrammarExample {
  chinese: string
  pinyin: string
  translation: string
}

export interface GrammarQuiz {
  question: string
  options: string[]
  answerIndex: number
  explanation?: string
}

export interface GrammarPoint {
  id: string
  level: number
  title: string
  titleVi: string
  structure: string
  usedFor: string
  explanation?: string
  tip?: string
  examples: GrammarExample[]
  quiz?: GrammarQuiz[]
}

const HSK_LEVELS = [
  { label: "Tất cả", value: "all" },
  { label: "HSK 1", value: "1" },
  { label: "HSK 2", value: "2" },
  { label: "HSK 3", value: "3" },
  { label: "HSK 4", value: "4" },
  { label: "HSK 5", value: "5" },
  { label: "HSK 6", value: "6" },
]

export default function GrammarPage() {
  const [grammarList, setGrammarList] = useState<GrammarPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadGrammar() {
      setLoading(true)
      try {
        const res = await fetch("/content/grammar/hsk_grammar_full.json")
        const data = await res.json()
        setGrammarList(data)
      } catch (err) {
        console.error("Failed to load grammar data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadGrammar()
  }, [])

  const filteredGrammar = useMemo(() => {
    return grammarList.filter((item) => {
      // 1. Lọc theo Level
      if (selectedLevel !== "all" && item.level !== parseInt(selectedLevel, 10)) {
        return false
      }
      // 2. Lọc theo Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchTitleVi = item.titleVi.toLowerCase().includes(q)
        const matchStructure = item.structure.toLowerCase().includes(q)
        const matchUsedFor = item.usedFor.toLowerCase().includes(q)
        const matchExample = item.examples.some(
          (ex) => ex.chinese.includes(q) || ex.pinyin.toLowerCase().includes(q) || ex.translation.toLowerCase().includes(q)
        )
        return matchTitle || matchTitleVi || matchStructure || matchUsedFor || matchExample
      }
      return true
    })
  }, [grammarList, selectedLevel, searchQuery])

  const handleSpeak = (text: string) => {
    playChineseAudio(text, { rate: 0.88, lang: "zh" })
  }

  const handleSelectQuiz = (quizKey: string, optIdx: number) => {
    if (quizSubmitted[quizKey]) return
    setQuizAnswers((prev) => ({ ...prev, [quizKey]: optIdx }))
    setQuizSubmitted((prev) => ({ ...prev, [quizKey]: true }))
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 md:py-10 text-china-ink">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-full border border-china-red/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Thư viện 510 điểm ngữ pháp
          </span>
          <span className="text-xs text-muted">Chuẩn AllSet Learning & Giáo trình HSK</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-china-red tracking-wide flex items-center gap-3">
          <BookOpen className="w-9 h-9" /> Sổ Tay Ngữ Pháp HSK
        </h1>
        <p className="mt-2 text-sm text-muted max-w-2xl">
          Tra cứu toàn diện các mẫu câu, cấu trúc và điểm ngữ pháp trọng yếu từ HSK 1 đến HSK 6. Có công thức rõ ràng, ví dụ phát âm chuẩn và bài tập trắc nghiệm củng cố.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo chữ Hán (把, 被, 了...), Pinyin hoặc tên ngữ pháp (so sánh, bị động...)..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:border-china-red transition-all shadow-xs text-china-ink placeholder:text-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-china-ink px-1.5 py-0.5 rounded-lg bg-border/40"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {HSK_LEVELS.map((lvl) => {
            const isActive = selectedLevel === lvl.value
            return (
              <button
                key={lvl.value}
                onClick={() => setSelectedLevel(lvl.value)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-xs ${
                  isActive
                    ? "bg-china-red text-white shadow-china-red/20 scale-105"
                    : "bg-card border border-border text-muted hover:text-china-ink hover:border-china-red/40"
                }`}
              >
                {lvl.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-muted mb-4 px-1">
        <span>
          Tìm thấy <strong className="text-china-red font-mono text-sm">{filteredGrammar.length}</strong> điểm ngữ pháp
        </span>
        {selectedLevel !== "all" && <span>Đang lọc: HSK {selectedLevel}</span>}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-china-red/30 border-t-china-red rounded-full animate-spin" />
          <p className="text-sm text-china-ink font-medium">Đang tải sổ tay ngữ pháp...</p>
        </div>
      ) : filteredGrammar.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-3xl p-6">
          <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3" />
          <h3 className="font-bold text-base text-china-ink">Không tìm thấy điểm ngữ pháp phù hợp</h3>
          <p className="text-xs text-muted mt-1">Hãy thử tìm với từ khóa khác hoặc đổi cấp độ HSK.</p>
        </div>
      ) : (
        /* Grammar Cards List */
        <div className="space-y-4">
          {filteredGrammar.map((item) => {
            const isExpanded = expandedId === item.id

            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-xs hover:border-china-red/30 transition-all"
              >
                {/* Card Top: Level Badge + Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-lg border border-china-red/20">
                      HSK {item.level}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold font-serif text-china-ink">
                      {item.titleVi}
                    </h2>
                    {item.title !== item.titleVi && (
                      <span className="text-xs text-muted font-normal italic">
                        ({item.title})
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-border/20 hover:bg-border/40 text-xs font-semibold text-muted hover:text-china-ink transition-colors"
                  >
                    <span>{isExpanded ? "Thu gọn" : "Chi tiết & Bài tập"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Structure Formula Bar */}
                {item.structure && (
                  <div className="mb-4 p-3 md:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs md:text-sm font-mono text-china-ink font-semibold flex items-center gap-2.5 overflow-x-auto">
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 font-sans">
                      Công thức:
                    </span>
                    <span className="text-china-red font-bold">{item.structure}</span>
                  </div>
                )}

                {/* Usage / Explanation */}
                {(item.explanation || item.usedFor) && (
                  <p className="text-xs md:text-sm text-muted leading-relaxed mb-4">
                    {item.explanation || item.usedFor}
                  </p>
                )}

                {/* Tip nếu có */}
                {item.tip && (
                  <div className="mb-4 p-3 rounded-2xl bg-china-jade/10 border border-china-jade/20 text-xs text-china-ink flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-china-jade shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-china-jade">Mẹo thi: </span>
                      <span>{item.tip}</span>
                    </div>
                  </div>
                )}

                {/* Examples List */}
                {item.examples && item.examples.length > 0 && (
                  <div className="space-y-2.5 border-t border-border/60 pt-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">
                      Ví dụ minh họa ({item.examples.length})
                    </p>

                    <div className="space-y-2">
                      {item.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3 rounded-2xl bg-border/20 flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-0.5">
                            <p className="text-base font-bold text-china-ink font-serif" lang="zh">
                              {ex.chinese}
                            </p>
                            <p className="text-xs font-mono text-china-red">{ex.pinyin}</p>
                            <p className="text-xs text-muted">{ex.translation}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSpeak(ex.chinese)}
                            className="p-2 rounded-xl border border-border bg-card hover:bg-china-red hover:text-white hover:border-china-red text-muted transition-all shrink-0 cursor-pointer shadow-2xs"
                            title="Nghe phát âm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded Section: Mini Quiz Trắc Nghiệm */}
                {isExpanded && item.quiz && item.quiz.length > 0 && (
                  <div className="mt-5 border-t border-border pt-4 space-y-4 bg-border/10 -mx-5 -mb-5 md:-mx-6 md:-mb-6 p-5 md:p-6 rounded-b-3xl">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-china-red" />
                      <h4 className="font-bold text-sm text-china-ink">
                        Luyện tập củng cố ngữ pháp ({item.quiz.length} câu)
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {item.quiz.map((q, qIdx) => {
                        const quizKey = `${item.id}_q${qIdx}`
                        const userChoice = quizAnswers[quizKey]
                        const isDone = quizSubmitted[quizKey]
                        const isRight = isDone && userChoice === q.answerIndex

                        return (
                          <div key={qIdx} className="bg-card border border-border rounded-2xl p-4 shadow-2xs">
                            <p className="text-sm font-semibold text-china-ink mb-3">
                              Câu {qIdx + 1}: {q.question}
                            </p>

                            <div className="grid grid-cols-1 gap-2 mb-2">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = userChoice === optIdx
                                const isActualRight = isDone && optIdx === q.answerIndex

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={isDone}
                                    onClick={() => handleSelectQuiz(quizKey, optIdx)}
                                    className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-2 ${
                                      isActualRight
                                        ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-300 font-bold"
                                        : isSelected && !isRight
                                        ? "bg-china-red/10 border-china-red text-china-red font-bold"
                                        : "bg-card border-border hover:border-china-red/40 text-china-ink"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isActualRight && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                                    {isSelected && !isRight && <XCircle className="w-4 h-4 text-china-red shrink-0" />}
                                  </button>
                                )
                              })}
                            </div>

                            {/* Giải thích câu hỏi */}
                            {isDone && q.explanation && (
                              <p className="text-xs text-muted mt-2 pt-2 border-t border-border">
                                <span className="font-bold text-china-gold">Giải thích: </span>
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
