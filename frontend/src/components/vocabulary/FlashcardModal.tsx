"use client"

import React, { useState, useEffect, useCallback } from "react"
import { type Word } from "../../../db/database"
import { Volume2, X, RotateCw, Check, ArrowRight, ArrowLeft, Sparkles, BookOpen } from "lucide-react"

interface FlashcardModalProps {
  isOpen: boolean
  onClose: () => void
  words: Word[]
  onMarkLearned?: (wordId: string) => void
}

export default function FlashcardModal({ isOpen, onClose, words, onMarkLearned }: FlashcardModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [rememberedCount, setRememberedCount] = useState(0)
  const [forgottenCount, setForgottenCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  // Reset when opening modal with new words
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
      setIsFlipped(false)
      setRememberedCount(0)
      setForgottenCount(0)
      setIsFinished(false)
    }
  }, [isOpen])

  const currentWord = words[currentIndex]

  const playAudio = useCallback((text?: string) => {
    if (!text) return
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const handleNext = useCallback((remembered: boolean) => {
    if (remembered) {
      setRememberedCount(prev => prev + 1)
      if (currentWord && onMarkLearned) {
        onMarkLearned(currentWord.id)
      }
    } else {
      setForgottenCount(prev => prev + 1)
    }

    setIsFlipped(false)
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }, [currentIndex, currentWord, onMarkLearned, words.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || isFinished) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        setIsFlipped(prev => !prev)
      } else if (e.code === "ArrowRight") {
        e.preventDefault()
        handleNext(true)
      } else if (e.code === "ArrowLeft") {
        e.preventDefault()
        handleNext(false)
      } else if (e.code === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFinished, handleNext, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-china-red/10 text-china-red rounded-xl">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-china-ink text-base">Flashcard Practice</h3>
              <p className="text-xs text-muted">
                {isFinished ? "Completed" : `Card ${currentIndex + 1} of ${words.length}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-china-ink hover:bg-border/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isFinished && currentWord ? (
          <div className="p-6 md:p-8 flex flex-col items-center">
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-border/50 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-china-jade transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              />
            </div>

            {/* Flashcard container with 3D Flip */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-72 md:h-80 cursor-pointer perspective select-none group"
            >
              <div
                className={`relative w-full h-full rounded-2xl border-2 transition-transform duration-500 transform-style-3d p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg ${
                  isFlipped ? "rotate-y-180 border-china-gold/40 bg-china-paper" : "border-china-red/30 bg-card"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {/* Front Side */}
                <div
                  className={`absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden ${
                    isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 px-3 py-1 bg-china-paper rounded-full border border-border">
                    Click or Press Space to Flip
                  </span>
                  <h2 className={`font-serif font-bold text-china-ink mb-4 whitespace-nowrap ${
                    currentWord.hanzi.length <= 1
                      ? 'text-7xl md:text-8xl'
                      : currentWord.hanzi.length === 2
                      ? 'text-5xl md:text-6xl'
                      : currentWord.hanzi.length === 3
                      ? 'text-4xl md:text-5xl'
                      : 'text-3xl md:text-4xl'
                  }`}>
                    {currentWord.hanzi}
                  </h2>
                  {currentWord.traditional && currentWord.traditional !== currentWord.hanzi && (
                    <p className="text-lg font-serif text-muted mb-2">
                      {currentWord.traditional} <span className="text-xs font-sans">(Phồn thể)</span>
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio(currentWord.hanzi)
                    }}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-china-red bg-china-red/10 hover:bg-china-red/20 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" /> Listen
                  </button>
                </div>

                {/* Back Side */}
                <div
                  className={`absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden ${
                    isFlipped ? "opacity-100" : "pointer-events-none opacity-0"
                  } transition-opacity duration-300`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <p className="text-3xl md:text-4xl font-medium text-china-red mb-2">
                    {currentWord.pinyin}
                  </p>
                  <div className="w-12 h-0.5 bg-china-gold/50 my-2" />
                  <p className="text-lg md:text-xl font-medium text-china-ink max-w-sm mb-3">
                    {currentWord.meanings_vi ? currentWord.meanings_vi.join(", ") : currentWord.meanings?.join(", ")}
                  </p>
                  {currentWord.partOfSpeech && currentWord.partOfSpeech.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap justify-center mb-2">
                      {currentWord.partOfSpeech.map((pos, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-border text-china-ink rounded-md font-medium">
                          {pos}
                        </span>
                      ))}
                    </div>
                  )}
                  {currentWord.classifiers && currentWord.classifiers.length > 0 && (
                    <p className="text-xs text-muted">
                      Lượng từ: <span className="font-serif text-china-ink font-semibold">{currentWord.classifiers.join(", ")}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleNext(false)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 hover:border-red-300 transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Chưa nhớ (←)
              </button>
              <button
                onClick={() => handleNext(true)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-china-jade/30 bg-china-jade text-white font-medium text-sm hover:bg-china-jade/90 transition-all active:scale-95 shadow-sm"
              >
                Đã nhớ (→) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Finished State */
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-china-jade/10 text-china-jade flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-china-ink mb-2">Hoàn thành buổi luyện tập!</h3>
            <p className="text-sm text-muted mb-6">Bạn vừa ôn luyện xong {words.length} thẻ từ vựng.</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-center">
                <span className="text-3xl font-serif font-bold text-green-600">{rememberedCount}</span>
                <p className="text-xs font-semibold text-green-700 mt-1">ĐÃ NHỚ</p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                <span className="text-3xl font-serif font-bold text-red-600">{forgottenCount}</span>
                <p className="text-xs font-semibold text-red-700 mt-1">CẦN ÔN LẠI</p>
              </div>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  setCurrentIndex(0)
                  setIsFlipped(false)
                  setRememberedCount(0)
                  setForgottenCount(0)
                  setIsFinished(false)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-card text-china-ink font-medium text-sm hover:bg-china-paper transition-colors shadow-sm"
              >
                <RotateCw className="w-4 h-4" /> Ôn lại
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-china-red text-white font-medium text-sm hover:bg-china-red-hover transition-colors shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
