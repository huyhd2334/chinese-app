"use client"

import { useEffect, useState, useCallback } from "react"
import useVocab from "../../../hooks/useVocab"
import Link from "next/link"
import { 
  Volume2, Sparkles, BookOpen, PenTool, CheckCircle2, 
  ChevronDown, ArrowRight, RotateCw, Check, Flame, Trophy
} from "lucide-react"

type FilterType = "due" | "new" | "learning" | "review" | "mastered" | "all"

export default function ReviewPage() {
  const { loading, cards, loadReview, markKnown, markUnknown, markHard, markEasy } = useVocab()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [filter, setFilter] = useState<FilterType>("due")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  const filterOptions = [
    { value: "due", label: "Cần ôn tập hôm nay" },
    { value: "new", label: "Từ mới chưa học" },
    { value: "learning", label: "Đang học" },
    { value: "review", label: "Đang ôn tập" },
    { value: "mastered", label: "Đã thuần thục" },
    { value: "all", label: "Tất cả từ vựng" },
  ]

  useEffect(() => {
    loadReview(filter)
  }, [filter, loadReview])

  useEffect(() => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setCompletedCount(0)
  }, [cards])

  const currentCard = cards[currentIndex]
  const total = cards.length
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0

  const playAudio = useCallback((text?: string) => {
    if (!text) return
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const handleResult = useCallback(async (action: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return
    try {
      if (action === "again") await markUnknown(currentCard.reviewId)
      if (action === "hard") await markHard(currentCard.reviewId)
      if (action === "good") await markKnown(currentCard.reviewId)
      if (action === "easy") await markEasy(currentCard.reviewId)

      setCompletedCount(prev => prev + 1)

      if (currentIndex >= cards.length - 1) {
        await loadReview(filter)
        return
      }
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
    } catch (error) {
      console.error("Review update error:", error)
    }
  }, [currentCard, currentIndex, cards.length, filter, loadReview, markEasy, markHard, markKnown, markUnknown])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.code === "Space") {
        e.preventDefault()
        setShowAnswer(prev => !prev)
      } else if (showAnswer) {
        if (e.key === "1") {
          e.preventDefault()
          handleResult("again")
        } else if (e.key === "2") {
          e.preventDefault()
          handleResult("hard")
        } else if (e.key === "3") {
          e.preventDefault()
          handleResult("good")
        } else if (e.key === "4") {
          e.preventDefault()
          handleResult("easy")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showAnswer, handleResult])

  // Get HSK Level number safely
  const getHskLevelNumber = (word: any) => {
    if (word?.hskLevel && Array.isArray(word.hskLevel) && word.hskLevel.length > 0) {
      return word.hskLevel[0]
    }
    if (word?.hskLevels && Array.isArray(word.hskLevels) && word.hskLevels.length > 0) {
      return word.hskLevels[0]
    }
    return null
  }

  const hskNum = currentCard ? getHskLevelNumber(currentCard.word) : null

  // Status mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return { label: "Từ mới", color: "bg-blue-50 text-blue-700 border-blue-200" }
      case "learning":
        return { label: "Đang học", color: "bg-amber-50 text-amber-700 border-amber-200" }
      case "review":
        return { label: "Cần ôn", color: "bg-purple-50 text-purple-700 border-purple-200" }
      case "mastered":
        return { label: "Đã thuộc", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      default:
        return { label: status, color: "bg-gray-50 text-gray-700 border-gray-200" }
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-china-red flex items-center gap-2">
              <span>复习</span>
              <span className="text-lg sm:text-xl font-sans text-china-ink font-semibold">Ôn tập từ vựng</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Hệ thống lặp lại ngắt quãng (Spaced Repetition)
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-china-ink shadow-xs hover:border-china-red/30 transition-all outline-none focus:ring-2 focus:ring-china-red/20 justify-between group"
              >
                <span className="group-hover:text-china-red transition-colors">
                  {filterOptions.find(o => o.value === filter)?.label}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted group-hover:text-china-red transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-xl z-30 overflow-hidden animate-fade-in">
                    <div className="py-1">
                      {filterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setFilter(opt.value as FilterType)
                            setIsFilterOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm transition-colors ${
                            filter === opt.value 
                              ? 'bg-china-red/10 text-china-red font-semibold' 
                              : 'text-china-ink hover:bg-border/30 hover:text-china-red'
                          }`}
                        >
                          {opt.label}
                          {filter === opt.value && (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Counter */}
            {cards.length > 0 && (
              <div className="rounded-full bg-border/60 px-3 py-1 text-xs sm:text-sm font-medium text-china-ink whitespace-nowrap">
                {currentIndex + 1} / {total}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {cards.length > 0 && (
          <div className="h-2 overflow-hidden rounded-full bg-border/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-china-red to-china-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Review Area */}
      {loading && cards.length === 0 ? (
        <div className="flex min-h-[45vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-china-ink">
            <div className="w-8 h-8 border-3 border-china-red/30 border-t-china-red rounded-full animate-spin"></div>
            <p className="text-xs sm:text-sm font-medium text-muted">Đang tải thẻ ôn tập...</p>
          </div>
        </div>
      ) : !cards.length ? (
        /* Empty / Completed state */
        <div className="flex min-h-[45vh] items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-10 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-china-jade/10 text-china-jade flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-china-ink mb-2">
              Xuất sắc! Đã hoàn thành ôn tập
            </h2>
            <p className="text-xs sm:text-sm text-muted mb-6">
              Bạn không còn từ nào cần ôn trong danh mục này. Hãy duy trì thói quen mỗi ngày nhé!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/vocabulary"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-china-red text-white text-sm font-semibold hover:bg-china-red-hover transition-all shadow-sm active:scale-95"
              >
                <BookOpen className="w-4 h-4" /> Học thêm từ mới
              </Link>
              <button
                onClick={() => setFilter("all")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-china-ink text-sm font-medium hover:bg-china-paper transition-all shadow-xs"
              >
                <RotateCw className="w-4 h-4" /> Ôn tất cả từ
              </button>
            </div>
          </div>
        </div>
      ) : currentCard ? (
        /* Active Card */
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-300">
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px] relative">
            
            {/* Top Badges (HSK Level + Status + Radical) */}
            <div className="w-full flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                {/* HSK Level Badge - User's explicit request */}
                {hskNum ? (
                  <span className="px-3 py-1 bg-gradient-to-r from-china-red to-[#a30d25] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs border border-china-red/30 tracking-wide">
                    HSK {hskNum}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-china-paper border border-border text-muted text-xs font-semibold rounded-lg">
                    HSK
                  </span>
                )}

                {/* Status Badge */}
                {currentCard.status_learning && (
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-lg border ${getStatusBadge(currentCard.status_learning).color}`}>
                    {getStatusBadge(currentCard.status_learning).label}
                  </span>
                )}

                {/* Radical */}
                {currentCard.word.radical && (
                  <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded-lg bg-china-paper border border-border text-muted">
                    Bộ: {currentCard.word.radical}
                  </span>
                )}
              </div>

              {/* Speaker Audio Button */}
              <button
                title="Phát âm từ này"
                onClick={() => playAudio(currentCard.word.hanzi)}
                className="p-2 text-china-red/80 hover:text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Hanzi Presentation */}
            <div className="text-center my-auto w-full">
              <h2 className={`font-serif font-bold text-china-ink leading-tight mb-2 tracking-wide whitespace-nowrap transition-transform duration-300 hover:scale-105 select-none ${
                currentCard.word.hanzi.length <= 1
                  ? "text-7xl sm:text-8xl md:text-9xl"
                  : currentCard.word.hanzi.length === 2
                  ? "text-6xl sm:text-7xl md:text-8xl"
                  : currentCard.word.hanzi.length === 3
                  ? "text-4xl sm:text-5xl md:text-6xl"
                  : "text-3xl sm:text-4xl md:text-5xl"
              }`}>
                {currentCard.word.hanzi}
              </h2>

              {currentCard.word.traditional && currentCard.word.traditional !== currentCard.word.hanzi && (
                <p className="text-sm sm:text-base font-serif text-muted mb-4 opacity-70">
                  {currentCard.word.traditional} <span className="text-xs font-sans">(Phồn thể)</span>
                </p>
              )}

              {/* Revealed Answer or Show Answer Button */}
              {showAnswer ? (
                <div className="space-y-3 mt-6 pt-6 border-t border-border/60 animate-fade-in w-full max-w-lg mx-auto">
                  {/* Pinyin */}
                  <div className="text-2xl sm:text-3xl font-medium text-china-red tracking-wide">
                    {currentCard.word.pinyin}
                  </div>

                  {/* Vietnamese / English Meaning */}
                  <div className="text-base sm:text-lg text-china-ink font-medium leading-relaxed">
                    {currentCard.word.meanings_vi ? currentCard.word.meanings_vi.join("; ") : currentCard.word.meanings?.join("; ")}
                  </div>

                  {/* Part of Speech & Classifiers */}
                  <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-muted pt-2">
                    {currentCard.word.partOfSpeech && currentCard.word.partOfSpeech.length > 0 && (
                      <span className="px-2 py-0.5 bg-china-paper border border-border rounded-md font-medium text-china-ink">
                        {currentCard.word.partOfSpeech.join(" · ")}
                      </span>
                    )}
                    {currentCard.word.classifiers && currentCard.word.classifiers.length > 0 && (
                      <span className="px-2 py-0.5 bg-china-paper border border-border rounded-md">
                        Lượng từ: <b className="font-serif text-china-ink">{currentCard.word.classifiers.join(", ")}</b>
                      </span>
                    )}
                    <Link
                      href={`/vocabulary/${currentCard.word.id}`}
                      className="inline-flex items-center gap-1 text-china-red hover:underline ml-2"
                    >
                      <PenTool className="w-3 h-3" /> Chi tiết & luyện viết →
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="mt-6 px-6 sm:px-8 py-3 rounded-2xl border-2 border-dashed border-border hover:border-china-red text-china-ink hover:text-china-red text-sm sm:text-base font-medium transition-all shadow-xs hover:bg-china-red/5 active:scale-95"
                >
                  Nhấn hoặc bấm <kbd className="px-1.5 py-0.5 bg-china-paper border border-border rounded text-xs font-mono text-muted">Space</kbd> để xem đáp án
                </button>
              )}
            </div>
          </div>

          {/* Rating Buttons (Spaced Repetition) */}
          {showAnswer && (
            <div className="border-t border-border bg-china-paper/60 p-4 sm:p-6 rounded-b-3xl animate-fade-in">
              <p className="text-center text-xs sm:text-sm text-muted mb-3 font-medium">
                Bạn nhớ từ này ở mức độ nào?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <button
                  onClick={() => handleResult("again")}
                  className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 transition-all shadow-xs active:scale-95 group"
                >
                  <span className="font-bold text-sm sm:text-base">Chưa nhớ</span>
                  <span className="text-[11px] text-red-400 mt-0.5">Học lại (<kbd className="font-mono text-[10px]">1</kbd>)</span>
                </button>

                <button
                  onClick={() => handleResult("hard")}
                  className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-amber-600 transition-all shadow-xs active:scale-95 group"
                >
                  <span className="font-bold text-sm sm:text-base">Hơi khó</span>
                  <span className="text-[11px] text-amber-500 mt-0.5">Vừa nhớ (<kbd className="font-mono text-[10px]">2</kbd>)</span>
                </button>

                <button
                  onClick={() => handleResult("good")}
                  className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-600 transition-all shadow-xs active:scale-95 group"
                >
                  <span className="font-bold text-sm sm:text-base">Nhớ tốt</span>
                  <span className="text-[11px] text-emerald-500 mt-0.5">Đã thuộc (<kbd className="font-mono text-[10px]">3</kbd>)</span>
                </button>

                <button
                  onClick={() => handleResult("easy")}
                  className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 transition-all shadow-xs active:scale-95 group"
                >
                  <span className="font-bold text-sm sm:text-base">Rất dễ</span>
                  <span className="text-[11px] text-blue-500 mt-0.5">Thuần thục (<kbd className="font-mono text-[10px]">4</kbd>)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}