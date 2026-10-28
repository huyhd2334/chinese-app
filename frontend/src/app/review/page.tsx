"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import useVocab from "../../../hooks/useVocab"
import { db } from "../../../db/database"
import Link from "next/link"
import { Volume2, RotateCw } from "lucide-react"
import { getHanViet } from "@/utils/hanviet"
import {
  FREE_REVIEW_LIMIT,
  getLocalSubscription,
  triggerUpgradeModal,
} from "@/utils/subscription"

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
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
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

  // Tính toán khoảng thời gian lặp lại dự kiến (Anki SRS Preview)
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

  const quotaPercent = Math.min(100, Math.round((totalReviewWords / FREE_REVIEW_LIMIT) * 100))

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* 1. Header & Quota Card */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-china-ink">
                Ôn tập từ vựng
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-china-paper border border-border text-[11px] font-medium text-muted">
                Spaced Repetition
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Ghi nhớ dài hạn theo chu kỳ đường cong quên lãng · Đã ôn {sessionReviewed} từ trong phiên này
            </p>
          </div>

          {/* Thanh dung lượng Free 500 từ hoặc Huy hiệu Pro */}
          <div className="flex items-center gap-3 bg-china-paper/80 px-3.5 py-2 rounded-xl border border-border self-start sm:self-auto">
            {isPro ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 bg-china-ink text-china-gold font-bold text-[10px] rounded uppercase">
                  PRO
                </span>
                <span className="font-semibold text-china-ink">
                  {totalReviewWords} từ (Không giới hạn)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="space-y-1 min-w-[125px]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted font-medium">Gói Miễn phí</span>
                    <span className={`font-bold ${totalReviewWords >= FREE_REVIEW_LIMIT ? "text-china-red" : "text-china-ink"}`}>
                      {totalReviewWords} / {FREE_REVIEW_LIMIT} từ
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        quotaPercent >= 90 ? "bg-china-red" : "bg-china-ink"
                      }`}
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => triggerUpgradeModal("manual")}
                  className="px-2.5 py-1.5 rounded-lg bg-china-red hover:bg-china-red-hover text-white text-[11px] font-bold transition-colors whitespace-nowrap active:scale-95"
                >
                  Nâng cấp Pro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bộ lọc Trạng thái dạng Tabs tinh gọn */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-2 border-t border-border/60">
          {filterTabs.map((tab) => {
            const active = filter === tab.value
            const count = statusCounts[tab.countKey]
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-china-ink text-white shadow-2xs"
                    : "bg-china-paper/70 hover:bg-china-paper text-china-ink border border-transparent hover:border-border"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-white text-muted border border-border/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Bộ lọc Cấp độ HSK + Thanh tiến độ phiên */}
        {cards.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setHskFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  hskFilter === "all"
                    ? "bg-china-red/10 text-china-red border border-china-red/30"
                    : "bg-white border border-border text-muted hover:text-china-ink"
                }`}
              >
                Tất cả HSK ({cards.length})
              </button>
              {[1, 2, 3, 4, 5, 6, 7].map((lv) => {
                const c = hskCounts[lv] || 0
                if (c === 0 && hskFilter !== lv) return null
                return (
                  <button
                    key={lv}
                    onClick={() => setHskFilter(lv)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      hskFilter === lv
                        ? "bg-china-red text-white"
                        : "bg-white border border-border text-muted hover:text-china-ink"
                    }`}
                  >
                    HSK {lv} ({c})
                  </button>
                )
              })}
            </div>

            {displayedCards.length > 0 && (
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-mono font-semibold text-china-ink">
                  Thẻ {currentIndex + 1} / {total}
                </span>
                <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-china-red transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Khu vực Thẻ Học Tập Chính */}
      {loading && cards.length === 0 ? (
        <div className="flex min-h-[420px] items-center justify-center bg-card rounded-3xl border border-border">
          <div className="flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-2 border-china-red/30 border-t-china-red rounded-full animate-spin" />
            <p className="text-xs text-muted">Đang tải thẻ ôn tập...</p>
          </div>
        </div>
      ) : !displayedCards.length ? (
        /* Trạng thái Hoàn Thành */
        <div className="bg-card rounded-3xl border border-border p-8 sm:p-12 text-center shadow-2xs space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            Hoàn thành mục tiêu
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-china-ink">
            {hskFilter !== "all"
              ? `Không còn từ HSK ${hskFilter} nào trong danh mục này`
              : "Bạn đã ôn tập xong toàn bộ thẻ đến hạn!"}
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            Duy trì việc ôn tập ngắt quãng mỗi ngày giúp bộ não chuyển từ vựng từ trí nhớ ngắn hạn sang trí nhớ dài hạn.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/vocabulary"
              className="px-5 py-2.5 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-semibold transition-all active:scale-95"
            >
              + Thêm từ mới từ Kho HSK
            </Link>
            {hskFilter !== "all" ? (
              <button
                onClick={() => setHskFilter("all")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-white text-china-ink text-xs sm:text-sm font-medium hover:bg-china-paper transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" /> Xem tất cả cấp độ
              </button>
            ) : (
              filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-white text-china-ink text-xs sm:text-sm font-medium hover:bg-china-paper transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Ôn tập toàn bộ ({statusCounts.all} từ)
                </button>
              )
            )}
          </div>
        </div>
      ) : currentCard ? (
        <div className="space-y-4">
          {/* Khung Thẻ Flashcard */}
          <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden transition-all">
            {/* Thanh thông tin trên cùng của Thẻ */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-border/60 bg-china-paper/40">
              <div className="flex items-center gap-2 flex-wrap">
                {hskNum && (
                  <span className="px-2.5 py-0.5 bg-china-red/10 text-china-red border border-china-red/20 text-xs font-bold rounded-lg">
                    HSK {hskNum}
                  </span>
                )}
                {currentCard.status_learning && (
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${
                      getStatusBadge(currentCard.status_learning).color
                    }`}
                  >
                    {getStatusBadge(currentCard.status_learning).label}
                  </span>
                )}
                {currentCard.word.radical && (
                  <span className="px-2.5 py-0.5 text-xs rounded-lg bg-white border border-border text-muted">
                    Bộ thủ: <b className="font-serif text-china-ink">{currentCard.word.radical}</b>
                  </span>
                )}
                {currentCard.reviewItem && currentCard.reviewItem.repetitions > 0 && (
                  <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] rounded-lg bg-white border border-border text-muted">
                    Lần lặp #{currentCard.reviewItem.repetitions} · Chu kỳ {currentCard.reviewItem.interval} ngày
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoAudio((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
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
                  className="p-2 rounded-xl bg-white border border-border text-china-red hover:bg-china-red hover:text-white transition-colors active:scale-95"
                >
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Nội dung chính của Thẻ */}
            <div className="p-6 sm:p-10 flex flex-col items-center justify-between min-h-[340px] sm:min-h-[370px]">
              {/* Chữ Hán trung tâm đặt trên nền khung Điền Tự Cách tinh tế */}
              <div className="my-auto text-center w-full space-y-2">
                <div className="inline-flex flex-col items-center justify-center px-8 py-5 rounded-2xl bg-china-paper/40 border border-border/70 relative">
                  <h2
                    className={`font-serif font-bold text-china-ink leading-tight tracking-wide select-all ${
                      currentCard.word.hanzi.length <= 1
                        ? "text-6xl sm:text-7xl md:text-8xl"
                        : currentCard.word.hanzi.length === 2
                        ? "text-5xl sm:text-6xl md:text-7xl"
                        : currentCard.word.hanzi.length === 3
                        ? "text-4xl sm:text-5xl md:text-6xl"
                        : "text-3xl sm:text-4xl md:text-5xl"
                    }`}
                  >
                    {currentCard.word.hanzi}
                  </h2>

                  {currentCard.word.traditional &&
                    currentCard.word.traditional !== currentCard.word.hanzi && (
                      <p className="text-xs sm:text-sm font-serif text-muted mt-1.5">
                        Phồn thể: <span className="text-china-ink">{currentCard.word.traditional}</span>
                      </p>
                    )}
                </div>

                {/* Khu vực Đáp án hoặc Nút Lật Thẻ */}
                {showAnswer ? (
                  <div className="pt-5 mt-4 border-t border-border/60 max-w-xl mx-auto space-y-3 animate-fade-in">
                    {/* Pinyin & Âm Hán-Việt */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <span className="text-2xl sm:text-3xl font-mono font-semibold text-china-red">
                        {currentCard.word.pinyin}
                      </span>
                      {cardHanViet && (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs sm:text-sm font-bold">
                          Hán-Việt: {cardHanViet}
                        </span>
                      )}
                    </div>

                    {/* Nghĩa tiếng Việt */}
                    <div className="bg-china-paper/70 border border-border rounded-2xl p-4 text-center">
                      <p className="text-base sm:text-xl font-bold text-china-ink leading-snug">
                        {currentCard.word.meanings_vi
                          ? currentCard.word.meanings_vi.join("; ")
                          : currentCard.word.meanings?.join("; ")}
                      </p>
                    </div>

                    {/* Từ loại, Lượng từ & Link luyện viết */}
                    <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-muted pt-1">
                      {currentCard.word.partOfSpeech && currentCard.word.partOfSpeech.length > 0 && (
                        <span className="px-2.5 py-0.5 bg-white border border-border rounded-md font-medium text-china-ink">
                          Loại từ: {currentCard.word.partOfSpeech.join(", ")}
                        </span>
                      )}
                      {currentCard.word.classifiers && currentCard.word.classifiers.length > 0 && (
                        <span className="px-2.5 py-0.5 bg-white border border-border rounded-md">
                          Lượng từ:{" "}
                          <b className="font-serif text-china-ink">
                            {currentCard.word.classifiers.join(", ")}
                          </b>
                        </span>
                      )}
                      <Link
                        href={`/vocabulary/${currentCard.word.id}`}
                        className="px-2.5 py-0.5 rounded-md bg-white border border-border text-china-red font-semibold hover:bg-china-red hover:text-white transition-colors"
                      >
                        Chi tiết & Luyện viết →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleRevealAnswer}
                      className="px-8 py-3 rounded-2xl bg-china-ink hover:bg-china-ink/85 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-95"
                    >
                      Hiển thị đáp án (Phím Space)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Thanh 4 Nút Đánh Giá SRS (Chỉ hiện khi đã xem đáp án) */}
            {showAnswer && (
              <div className="border-t border-border bg-china-paper/60 p-4 sm:p-5 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleResult("again")}
                    className="flex flex-col items-center justify-center py-3 px-3 rounded-2xl border border-border bg-white hover:border-red-400 hover:bg-red-50/50 transition-all active:scale-95"
                  >
                    <span className="text-[11px] font-mono text-muted mb-0.5">
                      {nextIntervals.again}
                    </span>
                    <span className="font-bold text-sm text-red-600">Chưa nhớ</span>
                    <span className="text-[10px] text-muted mt-0.5">Phím 1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResult("hard")}
                    className="flex flex-col items-center justify-center py-3 px-3 rounded-2xl border border-border bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-95"
                  >
                    <span className="text-[11px] font-mono text-muted mb-0.5">
                      {nextIntervals.hard}
                    </span>
                    <span className="font-bold text-sm text-amber-700">Hơi khó</span>
                    <span className="text-[10px] text-muted mt-0.5">Phím 2</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResult("good")}
                    className="flex flex-col items-center justify-center py-3 px-3 rounded-2xl border border-border bg-white hover:border-emerald-500 hover:bg-emerald-50/50 transition-all active:scale-95"
                  >
                    <span className="text-[11px] font-mono text-muted mb-0.5">
                      {nextIntervals.good}
                    </span>
                    <span className="font-bold text-sm text-emerald-700">Nhớ tốt</span>
                    <span className="text-[10px] text-muted mt-0.5">Phím 3</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResult("easy")}
                    className="flex flex-col items-center justify-center py-3 px-3 rounded-2xl border border-border bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all active:scale-95"
                  >
                    <span className="text-[11px] font-mono text-muted mb-0.5">
                      {nextIntervals.easy}
                    </span>
                    <span className="font-bold text-sm text-blue-700">Rất dễ</span>
                    <span className="text-[10px] text-muted mt-0.5">Phím 4</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
