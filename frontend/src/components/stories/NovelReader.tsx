"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Type,
  Sun,
  Moon,
  Coffee,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Volume2,
} from "lucide-react"
import { Novel, NovelChapter } from "@/types/novel"
import WordLookupModal from "./WordLookupModal"

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
  const [fontSize, setFontSize] = useState<number>(18)
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("light")
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false)
  
  // Word lookup state
  const [selectedHanzi, setSelectedHanzi] = useState<string>("")
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false)

  const contentContainerRef = useRef<HTMLDivElement | null>(null)

  // Current chapter data
  const currentChapter: NovelChapter | undefined =
    novel.chapters.find((ch) => ch.chapterNumber === currentChapterNum) || novel.chapters[0]

  // Restore & save progress
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
    // Match Chinese characters
    if (text && /[\u4e00-\u9fff]/.test(text)) {
      // Limit to reasonable word length for dictionary lookup (1-10 chars)
      const cleanChinese = text.replace(/[^\u4e00-\u9fff]/g, "")
      if (cleanChinese.length > 0 && cleanChinese.length <= 8) {
        setSelectedHanzi(cleanChinese)
        setIsLookupOpen(true)
      }
    }
  }

  // Quick word click helper
  const handleWordClick = (word: string) => {
    if (word && /[\u4e00-\u9fff]/.test(word)) {
      setSelectedHanzi(word)
      setIsLookupOpen(true)
    }
  }

  // Theme styling classes
  const themeClasses: Record<ReaderTheme, { bg: string; text: string; card: string; border: string }> = {
    light: {
      bg: "bg-slate-50/70",
      text: "text-slate-900",
      card: "bg-white",
      border: "border-slate-200/80",
    },
    sepia: {
      bg: "bg-[#f5efe6]",
      text: "text-[#3e3428]",
      card: "bg-[#faf6ee]",
      border: "border-[#e6dac7]",
    },
    dark: {
      bg: "bg-[#121319]",
      text: "text-[#edeaf0]",
      card: "bg-[#1a1b24]",
      border: "border-[#2b2d3c]",
    },
  }

  const activeTheme = themeClasses[readerTheme]

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} transition-colors duration-200 font-sans pb-24`}>
      
      {/* Top Fixed Control Bar */}
      <header className={`sticky top-0 z-30 ${activeTheme.card} ${activeTheme.border} border-b shadow-xs backdrop-blur-md px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-95 shrink-0"
              title="Quay lại Tủ truyện"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold truncate">
                {novel.title} • {novel.chineseTitle}
              </h1>
              <p className="text-[11px] opacity-70 truncate font-medium">
                Chương {currentChapter?.chapterNumber}/{novel.totalChapters}: {currentChapter?.title}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setIsChapterDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-xl border border-current/15 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Mục lục 51 chương"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Mục lục</span>
            </button>

            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center rounded-xl border border-current/15 overflow-hidden text-xs">
              <button
                onClick={() => setFontSize((prev) => Math.max(15, prev - 1))}
                className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 font-bold cursor-pointer"
                title="Giảm cỡ chữ"
              >
                A-
              </button>
              <span className="px-2 py-1 text-[11px] font-mono border-x border-current/15 select-none">
                {fontSize}
              </span>
              <button
                onClick={() => setFontSize((prev) => Math.min(26, prev + 1))}
                className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 font-bold cursor-pointer"
                title="Tăng cỡ chữ"
              >
                A+
              </button>
            </div>

            {/* Reader Theme Switcher */}
            <div className="flex items-center rounded-xl border border-current/15 p-0.5 gap-0.5 text-xs">
              <button
                onClick={() => setReaderTheme("light")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "light" ? "bg-black/10 dark:bg-white/20 shadow-2xs" : "opacity-60"
                }`}
                title="Giao diện Sáng dịu"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme("sepia")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "sepia" ? "bg-black/10 dark:bg-white/20 shadow-2xs" : "opacity-60"
                }`}
                title="Giao diện Giấy ấm"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme("dark")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  readerTheme === "dark" ? "bg-black/10 dark:bg-white/20 shadow-2xs" : "opacity-60"
                }`}
                title="Giao diện Ban đêm"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Reader Main Content Canvas */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Story Chapter Card */}
        <div
          ref={contentContainerRef}
          onMouseUp={handleMouseUp}
          className={`${activeTheme.card} ${activeTheme.border} border rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 select-text`}
        >
          {/* Chapter Header */}
          <div className="text-center pb-5 border-b border-current/10 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
              {novel.title} • {novel.author}
            </span>
            <h2 className="font-chinese text-2xl sm:text-3xl font-bold tracking-wide" lang="zh">
              {currentChapter?.title}
            </h2>
            <div className="flex items-center justify-center gap-3 text-xs opacity-60 pt-1">
              <span>{currentChapter?.paragraphs.length} đoạn văn</span>
              <span>•</span>
              <span>{currentChapter?.charCount} chữ Hán</span>
            </div>
          </div>

          {/* Hint bar for Interactive Vocabulary Lookup */}
          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-blue-600" />
              <span>
                <b>Mẹo học:</b> Bôi đen hoặc nhấp đúp vào từ bất kỳ để tra nghĩa &amp; thêm vào hàng chờ SRS!
              </span>
            </div>
          </div>

          {/* Chapter Paragraphs */}
          <div
            className="font-chinese space-y-5 leading-loose tracking-wide select-text"
            style={{ fontSize: `${fontSize}px` }}
            lang="zh"
          >
            {currentChapter?.paragraphs.map((para, pIdx) => (
              <p
                key={pIdx}
                className="indent-8 text-justify cursor-text selection:bg-blue-200 selection:text-slate-900 dark:selection:bg-blue-900 dark:selection:text-white"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Chapter Navigation Bottom Bar */}
          <div className="pt-8 border-t border-current/10 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterNum <= 1}
              className="px-4 py-2.5 rounded-2xl border border-current/20 hover:bg-black/5 dark:hover:bg-white/10 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Chương trước</span>
            </button>

            <span className="text-xs font-mono font-medium opacity-70">
              {currentChapterNum} / {novel.totalChapters}
            </span>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterNum >= novel.totalChapters}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
            className={`w-full max-w-sm h-full ${activeTheme.card} ${activeTheme.border} border-l shadow-2xl p-5 flex flex-col space-y-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-current/10">
              <div>
                <h3 className="font-bold text-sm sm:text-base">Mục lục ({novel.totalChapters} chương)</h3>
                <p className="text-xs opacity-70">{novel.title}</p>
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
                        ? "bg-blue-600 text-white shadow-2xs font-bold"
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
