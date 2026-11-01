"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import {
  BookOpen,
  Search,
  Filter,
  Volume2,
  VolumeX,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Star,
  Check,
  Copy,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  Layers,
  SlidersHorizontal,
} from "lucide-react"
import { playChineseAudio } from "@/utils/audioTts"
import { GrammarPoint } from "@/types/grammar"

const HSK_LEVELS = [
  { label: "Tất cả", value: "all" },
  { label: "HSK 1", value: "1" },
  { label: "HSK 2", value: "2" },
  { label: "HSK 3", value: "3" },
  { label: "HSK 4", value: "4" },
  { label: "HSK 5", value: "5" },
  { label: "HSK 6", value: "6" },
]

const QUICK_TAGS = [
  { label: "把 (ba)", query: "把" },
  { label: "被 (bèi)", query: "被" },
  { label: "比 (bǐ - so sánh)", query: "比" },
  { label: "了 (le - hoàn thành)", query: "了" },
  { label: "得 (de - bổ ngữ)", query: "得" },
  { label: "着 (zhe - tiếp diễn)", query: "着" },
  { label: "是…的 (nhấn mạnh)", query: "是" },
  { label: "越…越…", query: "越" },
  { label: "一边…一边…", query: "一边" },
  { label: "不但…而且…", query: "不但" },
]

const LEVEL_COLORS: Record<number, { badge: string; text: string }> = {
  1: { badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25", text: "text-emerald-600 dark:text-emerald-400" },
  2: { badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25", text: "text-teal-600 dark:text-teal-400" },
  3: { badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25", text: "text-sky-600 dark:text-sky-400" },
  4: { badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25", text: "text-indigo-600 dark:text-indigo-400" },
  5: { badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25", text: "text-amber-600 dark:text-amber-400" },
  6: { badge: "bg-china-red/10 text-china-red border-china-red/25", text: "text-china-red" },
}

export default function GrammarPage() {
  const [grammarList, setGrammarList] = useState<GrammarPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "saved" | "mastered" | "quiz">("all")

  // Study Mode Toggles
  const [showPinyin, setShowPinyin] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)

  // Saved (Bookmarked) & Mastered (Learned) stored in localStorage
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())

  // Audio playing & copy feedback state
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Load initial data
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

    // Restore bookmarks and mastered list from localStorage
    try {
      const saved = localStorage.getItem("hsk_grammar_saved_ids")
      if (saved) setSavedIds(new Set(JSON.parse(saved)))
      const mastered = localStorage.getItem("hsk_grammar_mastered_ids")
      if (mastered) setMasteredIds(new Set(JSON.parse(mastered)))
    } catch {}
  }, [])

  // Listen to window scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle bookmark / saved
  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem("hsk_grammar_saved_ids", JSON.stringify(Array.from(next)))
      } catch {}
      return next
    })
  }, [])

  // Toggle mastered
  const toggleMastered = useCallback((id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem("hsk_grammar_mastered_ids", JSON.stringify(Array.from(next)))
      } catch {}
      return next
    })
  }, [])

  // Audio Playback
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

  // Level counts for badges
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = { all: grammarList.length }
    for (const item of grammarList) {
      const key = String(item.level)
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [grammarList])

  // Filtered List
  const filteredGrammar = useMemo(() => {
    return grammarList.filter((item) => {
      // 1. Filter by Level
      if (selectedLevel !== "all" && item.level !== parseInt(selectedLevel, 10)) {
        return false
      }
      // 2. Filter by Status Tab
      if (statusFilter === "saved" && !savedIds.has(item.id)) return false
      if (statusFilter === "mastered" && !masteredIds.has(item.id)) return false
      if (statusFilter === "quiz" && (!item.quiz || item.quiz.length === 0)) return false

      // 3. Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchTitleVi = item.titleVi.toLowerCase().includes(q)
        const matchStructure = item.structure?.toLowerCase().includes(q)
        const matchUsedFor = item.usedFor?.toLowerCase().includes(q)
        const matchExplanation = item.explanation?.toLowerCase().includes(q)
        const matchExample = item.examples?.some(
          (ex) =>
            ex.chinese.includes(q) ||
            ex.pinyin.toLowerCase().includes(q) ||
            ex.translation.toLowerCase().includes(q)
        )
        return (
          matchTitle ||
          matchTitleVi ||
          matchStructure ||
          matchUsedFor ||
          matchExplanation ||
          matchExample
        )
      }
      return true
    })
  }, [grammarList, selectedLevel, statusFilter, savedIds, masteredIds, searchQuery])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLevel, statusFilter, searchQuery, itemsPerPage])

  // Pagination calculation
  const totalPages = Math.ceil(filteredGrammar.length / itemsPerPage)
  const paginatedGrammar = useMemo(() => {
    if (itemsPerPage >= 999) return filteredGrammar
    const start = (currentPage - 1) * itemsPerPage
    return filteredGrammar.slice(start, start + itemsPerPage)
  }, [filteredGrammar, currentPage, itemsPerPage])

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6 md:py-10 text-china-ink">
      {/* ================================================================= */}
      {/* 1. Header Banner & Motivational Stats                             */}
      {/* ================================================================= */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3.5 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-full border border-china-red/20 flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> 510 điểm ngữ pháp HSK 1 - 6 chuẩn hóa 100%
          </span>
          <span className="text-xs text-muted flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Chuẩn AllSet Learning & Khung HSK 3.0
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-china-red tracking-wide flex items-center gap-3">
              Sổ Tay Ngữ Pháp Tiếng Trung
            </h1>
            <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
              Hệ thống toàn diện công thức, cách dùng, câu ví dụ phát âm chuẩn bản ngữ và bài tập trắc nghiệm củng cố từ cơ bản đến cao cấp.
            </p>
          </div>

          {/* Quick Learning Stats */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="px-3.5 py-2 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-2xs">
              <Layers className="w-4 h-4 text-china-red" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted">Tổng số</p>
                <p className="text-sm font-bold font-mono text-china-ink">{grammarList.length}</p>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-2xs">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted">Đã lưu</p>
                <p className="text-sm font-bold font-mono text-china-ink">{savedIds.size}</p>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted">Đã nắm vững</p>
                <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {masteredIds.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. Search & Filter Bar                                            */}
      {/* ================================================================= */}
      <div className="space-y-4 mb-6">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo chữ Hán (把, 被, 了...), Pinyin (bǎ, bèi...), tiêu đề tiếng Việt hoặc ví dụ..."
            className="w-full pl-12 pr-16 py-3.5 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:border-china-red transition-all shadow-xs text-china-ink placeholder:text-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-china-ink px-2 py-1 rounded-lg bg-border/40 hover:bg-border/60 transition-colors font-medium"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Quick Tag Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-muted font-bold whitespace-nowrap shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-china-red" /> Gợi ý:
          </span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.query}
              onClick={() => setSearchQuery(tag.query)}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap border transition-all text-xs ${
                searchQuery === tag.query
                  ? "bg-china-red text-white border-china-red font-bold"
                  : "bg-card border-border text-muted hover:text-china-ink hover:border-china-red/40"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* HSK Level Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {HSK_LEVELS.map((lvl) => {
            const isActive = selectedLevel === lvl.value
            const count = levelCounts[lvl.value] || 0
            return (
              <button
                key={lvl.value}
                onClick={() => setSelectedLevel(lvl.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                  isActive
                    ? "bg-china-red text-white scale-102 shadow-china-red/20"
                    : "bg-card border border-border text-muted hover:text-china-ink hover:border-china-red/30"
                }`}
              >
                <span>{lvl.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-border/50 text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Status Tabs + Study Mode Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border/50">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                statusFilter === "all"
                  ? "bg-china-ink text-card dark:bg-card dark:text-china-ink border border-border shadow-2xs"
                  : "text-muted hover:text-china-ink hover:bg-border/30"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("saved")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                statusFilter === "saved"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold"
                  : "text-muted hover:text-china-ink hover:bg-border/30"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Đã lưu ({savedIds.size})
            </button>
            <button
              onClick={() => setStatusFilter("mastered")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                statusFilter === "mastered"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                  : "text-muted hover:text-china-ink hover:bg-border/30"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Đã nắm ({masteredIds.size})
            </button>
            <button
              onClick={() => setStatusFilter("quiz")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                statusFilter === "quiz"
                  ? "bg-china-red/15 text-china-red border border-china-red/30 font-bold"
                  : "text-muted hover:text-china-ink hover:bg-border/30"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-china-red" /> Có bài tập
            </button>
          </div>

          {/* Study Mode Toolbar */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Toggle Pinyin */}
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs ${
                showPinyin
                  ? "bg-card border-border text-china-ink"
                  : "bg-china-red/10 border-china-red/30 text-china-red font-semibold"
              }`}
              title={showPinyin ? "Nhấn để ẩn Pinyin" : "Nhấn để hiện Pinyin"}
            >
              {showPinyin ? <Eye className="w-3.5 h-3.5 text-muted" /> : <EyeOff className="w-3.5 h-3.5 text-china-red" />}
              <span>{showPinyin ? "Pinyin: Bật" : "Pinyin: Tắt"}</span>
            </button>

            {/* Toggle Translation */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs ${
                showTranslation
                  ? "bg-card border-border text-china-ink"
                  : "bg-china-red/10 border-china-red/30 text-china-red font-semibold"
              }`}
              title={showTranslation ? "Nhấn để ẩn nghĩa tiếng Việt" : "Nhấn để hiện nghĩa tiếng Việt"}
            >
              {showTranslation ? <Eye className="w-3.5 h-3.5 text-muted" /> : <EyeOff className="w-3.5 h-3.5 text-china-red" />}
              <span>{showTranslation ? "Dịch: Bật" : "Dịch: Tắt"}</span>
            </button>

          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. Results Header & Count                                         */}
      {/* ================================================================= */}
      <div className="flex items-center justify-between text-xs text-muted mb-4 px-1">
        <div>
          Tìm thấy <strong className="text-china-red font-mono text-sm">{filteredGrammar.length}</strong> điểm ngữ pháp
          {selectedLevel !== "all" && <span> • HSK {selectedLevel}</span>}
          {statusFilter !== "all" && (
            <span className="capitalize">
              {" "}• Lọc: {statusFilter === "saved" ? "Đã lưu" : statusFilter === "mastered" ? "Đã nắm" : "Có bài tập"}
            </span>
          )}
        </div>

        {/* Per page selector */}
        <div className="flex items-center gap-2">
          <span>Hiển thị:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
            className="bg-card border border-border text-xs rounded-lg px-2 py-1 text-china-ink focus:outline-none focus:border-china-red"
          >
            <option value={10}>10 / trang</option>
            <option value={15}>15 / trang</option>
            <option value={30}>30 / trang</option>
            <option value={999}>Tất cả ({filteredGrammar.length})</option>
          </select>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. Loading & Empty State                                          */}
      {/* ================================================================= */}
      {loading ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-china-red/30 border-t-china-red rounded-full animate-spin" />
          <p className="text-sm text-china-ink font-semibold">Đang chuẩn bị sổ tay ngữ pháp...</p>
          <p className="text-xs text-muted">Đang tải và chuẩn hóa 510 điểm ngữ pháp HSK</p>
        </div>
      ) : filteredGrammar.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-3xl p-8 shadow-xs">
          <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-base text-china-ink">Không tìm thấy điểm ngữ pháp phù hợp</h3>
          <p className="text-xs text-muted mt-1 max-w-md mx-auto">
            Không có kết quả nào cho từ khóa hoặc bộ lọc đã chọn. Hãy thử tìm chữ Hán khác hoặc đổi bộ lọc.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedLevel("all")
              setStatusFilter("all")
            }}
            className="mt-4 px-4 py-2 bg-china-red text-white text-xs font-bold rounded-xl shadow-xs hover:bg-china-red-hover transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        /* ================================================================= */
        /* 5. Grammar Cards List                                             */
        /* ================================================================= */
        <div className="space-y-4">
          {paginatedGrammar.map((item) => {
            const isSaved = savedIds.has(item.id)
            const isMastered = masteredIds.has(item.id)
            const levelStyle = LEVEL_COLORS[item.level] || LEVEL_COLORS[1]
            const usedForParts = item.usedFor ? item.usedFor.split(",").map((s) => s.trim()).filter(Boolean) : []
            const firstExample = item.examples && item.examples.length > 0 ? item.examples[0] : null
            const displayTitle = item.titleVi || item.title

            return (
              <div
                key={item.id}
                id={`grammar-${item.id}`}
                className={`bg-card border rounded-3xl p-5 md:p-6 shadow-xs transition-all ${
                  isMastered
                    ? "border-emerald-500/30 bg-emerald-500/2 dark:bg-emerald-500/5"
                    : isSaved
                    ? "border-amber-500/30 bg-amber-500/2 dark:bg-amber-500/5"
                    : "border-border hover:border-china-red/35 hover:shadow-sm"
                }`}
              >
                {/* 5.1 Card Top: Level Badge + Title + Action Buttons */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {/* Level Badge */}
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border uppercase tracking-wider ${levelStyle.badge}`}
                      >
                        HSK {item.level}
                      </span>

                      {/* Examples Count Badge */}
                      {item.examples && item.examples.length > 0 && (
                        <span className="px-2 py-0.5 bg-border/40 text-muted text-[11px] font-semibold rounded-md border border-border flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-china-red" /> {item.examples.length} ví dụ
                        </span>
                      )}

                      {/* Quiz Tag */}
                      {item.quiz && item.quiz.length > 0 && (
                        <span className="px-2 py-0.5 bg-china-red/10 text-china-red text-[11px] font-bold rounded-md border border-china-red/20 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> {item.quiz.length} bài tập
                        </span>
                      )}

                      {/* Mastered Status Indicator */}
                      {isMastered && (
                        <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-md border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Đã thuộc
                        </span>
                      )}
                    </div>

                    {/* Vietnamese Title - Click to open detail page */}
                    <Link
                      href={`/grammar/${item.id}`}
                      className="group/title inline-block mt-0.5"
                    >
                      <h2 className="text-lg md:text-xl font-bold font-serif text-china-ink group-hover/title:text-china-red transition-colors flex items-center gap-2">
                        <span>{displayTitle}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-china-red shrink-0" />
                      </h2>
                    </Link>
                  </div>

                  {/* Actions: Save / Mastered / Direct Link */}
                  <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
                    {/* Star / Bookmark Button */}
                    <button
                      type="button"
                      onClick={() => toggleSave(item.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isSaved
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                          : "bg-card border-border text-muted hover:text-amber-500 hover:border-amber-500/30"
                      }`}
                      title={isSaved ? "Bỏ lưu điểm này" : "Lưu điểm ngữ pháp này"}
                    >
                      <Star className={`w-4 h-4 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>

                    {/* Mastered Button */}
                    <button
                      type="button"
                      onClick={() => toggleMastered(item.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isMastered
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "bg-card border-border text-muted hover:text-emerald-600 hover:border-emerald-500/30"
                      }`}
                      title={isMastered ? "Đánh dấu chưa thuộc" : "Đánh dấu đã nắm vững"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {/* Link to detail page */}
                    <Link
                      href={`/grammar/${item.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-china-red/30 bg-china-red/5 hover:bg-china-red hover:text-white text-xs font-semibold text-china-red transition-all"
                      title="Xem toàn bộ bài học & bài tập"
                    >
                      <span>Chi tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* 5.2 Structure Formula Box */}
                {item.structure && (
                  <div className="mb-3 p-3 md:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 overflow-hidden">
                    <div className="flex items-center gap-2.5 overflow-x-auto text-xs md:text-sm font-mono text-china-ink font-semibold">
                      <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 font-sans text-xs uppercase tracking-wider">
                        Công thức:
                      </span>
                      <span className="text-china-red font-bold tracking-wide">{item.structure}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.structure, `struct_${item.id}`)}
                      className="p-1.5 rounded-lg border border-border bg-card/80 hover:bg-card text-muted hover:text-china-ink shrink-0 transition-colors"
                      title="Sao chép công thức"
                    >
                      {copiedKey === `struct_${item.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* 5.3 Usage Tags (Used for) */}
                {usedForParts.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Mục đích:</span>
                    {usedForParts.map((uf, ufIdx) => (
                      <span
                        key={ufIdx}
                        className="px-2.5 py-0.5 rounded-full bg-border/40 border border-border/80 text-[11px] font-medium text-china-ink"
                      >
                        {uf}
                      </span>
                    ))}
                  </div>
                )}

                {/* 5.4 Featured Example Preview (Clean & Compact) */}
                {firstExample && (
                  <div className="mt-3 p-3 rounded-2xl bg-border/20 border border-transparent hover:border-border/60 transition-all flex items-start justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-china-red tracking-wider">Ví dụ tiêu biểu:</span>
                      </div>
                      <p className="text-base font-bold text-china-ink font-serif leading-snug tracking-wide" lang="zh">
                        {firstExample.chinese}
                      </p>
                      {showPinyin && (
                        <p className="text-xs font-mono text-china-red font-medium">
                          {firstExample.pinyin}
                        </p>
                      )}
                      {showTranslation && (
                        <p className="text-xs text-china-ink/80 leading-relaxed font-sans">
                          {firstExample.translation}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleSpeak(firstExample.chinese)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                          playingAudio === firstExample.chinese
                            ? "bg-china-red text-white border-china-red scale-105"
                            : "border-border bg-card hover:bg-china-red hover:text-white hover:border-china-red text-muted"
                        }`}
                        title="Nghe phát âm chuẩn HD"
                      >
                        <Volume2 className={`w-4 h-4 ${playingAudio === firstExample.chinese ? "animate-pulse" : ""}`} />
                      </button>
                    </div>
                  </div>
                )}

                {/* 5.5 Card Footer: Summary & Call to Action Button */}
                <div className="mt-3 pt-3 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xs text-muted">
                    {item.examples?.length || 0} câu ví dụ kèm phát âm HD
                    {item.quiz?.length ? ` • ${item.quiz.length} câu trắc nghiệm` : ""}
                  </span>

                  <Link
                    href={`/grammar/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-china-red text-white text-xs font-bold hover:bg-china-red/90 transition-all shadow-xs group"
                  >
                    <span>Học chi tiết & Luyện tập</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/* 6. Pagination Navigation                                          */}
      {/* ================================================================= */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-border rounded-2xl shadow-xs">
          <p className="text-xs text-muted">
            Trang <strong className="text-china-ink">{currentPage}</strong> / {totalPages} (Tổng{" "}
            {filteredGrammar.length} điểm)
          </p>

          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1))
                scrollToTop()
              }}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-china-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-border/30 transition-colors"
            >
              Trước
            </button>

            {/* Page number buttons */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = idx + 1
              } else if (currentPage <= 3) {
                pageNum = idx + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx
              } else {
                pageNum = currentPage - 2 + idx
              }

              const isCurrent = currentPage === pageNum
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum)
                    scrollToTop()
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-china-red text-white shadow-china-red/20"
                      : "bg-card border border-border text-muted hover:text-china-ink hover:border-china-red/30"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            {/* Next Button */}
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1))
                scrollToTop()
              }}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-china-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-border/30 transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-china-red text-white shadow-lg shadow-china-red/30 hover:scale-105 active:scale-95 transition-all z-30"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
