'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  XCircle,
  BookOpen,
  BookmarkPlus,
  Check
} from 'lucide-react'
import { CurriculumWord } from '@/types/curriculum'
import { playChineseAudio } from '@/utils/audioTts'
import { db } from '../../../db/database'
import { reviewRepository } from '../../../repositories/reviewRepository'

interface LessonFlashcardsProps {
  words: CurriculumWord[]
  lessonTitle?: string
  level?: number
}

export default function LessonFlashcards({ words, lessonTitle, level = 1 }: LessonFlashcardsProps) {
  const [deck, setDeck] = useState<CurriculumWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())
  const [reviewLaterIds, setReviewLaterIds] = useState<Set<string>>(new Set())

  // Trạng thái từ đã nằm trong kho Ôn tập SRS
  const [inReviewHanziSet, setInReviewHanziSet] = useState<Set<string>>(new Set())
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isAddingAll, setIsAddingAll] = useState(false)

  const refreshInReviewStatus = useCallback(async () => {
    try {
      const allReviews = await db.reviewItems.toArray()
      const reviewWordIds = new Set(allReviews.map((r) => r.wordId))
      const wordsInDb = await db.words.where('id').anyOf(Array.from(reviewWordIds)).toArray()
      const hanziSet = new Set(wordsInDb.map((w) => w.hanzi))
      setInReviewHanziSet(hanziSet)
    } catch (err) {
      console.warn('Lỗi kiểm tra từ trong ôn tập:', err)
    }
  }, [])

  useEffect(() => {
    setDeck(words)
    setCurrentIndex(0)
    setIsFlipped(false)
    refreshInReviewStatus()
  }, [words, refreshInReviewStatus])

  if (!deck || deck.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted">
        <p>Chưa có từ vựng nào trong bài học này để tạo flashcard.</p>
      </div>
    )
  }

  const currentWord = deck[currentIndex] || deck[0]

  const ensureWordRecord = async (w: CurriculumWord): Promise<string> => {
    const wordRecord = await db.words.where('hanzi').equals(w.hanzi).first()
    if (!wordRecord) {
      const newId = `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
      await db.words.put({
        id: newId,
        hanzi: w.hanzi,
        pinyin: w.pinyin,
        meanings_vi: w.meaning ? [w.meaning] : [],
        meanings: [w.meaning || ''],
        hskLevel: [level],
        hskLevels: [level],
        sourceLevels: [`HSK${level}`],
        partOfSpeech: w.partOfSpeech ? [w.partOfSpeech] : [],
      })
      return newId
    }
    return wordRecord.id
  }

  const handleAddWordToReview = async (w: CurriculumWord, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      const wordId = await ensureWordRecord(w)
      const existing = await db.reviewItems.where('wordId').equals(wordId).first()
      if (existing) {
        setToastMessage(`Từ "${w.hanzi}" đã có sẵn trong danh sách Ôn tập rồi!`)
        setTimeout(() => setToastMessage(null), 3000)
        return
      }

      await reviewRepository.add(wordId)
      setInReviewHanziSet((prev) => new Set(prev).add(w.hanzi))
      window.dispatchEvent(new CustomEvent('hsk-words-updated'))
      setToastMessage(`✓ Đã thêm từ "${w.hanzi}" (${w.pinyin}) vào Ôn tập!`)
      setTimeout(() => setToastMessage(null), 3000)
    } catch (err) {
      console.warn(err)
      setToastMessage('Không thể thêm vào Ôn tập (Có thể đã chạm hạn mức)')
      setTimeout(() => setToastMessage(null), 3500)
    }
  }

  const handleAddAllToReview = async () => {
    if (deck.length === 0 || isAddingAll) return
    setIsAddingAll(true)
    try {
      let addedCount = 0
      const newSet = new Set(inReviewHanziSet)

      for (const w of deck) {
        if (!newSet.has(w.hanzi)) {
          const wordId = await ensureWordRecord(w)
          const existing = await db.reviewItems.where('wordId').equals(wordId).first()
          if (!existing) {
            await reviewRepository.add(wordId)
            newSet.add(w.hanzi)
            addedCount++
          }
        }
      }

      setInReviewHanziSet(newSet)
      window.dispatchEvent(new CustomEvent('hsk-words-updated'))
      if (addedCount > 0) {
        setToastMessage(`✓ Đã nạp thành công ${addedCount} từ vào lộ trình Ôn tập!`)
      } else {
        setToastMessage(`Tất cả ${deck.length} từ trong bài học đã có trong Ôn tập rồi!`)
      }
      setTimeout(() => setToastMessage(null), 3500)
    } catch (err) {
      console.warn(err)
      setToastMessage('Đã thêm từ đến giới hạn của tài khoản!')
      setTimeout(() => setToastMessage(null), 3500)
    } finally {
      setIsAddingAll(false)
    }
  }

  const playAudio = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    playChineseAudio(text)
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

  const handleMarkMastered = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const newMastered = new Set(masteredIds)
    newMastered.add(currentWord.id)
    setMasteredIds(newMastered)

    const newReview = new Set(reviewLaterIds)
    newReview.delete(currentWord.id)
    setReviewLaterIds(newReview)

    // Tự động đảm bảo từ này có trong kho Ôn tập
    try {
      const wordId = await ensureWordRecord(currentWord)
      const existing = await db.reviewItems.where('wordId').equals(wordId).first()
      if (!existing) {
        await reviewRepository.add(wordId)
        setInReviewHanziSet((prev) => new Set(prev).add(currentWord.hanzi))
        window.dispatchEvent(new CustomEvent('hsk-words-updated'))
      }
    } catch {}

    handleNext()
  }

  const handleMarkReview = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const newReview = new Set(reviewLaterIds)
    newReview.add(currentWord.id)
    setReviewLaterIds(newReview)

    const newMastered = new Set(masteredIds)
    newMastered.delete(currentWord.id)
    setMasteredIds(newMastered)

    // Tự động đảm bảo từ này có trong kho Ôn tập
    try {
      const wordId = await ensureWordRecord(currentWord)
      const existing = await db.reviewItems.where('wordId').equals(wordId).first()
      if (!existing) {
        await reviewRepository.add(wordId)
        setInReviewHanziSet((prev) => new Set(prev).add(currentWord.hanzi))
        window.dispatchEvent(new CustomEvent('hsk-words-updated'))
      }
    } catch {}

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
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-card border border-border p-3.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-china-ink">
            Thẻ <span className="text-china-red font-bold text-sm">{currentIndex + 1}</span> / {deck.length}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-md font-medium border border-emerald-200 dark:border-emerald-500/30">
              Đã thuộc: {masteredIds.size}
            </span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 rounded-md font-medium border border-amber-200 dark:border-amber-500/30">
              Cần ôn: {reviewLaterIds.size}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddAllToReview}
            disabled={isAddingAll || deck.every((w) => inReviewHanziSet.has(w.hanzi))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer border disabled:opacity-60 disabled:cursor-not-allowed bg-china-red/10 text-china-red border-china-red/20 hover:bg-china-red hover:text-white"
            title="Nạp toàn bộ từ của bài học vào lộ trình Ôn tập lặp lại ngắt quãng"
          >
            {isAddingAll ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : deck.every((w) => inReviewHanziSet.has(w.hanzi)) ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <BookmarkPlus className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isAddingAll
                ? 'Đang thêm...'
                : deck.every((w) => inReviewHanziSet.has(w.hanzi))
                ? 'Đã trong Ôn tập'
                : `Thêm cả ${deck.length} từ vào Ôn tập`}
            </span>
            <span className="sm:hidden">
              {isAddingAll
                ? 'Đang thêm'
                : deck.every((w) => inReviewHanziSet.has(w.hanzi))
                ? 'Đã thêm'
                : `+ ${deck.length} từ`}
            </span>
          </button>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-china-ink dark:hover:text-white bg-china-paper dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg transition cursor-pointer border border-border"
            title="Xáo trộn thứ tự từ"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trộn thẻ</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
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
              ? 'bg-gradient-to-br from-china-paper via-white to-amber-50/40 dark:from-card dark:via-card dark:to-amber-950/20 border-amber-200 dark:border-amber-500/30 rotate-y-180'
              : 'bg-white dark:bg-card border-border hover:border-china-red/40'
          }`}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Card Badges */}
          <div className="w-full flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-china-paper dark:bg-white/5 text-muted dark:text-slate-300 font-medium border border-border">
              {currentWord.partOfSpeech || 'Từ vựng'}
            </span>

            <div className="flex items-center gap-1.5">
              {isMastered && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                  Đã thuộc
                </span>
              )}
              {isReview && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                  Cần ôn lại
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddWordToReview(currentWord)
                }}
                disabled={inReviewHanziSet.has(currentWord.hanzi)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  inReviewHanziSet.has(currentWord.hanzi)
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 cursor-default'
                    : 'bg-china-paper dark:bg-white/10 text-china-ink dark:text-slate-200 border-border hover:border-china-red/40 hover:text-china-red active:scale-95'
                }`}
                title={
                  inReviewHanziSet.has(currentWord.hanzi)
                    ? 'Từ này đã có trong lộ trình Ôn tập'
                    : 'Thêm từ này vào lộ trình Ôn tập lặp lại ngắt quãng'
                }
              >
                {inReviewHanziSet.has(currentWord.hanzi) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Đã trong Ôn tập</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5 text-china-red" />
                    <span>+ Ôn tập</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => playAudio(currentWord.hanzi, e)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-china-paper dark:bg-white/10 hover:bg-china-red hover:text-white active:bg-china-red active:text-white text-china-ink dark:text-slate-200 transition touch-manipulation cursor-pointer"
                title="Phát âm"
                aria-label="Phát âm từ"
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
                <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-transparent dark:border-white/10">
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
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Hán-Việt: <span className="text-china-ink dark:text-slate-200">{currentWord.hanViet}</span>
                </div>
              )}

              <div className="p-3 bg-white/90 dark:bg-neutral-900/90 border border-border/80 dark:border-white/10 rounded-2xl max-w-md mx-auto shadow-xs">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-500/40 transition cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Chưa nhớ</span>
            </button>

            <span className="text-xs text-muted font-medium">
              Phím cách (Space) để lật
            </span>

            <button
              type="button"
              onClick={handleMarkMastered}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-500/40 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Đã thuộc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Nav Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-card border border-border hover:bg-china-paper dark:hover:bg-white/5 text-xs font-bold text-china-ink shadow-xs transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Thẻ trước</span>
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-china-paper dark:bg-card hover:bg-neutral-100 dark:hover:bg-white/5 border border-border text-xs font-bold text-china-ink transition shadow-xs cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-china-red" />
          <span>Lật thẻ</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <span>Thẻ tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-neutral-800/95 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full shadow-xl border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
