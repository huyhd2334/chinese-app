"use client"

import React, { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import {
  Headphones,
  Plus,
  Play,
  Crown,
  Search,
  BookOpen,
  Sparkles,
  Volume2,
  Video,
  Layers,
} from "lucide-react"
import { SHADOWING_VIDEOS, ShadowingVideo } from "@/data/shadowingData"
import ShadowingStudio from "@/components/shadowing/ShadowingStudio"
import AddCustomVideoModal from "@/components/shadowing/AddCustomVideoModal"
import { getLocalSubscription } from "@/utils/subscription"
import { LeafVineCornerSvg } from "@/components/roadmap/VineBorders"

const STORAGE_CUSTOM_VIDEOS_KEY = "custom_shadowing_videos"

export default function ShadowingPage() {
  const [selectedVideo, setSelectedVideo] = useState<ShadowingVideo | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [customVideos, setCustomVideos] = useState<ShadowingVideo[]>([])
  const [isPro, setIsPro] = useState(false)

  // Load Pro status & saved custom videos
  useEffect(() => {
    const sub = getLocalSubscription()
    setIsPro(sub.plan !== "free")

    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_VIDEOS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setCustomVideos(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const handleAddVideo = (newVideo: ShadowingVideo) => {
    const updated = [newVideo, ...customVideos]
    setCustomVideos(updated)
    try {
      localStorage.setItem(STORAGE_CUSTOM_VIDEOS_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    setSelectedVideo(newVideo)
  }

  // Combine built-in + custom videos
  const allVideos = useMemo(() => {
    return [...customVideos, ...SHADOWING_VIDEOS]
  }, [customVideos])

  // Filter videos
  const filteredVideos = useMemo(() => {
    return allVideos.filter((v) => {
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLevel =
        levelFilter === "all" ||
        (levelFilter === "hsk1" && v.level === "HSK 1-2") ||
        (levelFilter === "hsk2" && v.level === "HSK 2-3") ||
        (levelFilter === "hsk3" && v.level === "HSK 3-4") ||
        (levelFilter === "hsk4" && v.level === "HSK 4+")

      return matchesSearch && matchesLevel
    })
  }, [allVideos, searchQuery, levelFilter])

  // If in practice studio
  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-slate-50/70 dark:bg-background p-3 sm:p-6 lg:p-8">
        <ShadowingStudio
          video={selectedVideo}
          onBack={() => setSelectedVideo(null)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#111116] p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24 font-sans text-stone-900 dark:text-stone-100 transition-colors animate-fade-in">
      
      {/* Hero Banner Header - Viền dây leo SVG mộc mạc thanh nhã */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1a1a24] border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-9 h-9 sm:w-11 sm:h-11 opacity-80" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-9 h-9 sm:w-11 sm:h-11 opacity-80" />
        <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 opacity-60" />
        <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 opacity-60" />

        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
            <Headphones className="w-3.5 h-3.5" />
            <span>PHÒNG LUYỆN NÓI SHADOWING TIỂU LU</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
            Nhại Giọng Bản Xứ • Bứt Phá Khẩu Ngữ HSK
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Phương pháp Shadowing giúp bạn bắt chước ngữ điệu, thanh điệu và nối âm tự nhiên của người bản xứ:{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">Nghe mẫu trên YouTube → Bấm câu nhảy video → Thu âm đối chiếu</span> hoàn toàn miễn phí!
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Video Của Bạn</span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                PRO 👑
              </span>
            </button>
          </div>
        </div>

        {/* Mascot decoration - Clean side container */}
        <div className="relative z-10 hidden sm:flex items-center gap-3 p-4 rounded-3xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shrink-0">
          <div className="w-20 h-20 relative flex items-center justify-center">
            <Image
              src="/chibi-loading.svg"
              alt="Tiểu Lu Shadowing"
              width={80}
              height={80}
              priority
              className="object-contain"
            />
          </div>
          <div className="text-xs max-w-[130px] leading-tight text-stone-500 dark:text-stone-400">
            <p className="font-bold text-stone-900 dark:text-stone-100 mb-0.5">Tiểu Lu đồng hành</p>
            <p className="text-[11px]">Cùng bạn luyện nói mỗi ngày không lo ngại ngùng!</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1a1a24] p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs">
        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {[
            { id: "all", label: "Tất cả" },
            { id: "hsk1", label: "HSK 1-2" },
            { id: "hsk2", label: "HSK 2-3" },
            { id: "hsk3", label: "HSK 3-4" },
            { id: "hsk4", label: "HSK 4+" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLevelFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                levelFilter === tab.id
                  ? "bg-stone-900 text-white dark:bg-emerald-600 dark:text-white shadow-2xs"
                  : "bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm chủ đề, từ khóa..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-[#2c2d3d] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white dark:bg-[#16161f] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="group relative bg-white dark:bg-[#1a1a24] rounded-3xl border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
          >
            {/* Nhánh dây leo góc card */}
            <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Thumbnail Preview with Play Overlay */}
            <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Play Icon Center Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/95 group-hover:bg-emerald-600 text-stone-900 group-hover:text-white flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Badges on Thumbnail */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs border ${video.levelBadgeColor}`}
                >
                  {video.level}
                </span>
                {!video.isFree && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3" />
                    <span>PRO</span>
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-mono font-semibold">
                {video.duration}
              </div>
            </div>

            {/* Video Card Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 relative z-10">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                  {video.category}
                </span>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400 font-medium">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{video.sentencesCount} câu thoại</span>
                </div>

                <span className="font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                  <span>Luyện tập ngay</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Video Modal */}
      <AddCustomVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isPro={isPro}
        onAddVideo={handleAddVideo}
      />
    </div>
  )
}
