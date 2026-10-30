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
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { ShadowingVideo, ShadowingSentence } from "@/data/shadowingData"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"

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
        // Load YouTube Iframe script if not already present
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
              // event.data === 1: PLAYING
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

      // Tránh tranh chấp khi người dùng vừa chủ động bấm chọn câu
      if (isUserInteractingRef.current) return

      try {
        const currentTime = ytPlayerRef.current.getCurrentTime()
        if (typeof currentTime !== "number") return

        // Tìm câu đang phát dựa trên startTime và endTime
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
      
      {/* Top Header Bar - Minimal & Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-4 sm:p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer active:scale-95"
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
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{video.category}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white line-clamp-1 mt-0.5">
              {video.title}
            </h1>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 self-end sm:self-auto min-w-[200px]">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              <span>Đã luyện tập</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {completedSentenceIds.length}/{video.sentences.length} câu ({progressPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300 rounded-full"
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
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
            <div id="youtube-player-element" className="w-full h-full" />
          </div>

          {/* Visibility Controls Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-card border border-neutral-200/80 dark:border-neutral-800 shadow-xs text-xs">
            <div className="flex items-center gap-2 text-neutral-500 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tự động nhảy câu theo video</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  showPinyin
                    ? "bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
                title="Bật/Tắt Pinyin"
              >
                {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Pinyin</span>
              </button>

              <button
                onClick={() => setShowVietnamese(!showVietnamese)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  showVietnamese
                    ? "bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
                title="Bật/Tắt Tiếng Việt"
              >
                {showVietnamese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Dịch nghĩa</span>
              </button>
            </div>
          </div>

          {/* Focus Sentence Practice Card */}
          {currentSentence && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-card border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    Câu {currentSentenceIndex + 1}/{video.sentences.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    ⏱️ {formatTimestamp(currentSentence.startTime)} - {formatTimestamp(currentSentence.endTime)}
                  </span>
                  {currentSentence.speaker && (
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      • {currentSentence.speaker}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleCompleted(currentSentence.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    completedSentenceIds.includes(currentSentence.id)
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-neutral-100 text-neutral-500 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {completedSentenceIds.includes(currentSentence.id) ? "Đã luyện" : "Đánh dấu đã học"}
                  </span>
                </button>
              </div>

              {/* Chinese Character Display */}
              <div className="space-y-2.5 py-2 text-center">
                <p
                  className="font-chinese font-semibold text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-wide leading-relaxed"
                  lang="zh"
                >
                  {currentSentence.chinese}
                </p>

                {showPinyin && (
                  <p className="text-sm sm:text-base font-medium text-amber-700 dark:text-amber-400 tracking-wide">
                    {currentSentence.pinyin}
                  </p>
                )}

                {showVietnamese && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-lg mx-auto">
                    {currentSentence.vietnamese}
                  </p>
                )}
              </div>

              {/* Quick Jump / Replay Video Button */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectSentence(currentSentenceIndex)}
                  className="px-4 py-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  title="Phát lại đoạn này trên video"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-amber-600" />
                  <span>Phát lại đoạn này ({formatTimestamp(currentSentence.startTime)})</span>
                </button>
              </div>

              {/* Voice Recorder & Comparison Deck */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/80 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Thu âm nhại giọng của bạn (Shadowing)
                  </span>

                  {recorderError && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
                      {recorderError}
                    </p>
                  )}

                  {/* Mic Recording Button */}
                  {!audioUrl && !isRecording && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-5 py-2.5 rounded-2xl bg-neutral-900 hover:bg-black text-white font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4 text-amber-400" />
                      <span>Bắt đầu thu âm</span>
                    </button>
                  )}

                  {/* Recording In-progress Indicator */}
                  {isRecording && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-red-600 font-medium text-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                        <span>Đang ghi âm: 00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}s</span>
                      </div>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-5 py-2 rounded-2xl bg-neutral-900 hover:bg-black text-white font-medium text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                      >
                        <Square className="w-3.5 h-3.5 text-red-400 fill-current" />
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
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isPlayingUserAudio ? "Đang phát giọng bạn..." : "Nghe lại giọng bạn"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
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
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === video.sentences.length - 1}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
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
          <div className="bg-white dark:bg-card p-4 sm:p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Kịch bản phụ đề ({video.sentences.length} câu)
                </h3>
              </div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Bấm câu để nhảy video</span>
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
                        ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700 shadow-2xs"
                        : "bg-white hover:bg-neutral-50 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/60 border-neutral-200/70 dark:border-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive
                              ? "bg-amber-500 text-white"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {sentence.speaker && (
                          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                            {sentence.speaker}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isActive
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold"
                              : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 font-medium"
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
                          ? "font-bold text-neutral-900 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                      lang="zh"
                    >
                      {sentence.chinese}
                    </p>

                    {showPinyin && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-0.5 line-clamp-1">
                        {sentence.pinyin}
                      </p>
                    )}

                    {showVietnamese && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
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
