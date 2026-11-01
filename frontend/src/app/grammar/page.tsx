"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import {
  BookOpen,
  Search,
  Filter,
  Volume2,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Star,
  Check,
  Copy,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  Bookmark,
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
      if (selectedLevel !== "all" && item.level !== parseInt(selectedLevel, 10)) {
        return false
      }
      if (statusFilter === "saved" && !savedIds.has(item.id)) return false
      if (statusFilter === "mastered" && !masteredIds.has(item.id)) return false
      if (statusFilter === "quiz" && (!item.quiz || item.quiz.length === 0)) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = item.title?.toLowerCase().includes(q)
        const matchTitleVi = item.titleVi?.toLowerCase().includes(q)
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-8 md:py-10 text-china-ink pb-24">
      {/* 1. Header Banner */}
      <div className="mb-8 border-b border-border/60 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-bold tracking-widest text-china-red uppercase">
            HSK GRAMMAR SYLLABUS
          </span>
          <span className="text-muted/40">•</span>
          <span className="text-xs text-muted">510 điểm ngữ pháp chuẩn HSK 1 - 6</span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-china-ink tracking-tight">
          Sổ Tay Ngữ Pháp Tiếng Trung
        </h1>
        <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
          Tra cứu công thức chuẩn, giải thích cấu trúc và luyện tập qua từng câu ví dụ thực tế. Nhấn vào tiêu đề ngữ pháp để vào trang học chi tiết.
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-4 mb-8">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo chữ Hán (把, 被, 了...), Pinyin hoặc tên mẫu câu..."
            className="w-full pl-10 pr-10 py-2.5 bg-card border border-border rounded-lg text-sm text-china-ink placeholder:text-muted/70 focus:outline-none focus:border-china-red focus:ring-1 focus:ring-china-red/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-china-ink px-1"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-muted scrollbar-none">
          <span className="shrink-0 font-medium text-[11px] uppercase tracking-wider text-muted/80 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-china-red" /> Gợi ý:
          </span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.query}
              onClick={() => setSearchQuery(tag.query)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors text-xs ${
                searchQuery === tag.query
                  ? "bg-china-red text-white font-medium"
                  : "bg-neutral-100 dark:bg-neutral-800 text-muted hover:text-china-ink"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Level Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/60">
          {HSK_LEVELS.map((lvl) => {
            const isActive = selectedLevel === lvl.value
            const count = levelCounts[lvl.value] || 0
            return (
              <button
                key={lvl.value}
                onClick={() => setSelectedLevel(lvl.value)}
                className={`px-3 py-2 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors border-b-2 -mb-px ${
                  isActive
                    ? "border-china-red text-china-red"
                    : "border-transparent text-muted hover:text-china-ink"
                }`}
              >
                <span>{lvl.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? "bg-china-red/10 text-china-red font-bold" : "bg-neutral-100 dark:bg-neutral-800 text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filter Tabs & Display Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "all"
                  ? "bg-china-ink text-card dark:bg-white dark:text-neutral-900 font-bold"
                  : "text-muted hover:text-china-ink"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("saved")}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                statusFilter === "saved"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
                  : "text-muted hover:text-china-ink"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Đã lưu ({savedIds.size})
            </button>
            <button
              onClick={() => setStatusFilter("mastered")}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                statusFilter === "mastered"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-muted hover:text-china-ink"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Đã nắm vững ({masteredIds.size})
            </button>
            <button
              onClick={() => setStatusFilter("quiz")}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                statusFilter === "quiz"
                  ? "bg-china-red/15 text-china-red font-bold"
                  : "text-muted hover:text-china-ink"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-china-red" /> Có bài tập
            </button>
          </div>

          {/* Toggle Pinyin & Translation */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                showPinyin
                  ? "bg-neutral-100 dark:bg-neutral-800 text-china-ink"
                  : "text-muted hover:text-china-ink"
              }`}
            >
              {showPinyin ? <Eye className="w-3 h-3 text-muted" /> : <EyeOff className="w-3 h-3 text-china-red" />}
              <span>{showPinyin ? "Pinyin" : "Ẩn Pinyin"}</span>
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                showTranslation
                  ? "bg-neutral-100 dark:bg-neutral-800 text-china-ink"
                  : "text-muted hover:text-china-ink"
              }`}
            >
              {showTranslation ? <Eye className="w-3 h-3 text-muted" /> : <EyeOff className="w-3 h-3 text-china-red" />}
              <span>{showTranslation ? "Nghĩa" : "Ẩn Nghĩa"}</span>
            </button>

            <div className="h-3 w-px bg-border/60 mx-1" />

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
              className="bg-transparent border-0 text-[11px] text-muted focus:outline-none cursor-pointer"
            >
              <option value={10}>10 mục</option>
              <option value={15}>15 mục</option>
              <option value={30}>30 mục</option>
              <option value={999}>Tất cả</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Results count summary */}
      <div className="flex items-center justify-between text-xs text-muted mb-4 px-1">
        <span>
          Tìm thấy <strong className="text-china-red font-mono font-bold">{filteredGrammar.length}</strong> điểm ngữ pháp
          {selectedLevel !== "all" && <span> • Cấp độ HSK {selectedLevel}</span>}
        </span>
      </div>

      {/* 4. Loading & Empty State */}
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-china-red/30 border-t-china-red rounded-full animate-spin" />
          <p className="text-xs text-muted">Đang tải sổ tay ngữ pháp...</p>
        </div>
      ) : filteredGrammar.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl p-8">
          <HelpCircle className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
          <h3 className="font-bold text-sm text-china-ink">Không tìm thấy điểm ngữ pháp phù hợp</h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            Không có kết quả nào cho từ khóa hoặc bộ lọc đã chọn. Hãy thử tìm từ khóa khác.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedLevel("all")
              setStatusFilter("all")
            }}
            className="mt-4 px-3.5 py-1.5 bg-china-red text-white text-xs font-semibold rounded-lg hover:bg-china-red/90 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" /> Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        /* 5. Minimalist Creative Cards List */
        <div className="space-y-3.5">
          {paginatedGrammar.map((item) => {
            const isSaved = savedIds.has(item.id)
            const isMastered = masteredIds.has(item.id)
            const usedForParts = item.usedFor ? item.usedFor.split(",").map((s) => s.trim()).filter(Boolean) : []
            const firstExample = item.examples && item.examples.length > 0 ? item.examples[0] : null
            const displayTitle = item.titleVi || item.title

            return (
              <div
                key={item.id}
                id={`grammar-${item.id}`}
                className="group/card bg-card border border-border/80 rounded-xl p-5 hover:border-china-red/50 hover:shadow-xs transition-all duration-200"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Meta line: Level & tags */}
                    <div className="flex items-center gap-2 text-xs text-muted mb-1 flex-wrap">
                      <span className="font-mono font-bold text-china-red tracking-wider">
                        HSK {item.level}
                      </span>
                      <span className="text-muted/40">•</span>
                      <span>{item.examples?.length || 0} ví dụ</span>
                      {item.quiz && item.quiz.length > 0 && (
                        <>
                          <span className="text-muted/40">•</span>
                          <span className="text-china-red font-medium flex items-center gap-0.5">
                            <HelpCircle className="w-3 h-3" /> {item.quiz.length} bài tập
                          </span>
                        </>
                      )}
                      {isMastered && (
                        <>
                          <span className="text-muted/40">•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Đã thuộc
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title - Click to open detail page */}
                    <Link
                      href={`/grammar/${item.id}`}
                      className="group/link inline-block"
                    >
                      <h2 className="text-base md:text-lg font-serif font-bold text-china-ink group-hover/link:text-china-red transition-colors flex items-center gap-1.5">
                        <span>{displayTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-china-red shrink-0" />
                      </h2>
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleSave(item.id)}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        isSaved
                          ? "text-amber-500 bg-amber-500/10"
                          : "text-muted/60 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      title={isSaved ? "Bỏ lưu điểm này" : "Lưu điểm ngữ pháp này"}
                    >
                      <Star className={`w-4 h-4 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleMastered(item.id)}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        isMastered
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-muted/60 hover:text-emerald-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      title={isMastered ? "Đánh dấu chưa thuộc" : "Đánh dấu đã nắm vững"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Structure Formula Bar */}
                {item.structure && (
                  <div className="mt-2.5 px-3 py-2 bg-neutral-50 dark:bg-neutral-900/60 rounded-lg border-l-2 border-china-red flex items-center justify-between gap-3 overflow-hidden text-xs font-mono">
                    <div className="flex items-center gap-2 overflow-x-auto text-china-ink">
                      <span className="text-[10px] uppercase font-bold text-muted tracking-wider shrink-0 font-sans">
                        Công thức:
                      </span>
                      <span className="font-semibold text-china-ink">{item.structure}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.structure, `struct_${item.id}`)}
                      className="p-1 text-muted hover:text-china-ink transition-colors shrink-0"
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

                {/* Purpose text */}
                {usedForParts.length > 0 && (
                  <p className="mt-2 text-xs text-muted">
                    <span className="font-medium text-muted/80">Mục đích:</span>{" "}
                    <span className="text-china-ink/80">{usedForParts.join(" • ")}</span>
                  </p>
                )}

                {/* Example Preview */}
                {firstExample && (
                  <div className="mt-3 pl-3 border-l border-border/80 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-serif font-bold text-sm text-china-ink tracking-wide" lang="zh">
                        {firstExample.chinese}
                        {showPinyin && (
                          <span className="font-mono text-china-red font-medium text-xs ml-2">
                            {firstExample.pinyin}
                          </span>
                        )}
                      </p>
                      {showTranslation && (
                        <p className="text-china-ink/70 font-sans">
                          {firstExample.translation}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeak(firstExample.chinese)}
                      className={`p-1.5 rounded-md text-muted hover:text-china-red hover:bg-china-red/10 transition-colors shrink-0 ${
                        playingAudio === firstExample.chinese ? "text-china-red animate-pulse" : ""
                      }`}
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Bottom link to detail */}
                <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted text-[11px]">
                    Chi tiết công thức, lưu ý & bài tập trắc nghiệm
                  </span>
                  <Link
                    href={`/grammar/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-china-red hover:underline group-hover/card:translate-x-0.5 transition-transform"
                  >
                    <span>Vào bài học</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 6. Pagination Navigation */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-card border border-border/80 rounded-xl text-xs">
          <p className="text-muted">
            Trang <strong className="text-china-ink">{currentPage}</strong> / {totalPages} (Tổng{" "}
            {filteredGrammar.length} điểm)
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1))
                scrollToTop()
              }}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-md border border-border text-xs text-china-ink disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Trước
            </button>

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
                  className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                    isCurrent
                      ? "bg-china-red text-white"
                      : "text-muted hover:text-china-ink hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1))
                scrollToTop()
              }}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-md border border-border text-xs text-china-ink disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
          className="fixed bottom-6 right-6 p-2.5 rounded-full bg-china-red text-white shadow-md hover:bg-china-red/90 transition-all z-30"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
