"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  Layers,
  Compass,
} from "lucide-react"
import { Novel, NovelChapter } from "@/types/novel"
import WordLookupModal from "./WordLookupModal"
import { LeafVineCornerSvg } from "@/components/roadmap/VineBorders"
import { useAuth } from "@/contexts/AuthContext"
import {
  getHskWordMap,
  tokenizeParagraph,
  calculateChapterStats,
  HSK_LEVEL_STYLES,
  NovelToken,
  HskWordInfo,
} from "@/utils/novelTokenizer"

interface NovelReaderProps {
  novel: Novel
  initialChapterNumber?: number
  onBack: () => void
}

type ReaderTheme = "light" | "sepia" | "dark"

// Theme Palette độc lập, dùng inline style để đảm bảo tương phản 100% không bao giờ bị CSS đè bẹp
const READER_THEMES = {
  light: {
    pageBg: "#faf8f5",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    border: "#e7e5e4",
    title: "#1c1917",
    chineseText: "#1c1917",
    subText: "#78716c",
    accentButtonBg: "#1c1917",
    accentButtonText: "#ffffff",
    outlineButtonBg: "#ffffff",
    outlineButtonText: "#292524",
    outlineBorder: "#d6d3d1",
  },
  sepia: {
    pageBg: "#f4ede2",
    headerBg: "#faf4ea",
    cardBg: "#faf4ea",
    border: "#e2d5c3",
    title: "#3c3022",
    chineseText: "#3c3022",
    subText: "#7c6953",
    accentButtonBg: "#4a3b2c",
    accentButtonText: "#faf4ea",
    outlineButtonBg: "#faf4ea",
    outlineButtonText: "#4a3b2c",
    outlineBorder: "#d8c8b2",
  },
  dark: {
    pageBg: "#111116",
    headerBg: "#161620",
    cardBg: "#1c1c28",
    border: "#2d2d3d",
    title: "#edeae4",
    chineseText: "#edeae4",
    subText: "#9a958b",
    accentButtonBg: "#059669",
    accentButtonText: "#ffffff",
    outlineButtonBg: "#1a1a24",
    outlineButtonText: "#edeae4",
    outlineBorder: "#3a3b4e",
  },
}

export default function NovelReader({
  novel,
  initialChapterNumber = 1,
  onBack,
}: NovelReaderProps) {
  const { isDarkMode, toggleDarkMode } = useAuth()
  const [currentChapterNum, setCurrentChapterNum] = useState(initialChapterNumber)
  const [fontSize, setFontSize] = useState<number>(19)
  
  // Khởi tạo theme đọc theo dark mode toàn app
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>(() => (isDarkMode ? "dark" : "light"))
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false)
  
  // Word lookup state
  const [selectedHanzi, setSelectedHanzi] = useState<string>("")
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false)

  // HSK Word Segmentation & Color Underlining State
  const [wordDict, setWordDict] = useState<Map<string, HskWordInfo>>(new Map())
  const [showHskUnderline, setShowHskUnderline] = useState<boolean>(true)

  const contentContainerRef = useRef<HTMLDivElement | null>(null)

  const currentChapter: NovelChapter | undefined =
    novel.chapters.find((ch) => ch.chapterNumber === currentChapterNum) || novel.chapters[0]

  // Tải từ điển HSK từ IndexedDB (kho 11,470 từ) vào bộ nhớ RAM
  useEffect(() => {
    let isMounted = true
    getHskWordMap().then((dict) => {
      if (isMounted && dict.size > 0) {
        setWordDict(dict)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Đọc cài đặt bật/tắt gạch chân HSK từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("novel_show_hsk_levels")
      if (saved !== null) {
        setShowHskUnderline(saved === "true")
      }
    } catch {
      // ignore
    }
  }, [])

  const handleToggleHskUnderline = () => {
    setShowHskUnderline((prev) => {
      const next = !prev
      try {
        localStorage.setItem("novel_show_hsk_levels", String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Tách từ thông minh theo thuật toán Forward Maximum Matching cho toàn bộ đoạn văn
  const tokenizedParagraphs = useMemo<NovelToken[][]>(() => {
    if (!currentChapter?.paragraphs || currentChapter.paragraphs.length === 0) return []
    return currentChapter.paragraphs.map((para, pIdx) =>
      tokenizeParagraph(para, pIdx, wordDict)
    )
  }, [currentChapter, wordDict])

  // Thống kê độ khó và tỷ lệ các cấp độ HSK trong chương
  const chapterStats = useMemo(() => {
    return calculateChapterStats(tokenizedParagraphs)
  }, [tokenizedParagraphs])

  // Khi click trực tiếp vào một từ (1-click tra từ chính xác 100%, không bị thừa/thiếu chữ)
  const handleTokenClick = (word: string) => {
    const selection = window.getSelection()?.toString().trim()
    if (selection && selection.length > 1) {
      // Nếu người dùng chủ động kéo bôi đen chuột, để handleMouseUp xử lý
      return
    }
    const cleanChinese = word.replace(/[^\u4e00-\u9fff]/g, "")
    if (cleanChinese.length > 0 && cleanChinese.length <= 8) {
      setSelectedHanzi(cleanChinese)
      setIsLookupOpen(true)
    }
  }

  // Đồng bộ readerTheme khi dark mode toàn app thay đổi
  useEffect(() => {
    setReaderTheme(isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`novel_progress_${novel.id}`)
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed >= 1 && parsed <= novel.totalChapters) {
          setCurrentChapterNum(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [novel.id, novel.totalChapters])

  const handleSelectChapter = (num: number) => {
    setCurrentChapterNum(num)
    setIsChapterDrawerOpen(false)
    try {
      localStorage.setItem(`novel_progress_${novel.id}`, num.toString())
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrevChapter = () => {
    if (currentChapterNum > 1) {
      handleSelectChapter(currentChapterNum - 1)
    }
  }

  const handleNextChapter = () => {
    if (currentChapterNum < novel.totalChapters) {
      handleSelectChapter(currentChapterNum + 1)
    }
  }

  // Chuyển theme đọc sách và đồng bộ trạng thái Dark Mode toàn app
  const handleSwitchTheme = (newTheme: ReaderTheme) => {
    setReaderTheme(newTheme)
    if (newTheme === "dark" && !isDarkMode) {
      toggleDarkMode()
    } else if (newTheme === "light" && isDarkMode) {
      toggleDarkMode()
    }
  }

  // Handle Text Selection for Lookup
  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (!selection) return
    const text = selection.toString().trim()
    if (text && /[\u4e00-\u9fff]/.test(text)) {
      const cleanChinese = text.replace(/[^\u4e00-\u9fff]/g, "")
      if (cleanChinese.length > 0 && cleanChinese.length <= 8) {
        setSelectedHanzi(cleanChinese)
        setIsLookupOpen(true)
      }
    }
  }

  const t = READER_THEMES[readerTheme]

  return (
    <div
      style={{ backgroundColor: t.pageBg, color: t.title }}
      className="min-h-screen transition-colors duration-200 font-sans pb-28 select-text"
    >
      {/* Top Fixed Navigation & Reading Bar */}
      <header
        style={{
          backgroundColor: t.headerBg,
          color: t.title,
          borderColor: t.border,
        }}
        className="sticky top-0 z-30 border-b shadow-2xs backdrop-blur-md px-4 py-2.5 transition-colors"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back & Book Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              style={{ color: t.title }}
              className="p-2 rounded-xl hover:opacity-70 transition-opacity cursor-pointer active:scale-95 shrink-0"
              title="Quay lại Tủ truyện"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold truncate" style={{ color: t.title }}>
                {novel.title} <span className="opacity-70 font-normal">({novel.chineseTitle})</span>
              </h1>
              <p className="text-[11px] truncate font-medium" style={{ color: t.subText }}>
                Chương {currentChapter?.chapterNumber}/{novel.totalChapters}: {currentChapter?.title}
              </p>
            </div>
          </div>

          {/* Reading Customization Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setIsChapterDrawerOpen(true)}
              style={{
                backgroundColor: t.outlineButtonBg,
                color: t.outlineButtonText,
                borderColor: t.outlineBorder,
              }}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Mục lục 51 chương"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mục lục</span>
            </button>

            {/* HSK Level Underline Toggle Button */}
            <button
              onClick={handleToggleHskUnderline}
              style={{
                backgroundColor: showHskUnderline
                  ? (readerTheme === "dark" ? "#222232" : readerTheme === "sepia" ? "#ece3d4" : "#f1ede6")
                  : t.outlineButtonBg,
                color: showHskUnderline
                  ? (readerTheme === "dark" ? "#38bdf8" : "#0284c7")
                  : t.outlineButtonText,
                borderColor: showHskUnderline
                  ? (readerTheme === "dark" ? "#0284c7" : "#38bdf8")
                  : t.outlineBorder,
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title={showHskUnderline ? "Đang bật gạch chân HSK (Bấm để ẩn)" : "Đang ẩn gạch chân HSK (Bấm để hiện)"}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {showHskUnderline ? "Màu HSK: Bật" : "Màu HSK: Tắt"}
              </span>
            </button>

            {/* Font Size Adjuster */}
            <div
              style={{
                backgroundColor: t.outlineButtonBg,
                color: t.outlineButtonText,
                borderColor: t.outlineBorder,
              }}
              className="hidden sm:flex items-center rounded-xl border overflow-hidden text-xs shadow-2xs"
            >
              <button
                onClick={() => setFontSize((prev) => Math.max(16, prev - 1))}
                className="px-2.5 py-1 hover:opacity-70 font-bold cursor-pointer"
                title="Giảm cỡ chữ"
              >
                A-
              </button>
              <span className="px-2 py-1 text-[11px] font-mono border-x border-inherit opacity-80 select-none">
                {fontSize}
              </span>
              <button
                onClick={() => setFontSize((prev) => Math.min(26, prev + 1))}
                className="px-2.5 py-1 hover:opacity-70 font-bold cursor-pointer"
                title="Tăng cỡ chữ"
              >
                A+
              </button>
            </div>

            {/* Reading Theme Palette Toggle: [Sáng] [Sepia] [Tối] */}
            <div
              style={{
                backgroundColor: readerTheme === "dark" ? "#20202c" : "#eae7e1",
                borderColor: t.outlineBorder,
              }}
              className="flex items-center rounded-xl border p-0.5 gap-0.5 text-xs shadow-2xs"
            >
              <button
                onClick={() => handleSwitchTheme("light")}
                style={{
                  backgroundColor: readerTheme === "light" ? "#ffffff" : "transparent",
                  color: readerTheme === "light" ? "#b45309" : t.subText,
                }}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "light" ? "shadow-xs font-bold scale-105" : "opacity-70 hover:opacity-100"
                }`}
                title="Chế độ đọc Sáng (Giấy Tuyên Trắng)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleSwitchTheme("sepia")}
                style={{
                  backgroundColor: readerTheme === "sepia" ? "#faf4ea" : "transparent",
                  color: readerTheme === "sepia" ? "#4a3b2c" : t.subText,
                }}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "sepia" ? "shadow-xs font-bold scale-105" : "opacity-70 hover:opacity-100"
                }`}
                title="Chế độ đọc Sepia (Giấy Ấm Hoàng Cung)"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleSwitchTheme("dark")}
                style={{
                  backgroundColor: readerTheme === "dark" ? "#2d2d3e" : "transparent",
                  color: readerTheme === "dark" ? "#fcd34d" : t.subText,
                }}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "dark" ? "shadow-xs font-bold scale-105" : "opacity-70 hover:opacity-100"
                }`}
                title="Chế độ đọc Ban Đêm (Nghiên Mực Sâu Lắng)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Book Page Canvas */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* Book Chapter Card with Natural Leaf Vine Corner SVGs */}
        <div
          ref={contentContainerRef}
          onMouseUp={handleMouseUp}
          style={{
            backgroundColor: t.cardBg,
            color: t.chineseText,
            borderColor: t.border,
          }}
          className="relative rounded-3xl p-6 sm:p-10 border transition-colors select-text shadow-xs"
        >
          {/* 4 Dây leo lá cây thanh mảnh ở 4 góc - Không dùng viền neon */}
          <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 opacity-70" />
          <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 opacity-70" />
          <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-7 h-7 sm:w-8 sm:h-8 opacity-50" />
          <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 opacity-50" />

          {/* Chapter Heading */}
          <div
            style={{ borderColor: t.border }}
            className="relative z-10 text-center pb-6 border-b space-y-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: t.subText }}>
              {novel.title} • {novel.author}
            </span>
            <h2
              style={{ color: t.chineseText }}
              className="font-chinese text-2xl sm:text-3xl font-bold tracking-wide"
              lang="zh"
            >
              {currentChapter?.title}
            </h2>
            <div
              style={{ color: t.subText }}
              className="flex items-center justify-center gap-2 text-xs pt-1 font-medium"
            >
              <span>{currentChapter?.paragraphs.length} đoạn</span>
              <span>•</span>
              <span>{currentChapter?.charCount} chữ Hán</span>
            </div>
          </div>

          {/* Chapter Difficulty Breakdown Bar & HSK Legend */}
          {showHskUnderline && chapterStats && chapterStats.totalWords > 0 && (
            <div
              style={{
                backgroundColor: readerTheme === "dark" ? "#181824" : readerTheme === "sepia" ? "#f5ede1" : "#f8f7f4",
                borderColor: t.border,
              }}
              className="relative z-10 my-4 p-3 sm:p-4 rounded-2xl border text-xs transition-colors space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold flex items-center gap-1.5" style={{ color: t.title }}>
                    <Compass className="w-3.5 h-3.5 text-china-red" />
                    Ước lượng độ khó:
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${chapterStats.estimatedBadgeColor}`}>
                    {chapterStats.estimatedLevel}
                  </span>
                  <span className="text-[11px]" style={{ color: t.subText }}>
                    ({chapterStats.totalWords.toLocaleString()} từ ngữ)
                  </span>
                </div>

                <span className="text-[10px] italic" style={{ color: t.subText }}>
                  * Chạm vào từ bất kỳ để tra nghĩa &amp; nạp SRS
                </span>
              </div>

              {/* Mini Level Percentages Bar - Màu sắc thanh nhã, không chói */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-1 border-t border-inherit/40 text-[11px]">
                {([1, 2, 3, 4, 5, 6] as const).map((lvl) => {
                  const style = HSK_LEVEL_STYLES[lvl]
                  const pct = chapterStats.percentages[lvl] || 0
                  if (pct === 0 && (chapterStats.hskCounts[lvl] || 0) === 0) return null
                  return (
                    <div key={lvl} className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: style.dotColor }}
                      />
                      <span className="font-medium" style={{ color: t.subText }}>
                        {style.shortLabel}{" "}
                        <span className="font-mono text-[10px] font-semibold" style={{ color: t.title }}>
                          {pct}%
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Story Paragraphs - Tách từ chuẩn xác 100%, gạch chân phân tầng HSK thanh mảnh dịu mắt */}
          <div
            className="relative z-10 font-chinese space-y-6 pt-4 leading-loose select-text"
            style={{ fontSize: `${fontSize}px`, color: t.chineseText }}
            lang="zh"
          >
            {tokenizedParagraphs.map((paraTokens, pIdx) => (
              <p
                key={pIdx}
                style={{ color: t.chineseText }}
                className="indent-8 text-justify cursor-text selection:bg-amber-300 selection:text-stone-900"
              >
                {paraTokens.map((token) => {
                  if (!token.isWord) {
                    return <span key={token.id}>{token.text}</span>
                  }

                  const style = token.hskLevel ? HSK_LEVEL_STYLES[token.hskLevel] : null
                  const hasUnderline = showHskUnderline && style

                  return (
                    <span
                      key={token.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTokenClick(token.text)
                      }}
                      title={
                        token.hskLevel
                          ? `${token.text} (${style?.label}) • Chạm để tra nghĩa & nạp SRS`
                          : `${token.text} • Chạm để tra nghĩa`
                      }
                      style={{
                        borderBottomColor: hasUnderline ? style.underlineColor : "transparent",
                        borderBottomWidth: hasUnderline ? "1.5px" : "0px",
                        borderBottomStyle: "solid",
                      }}
                      className={`inline transition-colors duration-150 cursor-pointer select-text rounded-2xs px-[0.5px] ${
                        hasUnderline
                          ? "hover:bg-black/5 dark:hover:bg-white/10"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {token.text}
                    </span>
                  )
                })}
              </p>
            ))}
          </div>

          {/* Chapter Navigation Bottom */}
          <div
            style={{ borderColor: t.border }}
            className="relative z-10 pt-8 mt-8 border-t flex items-center justify-between gap-3"
          >
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterNum <= 1}
              style={{
                backgroundColor: t.outlineButtonBg,
                color: t.outlineButtonText,
                borderColor: t.outlineBorder,
              }}
              className="px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Chương trước</span>
            </button>

            <span className="text-xs font-mono font-bold" style={{ color: t.subText }}>
              {currentChapterNum} / {novel.totalChapters}
            </span>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterNum >= novel.totalChapters}
              style={{
                backgroundColor: t.accentButtonBg,
                color: t.accentButtonText,
              }}
              className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Chương kế tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Chapter Table of Contents Drawer */}
      {isChapterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs animate-fade-in">
          <div
            style={{
              backgroundColor: t.cardBg,
              color: t.title,
              borderColor: t.border,
            }}
            className="w-full max-w-sm h-full border-l shadow-2xl p-5 flex flex-col space-y-4"
          >
            <div style={{ borderColor: t.border }} className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-bold text-sm sm:text-base" style={{ color: t.title }}>
                  Mục lục ({novel.totalChapters} chương)
                </h3>
                <p className="text-xs" style={{ color: t.subText }}>{novel.title}</p>
              </div>
              <button
                onClick={() => setIsChapterDrawerOpen(false)}
                style={{ color: t.subText }}
                className="p-1.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {novel.chapters.map((ch) => {
                const isCurrent = ch.chapterNumber === currentChapterNum
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapter(ch.chapterNumber)}
                    style={{
                      backgroundColor: isCurrent ? t.accentButtonBg : "transparent",
                      color: isCurrent ? t.accentButtonText : t.title,
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isCurrent ? "shadow-2xs font-bold" : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">
                      Chương {ch.chapterNumber}: {ch.title}
                    </span>
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Word Lookup Modal */}
      <WordLookupModal
        hanzi={selectedHanzi}
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

    </div>
  )
}
