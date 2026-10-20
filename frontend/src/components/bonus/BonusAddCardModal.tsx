"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { BonusWord } from "@/types/bonus"
import { assistWordCreation } from "@/utils/bonusAssistant"
import { getHanViet } from "@/utils/hanviet"

interface BonusAddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveCard: (card: BonusWord) => void
  language?: "zh" | "en"
  defaultTopic?: string
  editCard?: BonusWord | null
}

export default function BonusAddCardModal({
  isOpen,
  onClose,
  onSaveCard,
  language = "zh",
  defaultTopic = "Từ vựng tự thêm",
  editCard = null,
}: BonusAddCardModalProps) {
  const [word, setWord] = useState("")
  const [pinyin, setPinyin] = useState("")
  const [phonetic, setPhonetic] = useState("")
  const [hanViet, setHanViet] = useState("")
  const [partOfSpeech, setPartOfSpeech] = useState("Từ vựng")
  const [meaning, setMeaning] = useState("")
  const [example, setExample] = useState("")
  const [examplePinyin, setExamplePinyin] = useState("")
  const [topic, setTopic] = useState(defaultTopic)

  const [isTranslating, setIsTranslating] = useState(false)
  const [assistantFeedback, setAssistantFeedback] = useState<string | null>(null)

  const isZh = language === "zh"

  // Reset or populate when opening
  useEffect(() => {
    if (isOpen) {
      if (editCard) {
        setWord(editCard.word || "")
        setPinyin(editCard.pinyin || "")
        setPhonetic(editCard.phonetic || "")
        setHanViet(editCard.hanViet || (editCard.hanzi ? getHanViet(editCard.hanzi) : ""))
        setPartOfSpeech(editCard.partOfSpeech || "Từ vựng")
        setMeaning(editCard.meaning || "")
        setExample(editCard.example || "")
        setExamplePinyin(editCard.examplePinyin || "")
        setTopic(editCard.topic || defaultTopic)
      } else {
        setWord("")
        setPinyin("")
        setPhonetic("")
        setHanViet("")
        setPartOfSpeech("Từ vựng")
        setMeaning("")
        setExample("")
        setExamplePinyin("")
        setTopic(defaultTopic)
      }
      setAssistantFeedback(null)
    }
  }, [isOpen, editCard, defaultTopic])

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Auto-translate & Assistant function
  const handleAutoAssist = async () => {
    const trimmed = word.trim()
    if (!trimmed) {
      setAssistantFeedback("Vui lòng nhập từ vựng trước khi dịch.")
      return
    }

    setIsTranslating(true)
    setAssistantFeedback(null)

    try {
      const res = await assistWordCreation(trimmed, language)

      if (isZh) {
        if (res.pinyin && !pinyin) setPinyin(res.pinyin)
        if (res.hanViet) setHanViet(res.hanViet)
        if (res.meaning && !meaning) setMeaning(res.meaning)
        if (res.partOfSpeech && partOfSpeech === "Từ vựng") setPartOfSpeech(res.partOfSpeech)
        if (res.example && !example) setExample(res.example)
        if (res.examplePinyin && !examplePinyin) setExamplePinyin(res.examplePinyin)
      } else {
        if (res.meaning && !meaning) setMeaning(res.meaning)
        if (res.example && !example) setExample(res.example)
      }

      setAssistantFeedback("Đã phân tích & điền tự động thành công!")
      setTimeout(() => setAssistantFeedback(null), 3500)
    } catch (e) {
      console.error(e)
      setAssistantFeedback("Lỗi dịch thuật, bạn có thể tự nhập thủ công.")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!word.trim()) return

    const newCard: BonusWord = {
      id: editCard?.id || `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      stt: editCard?.stt || Date.now(),
      word: word.trim(),
      hanzi: isZh ? word.trim() : undefined,
      pinyin: isZh ? pinyin.trim() : undefined,
      phonetic: !isZh ? phonetic.trim() : undefined,
      hanViet: isZh ? (hanViet.trim() || getHanViet(word.trim())) : undefined,
      partOfSpeech: partOfSpeech.trim() || "Từ vựng",
      meaning: meaning.trim() || word.trim(),
      example: example.trim() || undefined,
      examplePinyin: isZh ? examplePinyin.trim() || undefined : undefined,
      topic: topic.trim() || defaultTopic,
      language,
      isCustom: true,
      createdAt: editCard?.createdAt || Date.now(),
    }

    onSaveCard(newCard)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/60">
          <div>
            <h3 className="font-serif font-bold text-china-ink text-base sm:text-lg">
              {editCard ? "Chỉnh sửa thẻ từ vựng" : "Thêm thẻ từ vựng mới"}
            </h3>
            <p className="text-xs text-muted">
              {isZh ? "Bộ từ tiếng Trung · Tự động tính Pinyin & Hán-Việt" : "Bộ từ tiếng Anh · Hỗ trợ tra nghĩa tự động"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-china-ink rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Word Input & Assistant Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              {isZh ? "Chữ Hán / Từ vựng *" : "Từ tiếng Anh *"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={word}
                onChange={(e) => {
                  setWord(e.target.value)
                  if (isZh && e.target.value) {
                    setHanViet(getHanViet(e.target.value))
                  }
                }}
                placeholder={isZh ? "Ví dụ: 梦想, 努力..." : "Ví dụ: negotiate, flexible..."}
                className="flex-1 px-3.5 py-2.5 bg-china-paper border border-border rounded-xl text-sm text-china-ink font-serif focus:outline-hidden focus:border-china-red transition-colors"
              />
              <button
                type="button"
                onClick={handleAutoAssist}
                disabled={isTranslating || !word.trim()}
                className="px-4 py-2.5 rounded-xl bg-china-ink hover:bg-china-ink/80 text-white text-xs font-semibold disabled:opacity-40 transition-colors whitespace-nowrap shadow-xs active:scale-95"
              >
                {isTranslating ? "Đang dịch..." : "Dịch & Tự động điền"}
              </button>
            </div>
            {assistantFeedback && (
              <p className="text-[11px] font-medium text-china-jade">
                {assistantFeedback}
              </p>
            )}
          </div>

          {/* Pronunciation & Sino-Vietnamese reading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isZh ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Phiên âm Pinyin
                  </label>
                  <input
                    type="text"
                    value={pinyin}
                    onChange={(e) => setPinyin(e.target.value)}
                    placeholder="Ví dụ: mèngxiǎng"
                    className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm font-mono text-china-ink focus:outline-hidden focus:border-china-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Âm Hán-Việt
                  </label>
                  <input
                    type="text"
                    value={hanViet}
                    onChange={(e) => setHanViet(e.target.value)}
                    placeholder="Tự động tính từ chữ Hán"
                    className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink font-serif focus:outline-hidden focus:border-china-red"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Phiên âm IPA
                </label>
                <input
                  type="text"
                  value={phonetic}
                  onChange={(e) => setPhonetic(e.target.value)}
                  placeholder="Ví dụ: /nəˌɡoʊ.ʃiˈeɪt/"
                  className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm font-mono text-china-ink focus:outline-hidden focus:border-china-red"
                />
              </div>
            )}
          </div>

          {/* Part of Speech & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Loại từ
              </label>
              <input
                type="text"
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                placeholder="Động từ, Danh từ, Tính từ..."
                className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Chủ đề / Bài học
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Chủ đề của từ..."
                className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
              />
            </div>
          </div>

          {/* Meaning Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Nghĩa tiếng Việt *
            </label>
            <textarea
              required
              rows={2}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="Nhập nghĩa tiếng Việt chi tiết..."
              className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red resize-none"
            />
          </div>

          {/* Example Sentence */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Câu ví dụ minh họa
            </label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder={isZh ? "Ví dụ: 我每天都在为了梦想而努力。" : "Ví dụ: We need to negotiate a better deal."}
              className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
            />
          </div>

          {/* Example Pinyin (if Chinese) */}
          {isZh && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Phiên âm của câu ví dụ
              </label>
              <input
                type="text"
                value={examplePinyin}
                onChange={(e) => setExamplePinyin(e.target.value)}
                placeholder="Wǒ měitiān dōu zài wèile mèngxiǎng ér nǔlì."
                className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm font-mono text-china-ink focus:outline-hidden focus:border-china-red"
              />
            </div>
          )}

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-white hover:bg-china-paper text-xs sm:text-sm font-medium text-china-ink transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold shadow-xs transition-colors active:scale-95"
            >
              {editCard ? "Cập nhật thẻ" : "Lưu thẻ vào bộ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
