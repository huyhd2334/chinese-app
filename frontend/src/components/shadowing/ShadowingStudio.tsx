"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  ArrowLeft,
  Mic,
  Square,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Headphones,
} from "lucide-react"
import { ShadowingVideo, ShadowingSentence } from "@/data/shadowingData"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { LeafVineCornerSvg } from "@/components/roadmap/VineBorders"

interface ShadowingStudioProps {
  video: ShadowingVideo
  onBack: () => void
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady?: () => void
  }
}

export default function ShadowingStudio({ video, onBack }: ShadowingStudioProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [showPinyin, setShowPinyin] = useState(true)
  const [showVietnamese, setShowVietnamese] = useState(true)
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  // Track completed sentences
  const [completedSentenceIds, setCompletedSentenceIds] = useState<number[]>([])

  // Audio Recorder Hook for practicing
  const {
    isRecording,
    recordingTime,
    audioUrl,
    error: recorderError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder()

  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const ytPlayerRef = useRef<any>(null)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sentenceListRef = useRef<HTMLDivElement | null>(null)
  const activeSentenceRef = useRef<HTMLDivElement | null>(null)
  const isUserInteractingRef = useRef(false)

  const formatTimestamp = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`
  }

  // Khởi tạo YouTube IFrame API và Player
  useEffect(() => {
    let isMounted = true

    const loadYT = () => {
      if (!window.YT || !window.YT.Player) {
        if (!document.getElementById("youtube-iframe-api-script")) {
          const tag = document.createElement("script")
          tag.id = "youtube-iframe-api-script"
          tag.src = "https://www.youtube.com/iframe_api"
          const firstScriptTag = document.getElementsByTagName("script")[0]
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
        }

        const oldReady = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => {
          if (oldReady) oldReady()
          if (isMounted) initPlayer()
        }
      } else {
        initPlayer()
      }
    }

    const initPlayer = () => {
      if (!isMounted) return
      try {
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy()
          } catch {
            // ignore
          }
        }

        const initialStart = video.sentences[0]?.startTime || 0
        ytPlayerRef.current = new window.YT.Player("youtube-player-element", {
          videoId: video.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: Math.floor(initialStart),
          },
          events: {
            onReady: () => {
              if (isMounted) setIsPlayerReady(true)
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                startSyncTimer()
              } else {
                stopSyncTimer()
              }
            },
          },
        })
      } catch (err) {
        console.error("YouTube Player init error:", err)
      }
    }

    loadYT()

    return () => {
      isMounted = false
      stopSyncTimer()
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy()
        } catch {
          // ignore
        }
      }
    }
  }, [video.youtubeId])

  // Timer đồng bộ thời gian video với câu thoại trong kịch bản
  const startSyncTimer = useCallback(() => {
    if (syncIntervalRef.current) clearInterval(syncIntervalRef.current)

    syncIntervalRef.current = setInterval(() => {
      if (!ytPlayerRef.current || typeof ytPlayerRef.current.getCurrentTime !== "function") return
      if (isUserInteractingRef.current) return

      try {
        const currentTime = ytPlayerRef.current.getCurrentTime()
        if (typeof currentTime !== "number") return

        const matchIdx = video.sentences.findIndex(
          (s) => currentTime >= s.startTime - 0.2 && currentTime <= s.endTime + 0.3
        )

        if (matchIdx !== -1) {
          setCurrentSentenceIndex((prev) => {
            if (prev !== matchIdx) {
              return matchIdx
            }
            return prev
          })
        }
      } catch {
        // ignore
      }
    }, 250)
  }, [video.sentences])

  const stopSyncTimer = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current)
      syncIntervalRef.current = null
    }
  }, [])

  // Tự động cuộn mượt mà câu đang phát vào vùng hiển thị
  useEffect(() => {
    if (activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [currentSentenceIndex])

  const currentSentence: ShadowingSentence | undefined = video.sentences[currentSentenceIndex]

  // Khi click vào câu thoại bất kỳ
  const handleSelectSentence = (index: number) => {
    if (isRecording) {
      stopRecording()
    }
    resetRecording()
    setCurrentSentenceIndex(index)

    const target = video.sentences[index]
    if (target && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      isUserInteractingRef.current = true
      try {
        ytPlayerRef.current.seekTo(target.startTime, true)
        ytPlayerRef.current.playVideo()
      } catch (err) {
        console.error("Seek error:", err)
      }
      setTimeout(() => {
        isUserInteractingRef.current = false
      }, 600)
    }
  }

  const handleNextSentence = () => {
    if (currentSentenceIndex < video.sentences.length - 1) {
      handleSelectSentence(currentSentenceIndex + 1)
    }
  }

  const handlePrevSentence = () => {
    if (currentSentenceIndex > 0) {
      handleSelectSentence(currentSentenceIndex - 1)
    }
  }

  // Play user's recorded audio
  const handlePlayUserAudio = () => {
    if (!audioUrl) return
    if (!userAudioPlayerRef.current) {
      userAudioPlayerRef.current = new Audio(audioUrl)
      userAudioPlayerRef.current.onended = () => setIsPlayingUserAudio(false)
    } else {
      userAudioPlayerRef.current.src = audioUrl
    }

    setIsPlayingUserAudio(true)
    userAudioPlayerRef.current.play().catch(() => {
      setIsPlayingUserAudio(false)
    })
  }

  const handleToggleCompleted = (sentenceId: number) => {
    setCompletedSentenceIds((prev) =>
      prev.includes(sentenceId) ? prev.filter((id) => id !== sentenceId) : [...prev, sentenceId]
    )
  }

  const progressPercentage = Math.round(
    (completedSentenceIds.length / video.sentences.length) * 100
  )

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 pb-16 animate-fade-in font-sans">
      
      {/* Top Header Bar - Tông màu slate dịu mắt, chống lóa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer active:scale-95"
            title="Quay lại danh sách video"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${video.levelBadgeColor}`}
              >
                {video.level}
              </span>
              <span className="text-xs text-slate-500 dark:text-neutral-400">{video.category}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
              {video.title}
            </h1>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 self-end sm:self-auto min-w-[200px]">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
              <span>Đã luyện tập</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {completedSentenceIds.length}/{video.sentences.length} câu ({progressPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: YouTube Player & Practice Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* YouTube Video Player with Realtime API */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-sm border border-slate-200 dark:border-neutral-800">
            <div id="youtube-player-element" className="w-full h-full" />
          </div>

          {/* Visibility Controls Bar - Clean, Low Glare */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1a1a24] border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs text-xs">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đồng bộ tự động theo lời thoại</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  showPinyin
                    ? "bg-stone-900 text-white dark:bg-emerald-600 dark:text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:text-stone-900 dark:bg-[#20202c] dark:text-stone-300 dark:hover:bg-[#282838] border border-stone-200 dark:border-stone-700"
                }`}
                title="Bật/Tắt Pinyin"
              >
                {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Pinyin</span>
              </button>

              <button
                onClick={() => setShowVietnamese(!showVietnamese)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  showVietnamese
                    ? "bg-stone-900 text-white dark:bg-emerald-600 dark:text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:text-stone-900 dark:bg-[#20202c] dark:text-stone-300 dark:hover:bg-[#282838] border border-stone-200 dark:border-stone-700"
                }`}
                title="Bật/Tắt Tiếng Việt"
              >
                {showVietnamese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Dịch nghĩa</span>
              </button>
            </div>
          </div>

          {/* Focus Sentence Practice Card - Có nhánh dây leo SVG góc */}
          {currentSentence && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1a1a24] border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs space-y-5 relative overflow-hidden">
              <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-60" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700">
                    Câu {currentSentenceIndex + 1}/{video.sentences.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-700">
                    ⏱️ {formatTimestamp(currentSentence.startTime)} - {formatTimestamp(currentSentence.endTime)}
                  </span>
                  {currentSentence.speaker && (
                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                      • {currentSentence.speaker}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleCompleted(currentSentence.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    completedSentenceIds.includes(currentSentence.id)
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-stone-100 text-stone-600 hover:text-stone-900 dark:bg-stone-800 dark:text-stone-300"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {completedSentenceIds.includes(currentSentence.id) ? "Đã luyện" : "Đánh dấu đã học"}
                  </span>
                </button>
              </div>

              {/* Chinese Character Display - Độ tương phản cao, chống mỏi mắt */}
              <div className="space-y-3 py-2 text-center">
                <p
                  className="font-chinese font-bold text-2xl sm:text-3xl text-stone-900 dark:text-[#edeae4] tracking-wide leading-relaxed"
                  lang="zh"
                >
                  {currentSentence.chinese}
                </p>

                {showPinyin && (
                  <p className="text-sm sm:text-base font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide font-mono">
                    {currentSentence.pinyin}
                  </p>
                )}

                {showVietnamese && (
                  <p className="text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
                    {currentSentence.vietnamese}
                  </p>
                )}
              </div>

              {/* Quick Jump / Replay Video Button */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectSentence(currentSentenceIndex)}
                  className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-[#222230] dark:hover:bg-[#2a2a3c] text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-stone-200 dark:border-stone-700"
                  title="Phát lại đoạn này trên video"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-600 dark:text-emerald-400" />
                  <span>Phát lại đoạn này ({formatTimestamp(currentSentence.startTime)})</span>
                </button>
              </div>

              {/* Voice Recorder & Comparison Deck */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#15151e] border border-stone-200/60 dark:border-stone-800 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                    Thu âm nhại giọng của bạn (Shadowing)
                  </span>

                  {recorderError && (
                    <p className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl border border-rose-200 dark:border-rose-900/50">
                      {recorderError}
                    </p>
                  )}

                  {/* Mic Recording Button */}
                  {!audioUrl && !isRecording && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4 text-white" />
                      <span>Bắt đầu thu âm</span>
                    </button>
                  )}

                  {/* Recording In-progress Indicator */}
                  {isRecording && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                        <span>Đang ghi âm: 00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}s</span>
                      </div>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-5 py-2 rounded-2xl bg-stone-900 hover:bg-black text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                      >
                        <Square className="w-3.5 h-3.5 text-rose-400 fill-current" />
                        <span>Dừng thu âm &amp; Nghe lại</span>
                      </button>
                    </div>
                  )}

                  {/* Recorded Audio Controls */}
                  {audioUrl && !isRecording && (
                    <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handlePlayUserAudio}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                          isPlayingUserAudio
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isPlayingUserAudio ? "Đang phát giọng bạn..." : "Nghe lại giọng bạn"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Thu âm lại"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Thu lại</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Prev / Next Sentence Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevSentence}
                  disabled={currentSentenceIndex === 0}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer border border-stone-200 dark:border-stone-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === video.sentences.length - 1}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer border border-stone-200 dark:border-stone-700"
                >
                  <span>Câu tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Subtitles Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative bg-white dark:bg-[#1a1a24] p-4 sm:p-5 rounded-3xl border border-stone-200/90 dark:border-[#2c2d3d] shadow-xs space-y-3 overflow-hidden">
            <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-60" />
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 relative z-10">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Kịch bản phụ đề ({video.sentences.length} câu)
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">Bấm câu để nhảy video</span>
            </div>

            {/* Sentences List with Auto-sync Scroll */}
            <div
              ref={sentenceListRef}
              className="space-y-2 max-h-[580px] overflow-y-auto pr-1.5 custom-scrollbar"
            >
              {video.sentences.map((sentence, index) => {
                const isActive = index === currentSentenceIndex
                const isCompleted = completedSentenceIds.includes(sentence.id)

                return (
                  <div
                    key={sentence.id}
                    ref={isActive ? activeSentenceRef : null}
                    onClick={() => handleSelectSentence(index)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 shadow-2xs"
                        : "bg-white hover:bg-stone-50 dark:bg-[#161622] dark:hover:bg-[#1e1e2c] border-stone-200/80 dark:border-stone-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {sentence.speaker && (
                          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                            {sentence.speaker}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-bold"
                              : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 font-medium"
                          }`}
                        >
                          {formatTimestamp(sentence.startTime)}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </div>

                    <p
                      className={`font-chinese text-sm leading-relaxed ${
                        isActive
                          ? "font-bold text-stone-900 dark:text-[#edeae4]"
                          : "text-stone-800 dark:text-stone-200"
                      }`}
                      lang="zh"
                    >
                      {sentence.chinese}
                    </p>

                    {showPinyin && (
                      <p className={`text-[11px] font-medium mt-0.5 line-clamp-1 ${
                        isActive ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-stone-500 dark:text-stone-400"
                      }`}>
                        {sentence.pinyin}
                      </p>
                    )}

                    {showVietnamese && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                        {sentence.vietnamese}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
