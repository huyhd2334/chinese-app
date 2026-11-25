"use client"

import React, { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import {
  Headphones,
  Play,
  Crown,
  Search,
  Layers,
  Lock,
} from "lucide-react"
import { SHADOWING_VIDEOS, ShadowingVideo } from "@/data/shadowingData"
import ShadowingStudio from "@/components/shadowing/ShadowingStudio"
import { getLocalSubscription, triggerUpgradeModal } from "@/utils/subscription"
import { LeafVineCornerSvg } from "@/components/roadmap/VineBorders"

export default function ShadowingPage() {
  const [selectedVideo, setSelectedVideo] = useState<ShadowingVideo | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [isPro, setIsPro] = useState(false)

  // Load Pro status
  useEffect(() => {
    const sub = getLocalSubscription()
    setIsPro(sub.plan !== "free")
  }, [])

  // Filter videos from built-in collection
  const filteredVideos = useMemo(() => {
    return SHADOWING_VIDEOS.filter((v) => {
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
  }, [searchQuery, levelFilter])

  const handleSelectVideo = (video: ShadowingVideo) => {
    if (!video.isFree && !isPro) {
      triggerUpgradeModal("manual")
      return
    }
    setSelectedVideo(video)
  }

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24 text-foreground">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1 max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Luyện nói Shadowing
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Luyện phản xạ phát âm và ngữ điệu theo người bản xứ: nghe từng câu hội thoại, bấm nhảy vị trí video và thu âm đối chiếu trực tiếp.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {!isPro ? (
            <>
              <span className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-muted">
                Miễn phí 5 video
              </span>
              <button
                type="button"
                onClick={() => triggerUpgradeModal("manual")}
                className="px-3.5 py-1.5 rounded-lg bg-china-red hover:bg-china-red-hover text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Mở khóa Pro</span>
              </button>
            </>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-china-paper border border-border text-foreground text-xs font-semibold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-china-gold" />
              <span>Đã mở khóa toàn bộ video</span>
            </span>
          )}
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border border-border">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {[
            { id: "all", label: "Tất cả" },
            { id: "hsk1", label: "HSK 1-2" },
            { id: "hsk2", label: "HSK 2-3" },
            { id: "hsk3", label: "HSK 3-4" },
            { id: "hsk4", label: "HSK 4-5" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLevelFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                levelFilter === tab.id
                  ? "bg-foreground text-background"
                  : "bg-china-paper text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm chủ đề, từ khóa..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-border text-xs focus:outline-none focus:border-china-red bg-china-paper/60 dark:bg-card text-foreground placeholder:text-muted"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => {
          const isLocked = !video.isFree && !isPro

          return (
            <div
              key={video.id}
              onClick={() => handleSelectVideo(video)}
              className="group relative bg-card rounded-2xl border border-border hover:border-foreground/30 transition-colors flex flex-col overflow-hidden cursor-pointer"
            >

              {/* Thumbnail Preview with Play Overlay */}
              <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={video.title}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isLocked ? "opacity-75" : "group-hover:scale-105"
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Play Icon or Lock Icon Center Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isLocked ? (
                    <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
                      <Lock className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/95 group-hover:bg-emerald-600 text-stone-900 group-hover:text-white flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Badges on Thumbnail */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs border ${video.levelBadgeColor}`}
                  >
                    {video.level}
                  </span>
                  {video.isFree ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
                      Miễn phí
                    </span>
                  ) : (
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

                  {isLocked ? (
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Mở khóa PRO</span>
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                      <span>Luyện tập ngay</span>
                      <span>→</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
