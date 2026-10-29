"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Volume2,
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
  Award,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { ShadowingVideo, ShadowingSentence } from "@/data/shadowingData"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { playChineseAudio } from "@/utils/audioTts"

interface ShadowingStudioProps {
  video: ShadowingVideo
  onBack: () => void
}

export default function ShadowingStudio({ video, onBack }: ShadowingStudioProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [showPinyin, setShowPinyin] = useState(true)
  const [showVietnamese, setShowVietnamese] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 0.9 | 1.0>(1.0)
  const [playerMode, setPlayerMode] = useState<"video" | "audio">("video")
  const [isPlayingNativeAudio, setIsPlayingNativeAudio] = useState(false)
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false)

  // Track completed sentences (Set of sentence IDs)
  const [completedSentenceIds, setCompletedSentenceIds] = useState<number[]>([])

  // Audio Recorder Hook
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const formatTimestamp = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`
  }

  const seekAndPlayVideo = (startTime: number) => {
    setPlayerMode("video")
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [startTime, true],
        }),
        "*"
      )
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "playVideo",
          args: [],
        }),
        "*"
      )
    }
  }

  const currentSentence: ShadowingSentence | undefined = video.sentences[currentSentenceIndex]

  // Reset audio recording when changing sentence
  const handleSelectSentence = (index: number) => {
    if (isRecording) {
      stopRecording()
    }
    resetRecording()
    setCurrentSentenceIndex(index)
    const target = video.sentences[index]
    if (target && playerMode === "video") {
      seekAndPlayVideo(target.startTime)
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

  // Play native speaker sample audio (Web Speech TTS)
  const handlePlayNativeAudio = () => {
    if (!currentSentence) return
    setIsPlayingNativeAudio(true)
    playChineseAudio(currentSentence.chinese, {
      rate: playbackSpeed,
      volume: 1.0,
      onEnd: () => setIsPlayingNativeAudio(false),
      onError: () => setIsPlayingNativeAudio(false),
    })
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
    <div className="w-full max-w-6xl mx-auto space-y-5 pb-16 animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-china-paper hover:bg-neutral-200 text-china-ink transition-colors cursor-pointer active:scale-95"
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
              <span className="text-xs text-muted">{video.category}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-china-ink line-clamp-1">
              {video.title}
            </h1>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 self-end sm:self-auto min-w-[200px]">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-semibold text-muted mb-1">
              <span>Tiến độ luyện</span>
              <span className="text-china-red font-bold">
                {completedSentenceIds.length}/{video.sentences.length} câu ({progressPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-china-red to-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Video & Practice Deck (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Player Mode Switcher */}
          <div className="flex items-center justify-between pb-0.5">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-china-paper border border-border">
              <button
                type="button"
                onClick={() => setPlayerMode("video")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  playerMode === "video"
                    ? "bg-white text-china-red shadow-2xs border border-border"
                    : "text-muted hover:text-china-ink"
                }`}
              >
                <span>🎬 Video YouTube</span>
              </button>
              <button
                type="button"
                onClick={() => setPlayerMode("audio")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  playerMode === "audio"
                    ? "bg-white text-china-red shadow-2xs border border-border"
                    : "text-muted hover:text-china-ink"
                }`}
              >
                <span>🎧 Bàn Học Tiểu Lu</span>
              </button>
            </div>

            {playerMode === "video" && (
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-muted hover:text-china-red transition-colors flex items-center gap-1"
                title="Mở trực tiếp trên YouTube"
              >
                <span>Mở YouTube</span>
                <span>↗</span>
              </a>
            )}
          </div>

          {/* Media Player Container */}
          {playerMode === "video" ? (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-md border border-border">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?enablejsapi=1&rel=0&modestbranding=1&start=${Math.floor(currentSentence?.startTime || 0)}`}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            /* Animated Audio Stage with Chibi Little Dragon */
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1c23] to-[#0f1117] text-white shadow-md border border-border flex flex-col items-center justify-center p-6 text-center select-none">
              {/* Audio Visualizer Waves */}
              <div className="absolute inset-0 opacity-20 flex items-center justify-around px-8 pointer-events-none">
                {[40, 70, 30, 90, 60, 85, 45, 95, 50, 75, 35].map((h, i) => (
                  <div
                    key={i}
                    className={`w-2 bg-amber-400 rounded-full transition-all duration-300 ${
                      isPlayingNativeAudio ? "animate-pulse" : ""
                    }`}
                    style={{ height: isPlayingNativeAudio ? `${h}%` : "18%" }}
                  />
                ))}
              </div>

              {/* Chibi Avatar */}
              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 mb-3 transition-transform hover:scale-105">
                <Image
                  src="/chibi-loading.svg"
                  alt="Tiểu Lu Audio Studio"
                  width={112}
                  height={112}
                  priority
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>

              {/* Speaker & Current Sentence Preview */}
              <div className="relative z-10 space-y-2 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingNativeAudio ? "animate-bounce" : ""}`} />
                  <span>{currentSentence?.speaker || "Tiểu Lu phát âm"}</span>
                </div>
                <p className="font-chinese font-bold text-lg sm:text-xl text-white tracking-wide" lang="zh">
                  {currentSentence?.chinese}
                </p>
              </div>

              {/* Play / Listen Button */}
              <div className="relative z-10 pt-3">
                <button
                  type="button"
                  onClick={handlePlayNativeAudio}
                  disabled={isPlayingNativeAudio}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isPlayingNativeAudio ? "Đang phát mẫu..." : "Phát câu này (Giọng chuẩn bản xứ)"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Settings & Navigation Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-card border border-border shadow-xs text-xs">
            {/* Speed Selector */}
            <div className="flex items-center gap-1">
              <span className="text-muted font-medium hidden sm:inline mr-1">Tốc độ:</span>
              {([0.75, 0.9, 1.0] as const).map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackSpeed(rate)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    playbackSpeed === rate
                      ? "bg-china-red text-white shadow-2xs"
                      : "bg-china-paper dark:bg-white/5 text-china-ink dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-white/10"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Visibility Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  showPinyin
                    ? "bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40"
                    : "bg-china-paper dark:bg-white/5 text-muted hover:text-china-ink dark:hover:text-white border border-transparent dark:border-white/10"
                }`}
                title="Bật/Tắt Pinyin"
              >
                {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Pinyin</span>
              </button>

              <button
                onClick={() => setShowVietnamese(!showVietnamese)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  showVietnamese
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40"
                    : "bg-china-paper dark:bg-white/5 text-muted hover:text-china-ink dark:hover:text-white border border-transparent dark:border-white/10"
                }`}
                title="Bật/Tắt Tiếng Việt"
              >
                {showVietnamese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Nghĩa Việt</span>
              </button>
            </div>
          </div>

          {/* Focus Sentence Card */}
          {currentSentence && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-card border-2 border-china-red/20 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-china-paper dark:bg-white/5 text-china-ink dark:text-slate-200 border border-border">
                    Câu {currentSentenceIndex + 1}/{video.sentences.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                    ⏱️ {formatTimestamp(currentSentence.startTime)} - {formatTimestamp(currentSentence.endTime)}
                  </span>
                  {currentSentence.speaker && (
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      👤 {currentSentence.speaker}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleCompleted(currentSentence.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    completedSentenceIds.includes(currentSentence.id)
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                      : "bg-china-paper dark:bg-white/5 text-muted hover:text-china-ink dark:hover:text-white border border-border dark:border-white/10"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {completedSentenceIds.includes(currentSentence.id) ? "Đã luyện" : "Chưa hoàn thành"}
                  </span>
                </button>
              </div>

              {/* Chinese Character Display */}
              <div className="space-y-2 py-1 text-center">
                <p
                  className="font-chinese font-bold text-2xl sm:text-3xl text-china-ink tracking-wide leading-relaxed"
                  lang="zh"
                >
                  {currentSentence.chinese}
                </p>

                {showPinyin && (
                  <p className="text-sm sm:text-base font-semibold text-amber-800 dark:text-amber-400 tracking-wide">
                    {currentSentence.pinyin}
                  </p>
                )}

                {showVietnamese && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto italic">
                    "{currentSentence.vietnamese}"
                  </p>
                )}
              </div>

              {/* Media Controls: Play Video Segment & TTS Voice */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => seekAndPlayVideo(currentSentence.startTime)}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                  title="Nhảy đến đúng thời điểm câu này trong video YouTube và phát"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Xem đoạn này trên Video ({formatTimestamp(currentSentence.startTime)}) 🎬</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlayNativeAudio}
                  disabled={isPlayingNativeAudio}
                  className="px-4 py-2 rounded-2xl bg-china-paper dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 text-china-ink dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  <Volume2
                    className={`w-4 h-4 text-china-red ${isPlayingNativeAudio ? "animate-bounce" : ""}`}
                  />
                  <span>{isPlayingNativeAudio ? "Đang phát..." : "Nghe mẫu chuẩn bản xứ 🔊"}</span>
                </button>
              </div>

              {/* Voice Recorder & Comparison Deck */}
              <div className="pt-3 border-t border-border/80">
                <div className="p-4 rounded-2xl bg-china-paper/60 dark:bg-white/[0.03] border border-border/70 dark:border-white/10 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-bold text-china-ink dark:text-slate-200">
                    🎙️ Phòng Thu Âm &amp; Đối Chiếu Shadowing (Miễn phí 100%)
                  </span>

                  {recorderError && (
                    <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900/40">
                      {recorderError}
                    </p>
                  )}

                  {/* Mic Recording Button */}
                  {!audioUrl && !isRecording && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-5 py-3 rounded-2xl bg-china-red hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span>Bắt đầu thu âm giọng bạn 🎙️</span>
                    </button>
                  )}

                  {/* Recording In-progress Indicator */}
                  {isRecording && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                        <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                        <span>Đang thu âm: 00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}s</span>
                      </div>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                      >
                        <Square className="w-4 h-4 text-red-400 fill-current" />
                        <span>Dừng thu âm &amp; Nghe lại</span>
                      </button>
                    </div>
                  )}

                  {/* Recorded Audio Controls */}
                  {audioUrl && !isRecording && (
                    <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-1 animate-fade-in">
                      <button
                        type="button"
                        onClick={handlePlayUserAudio}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                          isPlayingUserAudio
                            ? "bg-emerald-600 text-white animate-pulse"
                            : "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isPlayingUserAudio ? "Đang phát giọng bạn..." : "Nghe lại giọng bạn 🎧"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-border text-china-ink dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
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
                  className="px-4 py-2 rounded-xl bg-china-paper dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-china-ink dark:text-slate-200 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === video.sentences.length - 1}
                  className="px-4 py-2 rounded-xl bg-china-paper dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-china-ink dark:text-slate-200 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <span>Câu kế tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Subtitles Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white dark:bg-card p-4 sm:p-5 rounded-3xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-china-red" />
                <h3 className="text-sm font-bold text-china-ink">Kịch Bản Phụ Đề ({video.sentences.length} câu)</h3>
              </div>
              <span className="text-[11px] text-muted">Bấm vào câu để học</span>
            </div>

            {/* Sentences List */}
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
              {video.sentences.map((sentence, index) => {
                const isActive = index === currentSentenceIndex
                const isCompleted = completedSentenceIds.includes(sentence.id)

                return (
                  <div
                    key={sentence.id}
                    onClick={() => handleSelectSentence(index)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-50/80 dark:bg-amber-500/15 border-china-red/40 dark:border-china-red/50 shadow-xs ring-1 ring-china-red/20 dark:ring-china-red/30"
                        : "bg-china-paper/40 dark:bg-white/[0.03] hover:bg-china-paper dark:hover:bg-white/[0.06] border-border/80 dark:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive
                              ? "bg-china-red text-white"
                              : "bg-neutral-200 dark:bg-white/10 text-china-ink dark:text-slate-300"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {sentence.speaker && (
                          <span className="text-[11px] font-semibold text-muted">
                            {sentence.speaker}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                          ⏱️ {formatTimestamp(sentence.startTime)}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </div>

                    <p
                      className={`font-chinese text-sm sm:text-base leading-relaxed ${
                        isActive ? "font-bold text-china-ink dark:text-white" : "text-neutral-700 dark:text-neutral-300"
                      }`}
                      lang="zh"
                    >
                      {sentence.chinese}
                    </p>

                    {showPinyin && (
                      <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium mt-0.5 line-clamp-1">
                        {sentence.pinyin}
                      </p>
                    )}

                    {showVietnamese && (
                      <p className="text-[11px] text-muted dark:text-slate-400 mt-0.5 line-clamp-1">
                        {sentence.vietnamese}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Little Dragon Chibi Encouragement Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 dark:border-amber-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 p-1 border border-border dark:border-white/10 shadow-2xs shrink-0 flex items-center justify-center">
              <Image
                src="/chibi-loading.svg"
                alt="Tiểu Lu"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div className="text-xs text-china-ink dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-900 dark:text-amber-400">Mẹo luyện của Tiểu Lu: </span>
              Hãy nghe mẫu 2–3 lần để bắt đúng ngữ điệu và ngắt nghỉ, sau đó bấm Micro thu âm đọc to rõ nhé!
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
