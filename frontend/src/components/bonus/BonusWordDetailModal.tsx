"use client"

import React, { useEffect } from "react"
import { Volume2, X, BookOpen, Star, Sparkles, Tag, Layers, Check } from "lucide-react"
import type { BonusWord } from "@/types/bonus"
import { getHanViet } from "@/utils/hanviet"

interface BonusWordDetailModalProps {
  word: BonusWord | null
  isOpen: boolean
  onClose: () => void
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
}

export default function BonusWordDetailModal({
  word,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}: BonusWordDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !word) return null

  const isZh = word.language === "zh"
  const hanViet = isZh && word.hanzi ? getHanViet(word.hanzi) : ""

  const playAudio = (text: string, lang: "zh" | "en" = "zh") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "zh" ? "zh-CN" : "en-US"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-china-red/10 text-china-red rounded-lg">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {word.category || word.topic || "Chi tiết từ vựng"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(word.id)}
                title={isFavorite ? "Bỏ lưu từ" : "Lưu từ yêu thích"}
                className={`p-2 rounded-xl transition-colors ${
                  isFavorite 
                    ? "text-amber-500 bg-amber-50" 
                    : "text-muted hover:text-amber-500 hover:bg-gray-100"
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-500" : ""}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-china-ink hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Word Hero */}
          <div className="text-center bg-china-paper/40 p-6 rounded-2xl border border-border/80 relative">
            <h2 className={`font-bold font-serif text-china-ink mb-2 select-all ${
              isZh ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
            }`}>
              {word.word}
            </h2>

            {/* Pronunciation & Audio */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
              <span className={`text-xl sm:text-2xl font-medium ${isZh ? "text-china-red" : "text-blue-600"}`}>
                {word.pinyin || word.phonetic}
              </span>
              <button
                onClick={() => playAudio(word.word, word.language)}
                title="Nghe phát âm"
                className="p-1.5 text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Sino-Vietnamese reading if Chinese */}
            {hanViet && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs sm:text-sm font-semibold text-amber-900 mb-2">
                <span>Hán-Việt:</span>
                <span className="font-serif">{hanViet}</span>
              </div>
            )}

            {/* Part of Speech & Topic Tags */}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-2">
              {word.partOfSpeech && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-white border border-border text-china-ink shadow-2xs">
                  {word.partOfSpeech}
                </span>
              )}
              {word.topic && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-china-jade/10 text-china-jade border border-china-jade/20">
                  {word.topic}
                </span>
              )}
            </div>
          </div>

          {/* Meaning Section */}
          <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs">
            <p className="text-xs uppercase tracking-wider text-muted font-bold flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-china-gold" /> Nghĩa tiếng Việt
            </p>
            <p className="text-base sm:text-lg font-semibold text-china-ink leading-relaxed">
              {word.meaning}
            </p>
          </div>

          {/* Example Sentence Section */}
          {word.example && (
            <div className="bg-china-paper/60 p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wider text-muted font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-china-red" /> Câu ví dụ thực tế
                </p>
                <button
                  onClick={() => playAudio(word.example || "", word.language)}
                  title="Nghe câu ví dụ"
                  className="p-1 text-china-red hover:bg-china-red/10 rounded-md transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className={`text-china-ink font-medium leading-relaxed mb-1.5 ${
                isZh ? "text-lg sm:text-xl font-serif" : "text-base sm:text-lg"
              }`}>
                {word.example}
              </p>

              {word.examplePinyin && (
                <p className="text-xs sm:text-sm text-china-red/90 italic font-mono mb-2">
                  {word.examplePinyin}
                </p>
              )}
            </div>
          )}

          {/* Synonyms if available */}
          {word.synonyms && word.synonyms.length > 0 && (
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/60">
              <p className="text-xs uppercase tracking-wider text-blue-700 font-bold mb-1.5">
                Từ đồng nghĩa & Liên quan
              </p>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map((syn, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-blue-200 rounded-md text-xs font-medium text-blue-800">
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border bg-china-paper/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-china-ink text-white text-xs sm:text-sm font-semibold hover:bg-china-ink/80 transition-colors shadow-xs active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
