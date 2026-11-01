"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Volume2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  Star,
  Check,
  Copy,
  RotateCcw,
  Share2,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react"
import { playChineseAudio } from "@/utils/audioTts"
import { GrammarPoint } from "@/types/grammar"

const LEVEL_COLORS: Record<number, { badge: string; text: string; bg: string; border: string }> = {
  1: { badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
  2: { badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25", text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/5", border: "border-teal-500/20" },
  3: { badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25", text: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/5", border: "border-sky-500/20" },
  4: { badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25", text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/5", border: "border-indigo-500/20" },
  5: { badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20" },
  6: { badge: "bg-china-red/10 text-china-red border-china-red/25", text: "text-china-red", bg: "bg-china-red/5", border: "border-china-red/20" },
}

export default function GrammarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [grammarList, setGrammarList] = useState<GrammarPoint[]>([])
  const [loading, setLoading] = useState(true)

  // Study Mode Toggles
  const [showPinyin, setShowPinyin] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)

  // Saved / Mastered
  const [isSaved, setIsSaved] = useState(false)
  const [isMastered, setIsMastered] = useState(false)

  // Audio & Copy
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({})

  // Load data
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await fetch("/content/grammar/hsk_grammar_full.json")
        const data: GrammarPoint[] = await res.json()
        setGrammarList(data)
      } catch (err) {
        console.error("Lỗi tải ngữ pháp:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Check saved / mastered state for this id
  useEffect(() => {
    if (!id) return
    try {
      const saved = localStorage.getItem("hsk_grammar_saved_ids")
      if (saved) {
        const set: string[] = JSON.parse(saved)
        setIsSaved(set.includes(id))
      }
      const mastered = localStorage.getItem("hsk_grammar_mastered_ids")
      if (mastered) {
        const set: string[] = JSON.parse(mastered)
        setIsMastered(set.includes(id))
      }
    } catch {}
  }, [id])

  // Current item and adjacent items
  const { currentItem, prevItem, nextItem } = useMemo(() => {
    if (!grammarList.length || !id) {
      return { currentItem: undefined, prevItem: undefined, nextItem: undefined }
    }
    const idx = grammarList.findIndex((g) => g.id === id)
    if (idx === -1) {
      return { currentItem: undefined, prevItem: undefined, nextItem: undefined }
    }
    return {
      currentItem: grammarList[idx],
      prevItem: idx > 0 ? grammarList[idx - 1] : undefined,
      nextItem: idx < grammarList.length - 1 ? grammarList[idx + 1] : undefined,
    }
  }, [grammarList, id])

  // Toggle Save
  const toggleSave = useCallback(() => {
    if (!id) return
    try {
      const saved = localStorage.getItem("hsk_grammar_saved_ids")
      const list: string[] = saved ? JSON.parse(saved) : []
      let next: string[]
      if (list.includes(id)) {
        next = list.filter((i) => i !== id)
        setIsSaved(false)
      } else {
        next = [...list, id]
        setIsSaved(true)
      }
      localStorage.setItem("hsk_grammar_saved_ids", JSON.stringify(next))
    } catch {}
  }, [id])

  // Toggle Mastered
  const toggleMastered = useCallback(() => {
    if (!id) return
    try {
      const mastered = localStorage.getItem("hsk_grammar_mastered_ids")
      const list: string[] = mastered ? JSON.parse(mastered) : []
      let next: string[]
      if (list.includes(id)) {
        next = list.filter((i) => i !== id)
        setIsMastered(false)
      } else {
        next = [...list, id]
        setIsMastered(true)
      }
      localStorage.setItem("hsk_grammar_mastered_ids", JSON.stringify(next))
    } catch {}
  }, [id])

  // Audio TTS
  const handleSpeak = useCallback((text: string) => {
    setPlayingAudio(text)
    playChineseAudio(text, {
      rate: 0.88,
      lang: "zh",
      onEnd: () => setPlayingAudio(null),
      onError: () => setPlayingAudio(null),
    })
  }, [])

  // Copy to clipboard
  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1800)
  }, [])

  // Quiz Interaction
  const handleSelectQuiz = useCallback(
    (quizKey: string, optIdx: number) => {
      if (quizSubmitted[quizKey]) return
      setQuizAnswers((prev) => ({ ...prev, [quizKey]: optIdx }))
      setQuizSubmitted((prev) => ({ ...prev, [quizKey]: true }))
    },
    [quizSubmitted]
  )

  const handleResetQuiz = useCallback((quizKey: string) => {
    setQuizAnswers((prev) => {
      const next = { ...prev }
      delete next[quizKey]
      return next
    })
    setQuizSubmitted((prev) => {
      const next = { ...prev }
      delete next[quizKey]
      return next
    })
  }, [])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-border/60 rounded-xl" />
          <div className="h-10 w-3/4 bg-border/60 rounded-2xl" />
          <div className="h-24 w-full bg-border/40 rounded-3xl" />
          <div className="h-48 w-full bg-border/40 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-16 text-center space-y-4">
        <HelpCircle className="w-16 h-16 text-muted mx-auto" />
        <h2 className="text-2xl font-bold font-serif text-china-ink">
          Không tìm thấy điểm ngữ pháp này
        </h2>
        <p className="text-sm text-muted">
          Điểm ngữ pháp bạn tìm kiếm có thể đã được cập nhật hoặc không tồn tại.
        </p>
        <Link
          href="/grammar"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-china-red text-white text-sm font-bold hover:bg-china-red/90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Thư viện Ngữ pháp
        </Link>
      </div>
    )
  }

  const levelStyle = LEVEL_COLORS[currentItem.level] || LEVEL_COLORS[1]
  const titleText = currentItem.titleVi || currentItem.title
  const usedForParts = (currentItem.usedFor || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-8 md:py-10 text-china-ink">
      {/* 1. Breadcrumbs & Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/grammar"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-border/30 text-xs font-semibold text-muted hover:text-china-ink transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Danh sách ngữ pháp HSK
        </Link>

        {/* Level Badge */}
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${levelStyle.badge}`}
        >
          HSK {currentItem.level}
        </span>
      </div>

      {/* 2. Main Title Card */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${levelStyle.badge}`}>
                HSK {currentItem.level}
              </span>
              {currentItem.quiz && currentItem.quiz.length > 0 && (
                <span className="px-2.5 py-0.5 bg-china-red/10 text-china-red text-xs font-bold rounded-lg border border-china-red/20 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> {currentItem.quiz.length} bài tập
                </span>
              )}
              {isMastered && (
                <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Đã nắm vững
                </span>
              )}
            </div>

            {/* Vietnamese Title */}
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-china-ink leading-tight">
              {titleText}
            </h1>
          </div>

          {/* Action Buttons: Bookmark & Mastered */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={toggleSave}
              className={`p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                  : "bg-card border-border text-muted hover:text-amber-500 hover:border-amber-500/30"
              }`}
              title={isSaved ? "Bỏ lưu điểm này" : "Lưu điểm ngữ pháp này"}
            >
              <Star className={`w-4 h-4 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
            </button>

            <button
              type="button"
              onClick={toggleMastered}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-xs font-semibold ${
                isMastered
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "bg-card border-border text-muted hover:text-emerald-600 hover:border-emerald-500/30"
              }`}
              title={isMastered ? "Đánh dấu chưa thuộc" : "Đánh dấu đã nắm vững"}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopy(window.location.href, "page_url")}
              className="p-2.5 rounded-xl border border-border bg-card text-muted hover:text-china-ink hover:border-china-red/30 transition-all"
              title="Sao chép liên kết bài học"
            >
              {copiedKey === "page_url" ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Formula Box */}
        {currentItem.structure && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-x-auto text-xs md:text-sm font-mono text-china-ink font-semibold">
              <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 font-sans text-xs uppercase tracking-wider">
                Công thức:
              </span>
              <span className="text-china-red font-bold tracking-wide">{currentItem.structure}</span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentItem.structure, `struct_${currentItem.id}`)}
              className="p-2 rounded-lg border border-border bg-card/80 hover:bg-card text-muted hover:text-china-ink shrink-0 transition-colors"
              title="Sao chép công thức"
            >
              {copiedKey === `struct_${currentItem.id}` ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Used For Tags */}
        {usedForParts.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Mục đích:</span>
            {usedForParts.map((uf, ufIdx) => (
              <span
                key={ufIdx}
                className="px-3 py-1 rounded-full bg-border/40 border border-border/80 text-xs font-medium text-china-ink"
              >
                {uf}
              </span>
            ))}
          </div>
        )}

        {/* Explanation */}
        {currentItem.explanation && (
          <div className="pt-3 border-t border-border/60">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
              Giải thích ngữ pháp & Cách dùng
            </h3>
            <p className="text-sm md:text-base text-china-ink/90 leading-relaxed">
              {currentItem.explanation}
            </p>
          </div>
        )}

        {/* Exam Tip */}
        {currentItem.tip && (
          <div className="mt-4 p-4 rounded-2xl bg-china-jade/10 border border-china-jade/25 text-xs md:text-sm text-china-ink flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-china-jade shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-china-jade font-bold">Mẹo làm bài & lưu ý phòng bẫy: </strong>
              <span>{currentItem.tip}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Examples Section */}
      {currentItem.examples && currentItem.examples.length > 0 && (
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5 pb-3 border-b border-border/60">
            <div>
              <h2 className="text-lg md:text-xl font-bold font-serif text-china-ink flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-china-red" />
                <span>Ví dụ minh họa ({currentItem.examples.length})</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">Nhấn biểu tượng loa để nghe giọng đọc bản xứ chuẩn</p>
            </div>

            {/* Study Mode Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPinyin((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  showPinyin
                    ? "bg-china-red/10 border-china-red/30 text-china-red"
                    : "bg-card border-border text-muted hover:text-china-ink"
                }`}
              >
                {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Pinyin</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTranslation((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  showTranslation
                    ? "bg-china-red/10 border-china-red/30 text-china-red"
                    : "bg-card border-border text-muted hover:text-china-ink"
                }`}
              >
                {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Dịch nghĩa</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {currentItem.examples.map((ex, exIdx) => {
              const isAudioActive = playingAudio === ex.chinese
              const copyKey = `ex_${currentItem.id}_${exIdx}`
              const isCopied = copiedKey === copyKey

              return (
                <div
                  key={exIdx}
                  className={`p-4 md:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    isAudioActive
                      ? "bg-china-red/5 border-china-red/30 shadow-2xs"
                      : "bg-border/20 border-transparent hover:border-border/60"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    {/* Chinese Hanzi */}
                    <p className="text-lg md:text-xl font-bold text-china-ink font-serif leading-snug tracking-wide" lang="zh">
                      {ex.chinese}
                    </p>

                    {/* Pinyin */}
                    {showPinyin && (
                      <p className="text-xs md:text-sm font-mono text-china-red font-medium tracking-wide">
                        {ex.pinyin}
                      </p>
                    )}

                    {/* Translation */}
                    {showTranslation && (
                      <p className="text-xs md:text-sm text-china-ink/85 leading-relaxed font-sans">
                        {ex.translation}
                      </p>
                    )}
                  </div>

                  {/* Audio & Copy Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleSpeak(ex.chinese)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                        isAudioActive
                          ? "bg-china-red text-white border-china-red scale-105"
                          : "border-border bg-card hover:bg-china-red hover:text-white hover:border-china-red text-muted"
                      }`}
                      title="Nghe phát âm chuẩn HD"
                    >
                      <Volume2 className={`w-4 h-4 ${isAudioActive ? "animate-pulse" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(ex.chinese, copyKey)}
                      className="p-2.5 rounded-xl border border-border bg-card hover:bg-border/40 text-muted hover:text-china-ink transition-all cursor-pointer shadow-2xs"
                      title="Sao chép câu chữ Hán"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. Quiz Section */}
      {currentItem.quiz && currentItem.quiz.length > 0 && (
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs mb-6">
          <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-china-red" />
              <h2 className="text-lg md:text-xl font-bold font-serif text-china-ink">
                Luyện tập củng cố ({currentItem.quiz.length} câu)
              </h2>
            </div>
            <span className="text-xs text-muted font-medium">Chọn đáp án đúng nhất</span>
          </div>

          <div className="space-y-4">
            {currentItem.quiz.map((q, qIdx) => {
              const quizKey = `${currentItem.id}_q${qIdx}`
              const userChoice = quizAnswers[quizKey]
              const isDone = quizSubmitted[quizKey]
              const isRight = isDone && userChoice === q.answerIndex

              return (
                <div
                  key={qIdx}
                  className="bg-border/15 border border-border rounded-2xl p-4 md:p-5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm md:text-base font-semibold text-china-ink leading-relaxed">
                      <span className="font-bold text-china-red mr-1.5">Câu {qIdx + 1}:</span>
                      {q.question}
                    </p>
                    {isDone && (
                      <button
                        type="button"
                        onClick={() => handleResetQuiz(quizKey)}
                        className="text-xs text-muted hover:text-china-ink flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-border/40 transition-colors shrink-0"
                        title="Làm lại câu này"
                      >
                        <RotateCcw className="w-3 h-3" /> Làm lại
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userChoice === optIdx
                      const isActualRight = isDone && optIdx === q.answerIndex

                      return (
                        <button
                          key={optIdx}
                          disabled={isDone}
                          onClick={() => handleSelectQuiz(quizKey, optIdx)}
                          className={`text-left p-3.5 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                            isActualRight
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                              : isSelected && !isRight
                              ? "bg-china-red/10 border-china-red text-china-red font-bold"
                              : "bg-card border-border hover:border-china-red/40 text-china-ink"
                          }`}
                        >
                          <span>{opt}</span>
                          {isActualRight && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isSelected && !isRight && (
                            <XCircle className="w-4 h-4 text-china-red shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Explanation note */}
                  {isDone && q.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs md:text-sm text-china-ink">
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        Giải thích chi tiết:{" "}
                      </span>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 5. Previous / Next Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {prevItem ? (
          <Link
            href={`/grammar/${prevItem.id}`}
            className="group flex flex-col p-4 rounded-2xl border border-border bg-card hover:border-china-red/40 transition-all text-left shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted group-hover:text-china-red transition-colors mb-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" /> Điểm trước
            </div>
            <span className="text-sm font-bold text-china-ink group-hover:text-china-red transition-colors line-clamp-1">
              {prevItem.titleVi || prevItem.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextItem && (
          <Link
            href={`/grammar/${nextItem.id}`}
            className="group flex flex-col p-4 rounded-2xl border border-border bg-card hover:border-china-red/40 transition-all text-right shadow-2xs"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-muted group-hover:text-china-red transition-colors mb-1 font-semibold">
              Điểm tiếp theo <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-china-ink group-hover:text-china-red transition-colors line-clamp-1">
              {nextItem.titleVi || nextItem.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
