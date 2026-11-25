"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import {
  BookOpen,
  BookMarked,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Award,
  BookmarkCheck,
  CheckCircle2,
} from "lucide-react"
import { NOVELS, getNovelById } from "@/data/novels"
import { Novel } from "@/types/novel"
import NovelReader from "@/components/stories/NovelReader"
import { LeafVineCornerSvg, FoliageEdgeBorder } from "@/components/roadmap/VineBorders"

export default function StoriesPage() {
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [savedProgress, setSavedProgress] = useState<Record<string, number>>({})

  // Load saved progress for novels
  useEffect(() => {
    const progressMap: Record<string, number> = {}
    NOVELS.forEach((n) => {
      try {
        const saved = localStorage.getItem(`novel_progress_${n.id}`)
        if (saved) {
          const num = parseInt(saved, 10)
          if (!isNaN(num)) {
            progressMap[n.id] = num
          }
        }
      } catch {
        // ignore
      }
    })
    setSavedProgress(progressMap)
  }, [])

  const filteredNovels = NOVELS.filter((n) => {
    if (selectedTag !== "all") {
      const hasTag = n.tags.some(
        (t) => t.toLowerCase() === selectedTag.toLowerCase()
      )
      if (!hasTag) return false
    }

    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      n.title.toLowerCase().includes(q) ||
      n.chineseTitle.includes(q) ||
      n.author.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    )
  })

  // If in reader mode
  if (selectedNovel) {
    const currentProgress = savedProgress[selectedNovel.id] || 1
    return (
      <NovelReader
        novel={selectedNovel}
        initialChapterNumber={currentProgress}
        onBack={() => {
          try {
            const saved = localStorage.getItem(`novel_progress_${selectedNovel.id}`)
            if (saved) {
              setSavedProgress((prev) => ({
                ...prev,
                [selectedNovel.id]: parseInt(saved, 10) || 1,
              }))
            }
          } catch {}
          setSelectedNovel(null)
        }}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24 text-foreground">
      {/* Header */}
      <header className="chibi-card relative overflow-hidden bg-card rounded-2xl border-emerald-600/20 dark:border-emerald-500/20 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-10 h-10" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-10 h-10" />
        <FoliageEdgeBorder position="top" className="h-2.5 opacity-75" />

        <div className="flex items-center gap-3.5 max-w-2xl relative z-10">
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-china-paper border border-border p-1.5 items-center justify-center shrink-0">
            <Image src="/chibi-taoist.svg" alt="Tiểu Lu Đọc Truyện" width={48} height={48} className="object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Đọc truyện song ngữ Trung – Việt
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Đọc tác phẩm chọn lọc theo chương. Chạm trực tiếp vào bất kỳ từ tiếng Trung nào để xem phiên âm, nghĩa Hán-Việt và lưu vào kho ôn tập SRS.
            </p>
          </div>
        </div>

        <div className="text-xs self-start md:self-auto relative z-10">
          <span className="px-3 py-1.5 rounded-xl bg-china-paper border border-border font-semibold text-foreground">
            {NOVELS.length} tác phẩm
          </span>
        </div>
      </header>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border border-border">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {[
            { id: "all", label: "Tất cả" },
            { id: "Trending", label: "Phổ biến" },
            { id: "Ngôn tình", label: "Ngôn tình" },
            { id: "Đô thị", label: "Đô thị" },
            { id: "Trinh thám", label: "Trinh thám" },
          ].map((tab) => {
            const isActive = selectedTag === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTag(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-china-paper text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên truyện, tác giả..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-border text-xs focus:outline-none focus:border-china-red bg-china-paper/60 dark:bg-card text-foreground"
          />
        </div>
      </div>

      {/* Novels List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNovels.map((novel) => {
          const progressChapter = savedProgress[novel.id] || 0
          const progressPercent = Math.round((progressChapter / novel.totalChapters) * 100)

          return (
            <div
              key={novel.id}
              onClick={() => setSelectedNovel(novel)}
              className="chibi-card chibi-card-interactive group relative bg-card rounded-2xl border-emerald-600/20 dark:border-emerald-500/20 hover:border-emerald-500/50 p-5 flex flex-col justify-between space-y-4 cursor-pointer overflow-hidden"
            >
              <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-9 h-9 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start gap-4 relative z-10">
                {/* Book Cover */}
                <div className="w-20 sm:w-24 aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900 relative shadow-sm shrink-0 border border-stone-200 dark:border-stone-800">
                  <img
                    src={novel.coverUrl}
                    alt={novel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 text-white">
                    <span className="font-chinese font-bold text-xs text-center line-clamp-1" lang="zh">
                      {novel.chineseTitle}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700">
                      {novel.level}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                      FULL {novel.totalChapters} Chương
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {novel.title}
                  </h3>

                  <p className="font-chinese text-xs font-semibold text-emerald-700 dark:text-emerald-400" lang="zh">
                    {novel.chineseTitle} • {novel.pinyinTitle}
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Tác giả: <span className="font-medium text-stone-800 dark:text-stone-300">{novel.author}</span>
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed pt-1">
                    {novel.description}
                  </p>
                </div>
              </div>

              {/* Progress & Action Bottom Bar */}
              <div className="relative z-10 pt-3 border-t border-stone-100 dark:border-[#282836] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {progressChapter > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 font-medium text-[11px]">
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đang đọc chương {progressChapter}/{novel.totalChapters} ({progressPercent}%)</span>
                      </div>
                      <div className="w-28 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-stone-400 dark:text-stone-500 text-[11px]">Chưa bắt đầu đọc</span>
                  )}
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-500 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <span>{progressChapter > 0 ? "Đọc tiếp" : "Bắt đầu đọc"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
