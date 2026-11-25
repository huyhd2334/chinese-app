"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import type { BonusCollection } from "@/types/bonus"
import BonusCreateCollectionModal from "@/components/bonus/BonusCreateCollectionModal"
import { useAuth } from "@/contexts/AuthContext"
import { 
  syncCollectionsWithCloud, 
  saveCollectionToCloud, 
  deleteCollectionFromCloud,
  getLocalCollections,
  getLocalCollectionsKey,
  getLocalCardsKey
} from "@/utils/bonusCloudSync"

const DEFAULT_COLLECTIONS = [
  {
    slug: "hsk5",
    title: "Tổng Hợp Từ Vựng HSK 5",
    subtitle: "Phiên bản 3.0 Mới Nhất",
    language: "zh" as const,
    baseItemCount: 1070,
    badge: "HSK 3.0",
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
    badge: "TOEIC 550+",
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
  const { user } = useAuth()
  const [customCollections, setCustomCollections] = useState<BonusCollection[]>([])
  const [customCounts, setCustomCounts] = useState<Record<string, number>>({})
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Load custom collections (from Cloud if logged in, else localStorage) and card counts
  useEffect(() => {
    async function loadData() {
      let collectionsToUse: BonusCollection[] = []

      // Dọn dẹp key toàn cục cũ để không gây lẫn bộ sưu tập giữa các tài khoản
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("bonus_custom_collections")
        } catch {}
      }

      if (user) {
        collectionsToUse = await syncCollectionsWithCloud(user.id)
        setCustomCollections(collectionsToUse)
      } else {
        collectionsToUse = getLocalCollections("guest")
        setCustomCollections(collectionsToUse)
      }

      // Count custom cards in each collection
      const counts: Record<string, number> = {}
      DEFAULT_COLLECTIONS.forEach(col => {
        const customCards = localStorage.getItem(getLocalCardsKey(col.slug, user?.id))
        counts[col.slug] = customCards ? JSON.parse(customCards).length : 0
      })
      collectionsToUse.forEach(c => {
        const customCards = localStorage.getItem(getLocalCardsKey(c.slug, user?.id))
        counts[c.slug] = customCards ? JSON.parse(customCards).length : 0
      })
      setCustomCounts(counts)
    }

    loadData()
  }, [user])

  const handleCreateCollection = (newCol: BonusCollection) => {
    const updated = [newCol, ...customCollections]
    setCustomCollections(updated)
    try {
      const key = getLocalCollectionsKey(user?.id)
      localStorage.setItem(key, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }

    if (user) {
      saveCollectionToCloud(user.id, newCol)
    }
  }

  const handleDeleteCustomCollection = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!confirm("Bạn có chắc chắn muốn xóa bộ từ vựng này không?")) return

    const updated = customCollections.filter(c => c.slug !== slug)
    setCustomCollections(updated)
    try {
      const key = getLocalCollectionsKey(user?.id)
      localStorage.setItem(key, JSON.stringify(updated))
      localStorage.removeItem(getLocalCardsKey(slug, user?.id))
    } catch (e) {
      console.error(e)
    }

    if (user) {
      deleteCollectionFromCloud(user.id, slug)
    }
  }

  const totalWords = DEFAULT_COLLECTIONS.reduce((acc, c) => acc + c.baseItemCount + (customCounts[c.slug] || 0), 0) +
    customCollections.reduce((acc, c) => acc + (customCounts[c.slug] || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 space-y-6">
      {/* 1. Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1 max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Từ vựng mở rộng &amp; Bộ thẻ cá nhân
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Ôn luyện từ vựng chuyên đề nâng cao hoặc tự tạo bộ thẻ Flashcard riêng cho nhu cầu học tập của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <span className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted">
            Tổng: <strong className="font-semibold text-foreground">{totalWords.toLocaleString("vi-VN")} từ</strong> ({DEFAULT_COLLECTIONS.length + customCollections.length} bộ)
          </span>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-china-red hover:bg-china-red-hover text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            + Tạo bộ thẻ mới
          </button>
        </div>
      </header>

      {/* 2. Gallery of Collections */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Custom User Collections */}
          {customCollections.map((col) => {
            const count = customCounts[col.slug] || 0
            const isZh = col.language === "zh"

            return (
              <div
                key={col.slug}
                className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-2xs hover:border-china-gold/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold rounded-md">
                      Bộ tự tạo {isZh ? "· Tiếng Trung" : "· Tiếng Anh"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">
                        {count} thẻ
                      </span>
                      <button
                        onClick={(e) => handleDeleteCustomCollection(col.slug, e)}
                        title="Xóa bộ từ vựng này"
                        className="text-xs text-muted hover:text-red-500 px-2 py-0.5 rounded hover:bg-red-50 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold text-china-ink">
                    {col.title}
                  </h3>
                  <p className="text-muted text-xs mb-2">
                    {col.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                    {col.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-3">
                  <Link
                    href={`/bonus/${col.slug}?mode=flashcard`}
                    className="py-2.5 px-4 rounded-xl bg-china-red text-white text-xs sm:text-sm font-semibold hover:bg-china-red-hover transition-all text-center active:scale-95 shadow-2xs"
                  >
                    Học Flashcard
                  </Link>
                  <Link
                    href={`/bonus/${col.slug}?mode=gallery`}
                    className="py-2.5 px-4 rounded-xl bg-china-paper border border-border text-foreground text-xs sm:text-sm font-semibold hover:bg-border/60 transition-colors text-center"
                  >
                    Xem & Thêm Thẻ
                  </Link>
                </div>
              </div>
            )
          })}

          {/* Default Collections (HSK 5 & TOEIC) */}
          {DEFAULT_COLLECTIONS.map((col) => {
            const addedCustom = customCounts[col.slug] || 0
            const totalCount = col.baseItemCount + addedCustom
            const isHsk = col.slug === "hsk5"

            return (
              <div
                key={col.slug}
                className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-2xs hover:border-border/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                      isHsk 
                        ? "bg-china-red/5 text-china-red border-china-red/20" 
                        : "bg-blue-50 text-blue-700 border-blue-200/80"
                    }`}>
                      {col.badge}
                    </span>
                    <span className="text-xs text-muted">
                      {totalCount} từ vựng {addedCustom > 0 && `(+${addedCustom} tự thêm)`}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold text-china-ink">
                    {col.title}
                  </h3>
                  <p className="text-muted text-xs mb-2">
                    {col.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
                    {col.description}
                  </p>

                  {/* Preview Words */}
                  <div className="flex flex-wrap gap-1.5 pt-1 mb-4">
                    {col.previewWords.map((pw, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1 bg-china-paper border border-border rounded-lg text-xs flex items-center gap-1.5"
                      >
                        <span className={`font-serif font-semibold text-china-ink dark:text-[#edeae4] ${col.language === "zh" ? "" : "font-sans"}`}>
                          {pw.word}
                        </span>
                        <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">{pw.pinyin}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-3">
                  <Link
                    href={`/bonus/${col.slug}?mode=flashcard`}
                    className="py-2.5 px-4 rounded-xl bg-china-red text-white text-xs sm:text-sm font-semibold hover:bg-china-red-hover transition-all text-center active:scale-95 shadow-2xs"
                  >
                    Học Flashcard
                  </Link>
                  <Link
                    href={`/bonus/${col.slug}?mode=gallery`}
                    className="py-2.5 px-4 rounded-xl bg-china-paper border border-border text-foreground text-xs sm:text-sm font-semibold hover:bg-border/60 transition-colors text-center"
                  >
                    Xem & Thêm Thẻ
                  </Link>
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
