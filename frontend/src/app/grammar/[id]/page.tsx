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
} from "lucide-react"
import { playChineseAudio } from "@/utils/audioTts"
import { GrammarPoint } from "@/types/grammar"

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
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-8 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-20 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded-lg" />
          <div className="h-40 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6 py-16 text-center space-y-3">
        <HelpCircle className="w-12 h-12 text-muted mx-auto opacity-50" />
        <h2 className="text-xl font-bold font-serif text-china-ink">
          Không tìm thấy điểm ngữ pháp này
        </h2>
        <p className="text-xs text-muted">
          Điểm ngữ pháp bạn tìm kiếm có thể đã được cập nhật hoặc không tồn tại.
        </p>
        <Link
          href="/grammar"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-china-red text-white text-xs font-semibold hover:bg-china-red/90 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách ngữ pháp
        </Link>
      </div>
    )
  }

  const titleText = currentItem.titleVi || currentItem.title
  const usedForParts = (currentItem.usedFor || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 md:px-6 py-8 text-china-ink pb-24">
      {/* 1. Breadcrumbs & Top Meta */}
      <div className="flex items-center justify-between gap-4 mb-6 text-xs">
        <Link
          href="/grammar"
          className="inline-flex items-center gap-1.5 text-muted hover:text-china-ink font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Thư viện Ngữ pháp HSK
        </Link>

        <span className="font-mono font-bold text-china-red uppercase tracking-wider">
          HSK {currentItem.level}
        </span>
      </div>

      {/* 2. Main Article Section */}
      <article className="bg-card border border-border/80 rounded-xl p-6 md:p-8 space-y-6 mb-6">
        {/* Title Header */}
        <div className="border-b border-border/60 pb-5">
          <div className="flex items-center gap-2 text-xs text-muted mb-2">
            <span className="font-mono font-bold text-china-red">CẤP ĐỘ {currentItem.level}</span>
            <span className="text-muted/40">•</span>
            <span>{currentItem.examples?.length || 0} câu ví dụ</span>
            {currentItem.quiz && currentItem.quiz.length > 0 && (
              <>
                <span className="text-muted/40">•</span>
                <span className="text-china-red font-medium">{currentItem.quiz.length} bài tập</span>
              </>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-china-ink leading-tight tracking-tight">
              {titleText}
            </h1>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 shrink-0 pt-1">
              <button
                type="button"
                onClick={toggleSave}
                className={`p-2 rounded-md transition-colors ${
                  isSaved
                    ? "text-amber-500 bg-amber-500/10"
                    : "text-muted hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                title={isSaved ? "Bỏ lưu điểm này" : "Lưu điểm ngữ pháp này"}
              >
                <Star className={`w-4 h-4 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
              </button>

              <button
                type="button"
                onClick={toggleMastered}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  isMastered
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "text-muted hover:text-emerald-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                title={isMastered ? "Đánh dấu chưa thuộc" : "Đánh dấu đã nắm vững"}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(window.location.href, "page_url")}
                className="p-2 rounded-md text-muted hover:text-china-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
        </div>

        {/* Structure Formula */}
        {currentItem.structure && (
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-lg border-l-4 border-china-red flex items-center justify-between gap-4 font-mono">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-muted font-sans tracking-wider block">
                Công thức chuẩn:
              </span>
              <p className="text-base md:text-lg font-bold text-china-ink break-words">
                {currentItem.structure}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentItem.structure, `struct_${currentItem.id}`)}
              className="p-1.5 text-muted hover:text-china-ink hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded transition-colors shrink-0"
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

        {/* Purpose */}
        {usedForParts.length > 0 && (
          <div className="text-xs text-muted flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-muted/80">Mục đích:</span>
            <span className="text-china-ink font-medium">{usedForParts.join(" • ")}</span>
          </div>
        )}

        {/* Explanation */}
        {currentItem.explanation && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
              Giải thích & Cách dùng
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-china-ink/90">
              {currentItem.explanation}
            </p>
          </div>
        )}

        {/* Exam Tips Callout */}
        {currentItem.tip && (
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/40 border-l-2 border-china-gold rounded-r-lg text-xs md:text-sm text-china-ink flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-china-gold shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-china-gold font-bold">Lưu ý khi làm bài: </strong>
              <span>{currentItem.tip}</span>
            </div>
          </div>
        )}
      </article>

      {/* 3. Examples Section */}
      {currentItem.examples && currentItem.examples.length > 0 && (
        <section className="bg-card border border-border/80 rounded-xl p-6 md:p-8 space-y-4 mb-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="text-base md:text-lg font-serif font-bold text-china-ink flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-china-red" />
                <span>Ví dụ minh họa ({currentItem.examples.length})</span>
              </h2>
              <p className="text-[11px] text-muted">Nhấn loa để nghe phát âm chuẩn giọng bản xứ</p>
            </div>

            {/* Study Mode Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPinyin((v) => !v)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  showPinyin
                    ? "bg-neutral-100 dark:bg-neutral-800 text-china-ink"
                    : "text-muted hover:text-china-ink"
                }`}
              >
                {showPinyin ? <Eye className="w-3 h-3 text-muted" /> : <EyeOff className="w-3 h-3 text-china-red" />}
                <span>Pinyin</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTranslation((v) => !v)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  showTranslation
                    ? "bg-neutral-100 dark:bg-neutral-800 text-china-ink"
                    : "text-muted hover:text-china-ink"
                }`}
              >
                {showTranslation ? <Eye className="w-3 h-3 text-muted" /> : <EyeOff className="w-3 h-3 text-china-red" />}
                <span>Dịch nghĩa</span>
              </button>
            </div>
          </div>

          {/* Clean list with subtle dividers */}
          <div className="divide-y divide-border/50">
            {currentItem.examples.map((ex, exIdx) => {
              const isAudioActive = playingAudio === ex.chinese
              const copyKey = `ex_${currentItem.id}_${exIdx}`
              const isCopied = copiedKey === copyKey

              return (
                <div
                  key={exIdx}
                  className="py-4 first:pt-2 last:pb-2 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    {/* Chinese Hanzi */}
                    <p className="text-lg md:text-xl font-bold font-serif text-china-ink leading-snug tracking-wide" lang="zh">
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
                      <p className="text-xs md:text-sm text-china-ink/80 leading-relaxed font-sans">
                        {ex.translation}
                      </p>
                    )}
                  </div>

                  {/* Audio & Copy Buttons */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleSpeak(ex.chinese)}
                      className={`p-2 rounded-md transition-colors cursor-pointer ${
                        isAudioActive
                          ? "bg-china-red text-white"
                          : "text-muted hover:text-china-ink hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      title="Nghe phát âm chuẩn HD"
                    >
                      <Volume2 className={`w-4 h-4 ${isAudioActive ? "animate-pulse" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(ex.chinese, copyKey)}
                      className="p-2 rounded-md text-muted hover:text-china-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
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
        </section>
      )}

      {/* 4. Quiz Section */}
      {currentItem.quiz && currentItem.quiz.length > 0 && (
        <section className="bg-card border border-border/80 rounded-xl p-6 md:p-8 space-y-5 mb-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="text-base md:text-lg font-serif font-bold text-china-ink flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-china-red" />
                <span>Luyện tập củng cố ({currentItem.quiz.length} câu)</span>
              </h2>
              <p className="text-[11px] text-muted">Chọn đáp án đúng nhất để kiểm tra khả năng ghi nhớ</p>
            </div>
          </div>

          <div className="space-y-6">
            {currentItem.quiz.map((q, qIdx) => {
              const quizKey = `${currentItem.id}_q${qIdx}`
              const userChoice = quizAnswers[quizKey]
              const isDone = quizSubmitted[quizKey]
              const isRight = isDone && userChoice === q.answerIndex

              return (
                <div key={qIdx} className="space-y-3 pt-2 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-china-ink leading-relaxed">
                      <span className="font-bold text-china-red mr-1.5 font-mono">Câu {qIdx + 1}:</span>
                      {q.question}
                    </p>
                    {isDone && (
                      <button
                        type="button"
                        onClick={() => handleResetQuiz(quizKey)}
                        className="text-xs text-muted hover:text-china-ink flex items-center gap-1 transition-colors shrink-0"
                        title="Làm lại câu này"
                      >
                        <RotateCcw className="w-3 h-3" /> Làm lại
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userChoice === optIdx
                      const isActualRight = isDone && optIdx === q.answerIndex

                      return (
                        <button
                          key={optIdx}
                          disabled={isDone}
                          onClick={() => handleSelectQuiz(quizKey, optIdx)}
                          className={`text-left p-3 rounded-lg border text-xs md:text-sm font-medium transition-colors flex items-center justify-between gap-3 ${
                            isActualRight
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold"
                              : isSelected && !isRight
                              ? "bg-china-red/10 border-china-red text-china-red font-semibold"
                              : "border-border/80 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-china-ink"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded border border-border flex items-center justify-center text-[10px] font-mono text-muted shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </span>

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
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border-l-2 border-china-gold text-xs text-china-ink">
                      <span className="font-bold text-china-gold">Giải thích: </span>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 5. Previous / Next Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {prevItem ? (
          <Link
            href={`/grammar/${prevItem.id}`}
            className="group p-3.5 rounded-lg border border-border/80 bg-card hover:border-china-red/40 transition-colors text-left"
          >
            <div className="flex items-center gap-1 text-[11px] text-muted group-hover:text-china-red transition-colors mb-0.5">
              <ArrowLeft className="w-3 h-3" /> Điểm trước
            </div>
            <span className="text-xs md:text-sm font-bold text-china-ink group-hover:text-china-red transition-colors line-clamp-1">
              {prevItem.titleVi || prevItem.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextItem && (
          <Link
            href={`/grammar/${nextItem.id}`}
            className="group p-3.5 rounded-lg border border-border/80 bg-card hover:border-china-red/40 transition-colors text-right"
          >
            <div className="flex items-center justify-end gap-1 text-[11px] text-muted group-hover:text-china-red transition-colors mb-0.5">
              Điểm tiếp theo <ArrowRight className="w-3 h-3" />
            </div>
            <span className="text-xs md:text-sm font-bold text-china-ink group-hover:text-china-red transition-colors line-clamp-1">
              {nextItem.titleVi || nextItem.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
