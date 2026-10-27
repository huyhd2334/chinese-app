"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import type { BonusCollection } from "@/types/bonus"
import BonusCreateCollectionModal from "@/components/bonus/BonusCreateCollectionModal"

const DEFAULT_COLLECTIONS = [
  {
    slug: "hsk5",
    title: "Tổng Hợp Từ Vựng HSK 5",
    subtitle: "Phiên bản 3.0 Mới Nhất",
    language: "zh" as const,
    baseItemCount: 1070,
    badge: "HSK 3.0",
    bgGradient: "from-[#c8102e] via-[#940d23] to-[#5a0011]",
    description: "1,070 từ vựng HSK 5 chuẩn 3.0 kèm Pinyin, âm Hán-Việt và câu ví dụ.",
    previewWords: [
      { word: "安慰", pinyin: "ānwèi" },
      { word: "岸", pinyin: "àn" },
      { word: "按摩", pinyin: "ànmó" },
      { word: "拔", pinyin: "bá" },
      { word: "拜访", pinyin: "bàifǎng" },
      { word: "包围", pinyin: "bāowéi" }
    ]
  },
  {
    slug: "toeic",
    title: "Bộ Từ Vựng TOEIC Chuyên Sâu",
    subtitle: "Công Sở, Thương Mại & Đàm Phán",
    language: "en" as const,
    baseItemCount: 986,
    badge: "TOEIC 550 - 900+",
    bgGradient: "from-[#1e3a8a] via-[#1e293b] to-[#0f172a]",
    description: "986 từ vựng TOEIC thông dụng theo các chủ đề công sở và thương mại.",
    previewWords: [
      { word: "contract", pinyin: "/ˈkɑːn.trækt/" },
      { word: "finalize", pinyin: "/ˈfaɪ.nəl.aɪz/" },
      { word: "application", pinyin: "/ˌæp.ləˈkeɪ.ʃən/" },
      { word: "competitor", pinyin: "/kəmˈpet̬.ə.t̬ɚ/" },
      { word: "reimbursement", pinyin: "/ˌriː.ɪmˈbɝːs.mənt/" },
      { word: "negotiation", pinyin: "/nəˌɡoʊ.ʃiˈeɪ.ʃən/" }
    ]
  }
]

export default function BonusHubPage() {
  const [customCollections, setCustomCollections] = useState<BonusCollection[]>([])
  const [customCounts, setCustomCounts] = useState<Record<string, number>>({})
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Load custom collections and card counts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bonus_custom_collections")
      if (stored) {
        setCustomCollections(JSON.parse(stored))
      }

      // Count custom cards in each collection
      const counts: Record<string, number> = {}
      DEFAULT_COLLECTIONS.forEach(col => {
        const customCards = localStorage.getItem(`bonus_custom_cards_${col.slug}`)
        counts[col.slug] = customCards ? JSON.parse(customCards).length : 0
      })

      if (stored) {
        const parsed: BonusCollection[] = JSON.parse(stored)
        parsed.forEach(c => {
          const customCards = localStorage.getItem(`bonus_custom_cards_${c.slug}`)
          counts[c.slug] = customCards ? JSON.parse(customCards).length : 0
        })
      }

      setCustomCounts(counts)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleCreateCollection = (newCol: BonusCollection) => {
    const updated = [newCol, ...customCollections]
    setCustomCollections(updated)
    try {
      localStorage.setItem("bonus_custom_collections", JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteCustomCollection = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!confirm("Bạn có chắc chắn muốn xóa bộ từ vựng này không?")) return

    const updated = customCollections.filter(c => c.slug !== slug)
    setCustomCollections(updated)
    try {
      localStorage.setItem("bonus_custom_collections", JSON.stringify(updated))
      localStorage.removeItem(`bonus_custom_cards_${slug}`)
    } catch (e) {
      console.error(e)
    }
  }

  const totalWords = DEFAULT_COLLECTIONS.reduce((acc, c) => acc + c.baseItemCount + (customCounts[c.slug] || 0), 0) +
    customCollections.reduce((acc, c) => acc + (customCounts[c.slug] || 0), 0)

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* 1. Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-china-ink via-[#1f1f1f] to-china-ink text-china-paper p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-block px-3 py-0.5 bg-white/10 rounded-full border border-white/15 text-[11px] font-semibold text-china-gold tracking-wide">
            Mục Mở Rộng
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            Kho Từ Vựng Bonus
          </h1>

          <p className="text-xs sm:text-sm text-china-paper/85 leading-relaxed">
            Học từ vựng mở rộng với Flashcard, thư viện tra cứu và tự tạo bộ thẻ học riêng.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-china-paper/90">
            <div className="bg-white/10 px-3 py-1 rounded-xl">
              <span className="font-bold text-china-gold">{totalWords}</span> từ vựng
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-xl">
              <span className="font-bold text-emerald-400">{DEFAULT_COLLECTIONS.length + customCollections.length}</span> bộ từ
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gallery of Collections */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-china-ink">
              Bộ Sưu Tập Thẻ
            </h2>
            <p className="text-xs text-muted">
              Chọn bộ từ vựng để ôn Flashcard hoặc thêm từ mới
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-china-ink hover:bg-china-ink/80 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
          >
            + Tạo bộ từ vựng mới
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Custom User Collections First */}
          {customCollections.map((col) => {
            const count = customCounts[col.slug] || 0
            const isZh = col.language === "zh"
            const bgGrad = isZh ? "from-[#b91c1c] to-[#7f1d1d]" : "from-[#1d4ed8] to-[#1e293b]"

            return (
              <div
                key={col.slug}
                className="bg-card rounded-2xl border border-china-gold/40 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Banner */}
                <div className={`p-5 sm:p-6 bg-gradient-to-br ${bgGrad} text-white`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-400 text-china-ink text-[11px] font-bold rounded-full">
                        Bộ tự tạo
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/90">
                          {count} thẻ
                        </span>
                        <button
                          onClick={(e) => handleDeleteCustomCollection(col.slug, e)}
                          title="Xóa bộ từ vựng này"
                          className="text-xs text-white/70 hover:text-white px-2 py-0.5 rounded bg-black/20 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white pt-1">
                      {col.title}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {col.subtitle}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-china-ink/80 leading-relaxed">
                    {col.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <Link
                      href={`/bonus/${col.slug}?mode=flashcard`}
                      className="py-2.5 px-4 rounded-xl bg-china-red text-white text-xs sm:text-sm font-bold hover:bg-china-red-hover transition-all text-center active:scale-95"
                    >
                      Học Flashcard
                    </Link>
                    <Link
                      href={`/bonus/${col.slug}?mode=gallery`}
                      className="py-2.5 px-4 rounded-xl bg-white border border-border text-china-ink text-xs sm:text-sm font-semibold hover:bg-china-paper transition-all text-center active:scale-95"
                    >
                      Xem & Thêm Thẻ
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Default Collections */}
          {DEFAULT_COLLECTIONS.map((col) => {
            const addedCustom = customCounts[col.slug] || 0
            const totalCount = col.baseItemCount + addedCustom

            return (
              <div
                key={col.slug}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Banner */}
                <div className={`p-5 sm:p-6 bg-gradient-to-br ${col.bgGradient} text-white`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-white/20 text-[11px] font-bold rounded-full border border-white/30">
                        {col.badge}
                      </span>
                      <span className="text-xs text-white/80">
                        {totalCount} từ vựng {addedCustom > 0 && `(+${addedCustom} tự thêm)`}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white pt-1">
                      {col.title}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {col.subtitle}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-china-ink/80 leading-relaxed">
                      {col.description}
                    </p>

                    {/* Preview Words */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {col.previewWords.map((pw, i) => (
                        <div
                          key={i}
                          className="px-2 py-0.5 bg-china-paper border border-border/80 rounded-lg text-xs flex items-center gap-1.5"
                        >
                          <span className={`font-serif font-bold ${col.language === "zh" ? "text-china-ink" : "text-china-ink font-sans"}`}>
                            {pw.word}
                          </span>
                          <span className="text-muted text-[11px]">{pw.pinyin}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <Link
                      href={`/bonus/${col.slug}?mode=flashcard`}
                      className="py-2.5 px-4 rounded-xl bg-china-red text-white text-xs sm:text-sm font-bold hover:bg-china-red-hover transition-all text-center active:scale-95"
                    >
                      Học Flashcard
                    </Link>
                    <Link
                      href={`/bonus/${col.slug}?mode=gallery`}
                      className="py-2.5 px-4 rounded-xl bg-white border border-border text-china-ink text-xs sm:text-sm font-semibold hover:bg-china-paper transition-all text-center active:scale-95"
                    >
                      Xem & Thêm Thẻ
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Modal create collection */}
      <BonusCreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />

    </div>
  )
}
