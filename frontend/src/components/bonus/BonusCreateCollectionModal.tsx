"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { BonusCollection } from "@/types/bonus"

interface BonusCreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCollection: (col: BonusCollection) => void
}

export default function BonusCreateCollectionModal({
  isOpen,
  onClose,
  onCreateCollection,
}: BonusCreateCollectionModalProps) {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setSubtitle("")
      setLanguage("zh")
      setDescription("")
    }
  }, [isOpen])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const slug = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    const isZh = language === "zh"

    const newCollection: BonusCollection = {
      id: slug,
      slug,
      title: title.trim(),
      subtitle: subtitle.trim() || (isZh ? "Bộ từ vựng tiếng Trung tự tạo" : "Bộ từ vựng tiếng Anh tự tạo"),
      language,
      itemCount: 0,
      badge: isZh ? "Tự Tạo · Tiếng Trung" : "Tự Tạo · Tiếng Anh",
      description: description.trim() || "Bộ từ vựng do người học tự xây dựng và mở rộng thẻ học tập.",
      isCustom: true,
      createdAt: Date.now(),
    }

    onCreateCollection(newCollection)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/60">
          <div>
            <h3 className="font-serif font-bold text-china-ink text-base sm:text-lg">
              Tạo bộ từ vựng mới
            </h3>
            <p className="text-xs text-muted">
              Tạo thư mục từ vựng riêng để tự thêm thẻ và học với Flashcard
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
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Tên bộ từ vựng *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Từ vựng Du lịch & Đời sống..."
              className="w-full px-3.5 py-2.5 bg-china-paper border border-border rounded-xl text-sm text-china-ink focus:outline-hidden focus:border-china-red transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Phụ đề / Ghi chú ngắn
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ví dụ: 50 câu giao tiếp thực tế..."
              className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Ngôn ngữ học tập
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage("zh")}
                className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-center ${
                  language === "zh"
                    ? "bg-china-red text-white border-china-red shadow-xs"
                    : "bg-white border-border text-china-ink hover:bg-china-paper"
                }`}
              >
                Tiếng Trung (HSK)
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-center ${
                  language === "en"
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-white border-border text-china-ink hover:bg-china-paper"
                }`}
              >
                Tiếng Anh (TOEIC)
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Mô tả bộ từ vựng
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục tiêu học tập, đối tượng từ vựng..."
              className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red resize-none"
            />
          </div>

          {/* Footer */}
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
              Tạo bộ thẻ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
