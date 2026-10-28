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
  }, [filter, loadReview, refreshGlobalStats])

  useEffect(() => {
    setCurrentIndex(0)
    setShowAnswer(false)
  }, [cards, hskFilter])

  const getHskLevelNumber = useCallback((word: any) => {
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
    <div className="mx-auto w-full max-w-4xl lg:max-w-5xl px-3 sm:px-6 py-3 sm:py-4 space-y-3.5">
      
      {/* 1. Header & Bộ Lọc Khoáng Đạt, Đẹp Mắt */}
      <div className="bg-card rounded-2xl border border-border/80 p-3.5 sm:p-4 shadow-xs space-y-3">
        {/* Hàng 1: Tiêu đề + Tiến độ + Gói cước */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-china-ink">
              Ôn tập từ vựng
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-china-paper border border-border text-xs font-semibold text-muted">
              Đã ôn {sessionReviewed} từ
            </span>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            {/* Thanh tiến độ thẻ to rõ */}
            {displayedCards.length > 0 && (
              <div className="flex items-center gap-2.5 bg-china-paper px-3 py-1 rounded-xl border border-border/70">
                <span className="text-xs font-mono font-bold text-china-ink">
                  Thẻ {currentIndex + 1} / {total}
                </span>
                <div className="w-24 sm:w-28 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-china-red transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Gói cước Pro / Miễn phí */}
            {isPro ? (
              <span className="px-2 py-0.5 bg-china-ink text-china-gold font-bold text-xs rounded-lg shadow-2xs">
                PRO
              </span>
            ) : (
              <button
                onClick={() => triggerUpgradeModal("manual")}
                className="text-xs font-bold text-china-red hover:underline flex items-center gap-1"
                title={`${totalReviewWords}/${FREE_REVIEW_LIMIT} từ miễn phí`}
              >
                <span>{totalReviewWords}/{FREE_REVIEW_LIMIT} từ</span>
              </button>
            )}
          </div>
        </div>

        {/* Hàng 2: Tabs trạng thái & HSK filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2 border-t border-border/60">
          {/* Tabs trạng thái */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
            {filterTabs.map((tab) => {
              const active = filter === tab.value
              const count = statusCounts[tab.countKey]
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-china-ink text-white shadow-xs"
                      : "bg-china-paper hover:bg-white text-china-ink border border-transparent hover:border-border"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      active ? "bg-white/20 text-white" : "bg-white text-muted border border-border/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Cấp độ HSK */}
          {cards.length > 0 && (
            <div className="flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setHskFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  hskFilter === "all"
                    ? "bg-china-red/10 text-china-red border border-china-red/30"
                    : "bg-white border border-border text-muted hover:text-china-ink"
                }`}
              >
                Tất cả ({cards.length})
              </button>
              {[1, 2, 3, 4, 5, 6, 7].map((lv) => {
                const c = hskCounts[lv] || 0
                if (c === 0 && hskFilter !== lv) return null
                return (
                  <button
                    key={lv}
                    onClick={() => setHskFilter(lv)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                      hskFilter === lv
                        ? "bg-china-red text-white"
                        : "bg-white border border-border text-muted hover:text-china-ink"
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

      {/* 2. Khung Thẻ Flashcard Bề Thế, To Rõ & Có Tiểu Lu Lấp Ló */}
      {loading && cards.length === 0 ? (
        <div className="flex min-h-[420px] items-center justify-center bg-card rounded-3xl border border-border shadow-xs">
          <ChibiLoading
            variant="loading"
            character="loading"
            size="md"
            title="Đang tải thẻ ôn tập..."
          />
        </div>
      ) : !displayedCards.length ? (
        /* Trạng thái Hoàn Thành - Có Chibi Cổ Vũ */
        <div className="bg-card rounded-3xl border border-border p-8 sm:p-12 text-center shadow-xs space-y-4 animate-fade-in">
          <div className="relative w-40 h-40 mx-auto select-none">
            <Image
              src="/chibi-cheer.svg"
              alt="Tiểu Lu Hoàn Thành"
              width={160}
              height={160}
              priority
              className="object-contain"
            />
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            Hoàn thành xuất sắc!
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-china-ink">
            {hskFilter !== "all"
              ? `Không còn từ HSK ${hskFilter} nào cần ôn`
              : "Bạn đã hoàn thành sạch thẻ cần ôn hôm nay!"}
          </h2>

          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            Duy trì ôn tập ngắt quãng mỗi ngày giúp bộ não ghi nhớ dài hạn bền vững.
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/vocabulary"
              className="px-5 py-2.5 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Học thêm từ mới HSK</span>
            </Link>
            {hskFilter !== "all" ? (
              <button
                onClick={() => setHskFilter("all")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-white text-china-ink text-xs sm:text-sm font-semibold hover:bg-china-paper"
              >
                <RotateCw className="w-4 h-4" /> Xem tất cả cấp độ
              </button>
            ) : (
              filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-white text-china-ink text-xs sm:text-sm font-semibold hover:bg-china-paper"
                >
                  <RotateCw className="w-4 h-4" /> Ôn toàn bộ ({statusCounts.all} từ)
                </button>
              )
            )}
          </div>
        </div>
      ) : currentCard ? (
        <div className="relative rounded-3xl border border-border/90 bg-card shadow-sm overflow-visible flex flex-col transition-all">
          
          {/* Tiểu Lu Lấp Ló trên góc phải của thẻ Flashcard */}
          <div className="absolute -top-7 sm:-top-8 right-8 sm:right-12 w-16 sm:w-20 h-10 sm:h-12 z-20 pointer-events-none select-none transition-transform hover:scale-110">
            <Image
              src="/chibi-peek.svg"
              alt="Tiểu Lu lấp ló"
              width={75}
              height={48}
              priority
              className="object-contain drop-shadow-xs"
            />
          </div>

          {/* Thanh Header Thẻ */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-3 border-b border-border/70 bg-china-paper/50 rounded-t-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              {hskNum && (
                <span className="px-3 py-1 bg-china-red/10 text-china-red border border-china-red/25 text-xs font-bold rounded-lg">
                  HSK {hskNum}
                </span>
              )}
              {currentCard.status_learning && (
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                    getStatusBadge(currentCard.status_learning).color
                  }`}
                >
                  {getStatusBadge(currentCard.status_learning).label}
                </span>
              )}
              {currentCard.word.radical && (
                <span className="px-2.5 py-1 text-xs rounded-lg bg-white border border-border text-muted">
                  Bộ thủ: <b className="font-chinese text-china-ink">{currentCard.word.radical}</b>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoAudio((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  autoAudio
                    ? "bg-china-ink text-white border-china-ink"
                    : "bg-white text-muted border-border hover:text-china-ink"
                }`}
                title="Tự động đọc khi hiện đáp án"
              >
                Tự đọc: {autoAudio ? "Bật" : "Tắt"}
              </button>
              <button
                type="button"
                title="Nghe phát âm (Phím R)"
                onClick={() => playAudio(currentCard.word.hanzi)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-white border border-border text-china-red hover:bg-china-red hover:text-white transition-colors active:scale-95 cursor-pointer shadow-2xs touch-manipulation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thân Thẻ Flashcard: Chữ Hán To Bề Thế, Đẹp Mắt */}
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            
            {/* Khung Chữ Hán Trang Nhã */}
            <div className="px-10 py-5 sm:py-6 rounded-2xl bg-china-paper/60 border border-border/80 shadow-2xs inline-flex flex-col items-center justify-center min-w-[200px] sm:min-w-[240px]">
              <h2
                className={`font-chinese font-bold text-china-ink leading-tight tracking-wider select-all ${
                  currentCard.word.hanzi.length <= 1
                    ? "text-6xl sm:text-7xl md:text-8xl"
                    : currentCard.word.hanzi.length === 2
                    ? "text-5xl sm:text-6xl md:text-7xl"
                    : "text-4xl sm:text-5xl md:text-6xl"
                }`}
                lang="zh"
              >
                {currentCard.word.hanzi}
              </h2>

              {currentCard.word.traditional &&
                currentCard.word.traditional !== currentCard.word.hanzi && (
                  <p className="text-xs sm:text-sm font-chinese text-muted mt-1.5" lang="zh">
                    Phồn thể: <span className="text-china-ink font-semibold">{currentCard.word.traditional}</span>
                  </p>
                )}
            </div>

            {/* Khu vực Đáp án */}
            {showAnswer ? (
              <div className="w-full max-w-xl mx-auto space-y-3 pt-1 animate-fade-in">
                {/* Pinyin to rõ + Hán-Việt đậm đà */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-china-red tracking-wide">
                    {currentCard.word.pinyin}
                  </span>
                  {cardHanViet && (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-800 border border-amber-300 rounded-lg text-xs sm:text-sm font-bold">
                      Hán-Việt: {cardHanViet}
                    </span>
                  )}
                </div>

                {/* Nghĩa tiếng Việt rõ ràng, to bản */}
                <div className="bg-china-paper/90 border border-border/90 rounded-2xl px-5 py-3 text-center shadow-2xs">
                  <p className="text-base sm:text-lg font-bold text-china-ink leading-snug">
                    {currentCard.word.meanings_vi
                      ? currentCard.word.meanings_vi.join("; ")
                      : currentCard.word.meanings?.join("; ")}
                  </p>
                </div>

                {/* Phân loại & Link luyện viết */}
                <div className="flex items-center justify-center gap-3 text-xs text-muted pt-0.5">
                  {currentCard.word.partOfSpeech && currentCard.word.partOfSpeech.length > 0 && (
                    <span className="bg-white border border-border px-2 py-0.5 rounded-md font-medium text-china-ink">
                      {currentCard.word.partOfSpeech.join(", ")}
                    </span>
                  )}
                  <Link
                    href={`/vocabulary/${currentCard.word.id}`}
                    className="inline-flex items-center gap-1 font-bold text-china-red hover:underline"
                  >
                    <span>Chi tiết & Luyện viết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRevealAnswer}
                  className="px-8 py-3 rounded-2xl bg-china-ink hover:bg-china-ink/90 text-white text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Hiển thị đáp án (Phím Space)
                </button>
              </div>
            )}
          </div>

          {/* 3. Thanh 4 Nút Đánh Giá SRS: Đồng bộ Hán phong với Mini Mascot Tiểu Lu */}
          {showAnswer && (
            <div className="border-t border-border/80 bg-china-paper/60 p-3 sm:p-4 rounded-b-3xl animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {/* 1. Chưa nhớ */}
                <button
                  type="button"
                  onClick={() => handleResult("again")}
                  className="flex flex-col items-center justify-between py-2.5 px-3 rounded-2xl border border-border/90 bg-white hover:border-china-red hover:bg-china-paper/70 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mb-1.5 transition-transform group-hover:scale-110">
                    <Image
                      src="/srs-again.svg"
                      alt="Chưa nhớ"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-sm sm:text-base text-china-ink group-hover:text-china-red transition-colors">
                      Chưa nhớ
                    </span>
                    <span className="block text-[11px] text-muted font-medium mt-0.5">
                      {nextIntervals.again}
                    </span>
                  </div>
                  <span className="mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono text-muted/70 bg-china-paper border border-border/60">
                    Phím 1
                  </span>
                </button>

                {/* 2. Hơi khó */}
                <button
                  type="button"
                  onClick={() => handleResult("hard")}
                  className="flex flex-col items-center justify-between py-2.5 px-3 rounded-2xl border border-border/90 bg-white hover:border-amber-400 hover:bg-china-paper/70 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mb-1.5 transition-transform group-hover:scale-110">
                    <Image
                      src="/srs-hard.svg"
                      alt="Hơi khó"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-sm sm:text-base text-china-ink group-hover:text-amber-700 transition-colors">
                      Hơi khó
                    </span>
                    <span className="block text-[11px] text-muted font-medium mt-0.5">
                      {nextIntervals.hard}
                    </span>
                  </div>
                  <span className="mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono text-muted/70 bg-china-paper border border-border/60">
                    Phím 2
                  </span>
                </button>

                {/* 3. Nhớ tốt */}
                <button
                  type="button"
                  onClick={() => handleResult("good")}
                  className="flex flex-col items-center justify-between py-2.5 px-3 rounded-2xl border border-border/90 bg-white hover:border-china-jade hover:bg-china-paper/70 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mb-1.5 transition-transform group-hover:scale-110">
                    <Image
                      src="/srs-good.svg"
                      alt="Nhớ tốt"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-sm sm:text-base text-china-ink group-hover:text-china-jade transition-colors">
                      Nhớ tốt
                    </span>
                    <span className="block text-[11px] text-muted font-medium mt-0.5">
                      {nextIntervals.good}
                    </span>
                  </div>
                  <span className="mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono text-muted/70 bg-china-paper border border-border/60">
                    Phím 3
                  </span>
                </button>

                {/* 4. Rất dễ */}
                <button
                  type="button"
                  onClick={() => handleResult("easy")}
                  className="flex flex-col items-center justify-between py-2.5 px-3 rounded-2xl border border-border/90 bg-white hover:border-china-gold hover:bg-china-paper/70 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mb-1.5 transition-transform group-hover:scale-110">
                    <Image
                      src="/srs-easy.svg"
                      alt="Rất dễ"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-sm sm:text-base text-china-ink group-hover:text-amber-600 transition-colors">
                      Rất dễ
                    </span>
                    <span className="block text-[11px] text-muted font-medium mt-0.5">
                      {nextIntervals.easy}
                    </span>
                  </div>
                  <span className="mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono text-muted/70 bg-china-paper border border-border/60">
                    Phím 4
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
