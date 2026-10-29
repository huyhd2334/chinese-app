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
      <div className="min-h-screen bg-china-paper p-3 sm:p-6 lg:p-8">
        <ShadowingStudio
          video={selectedVideo}
          onBack={() => setSelectedVideo(null)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-china-paper p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24">
      
      {/* Hero Banner Header - Soft Paper Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-border shadow-xs p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-china-red/10 border border-china-red/20 text-china-red">
            <Headphones className="w-3.5 h-3.5" />
            <span>PHÒNG LUYỆN NÓI SHADOWING TIỂU LU</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-china-ink tracking-tight leading-snug">
            Nhại Giọng Bản Xứ • Bứt Phá Khẩu Ngữ HSK
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Phương pháp Shadowing giúp bạn bắt chước ngữ điệu, thanh điệu và nối âm tự nhiên của người bản xứ:{" "}
            <span className="font-semibold text-china-ink">Nghe mẫu → Thu âm nhại theo → Nghe lại đối chiếu trực tiếp</span> hoàn toàn miễn phí!
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Video Của Bạn</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-950 text-amber-300 text-[10px] font-extrabold uppercase">
                PRO 👑
              </span>
            </button>
          </div>
        </div>

        {/* Mascot decoration - Clean side container */}
        <div className="hidden sm:flex items-center gap-3 p-4 rounded-3xl bg-china-paper border border-border/80 shrink-0">
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
          <div className="text-xs max-w-[130px] leading-tight text-muted">
            <p className="font-bold text-china-ink mb-0.5">Tiểu Lu đồng hành</p>
            <p className="text-[11px]">Cùng bạn luyện nói mỗi ngày không lo ngại ngùng!</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                levelFilter === tab.id
                  ? "bg-china-red text-white shadow-2xs"
                  : "bg-china-paper text-muted hover:text-china-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm chủ đề, từ khóa..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-china-red/30 bg-white"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="group bg-white rounded-3xl border border-border shadow-xs hover:shadow-md hover:border-china-red/40 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
          >
            {/* Thumbnail Preview with Play Overlay */}
            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Play Icon Center Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-china-red text-china-red group-hover:text-white flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
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
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-700 tracking-wide uppercase">
                  {video.category}
                </span>
                <h3 className="font-bold text-china-ink text-sm sm:text-base line-clamp-2 group-hover:text-china-red transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted font-medium">
                  <Layers className="w-3.5 h-3.5 text-china-red" />
                  <span>{video.sentencesCount} câu thoại</span>
                </div>

                <span className="font-bold text-china-red group-hover:underline flex items-center gap-1">
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
