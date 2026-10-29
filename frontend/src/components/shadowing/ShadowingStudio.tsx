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

  const currentSentence: ShadowingSentence | undefined = video.sentences[currentSentenceIndex]

  // Reset audio recording when changing sentence
  const handleSelectSentence = (index: number) => {
    if (isRecording) {
      stopRecording()
    }
    resetRecording()
    setCurrentSentenceIndex(index)
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
            <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
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
          
          {/* YouTube Video Player Embed */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-md border border-border">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?enablejsapi=1&rel=0&modestbranding=1`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Quick Settings & Navigation Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-border shadow-xs text-xs">
            {/* Speed Selector */}
            <div className="flex items-center gap-1">
              <span className="text-muted font-medium hidden sm:inline mr-1">Tốc độ:</span>
              {([0.75, 0.9, 1.0] as const).map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackSpeed(rate)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    playbackSpeed === rate
                      ? "bg-china-red text-white shadow-2xs"
                      : "bg-china-paper text-china-ink hover:bg-neutral-200"
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
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  showPinyin
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-china-paper text-muted hover:text-china-ink"
                }`}
                title="Bật/Tắt Pinyin"
              >
                {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Pinyin</span>
              </button>

              <button
                onClick={() => setShowVietnamese(!showVietnamese)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  showVietnamese
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-china-paper text-muted hover:text-china-ink"
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
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-china-red/20 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-china-paper text-china-ink border border-border">
                    Câu {currentSentenceIndex + 1}/{video.sentences.length}
                  </span>
                  {currentSentence.speaker && (
                    <span className="text-xs font-semibold text-amber-700">
                      👤 {currentSentence.speaker}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleCompleted(currentSentence.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    completedSentenceIds.includes(currentSentence.id)
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-china-paper text-muted hover:text-china-ink border border-border"
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
                  <p className="text-sm sm:text-base font-semibold text-amber-800 tracking-wide">
                    {currentSentence.pinyin}
                  </p>
                )}

                {showVietnamese && (
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto italic">
                    "{currentSentence.vietnamese}"
                  </p>
                )}
              </div>

              {/* Native Voice Listen Button */}
              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={handlePlayNativeAudio}
                  disabled={isPlayingNativeAudio}
                  className="px-4 py-2 rounded-2xl bg-china-paper hover:bg-neutral-200 text-china-ink text-xs font-bold transition-all flex items-center gap-2 shadow-2xs active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  <Volume2
                    className={`w-4 h-4 text-china-red ${isPlayingNativeAudio ? "animate-bounce" : ""}`}
                  />
                  <span>{isPlayingNativeAudio ? "Đang phát..." : "Nghe mẫu chuẩn bản xứ 🔊"}</span>
                </button>
              </div>

              {/* Voice Recorder & Comparison Deck */}
              <div className="pt-3 border-t border-border/80">
                <div className="p-4 rounded-2xl bg-china-paper/60 border border-border/70 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-bold text-china-ink">
                    🎙️ Phòng Thu Âm &amp; Đối Chiếu Shadowing (Miễn phí 100%)
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
                            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300"
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isPlayingUserAudio ? "Đang phát giọng bạn..." : "Nghe lại giọng bạn 🎧"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-border text-china-ink text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
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
                  className="px-4 py-2 rounded-xl bg-china-paper hover:bg-neutral-200 text-china-ink text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === video.sentences.length - 1}
                  className="px-4 py-2 rounded-xl bg-china-paper hover:bg-neutral-200 text-china-ink text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
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
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border shadow-xs space-y-3">
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
                        ? "bg-amber-50/80 border-china-red/40 shadow-xs ring-1 ring-china-red/20"
                        : "bg-china-paper/40 hover:bg-china-paper border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive
                              ? "bg-china-red text-white"
                              : "bg-neutral-200 text-china-ink"
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

                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <p
                      className={`font-chinese text-sm sm:text-base leading-relaxed ${
                        isActive ? "font-bold text-china-ink" : "text-neutral-700"
                      }`}
                      lang="zh"
                    >
                      {sentence.chinese}
                    </p>

                    {showPinyin && (
                      <p className="text-[11px] text-amber-800 font-medium mt-0.5 line-clamp-1">
                        {sentence.pinyin}
                      </p>
                    )}

                    {showVietnamese && (
                      <p className="text-[11px] text-muted mt-0.5 line-clamp-1">
                        {sentence.vietnamese}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Little Panda Chibi Encouragement Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-border shadow-2xs shrink-0 flex items-center justify-center">
              <Image
                src="/chibi-loading.svg"
                alt="Tiểu Lu"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div className="text-xs text-china-ink leading-relaxed">
              <span className="font-bold text-amber-900">Mẹo luyện của Tiểu Lu: </span>
              Hãy nghe mẫu 2–3 lần để bắt đúng ngữ điệu và ngắt nghỉ, sau đó bấm Micro thu âm đọc to rõ nhé!
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
