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
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#111116] p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24 font-sans text-stone-900 dark:text-stone-100 transition-colors animate-fade-in">
      
      {/* Hero Banner Header - Viền dây leo SVG mộc mạc thanh nhã */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1a1a24] border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Nhánh dây leo lá cây SVG mảnh ở các góc */}
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-9 h-9 sm:w-11 sm:h-11 opacity-80" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-9 h-9 sm:w-11 sm:h-11 opacity-80" />
        <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 opacity-60" />
        <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 opacity-60" />

        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
            <BookMarked className="w-3.5 h-3.5" />
            <span>TỦ TRUYỆN SONG NGỮ • ĐỌC &amp; NẠP TỪ VỰNG</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black tracking-tight leading-snug text-stone-900 dark:text-stone-100">
            Tủ Truyện Ngôn Tình • Đọc Đến Đâu Nạp Từ Đến Đó
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Đọc tiểu thuyết nguyên tác chuẩn bản xứ được tuyển chọn từ các tác phẩm kinh điển.{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              Bôi đen hoặc chạm vào từ bất kỳ để đối chiếu với kho 11,470 từ vựng và nạp thẳng vào hàng chờ ôn tập SRS!
            </span>
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Văn bản Full (Đầy đủ 51 chương)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Tra từ tức thời &amp; Thêm vào SRS
            </span>
          </div>
        </div>

        {/* Mascot decoration */}
        <div className="relative z-10 hidden sm:flex items-center gap-3 p-4 rounded-3xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shrink-0">
          <div className="w-20 h-20 relative flex items-center justify-center">
            <Image
              src="/chibi-loading.svg"
              alt="Tiểu Lu Đọc Truyện"
              width={80}
              height={80}
              priority
              className="object-contain"
            />
          </div>
          <div className="text-xs max-w-[130px] leading-tight text-stone-500 dark:text-stone-400">
            <p className="font-bold text-stone-900 dark:text-stone-100 mb-0.5">Tiểu Lu đọc sách</p>
            <p className="text-[11px]">Vừa đọc ngôn tình vừa nạp từ vựng cực kỳ cuốn hút!</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#1a1a24] p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên truyện, tác giả, thể loại..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-[#2c2d3d] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white dark:bg-[#16161f] text-stone-900 dark:text-stone-100"
          />
        </div>
        <div className="text-xs text-stone-500 dark:text-stone-400">
          Có <b>{filteredNovels.length}</b> tác phẩm
        </div>
      </div>

      {/* Novels List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNovels.map((novel) => {
          const progressChapter = savedProgress[novel.id] || 0
          const progressPercent = Math.round((progressChapter / novel.totalChapters) * 100)

          return (
            <div
              key={novel.id}
              onClick={() => setSelectedNovel(novel)}
              className="group relative bg-white dark:bg-[#1a1a24] rounded-3xl border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs hover:shadow-md transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between space-y-4 cursor-pointer overflow-hidden"
            >
              {/* Nhánh dây leo góc nhẹ nhàng */}
              <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" />

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

                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Tác giả: <span className="font-medium text-stone-700 dark:text-stone-300">{novel.author}</span>
                  </p>

                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed pt-1">
                    {novel.description}
                  </p>
                </div>
              </div>

              {/* Progress & Action Bottom Bar */}
              <div className="relative z-10 pt-3 border-t border-stone-100 dark:border-[#282836] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {progressChapter > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium text-[11px]">
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
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black dark:bg-stone-100 dark:text-stone-900 text-white font-semibold text-xs transition-all flex items-center gap-1.5 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-500 group-hover:text-white shadow-2xs active:scale-95 cursor-pointer"
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
