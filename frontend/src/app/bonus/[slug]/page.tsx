"use client"

import React, { useState, useEffect, useMemo, useCallback, use } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Volume2, Star, Search, ChevronLeft, ChevronRight } from "lucide-react"
import type { BonusWord } from "@/types/bonus"
import { getHanViet } from "@/utils/hanviet"
import BonusWordDetailModal from "@/components/bonus/BonusWordDetailModal"

// Direct static import for instant rendering and offline support
import hsk5Raw from "@/data/bonus/hsk5_v3.json"
import toeicRaw from "@/data/bonus/toeic_vocab.json"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BonusStudyPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const searchParams = useSearchParams()

  const initialMode = searchParams.get("mode") === "gallery" ? "gallery" : "flashcard"
  const [mode, setMode] = useState<"flashcard" | "gallery">(initialMode)

  // Collection metadata
  const isZh = slug === "hsk5"
  const collectionTitle = isZh ? "Tổng Hợp Từ Vựng HSK 5" : "Bộ Từ Vựng TOEIC Chuyên Sâu"
  const collectionBadge = isZh ? "HSK 3.0" : "TOEIC Vocab"

  // Load raw data
  const rawWords = useMemo<BonusWord[]>(() => {
    if (slug === "hsk5") {
      return hsk5Raw as BonusWord[]
    }
    return toeicRaw as BonusWord[]
  }, [slug])

  // Favorites
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const favStorageKey = `bonus_fav_${slug}`

  useEffect(() => {
    try {
      const stored = localStorage.getItem(favStorageKey)
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)))
      }
    } catch (e) {
      console.error(e)
    }
  }, [favStorageKey])

  const toggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(favStorageKey, JSON.stringify(Array.from(next)))
      } catch (err) {
        console.error(err)
      }
      return next
    })
  }, [favStorageKey])

  // --- Flashcard Mode State ---
  const [deck, setDeck] = useState<BonusWord[]>(rawWords)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [rememberedIds, setRememberedIds] = useState<Set<string>>(new Set())
  const [forgottenIds, setForgottenIds] = useState<Set<string>>(new Set())
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  // Reset deck when rawWords change
  useEffect(() => {
    setDeck(rawWords)
    setCurrentIndex(0)
    setIsFlipped(false)
    setRememberedIds(new Set())
    setForgottenIds(new Set())
  }, [rawWords])

  const currentCard = deck[currentIndex]

  // Audio helper
  const playAudio = useCallback((text?: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (!text) return
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = isZh ? "zh-CN" : "en-US"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }, [isZh])

  // Next / Prev card
  const handleCardResult = useCallback((remembered: boolean) => {
    if (!currentCard) return
    if (remembered) {
      setRememberedIds(prev => new Set(prev).add(currentCard.id))
      setForgottenIds(prev => {
        const next = new Set(prev)
        next.delete(currentCard.id)
        return next
      })
    } else {
      setForgottenIds(prev => new Set(prev).add(currentCard.id))
      setRememberedIds(prev => {
        const next = new Set(prev)
        next.delete(currentCard.id)
        return next
      })
    }

    setIsFlipped(false)
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentCard, currentIndex, deck.length])

  // Shuffle deck
  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  // Keyboard navigation for Flashcard
  useEffect(() => {
    if (mode !== "flashcard") return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.code === "Space") {
        e.preventDefault()
        setIsFlipped(prev => !prev)
      } else if (e.code === "ArrowRight") {
        e.preventDefault()
        handleCardResult(true)
      } else if (e.code === "ArrowLeft") {
        e.preventDefault()
        handleCardResult(false)
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault()
        setIsFlipped(false)
        setCurrentIndex(0)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mode, handleCardResult])

  // Auto-play feature
  useEffect(() => {
    if (!isAutoPlay || mode !== "flashcard" || !currentCard) return

    playAudio(currentCard.word)

    const flipTimer = setTimeout(() => {
      setIsFlipped(true)
    }, 1500)

    const nextTimer = setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setIsFlipped(false)
        setCurrentIndex(prev => prev + 1)
      } else {
        setIsAutoPlay(false)
      }
    }, 4500)

    return () => {
      clearTimeout(flipTimer)
      clearTimeout(nextTimer)
    }
  }, [isAutoPlay, mode, currentIndex, currentCard, deck.length, playAudio])

  // --- Gallery Mode State ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedPos, setSelectedPos] = useState("all")
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [hidePhonetic, setHidePhonetic] = useState(false)
  const [hideMeaning, setHideMeaning] = useState(false)
  const [galleryPage, setGalleryPage] = useState(0)
  const [selectedDetailWord, setSelectedDetailWord] = useState<BonusWord | null>(null)
  const itemsPerPage = 36

  // Unique topics
  const topics = useMemo(() => {
    const s = new Set<string>()
    rawWords.forEach(w => {
      if (w.topic) s.add(w.topic)
    })
    return Array.from(s)
  }, [rawWords])

  // Filtered gallery words
  const filteredWords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return rawWords.filter(w => {
      if (onlyFavorites && !favorites.has(w.id)) return false
      if (selectedTopic !== "all" && w.topic !== selectedTopic) return false
      if (selectedPos !== "all" && w.partOfSpeech !== selectedPos) return false

      if (q) {
        const matchWord = w.word.toLowerCase().includes(q)
        const matchMean = w.meaning.toLowerCase().includes(q)
        const matchPy = (w.pinyin || w.phonetic || "").toLowerCase().includes(q)
        const matchEx = (w.example || "").toLowerCase().includes(q)
        const matchHv = isZh && w.hanzi ? getHanViet(w.hanzi).toLowerCase().includes(q) : false
        return matchWord || matchMean || matchPy || matchEx || matchHv
      }
      return true
    })
  }, [rawWords, searchQuery, selectedTopic, selectedPos, onlyFavorites, favorites, isZh])

  const totalPages = Math.ceil(filteredWords.length / itemsPerPage)
  const paginatedWords = useMemo(() => {
    const start = galleryPage * itemsPerPage
    return filteredWords.slice(start, start + itemsPerPage)
  }, [filteredWords, galleryPage])

  // Sino-Vietnamese reading for current flashcard
  const currentHanViet = isZh && currentCard?.hanzi ? getHanViet(currentCard.hanzi) : ""

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* 1. Sticky Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/bonus"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-china-paper hover:bg-gray-100 text-china-ink text-xs sm:text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kho Bonus</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isZh ? "bg-china-red/10 text-china-red" : "bg-blue-50 text-blue-700"
              }`}>
                {collectionBadge}
              </span>
              <h1 className="text-base sm:text-xl font-serif font-bold text-china-ink">
                {collectionTitle}
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-muted">
              {rawWords.length} từ vựng · {favorites.size} đã lưu
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-china-paper border border-border p-1 rounded-xl shadow-2xs w-full sm:w-auto">
          <button
            onClick={() => setMode("flashcard")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === "flashcard"
                ? "bg-china-red text-white shadow-xs"
                : "text-muted hover:text-china-ink"
            }`}
          >
            Thẻ Flashcard
          </button>
          <button
            onClick={() => setMode("gallery")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === "gallery"
                ? "bg-china-red text-white shadow-xs"
                : "text-muted hover:text-china-ink"
            }`}
          >
            Thư Viện Thẻ
          </button>
        </div>
      </div>

      {/* 2. MODE: FLASHCARD */}
      {mode === "flashcard" && (
        <div className="space-y-6">
          {/* Progress & Quick Controls Bar */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-medium">
                <span className="text-muted">Tiến độ:</span>
                <span className="font-bold text-china-ink font-mono text-sm sm:text-base">
                  {currentIndex + 1} / {deck.length}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-china-jade/10 text-china-jade font-semibold">
                  {rememberedIds.size} đã nhớ
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-china-red/10 text-china-red font-semibold">
                  {forgottenIds.size} cần ôn
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShuffle}
                  className="px-3 py-1.5 rounded-xl border border-border bg-white hover:bg-china-paper text-xs font-medium text-china-ink transition-colors shadow-2xs"
                >
                  Xáo trộn
                </button>
                <button
                  onClick={() => setIsAutoPlay(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                    isAutoPlay 
                      ? "bg-china-jade text-white" 
                      : "bg-white border border-border text-china-ink hover:bg-china-paper"
                  }`}
                >
                  {isAutoPlay ? "Dừng tự động" : "Tự động đọc"}
                </button>
              </div>
            </div>

            {/* Progress line */}
            <div className="h-2 w-full bg-border/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-china-red to-china-gold transition-all duration-300 rounded-full"
                style={{ width: `${deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* 3D Flashcard Presentation */}
          {currentCard ? (
            <div className="flex flex-col items-center">
              <div
                onClick={() => setIsFlipped(prev => !prev)}
                className="w-full max-w-2xl min-h-[360px] sm:min-h-[420px] rounded-3xl cursor-pointer perspective-1000 select-none transition-transform active:scale-[0.99]"
              >
                <div
                  className={`relative w-full h-full min-h-[360px] sm:min-h-[420px] rounded-3xl border transition-all duration-500 shadow-md ${
                    isFlipped 
                      ? "rotate-y-180 border-china-gold/40 bg-china-paper" 
                      : "border-china-red/30 bg-card hover:border-china-red/50 hover:shadow-lg"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT SIDE */}
                  <div
                    className={`absolute inset-0 p-6 sm:p-10 flex flex-col justify-between backface-hidden ${
                      isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                    } transition-opacity duration-300`}
                  >
                    {/* Top tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-xl border border-china-red/20">
                          {currentCard.category || currentCard.topic || "Từ vựng"}
                        </span>
                        {currentCard.partOfSpeech && (
                          <span className="px-2.5 py-0.5 bg-china-paper border border-border text-muted text-xs font-semibold rounded-lg">
                            {currentCard.partOfSpeech}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => toggleFavorite(currentCard.id, e)}
                          title="Lưu từ yêu thích"
                          className="p-2 text-muted hover:text-amber-500 transition-colors"
                        >
                          <Star className={`w-5 h-5 ${favorites.has(currentCard.id) ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>
                        <button
                          onClick={(e) => playAudio(currentCard.word, e)}
                          title="Phát âm"
                          className="p-2 text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
                        >
                          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Word Center */}
                    <div className="text-center my-auto py-6">
                      <h2 className={`font-serif font-bold text-china-ink leading-tight mb-3 ${
                        isZh 
                          ? "text-6xl sm:text-7xl md:text-8xl" 
                          : "text-3xl sm:text-5xl md:text-6xl font-sans"
                      }`}>
                        {currentCard.word}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted">
                        Bấm hoặc nhấn phím <kbd className="px-2 py-0.5 bg-china-paper border border-border rounded font-mono text-[11px]">Space</kbd> để lật xem đáp án
                      </p>
                    </div>

                    {/* Hint bottom */}
                    <div className="flex items-center justify-between text-xs text-muted/80 border-t border-border/60 pt-3">
                      <span>Thẻ #{currentCard.stt}</span>
                      <span className="text-china-red font-medium">Bấm để lật ↺</span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className={`absolute inset-0 p-6 sm:p-10 flex flex-col justify-between backface-hidden ${
                      isFlipped ? "opacity-100" : "pointer-events-none opacity-0"
                    } transition-opacity duration-300`}
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    {/* Top tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-2xl sm:text-3xl font-medium tracking-wide ${
                          isZh ? "text-china-red font-mono" : "text-blue-600 font-sans"
                        }`}>
                          {currentCard.pinyin || currentCard.phonetic}
                        </span>
                        {currentHanViet && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-bold tracking-wide">
                            Hán-Việt: {currentHanViet}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => playAudio(currentCard.word, e)}
                        title="Nghe phát âm"
                        className="p-2 text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
                      >
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>

                    {/* Meaning in Center */}
                    <div className="my-auto py-4 space-y-4 text-center">
                      <div className="bg-white/80 p-4 rounded-2xl border border-border shadow-2xs max-w-lg mx-auto">
                        <p className="text-xs uppercase tracking-wider text-muted font-bold mb-1">Nghĩa tiếng Việt</p>
                        <p className="text-xl sm:text-2xl font-bold text-china-ink leading-snug">
                          {currentCard.meaning}
                        </p>
                      </div>

                      {/* Example sentence if available */}
                      {currentCard.example && (
                        <div className="bg-white/60 p-4 rounded-2xl border border-border/80 text-left max-w-lg mx-auto space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-wider text-muted font-bold">
                              Ví dụ minh họa
                            </span>
                            <button
                              onClick={(e) => playAudio(currentCard.example, e)}
                              className="p-1 text-china-red hover:bg-china-red/10 rounded-md transition-colors"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className={`text-china-ink font-medium ${isZh ? "text-base font-serif" : "text-sm"}`}>
                            {currentCard.example}
                          </p>
                          {currentCard.examplePinyin && (
                            <p className="text-xs text-china-red/80 italic font-mono">
                              {currentCard.examplePinyin}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom notes */}
                    <div className="flex items-center justify-between text-xs text-muted border-t border-border/60 pt-3">
                      <span>Loại từ: {currentCard.partOfSpeech || "Chung"}</span>
                      <span className="text-china-gold font-medium">Space để lật lại ↺</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Again vs Remembered */}
              <div className="w-full max-w-2xl mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCardResult(false)}
                  className="flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm sm:text-base transition-all shadow-xs active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Chưa nhớ (←)</span>
                </button>

                <button
                  onClick={() => handleCardResult(true)}
                  className="flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl border border-china-jade/30 bg-china-jade hover:bg-china-jade/90 text-white font-bold text-sm sm:text-base transition-all shadow-xs active:scale-95"
                >
                  <span>Đã nhớ (→)</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border border-border p-8">
              <h3 className="text-2xl font-serif font-bold text-china-ink mb-2">Đã hoàn thành bộ thẻ!</h3>
              <p className="text-sm text-muted mb-6">Bạn đã xem hết toàn bộ thẻ từ vựng trong bộ tài liệu này.</p>
              <button
                onClick={() => {
                  setCurrentIndex(0)
                  setIsFlipped(false)
                }}
                className="px-6 py-2.5 rounded-xl bg-china-red text-white text-sm font-semibold hover:bg-china-red-hover transition-colors shadow-xs"
              >
                Luyện lại từ đầu
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. MODE: GALLERY GRID */}
      {mode === "gallery" && (
        <div className="space-y-6">
          {/* Controls & Search Bar */}
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setGalleryPage(0)
                  }}
                  placeholder={isZh ? "Tìm chữ Hán, Pinyin, Hán-Việt, nghĩa..." : "Tìm từ tiếng Anh, IPA, nghĩa..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red transition-colors"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setHidePhonetic(p => !p)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    hidePhonetic
                      ? "bg-china-red text-white border-china-red"
                      : "bg-white border-border text-china-ink hover:bg-china-paper"
                  }`}
                >
                  {hidePhonetic ? "Hiện phiên âm" : "Ẩn phiên âm"}
                </button>

                <button
                  onClick={() => setHideMeaning(m => !m)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    hideMeaning
                      ? "bg-china-red text-white border-china-red"
                      : "bg-white border-border text-china-ink hover:bg-china-paper"
                  }`}
                >
                  {hideMeaning ? "Hiện nghĩa" : "Ẩn nghĩa"}
                </button>

                <button
                  onClick={() => {
                    setOnlyFavorites(f => !f)
                    setGalleryPage(0)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                    onlyFavorites
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white border-border text-china-ink hover:bg-china-paper"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-white" : ""}`} />
                  <span>Đã lưu ({favorites.size})</span>
                </button>
              </div>
            </div>

            {/* Filter Pills for Topics */}
            {topics.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
                <span className="text-muted font-bold shrink-0">Chủ đề:</span>
                <button
                  onClick={() => {
                    setSelectedTopic("all")
                    setGalleryPage(0)
                  }}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedTopic === "all"
                      ? "bg-china-ink text-white"
                      : "bg-china-paper text-china-ink hover:bg-gray-200"
                  }`}
                >
                  Tất cả ({rawWords.length})
                </button>
                {topics.map(t => {
                  const count = rawWords.filter(w => w.topic === t).length
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTopic(t)
                        setGalleryPage(0)
                      }}
                      className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        selectedTopic === t
                          ? "bg-china-ink text-white"
                          : "bg-china-paper text-china-ink hover:bg-gray-200"
                      }`}
                    >
                      {t} ({count})
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedWords.map(word => {
              const wordHanViet = isZh && word.hanzi ? getHanViet(word.hanzi) : ""
              const isFav = favorites.has(word.id)

              return (
                <div
                  key={word.id}
                  onClick={() => setSelectedDetailWord(word)}
                  className="bg-card rounded-2xl border border-border p-4 shadow-2xs hover:shadow-md hover:border-china-red/40 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {word.partOfSpeech && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-china-paper border border-border text-muted">
                            {word.partOfSpeech}
                          </span>
                        )}
                        {word.topic && (
                          <span className="text-[10px] text-muted truncate max-w-[120px]" title={word.topic}>
                            {word.topic}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => toggleFavorite(word.id, e)}
                          title="Lưu từ yêu thích"
                          className="p-1 text-muted hover:text-amber-500 transition-colors"
                        >
                          <Star className={`w-4 h-4 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>
                        <button
                          onClick={(e) => playAudio(word.word, e)}
                          title="Nghe phát âm"
                          className="p-1 text-muted hover:text-china-red transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Word Presentation */}
                    <div className="mb-2">
                      <h3 className={`font-serif font-bold text-china-ink group-hover:text-china-red transition-colors select-all ${
                        isZh ? "text-3xl" : "text-xl font-sans"
                      }`}>
                        {word.word}
                      </h3>

                      {/* Phonetic & Hán-Việt */}
                      {!hidePhonetic ? (
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <span className={`text-xs font-medium ${isZh ? "text-china-red font-mono" : "text-blue-600 font-sans"}`}>
                            {word.pinyin || word.phonetic}
                          </span>
                          {wordHanViet && (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.2 rounded font-medium">
                              {wordHanViet}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="h-4 my-1 bg-border/40 rounded w-20 animate-pulse" />
                      )}
                    </div>

                    {/* Meaning */}
                    {!hideMeaning ? (
                      <p className="text-xs text-china-ink/90 font-medium line-clamp-2 leading-relaxed">
                        {word.meaning}
                      </p>
                    ) : (
                      <div className="h-4 bg-border/40 rounded w-full animate-pulse" />
                    )}
                  </div>

                  {/* Card bottom hint */}
                  <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[11px] text-muted">
                    <span>#{word.stt}</span>
                    <span className="group-hover:text-china-red transition-colors">Xem chi tiết →</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {filteredWords.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-muted font-medium bg-card rounded-2xl border border-border">
              <p>Không tìm thấy từ vựng nào khớp với bộ lọc.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-6">
              <button
                disabled={galleryPage === 0}
                onClick={() => {
                  setGalleryPage(p => Math.max(0, p - 1))
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-china-ink disabled:opacity-40 hover:bg-china-paper transition-colors shadow-2xs"
              >
                Trước
              </button>

              <div className="flex items-center gap-1 mx-2">
                {[...Array(totalPages)].map((_, i) => {
                  if (i === 0 || i === totalPages - 1 || (i >= galleryPage - 1 && i <= galleryPage + 1)) {
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setGalleryPage(i)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                          galleryPage === i 
                            ? "bg-china-red text-white" 
                            : "bg-white border border-border text-china-ink hover:bg-china-paper"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  }
                  if (i === galleryPage - 2 || i === galleryPage + 2) {
                    return <span key={i} className="text-muted text-xs">...</span>
                  }
                  return null
                })}
              </div>

              <button
                disabled={galleryPage === totalPages - 1}
                onClick={() => {
                  setGalleryPage(p => Math.min(totalPages - 1, p + 1))
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-china-ink disabled:opacity-40 hover:bg-china-paper transition-colors shadow-2xs"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Word Detail Modal */}
      <BonusWordDetailModal
        word={selectedDetailWord}
        isOpen={Boolean(selectedDetailWord)}
        onClose={() => setSelectedDetailWord(null)}
        isFavorite={selectedDetailWord ? favorites.has(selectedDetailWord.id) : false}
        onToggleFavorite={toggleFavorite}
      />

    </div>
  )
}
