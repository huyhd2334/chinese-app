"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import useVocab from "../../../hooks/useVocab"
import { db } from "../../../db/database"
import Link from "next/link"
import Image from "next/image"
import { Volume2, RotateCw, BookOpen, Sparkles, ExternalLink } from "lucide-react"
import { getHanViet } from "@/utils/hanviet"
import { playChineseAudio } from "@/utils/audioTts"
import {
  FREE_REVIEW_LIMIT,
  getLocalSubscription,
  triggerUpgradeModal,
} from "@/utils/subscription"
import ChibiLoading from "@/components/common/ChibiLoading"
import { ReviewMasteryChart } from "@/components/review/ReviewMasteryChart"

type FilterType = "due" | "new" | "learning" | "review" | "mastered" | "all"

export default function ReviewPage() {
  const { loading, cards, loadReview, markKnown, markUnknown, markHard, markEasy } = useVocab()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [filter, setFilter] = useState<FilterType>("due")
  const [hskFilter, setHskFilter] = useState<number | "all">("all")
  const [autoAudio, setAutoAudio] = useState(true)
  const [sessionReviewed, setSessionReviewed] = useState(0)

  // Thống kê toàn bộ từ trong Review & trạng thái gói cước
  const [totalReviewWords, setTotalReviewWords] = useState(0)
  const [accuracyRate, setAccuracyRate] = useState(100)
  const [statusCounts, setStatusCounts] = useState({
    due: 0,
    new: 0,
    learning: 0,
    review: 0,
    mastered: 0,
    all: 0,
  })
  const [isPro, setIsPro] = useState(false)

  const filterTabs: { value: FilterType; label: string; countKey: keyof typeof statusCounts }[] = [
    { value: "due", label: "Cần ôn hôm nay", countKey: "due" },
    { value: "new", label: "Từ mới", countKey: "new" },
    { value: "learning", label: "Đang học", countKey: "learning" },
    { value: "review", label: "Đang ôn", countKey: "review" },
    { value: "mastered", label: "Đã thuộc", countKey: "mastered" },
    { value: "all", label: "Tất cả", countKey: "all" },
  ]

  const refreshGlobalStats = useCallback(async () => {
    try {
      const allItems = await db.reviewItems.toArray()
      const now = Date.now()
      setTotalReviewWords(allItems.length)

      let totalCorrect = 0
      let totalWrong = 0
      for (const item of allItems) {
        totalCorrect += item.correctCount || 0
        totalWrong += item.wrongCount || 0
      }
      const totalAnswers = totalCorrect + totalWrong
      setAccuracyRate(totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 100)

      setStatusCounts({
        due: allItems.filter((i) => i.dueAt <= now).length,
        new: allItems.filter((i) => i.status === "new").length,
        learning: allItems.filter((i) => i.status === "learning").length,
        review: allItems.filter((i) => i.status === "review").length,
        mastered: allItems.filter((i) => i.status === "mastered").length,
        all: allItems.length,
      })
    } catch (e) {
      console.error(e)
    }
  }, [])

  const masteryDistribution = useMemo(() => ({
    total: statusCounts.all,
    newCount: statusCounts.new,
    learningCount: statusCounts.learning,
    reviewCount: statusCounts.review,
    masteredCount: statusCounts.mastered,
    dueCount: statusCounts.due,
    accuracyRate,
  }), [statusCounts, accuracyRate])

  useEffect(() => {
    const checkSub = () => {
      const sub = getLocalSubscription()
      setIsPro(
        (sub.plan === "pro_monthly" || sub.plan === "pro_yearly") &&
          (!sub.expiresAt || sub.expiresAt > Date.now())
      )
    }
    checkSub()
    window.addEventListener("hsk-subscription-updated", checkSub)
    return () => window.removeEventListener("hsk-subscription-updated", checkSub)
  }, [])

  useEffect(() => {
    loadReview(filter)
    refreshGlobalStats()

    const handleSync = () => {
      loadReview(filter)
      refreshGlobalStats()
    }
    window.addEventListener("hsk-cloud-synced", handleSync)
    window.addEventListener("hsk-srs-synced", handleSync)
    window.addEventListener("hsk-words-updated", handleSync)
    window.addEventListener("hsk-auth-changed", handleSync)
    return () => {
      window.removeEventListener("hsk-cloud-synced", handleSync)
      window.removeEventListener("hsk-srs-synced", handleSync)
      window.removeEventListener("hsk-words-updated", handleSync)
      window.removeEventListener("hsk-auth-changed", handleSync)
    }
  }, [filter, loadReview, refreshGlobalStats])

  useEffect(() => {
    setCurrentIndex(0)
    setShowAnswer(false)
  }, [cards, hskFilter])

  const getHskLevelNumber = useCallback((word: { hskLevel?: number[]; hskLevels?: number[] } | null | undefined) => {
    if (word?.hskLevel && Array.isArray(word.hskLevel) && word.hskLevel.length > 0) {
      return word.hskLevel[0]
    }
    if (word?.hskLevels && Array.isArray(word.hskLevels) && word.hskLevels.length > 0) {
      return word.hskLevels[0]
    }
    return null
  }, [])

  const displayedCards = useMemo(() => {
    if (hskFilter === "all") return cards
    return cards.filter((c) => getHskLevelNumber(c.word) === hskFilter)
  }, [cards, hskFilter, getHskLevelNumber])

  const hskCounts = useMemo(() => {
    const counts: Record<number, number> = {}
    for (const c of cards) {
      const lv = getHskLevelNumber(c.word)
      if (lv) counts[lv] = (counts[lv] || 0) + 1
    }
    return counts
  }, [cards, getHskLevelNumber])

  const currentCard = displayedCards[currentIndex]
  const total = displayedCards.length
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0

  const playAudio = useCallback((text?: string) => {
    if (!text) return
    playChineseAudio(text)
  }, [])

  // Tự động phát âm khi lật đáp án
  const handleRevealAnswer = useCallback(() => {
    setShowAnswer(true)
    if (autoAudio && currentCard?.word?.hanzi) {
      playAudio(currentCard.word.hanzi)
    }
  }, [autoAudio, currentCard, playAudio])

  const handleResult = useCallback(
    async (action: "again" | "hard" | "good" | "easy") => {
      if (!currentCard) return
      try {
        if (action === "again") await markUnknown(currentCard.reviewId)
        if (action === "hard") await markHard(currentCard.reviewId)
        if (action === "good") await markKnown(currentCard.reviewId)
        if (action === "easy") await markEasy(currentCard.reviewId)

        setSessionReviewed((prev) => prev + 1)
        await refreshGlobalStats()

        if (currentIndex >= displayedCards.length - 1) {
          await loadReview(filter)
          return
        }
        setCurrentIndex((prev) => prev + 1)
        setShowAnswer(false)
      } catch (error) {
        console.error("Review update error:", error)
      }
    },
    [
      currentCard,
      currentIndex,
      displayedCards.length,
      filter,
      loadReview,
      markEasy,
      markHard,
      markKnown,
      markUnknown,
      refreshGlobalStats,
    ]
  )

  // Phím tắt bàn phím
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.code === "Space") {
        e.preventDefault()
        if (!showAnswer) {
          handleRevealAnswer()
        } else {
          setShowAnswer(false)
        }
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault()
        playAudio(currentCard?.word?.hanzi)
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
  }, [showAnswer, handleResult, handleRevealAnswer, currentCard, playAudio])

  const hskNum = currentCard ? getHskLevelNumber(currentCard.word) : null
  const cardHanViet = currentCard
    ? getHanViet(currentCard.word.hanzi, currentCard.word.traditional, currentCard.word.pinyinNumeric)
    : ""

  // Khoảng thời gian lặp lại dự kiến (Anki SRS Preview)
  const nextIntervals = useMemo(() => {
    const item = currentCard?.reviewItem
    if (!item) {
      return { again: "10 phút", hard: "1 ngày", good: "1 ngày", easy: "4 ngày" }
    }
    const hardDays = item.interval > 0 ? Math.max(1, Math.round(item.interval * 1.2)) : 1
    const goodDays = Math.min(365, item.interval > 0 ? Math.round(item.interval * item.easeFactor) : 1)
    const easyDays = Math.min(365, item.interval > 0 ? Math.round(item.interval * item.easeFactor * 1.3) : 4)
    return {
      again: "10 phút",
      hard: `${hardDays} ngày`,
      good: `${goodDays} ngày`,
      easy: `${easyDays} ngày`,
    }
  }, [currentCard])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return { label: "Từ mới", color: "bg-china-paper text-china-ink border-border" }
      case "learning":
        return { label: "Đang học", color: "bg-amber-50 text-amber-800 border-amber-200" }
      case "review":
        return { label: "Đang ôn", color: "bg-blue-50 text-blue-700 border-blue-200" }
      case "mastered":
        return { label: "Đã thuộc", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      default:
        return { label: status, color: "bg-china-paper text-muted border-border" }
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-5 sm:py-6 space-y-4">
      {/* 1. Header & Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Ôn tập lặp lại ngắt quãng
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-china-paper border border-border text-xs font-medium text-muted">
              Phiên này: {sessionReviewed} thẻ
            </span>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {displayedCards.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-semibold text-foreground">
                  {currentIndex + 1} / {total}
                </span>
                <div className="w-20 sm:w-24 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-china-red transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {isPro ? (
              <span className="px-2 py-0.5 bg-foreground text-background font-bold text-[11px] rounded">
                PRO
              </span>
            ) : (
              <button
                onClick={() => triggerUpgradeModal("manual")}
                className="text-xs font-semibold text-muted hover:text-china-red transition-colors cursor-pointer"
                title="Bấm để xem gói nâng cấp"
              >
                {totalReviewWords}/{FREE_REVIEW_LIMIT} từ
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2.5 border-t border-border">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {filterTabs.map((tab) => {
              const active = filter === tab.value
              const count = statusCounts[tab.countKey]
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? "bg-foreground text-background font-semibold"
                      : "bg-china-paper/70 hover:bg-china-paper text-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[11px] ${active ? "opacity-80" : "text-muted"}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>

          {cards.length > 0 && (
            <div className="flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setHskFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  hskFilter === "all"
                    ? "bg-china-red/10 text-china-red font-semibold"
                    : "text-muted hover:text-foreground hover:bg-china-paper"
                }`}
              >
                Tất cả
              </button>
              {[1, 2, 3, 4, 5, 6, 7].map((lv) => {
                const c = hskCounts[lv] || 0
                if (c === 0 && hskFilter !== lv) return null
                return (
                  <button
                    key={lv}
                    onClick={() => setHskFilter(lv)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      hskFilter === lv
                        ? "bg-china-red text-white font-semibold"
                        : "text-muted hover:text-foreground hover:bg-china-paper"
                    }`}
                  >
                    HSK {lv}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Mastery Distribution */}
      {statusCounts.all > 0 && (
        <ReviewMasteryChart
          distribution={masteryDistribution}
          currentFilter={filter}
          onSelectFilter={(newFilter) => setFilter(newFilter)}
        />
      )}

      {/* 3. Flashcard Study Stage */}
      {loading && cards.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center bg-card rounded-2xl border border-border">
          <div className="w-6 h-6 border-2 border-china-red border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-muted">Đang tải thẻ ôn tập...</p>
        </div>
      ) : !displayedCards.length ? (
        <div className="bg-card rounded-2xl border border-border p-10 sm:p-14 text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            Đã hoàn tất
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {hskFilter !== "all"
              ? `Không còn thẻ HSK ${hskFilter} nào trong mục này`
              : "Bạn đã ôn xong toàn bộ thẻ cần ôn hôm nay"}
          </h2>

          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            Nghỉ ngơi hoặc nạp thêm từ mới từ Giáo trình và Từ điển HSK để tiếp tục mở rộng vốn từ.
          </p>

          <div className="flex flex-wrap gap-2.5 justify-center pt-2">
            <Link
              href="/vocabulary"
              className="px-4 py-2.5 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Mở Từ điển HSK</span>
            </Link>
            {hskFilter !== "all" ? (
              <button
                onClick={() => setHskFilter("all")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm font-medium hover:bg-china-paper cursor-pointer"
              >
                <RotateCw className="w-4 h-4" /> Xem tất cả cấp độ
              </button>
            ) : (
              filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm font-medium hover:bg-china-paper cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" /> Luyện toàn bộ ({statusCounts.all} từ)
                </button>
              )
            )}
          </div>
        </div>
      ) : currentCard ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-border bg-china-paper/40 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2 flex-wrap">
              {hskNum && (
                <span className="px-2.5 py-0.5 bg-card border border-border text-foreground text-xs font-semibold rounded-md">
                  HSK {hskNum}
                </span>
              )}
              {currentCard.status_learning && (
                <span
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-md border ${
                    getStatusBadge(currentCard.status_learning).color
                  }`}
                >
                  {getStatusBadge(currentCard.status_learning).label}
                </span>
              )}
              {currentCard.word.radical && (
                <span className="text-xs text-muted">
                  Bộ thủ: <b className="font-chinese text-foreground" lang="zh">{currentCard.word.radical}</b>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoAudio((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  autoAudio
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-muted border-border hover:text-foreground"
                }`}
                title="Tự động đọc khi hiện đáp án"
              >
                Tự đọc: {autoAudio ? "Bật" : "Tắt"}
              </button>
              <button
                type="button"
                title="Nghe phát âm (Phím R)"
                onClick={() => playAudio(currentCard.word.hanzi)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-border text-foreground hover:bg-china-red hover:text-white hover:border-china-red transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8 sm:p-10 min-h-[260px] flex flex-col items-center justify-center text-center space-y-5">
            <div>
              <h2
                className={`font-chinese font-bold text-foreground leading-tight tracking-wide select-all ${
                  currentCard.word.hanzi.length <= 2
                    ? "text-6xl sm:text-7xl"
                    : "text-4xl sm:text-6xl"
                }`}
                lang="zh"
              >
                {currentCard.word.hanzi}
              </h2>

              {currentCard.word.traditional &&
                currentCard.word.traditional !== currentCard.word.hanzi && (
                  <p className="text-xs font-chinese text-muted mt-2" lang="zh">
                    Phồn thể: <span className="text-foreground font-semibold">{currentCard.word.traditional}</span>
                  </p>
                )}
            </div>

            {showAnswer ? (
              <div className="w-full max-w-lg mx-auto space-y-3 pt-2 border-t border-border animate-fade-in">
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-bold text-china-red">
                    {currentCard.word.pinyin}
                  </span>
                  {cardHanViet && (
                    <span className="px-2.5 py-0.5 bg-china-paper border border-border rounded-md text-xs font-semibold text-foreground">
                      {cardHanViet}
                    </span>
                  )}
                </div>

                <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                  {currentCard.word.meanings_vi
                    ? currentCard.word.meanings_vi.join("; ")
                    : currentCard.word.meanings?.join("; ")}
                </p>

                <div className="flex items-center justify-center gap-3 text-xs text-muted pt-1">
                  {currentCard.word.partOfSpeech && currentCard.word.partOfSpeech.length > 0 && (
                    <span>{currentCard.word.partOfSpeech.join(", ")}</span>
                  )}
                  <Link
                    href={`/vocabulary/${currentCard.word.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-china-red hover:underline"
                  >
                    <span>Chi tiết &amp; nét viết</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRevealAnswer}
                  className="px-6 py-2.5 rounded-xl bg-foreground hover:opacity-90 text-background text-sm font-semibold transition-opacity cursor-pointer"
                >
                  Hiện đáp án (Space)
                </button>
              </div>
            )}
          </div>

          {/* 4 SRS Rating Buttons */}
          {showAnswer && (
            <div className="border-t border-border bg-china-paper/40 dark:bg-white/[0.02] p-3.5 sm:p-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleResult("again")}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-border bg-card hover:border-red-500 hover:bg-red-50/40 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm text-red-600 dark:text-red-400">
                    Chưa nhớ
                  </span>
                  <span className="text-[11px] text-muted mt-0.5">
                    {nextIntervals.again} · [1]
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResult("hard")}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-border bg-card hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm text-amber-600 dark:text-amber-400">
                    Hơi khó
                  </span>
                  <span className="text-[11px] text-muted mt-0.5">
                    {nextIntervals.hard} · [2]
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResult("good")}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-border bg-card hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                    Nhớ tốt
                  </span>
                  <span className="text-[11px] text-muted mt-0.5">
                    {nextIntervals.good} · [3]
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResult("easy")}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-border bg-card hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                    Rất dễ
                  </span>
                  <span className="text-[11px] text-muted mt-0.5">
                    {nextIntervals.easy} · [4]
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
