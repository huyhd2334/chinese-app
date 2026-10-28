'use client'

import React, { useState, useEffect } from 'react'
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen
} from 'lucide-react'
import { CurriculumWord } from '@/types/curriculum'

interface LessonFlashcardsProps {
  words: CurriculumWord[]
  lessonTitle?: string
}

export default function LessonFlashcards({ words, lessonTitle }: LessonFlashcardsProps) {
  const [deck, setDeck] = useState<CurriculumWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())
  const [reviewLaterIds, setReviewLaterIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setDeck(words)
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [words])

  if (!deck || deck.length === 0) {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted">
        <p>Chưa có từ vựng nào trong bài học này để tạo flashcard.</p>
      </div>
    )
  }

  const currentWord = deck[currentIndex] || deck[0]

  const playAudio = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      playAudio(currentWord.hanzi)
    }
  }

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % deck.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length)
  }

  const handleMarkMastered = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newMastered = new Set(masteredIds)
    newMastered.add(currentWord.id)
    setMasteredIds(newMastered)

    const newReview = new Set(reviewLaterIds)
    newReview.delete(currentWord.id)
    setReviewLaterIds(newReview)

    handleNext()
  }

  const handleMarkReview = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newReview = new Set(reviewLaterIds)
    newReview.add(currentWord.id)
    setReviewLaterIds(newReview)

    const newMastered = new Set(masteredIds)
    newMastered.delete(currentWord.id)
    setMasteredIds(newMastered)

    handleNext()
  }

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const isMastered = masteredIds.has(currentWord.id)
  const isReview = reviewLaterIds.has(currentWord.id)
  const progressPercent = Math.round((masteredIds.size / deck.length) * 100)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Top Deck Stats & Controls */}
      <div className="flex items-center justify-between gap-4 bg-white border border-border p-3.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-china-ink">
            Thẻ <span className="text-china-red font-bold text-sm">{currentIndex + 1}</span> / {deck.length}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
              Đã thuộc: {masteredIds.size}
            </span>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200">
              Cần ôn: {reviewLaterIds.size}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-muted hover:text-china-ink bg-china-paper hover:bg-neutral-100 rounded-lg transition"
            title="Xáo trộn thứ tự từ"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trộn thẻ</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-china-red h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="relative cursor-pointer min-h-[320px] select-none perspective-1000"
      >
        <div
          className={`relative w-full min-h-[320px] rounded-3xl p-8 flex flex-col items-center justify-between transition-transform duration-500 transform-style-3d shadow-md border ${
            isFlipped
              ? 'bg-gradient-to-br from-china-paper via-white to-amber-50/40 border-amber-200 rotate-y-180'
              : 'bg-white border-border hover:border-china-red/40'
          }`}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Card Badges */}
          <div className="w-full flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-china-paper text-muted font-medium border border-border">
              {currentWord.partOfSpeech || 'Từ vựng'}
            </span>

            <div className="flex items-center gap-1.5">
              {isMastered && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Đã thuộc
                </span>
              )}
              {isReview && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                  Cần ôn lại
                </span>
              )}
              <button
                type="button"
                onClick={(e) => playAudio(currentWord.hanzi, e)}
                className="p-1.5 rounded-full bg-china-paper hover:bg-china-red hover:text-white text-china-ink transition"
                title="Phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FRONT OF CARD */}
          {!isFlipped ? (
            <div className="my-auto text-center space-y-4">
              <div className="text-6xl sm:text-7xl font-serif font-bold text-china-ink tracking-wide">
                {currentWord.hanzi}
              </div>

              {currentWord.hanViet && (
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                  Âm Hán-Việt: {currentWord.hanViet}
                </div>
              )}

              <p className="text-xs text-muted flex items-center justify-center gap-1 pt-2">
                <RotateCw className="w-3.5 h-3.5 text-china-red animate-spin-slow" />
                <span>Bấm vào thẻ để lật xem Pinyin &amp; Nghĩa</span>
              </p>
            </div>
          ) : (
            /* BACK OF CARD */
            <div
              className="my-auto text-center space-y-3.5"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="text-4xl font-serif font-bold text-china-ink">
                {currentWord.hanzi}
              </div>

              <div className="text-2xl font-sans font-bold text-china-red">
                {currentWord.pinyin}
              </div>

              {currentWord.hanViet && (
                <div className="text-xs font-semibold text-slate-600">
                  Hán-Việt: <span className="text-china-ink">{currentWord.hanViet}</span>
                </div>
              )}

              <div className="p-3 bg-white/90 border border-border/80 rounded-2xl max-w-md mx-auto shadow-xs">
                <p className="text-sm font-semibold text-china-ink leading-relaxed">
                  {currentWord.meaning}
                </p>
              </div>

              <p className="text-[11px] text-muted">Bấm lại để lật về chữ Hán</p>
            </div>
          )}

          {/* Card Footer Action Bar */}
          <div
            className="w-full flex items-center justify-between pt-4 border-t border-border/60"
            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
          >
            <button
              type="button"
              onClick={handleMarkReview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition"
            >
              <XCircle className="w-4 h-4 text-amber-600" />
              <span>Chưa nhớ</span>
            </button>

            <span className="text-xs text-muted font-medium">
              Phím cách (Space) để lật
            </span>

            <button
              type="button"
              onClick={handleMarkMastered}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã thuộc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Nav Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-border hover:bg-china-paper text-xs font-bold text-china-ink shadow-xs transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Thẻ trước</span>
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-china-paper hover:bg-neutral-100 border border-border text-xs font-bold text-china-ink transition shadow-xs"
        >
          <RotateCw className="w-3.5 h-3.5 text-china-red" />
          <span>Lật thẻ</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold shadow-xs transition"
        >
          <span>Thẻ tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
