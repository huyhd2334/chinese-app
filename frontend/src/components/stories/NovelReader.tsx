"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react"
import { Novel, NovelChapter } from "@/types/novel"
import WordLookupModal from "./WordLookupModal"
import { LeafVineCornerSvg } from "@/components/roadmap/VineBorders"

interface NovelReaderProps {
  novel: Novel
  initialChapterNumber?: number
  onBack: () => void
}

type ReaderTheme = "light" | "sepia" | "dark"

export default function NovelReader({
  novel,
  initialChapterNumber = 1,
  onBack,
}: NovelReaderProps) {
  const [currentChapterNum, setCurrentChapterNum] = useState(initialChapterNumber)
  const [fontSize, setFontSize] = useState<number>(19)
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("light")
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false)
  
  // Word lookup state
  const [selectedHanzi, setSelectedHanzi] = useState<string>("")
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false)

  const contentContainerRef = useRef<HTMLDivElement | null>(null)

  const currentChapter: NovelChapter | undefined =
    novel.chapters.find((ch) => ch.chapterNumber === currentChapterNum) || novel.chapters[0]

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

  // Theme styling definitions (Đảm bảo độ tương phản hoàn hảo, không bị đen chìm hay chói lóa)
  const themeStyles = {
    light: {
      pageBg: "bg-[#faf8f5]",
      headerBg: "bg-[#faf8f5]/95 border-stone-200/80 text-stone-900",
      cardBg: "bg-white border-stone-200/90 text-stone-900 shadow-xs",
      subText: "text-stone-500",
      chineseText: "text-stone-900",
      accentButton: "bg-stone-900 hover:bg-black text-white",
      outlineButton: "border-stone-300 text-stone-700 hover:bg-stone-100",
    },
    sepia: {
      pageBg: "bg-[#f4ede2]",
      headerBg: "bg-[#f4ede2]/95 border-[#e2d5c3] text-[#3c3022]",
      cardBg: "bg-[#faf4ea] border-[#e2d5c3] text-[#3c3022] shadow-xs",
      subText: "text-[#7c6953]",
      chineseText: "text-[#3c3022]",
      accentButton: "bg-[#4a3b2c] hover:bg-[#34291e] text-[#faf4ea]",
      outlineButton: "border-[#d8c8b2] text-[#4a3b2c] hover:bg-[#ede3d3]",
    },
    dark: {
      pageBg: "bg-[#111116]",
      headerBg: "bg-[#16161f]/95 border-[#282836] text-[#edeae4]",
      cardBg: "bg-[#1a1a24] border-[#2c2d3d] text-[#edeae4] shadow-md",
      subText: "text-[#9a958b]",
      chineseText: "text-[#f3f0e8]",
      accentButton: "bg-[#edeae4] hover:bg-white text-[#111116]",
      outlineButton: "border-[#3a3b4e] text-[#edeae4] hover:bg-[#252533]",
    },
  }[readerTheme]

  return (
    <div className={`min-h-screen ${themeStyles.pageBg} transition-colors duration-200 font-sans pb-28 select-text`}>
      
      {/* Top Fixed Navigation & Reading Bar */}
      <header className={`sticky top-0 z-30 ${themeStyles.headerBg} border-b backdrop-blur-md px-4 py-2.5 transition-colors`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back & Book Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-95 shrink-0"
              title="Quay lại Tủ truyện"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold truncate">
                {novel.title} <span className="opacity-70 font-normal">({novel.chineseTitle})</span>
              </h1>
              <p className={`text-[11px] ${themeStyles.subText} truncate font-medium`}>
                Chương {currentChapter?.chapterNumber}/{novel.totalChapters}: {currentChapter?.title}
              </p>
            </div>
          </div>

          {/* Reading Customization Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setIsChapterDrawerOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${themeStyles.outlineButton}`}
              title="Mục lục 51 chương"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mục lục</span>
            </button>

            {/* Font Size Adjuster */}
            <div className={`hidden sm:flex items-center rounded-xl border overflow-hidden text-xs ${themeStyles.outlineButton}`}>
              <button
                onClick={() => setFontSize((prev) => Math.max(16, prev - 1))}
                className="px-2.5 py-1 hover:bg-black/5 dark:hover:bg-white/10 font-bold cursor-pointer"
                title="Giảm cỡ chữ"
              >
                A-
              </button>
              <span className="px-2 py-1 text-[11px] font-mono border-x border-inherit opacity-80 select-none">
                {fontSize}
              </span>
              <button
                onClick={() => setFontSize((prev) => Math.min(26, prev + 1))}
                className="px-2.5 py-1 hover:bg-black/5 dark:hover:bg-white/10 font-bold cursor-pointer"
                title="Tăng cỡ chữ"
              >
                A+
              </button>
            </div>

            {/* Reading Theme Palette Toggle */}
            <div className="flex items-center rounded-xl border border-stone-300 dark:border-neutral-700 p-0.5 gap-0.5 text-xs">
              <button
                onClick={() => setReaderTheme("light")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "light" ? "bg-white shadow-2xs text-amber-700" : "opacity-60"
                }`}
                title="Giấy sáng mát mắt"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme("sepia")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "sepia" ? "bg-[#eae0d2] shadow-2xs text-[#4a3b2c]" : "opacity-60"
                }`}
                title="Giấy ấm cổ điển"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme("dark")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "dark" ? "bg-[#252532] shadow-2xs text-amber-300" : "opacity-60"
                }`}
                title="Ban đêm dịu mắt"
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
          className={`relative rounded-3xl p-6 sm:p-10 border transition-colors select-text ${themeStyles.cardBg}`}
        >
          {/* 4 Dây leo lá cây thanh mảnh ở 4 góc - Không dùng viền neon */}
          <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 opacity-70" />
          <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 opacity-70" />
          <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-7 h-7 sm:w-8 sm:h-8 opacity-50" />
          <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 opacity-50" />

          {/* Chapter Heading */}
          <div className="relative z-10 text-center pb-6 border-b border-inherit/15 space-y-2">
            <span className={`text-xs font-medium uppercase tracking-wider ${themeStyles.subText}`}>
              {novel.title} • {novel.author}
            </span>
            <h2 className={`font-chinese text-2xl sm:text-3xl font-bold tracking-wide ${themeStyles.chineseText}`} lang="zh">
              {currentChapter?.title}
            </h2>
            <div className={`flex items-center justify-center gap-2 text-xs ${themeStyles.subText} pt-1`}>
              <span>{currentChapter?.paragraphs.length} đoạn</span>
              <span>•</span>
              <span>{currentChapter?.charCount} chữ Hán</span>
              <span>•</span>
              <span className="italic">Bôi đen chữ bất kỳ để tra nghĩa &amp; nạp SRS</span>
            </div>
          </div>

          {/* Story Paragraphs - Văn bản rõ ràng, tương phản hoàn hảo */}
          <div
            className={`relative z-10 font-chinese space-y-6 pt-6 leading-loose select-text ${themeStyles.chineseText}`}
            style={{ fontSize: `${fontSize}px` }}
            lang="zh"
          >
            {currentChapter?.paragraphs.map((para, pIdx) => (
              <p
                key={pIdx}
                className="indent-8 text-justify cursor-text selection:bg-amber-200 selection:text-stone-900 dark:selection:bg-stone-700 dark:selection:text-white"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Chapter Navigation Bottom */}
          <div className="relative z-10 pt-8 mt-8 border-t border-inherit/15 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterNum <= 1}
              className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${themeStyles.outlineButton}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Chương trước</span>
            </button>

            <span className={`text-xs font-mono font-medium ${themeStyles.subText}`}>
              {currentChapterNum} / {novel.totalChapters}
            </span>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterNum >= novel.totalChapters}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${themeStyles.accentButton}`}
            >
              <span>Chương kế tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Chapter Table of Contents Drawer */}
      {isChapterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div
            className={`w-full max-w-sm h-full border-l shadow-2xl p-5 flex flex-col space-y-4 ${themeStyles.cardBg}`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit/15">
              <div>
                <h3 className="font-bold text-sm sm:text-base">Mục lục ({novel.totalChapters} chương)</h3>
                <p className={`text-xs ${themeStyles.subText}`}>{novel.title}</p>
              </div>
              <button
                onClick={() => setIsChapterDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isCurrent
                        ? "bg-emerald-700 text-white shadow-2xs font-bold"
                        : "hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100"
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
