"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { BonusWord } from "@/types/bonus"
import { assistWordCreation, batchAssistWords } from "@/utils/bonusAssistant"
import { getHanViet } from "@/utils/hanviet"

interface BonusAddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveCard: (card: BonusWord) => void
  onSaveCards?: (cards: BonusWord[]) => void
  language?: "zh" | "en"
  defaultTopic?: string
  editCard?: BonusWord | null
  initialTab?: "single" | "bulk"
}

export default function BonusAddCardModal({
  isOpen,
  onClose,
  onSaveCard,
  onSaveCards,
  language = "zh",
  defaultTopic = "Từ vựng tự thêm",
  editCard = null,
  initialTab = "single",
}: BonusAddCardModalProps) {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single")

  // Single word form state
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

  // Bulk add state
  const [bulkInput, setBulkInput] = useState("")
  const [bulkTopic, setBulkTopic] = useState(defaultTopic)
  const [isBatchProcessing, setIsBatchProcessing] = useState(false)
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null)
  const [bulkPreviewCards, setBulkPreviewCards] = useState<BonusWord[]>([])

  const isZh = language === "zh"

  // Reset or populate on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(editCard ? "single" : initialTab)
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
      setBulkInput("")
      setBulkTopic(defaultTopic)
      setIsBatchProcessing(false)
      setBatchProgress(null)
      setBulkPreviewCards([])
    }
  }, [isOpen, editCard, defaultTopic, initialTab])

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

  // Single word: Auto-translate & Assistant function
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
      setTimeout(() => setAssistantFeedback(null), 3000)
    } catch (e) {
      console.error(e)
      setAssistantFeedback("Lỗi tra từ, bạn có thể tự nhập thủ công.")
    } finally {
      setIsTranslating(false)
    }
  }

  // Single word submit
  const handleSingleSubmit = (e: React.FormEvent) => {
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

  // Bulk: Process input list
  const handleStartBatchProcess = async () => {
    const rawLines = bulkInput.split("\n").map(l => l.trim()).filter(Boolean)
    if (rawLines.length === 0) return

    setIsBatchProcessing(true)
    setBatchProgress({ done: 0, total: rawLines.length })

    try {
      const generatedCards = await batchAssistWords(
        rawLines,
        language,
        (done, total) => {
          setBatchProgress({ done, total })
        }
      )

      // Apply selected topic to all batch cards
      const tagged = generatedCards.map(c => ({
        ...c,
        topic: bulkTopic.trim() || defaultTopic
      }))

      setBulkPreviewCards(tagged)
    } catch (e) {
      console.error(e)
      alert("Đã xảy ra lỗi trong quá trình xử lý hàng loạt.")
    } finally {
      setIsBatchProcessing(false)
    }
  }

  // Bulk: Remove card from preview
  const handleRemovePreviewCard = (index: number) => {
    setBulkPreviewCards(prev => prev.filter((_, i) => i !== index))
  }

  // Bulk: Update preview meaning
  const handleUpdatePreviewMeaning = (index: number, newMeaning: string) => {
    setBulkPreviewCards(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], meaning: newMeaning }
      return copy
    })
  }

  // Bulk: Save all preview cards
  const handleSaveAllBulk = () => {
    if (bulkPreviewCards.length === 0) return

    if (onSaveCards) {
      onSaveCards(bulkPreviewCards)
    } else {
      bulkPreviewCards.forEach(c => onSaveCard(c))
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/60">
          <div>
            <h3 className="font-serif font-bold text-china-ink text-base sm:text-lg">
              {editCard ? "Chỉnh sửa thẻ từ vựng" : "Thêm từ vựng vào bộ"}
            </h3>
            <p className="text-xs text-muted">
              {isZh ? "Tiếng Trung · Tự động tính Pinyin & Hán-Việt" : "Tiếng Anh · Hỗ trợ tra nghĩa tự động"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-china-ink rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher (only when creating new cards) */}
        {!editCard && (
          <div className="flex border-b border-border bg-white px-6 pt-3 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "single"
                  ? "border-china-red text-china-red"
                  : "border-transparent text-muted hover:text-china-ink"
              }`}
            >
              Thêm 1 từ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bulk")}
              className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "bulk"
                  ? "border-china-red text-china-red"
                  : "border-transparent text-muted hover:text-china-ink"
              }`}
            >
              Thêm nhiều từ cùng lúc
            </button>
          </div>
        )}

        {/* TAB 1: SINGLE WORD FORM */}
        {activeTab === "single" && (
          <form onSubmit={handleSingleSubmit} className="p-6 overflow-y-auto space-y-4">
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
                  className="px-4 py-2.5 rounded-xl bg-china-ink hover:bg-china-ink/80 text-white text-xs font-semibold disabled:opacity-40 transition-colors whitespace-nowrap active:scale-95"
                >
                  {isTranslating ? "Đang dịch..." : "Dịch & Điền tự động"}
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
                  Chủ đề
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
                placeholder="Nhập nghĩa tiếng Việt..."
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
                className="px-5 py-2 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold transition-colors active:scale-95"
              >
                {editCard ? "Cập nhật thẻ" : "Lưu thẻ vào bộ"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: BULK ADD FORM */}
        {activeTab === "bulk" && (
          <div className="p-6 overflow-y-auto space-y-4">
            {bulkPreviewCards.length === 0 ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Danh sách từ vựng (mỗi từ một dòng)
                  </label>
                  <p className="text-xs text-muted">
                    Hỗ trợ định dạng: <code>từ vựng</code> hoặc <code>từ vựng - nghĩa</code> (tự động phân tích Pinyin, Hán-Việt và dịch nghĩa).
                  </p>
                  <textarea
                    rows={7}
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder={isZh ? "苹果\n梦想 - giấc mơ, hoài bão\n学校\n努力" : "negotiate\ncontract - hợp đồng\nrevenue\nflexible"}
                    className="w-full px-3.5 py-2.5 bg-china-paper border border-border rounded-xl text-sm font-mono text-china-ink focus:outline-hidden focus:border-china-red resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Chủ đề chung
                  </label>
                  <input
                    type="text"
                    value={bulkTopic}
                    onChange={(e) => setBulkTopic(e.target.value)}
                    placeholder="Chủ đề cho các từ này..."
                    className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
                  />
                </div>

                {isBatchProcessing && batchProgress && (
                  <div className="p-3 bg-china-paper rounded-xl border border-border space-y-2">
                    <div className="flex justify-between text-xs font-medium text-china-ink">
                      <span>Đang phân tích & dịch từ vựng...</span>
                      <span>{batchProgress.done} / {batchProgress.total}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-china-red h-full transition-all duration-200"
                        style={{ width: `${(batchProgress.done / batchProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-border bg-white hover:bg-china-paper text-xs sm:text-sm font-medium text-china-ink transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={isBatchProcessing || !bulkInput.trim()}
                    onClick={handleStartBatchProcess}
                    className="px-5 py-2 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold transition-colors disabled:opacity-40 active:scale-95"
                  >
                    {isBatchProcessing ? "Đang xử lý..." : "Phân tích & Dịch hàng loạt"}
                  </button>
                </div>
              </>
            ) : (
              // Preview & confirmation table
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-china-ink">
                      Xem trước ({bulkPreviewCards.length} từ)
                    </h4>
                    <p className="text-xs text-muted">
                      Kiểm tra nghĩa trước khi lưu vào bộ từ vựng
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBulkPreviewCards([])}
                    className="text-xs text-muted hover:text-china-red font-medium transition-colors"
                  >
                    Làm lại danh sách
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto border border-border rounded-2xl divide-y divide-border bg-china-paper/30">
                  {bulkPreviewCards.map((card, idx) => (
                    <div key={card.id || idx} className="p-3 flex items-start justify-between gap-3 bg-white hover:bg-china-paper/50 transition-colors">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-bold text-china-ink text-sm sm:text-base">
                            {card.word}
                          </span>
                          {card.pinyin && (
                            <span className="text-xs font-mono text-muted">
                              {card.pinyin}
                            </span>
                          )}
                          {card.hanViet && (
                            <span className="text-[11px] text-china-gold font-medium">
                              [{card.hanViet}]
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={card.meaning}
                          onChange={(e) => handleUpdatePreviewMeaning(idx, e.target.value)}
                          placeholder="Nghĩa tiếng Việt..."
                          className="w-full px-2 py-1 bg-china-paper/80 border border-border rounded-lg text-xs text-china-ink focus:outline-hidden focus:border-china-red"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePreviewCard(idx)}
                        title="Xóa từ này"
                        className="p-1 text-muted hover:text-china-red rounded-md transition-colors mt-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setBulkPreviewCards([])}
                    className="px-4 py-2 rounded-xl border border-border bg-white hover:bg-china-paper text-xs sm:text-sm font-medium text-china-ink transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAllBulk}
                    className="px-5 py-2 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold transition-colors active:scale-95"
                  >
                    Lưu tất cả ({bulkPreviewCards.length} từ)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
