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
    description: "Toàn bộ 1,070 từ vựng HSK 5 chuẩn phiên bản 3.0 mới nhất với phiên âm Pinyin, âm Hán-Việt, loại từ, nghĩa tiếng Việt và 100% câu ví dụ thực tế kèm phiên âm.",
    previewWords: [
      { word: "安慰", pinyin: "ānwèi" },
      { word: "岸", pinyin: "àn" },
      { word: "按摩", pinyin: "ànmó" },
      { word: "拔", pinyin: "bá" },
      { word: "拜访", pinyin: "bàifǎng" },
      { word: "包围", pinyin: "bāowéi" }
    ],
    features: [
      "1,070 từ vựng cao cấp chuẩn HSK 3.0",
      "Có phiên âm Pinyin & âm Hán-Việt",
      "100% câu ví dụ kèm phiên âm chi tiết",
      "Tích hợp phát âm giọng đọc tiếng Trung",
      "Hỗ trợ tự thêm thẻ mới & dịch tự động"
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
    description: "Kho gần 1,000 từ vựng và cụm từ TOEIC thiết yếu chia theo 12+ chủ đề thực tế: Hợp đồng, Đầu tư, Thuế, Báo cáo tài chính, Nhân sự, Giao tiếp công sở với phiên âm IPA chuẩn.",
    previewWords: [
      { word: "contract", pinyin: "/ˈkɑːn.trækt/" },
      { word: "finalize", pinyin: "/ˈfaɪ.nəl.aɪz/" },
      { word: "application", pinyin: "/ˌæp.ləˈkeɪ.ʃən/" },
      { word: "competitor", pinyin: "/kəmˈpet̬.ə.t̬ɚ/" },
      { word: "reimbursement", pinyin: "/ˌriː.ɪmˈbɝːs.mənt/" },
      { word: "negotiation", pinyin: "/nəˌɡoʊ.ʃiˈeɪ.ʃən/" }
    ],
    features: [
      "986 từ & cụm từ thiết yếu cho bài thi TOEIC",
      "Phiên âm IPA chuẩn quốc tế",
      "12+ chủ đề công sở, đầu tư & thương mại",
      "Kèm từ đồng nghĩa & cụm động từ quan trọng",
      "Hỗ trợ tự thêm thẻ mới & dịch tự động"
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
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* 1. Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-china-ink via-[#1f1f1f] to-china-ink text-china-paper p-6 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/15 text-xs font-semibold text-china-gold tracking-wide">
            Mục Mở Rộng · 词汇宝库
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white">
            Kho Từ Vựng Bonus
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-china-paper/80 leading-relaxed">
            Kho từ vựng mở rộng linh hoạt: Học các bộ từ có sẵn (HSK 5 & TOEIC) hoặc <b>tự tạo bộ thẻ và thêm từ vựng riêng</b> với công cụ <b>trợ lý dịch & tự động điền Pinyin, Hán-Việt</b>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-china-paper/90">
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="font-bold text-china-gold">{totalWords}</span> từ vựng
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="font-bold text-emerald-400">{DEFAULT_COLLECTIONS.length + customCollections.length}</span> bộ từ vựng
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="font-bold text-sky-400">Tự do</span> thêm thẻ & dịch AI
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gallery of Collections */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-china-ink">
              Bộ Sưu Tập Thẻ Từ Vựng
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Chọn bộ tài liệu để học với Flashcard, xem thư viện thẻ hoặc bấm vào để tự thêm từ vựng mới
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-china-ink hover:bg-china-ink/80 text-white text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            + Tạo bộ từ vựng mới
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Custom User Collections First */}
          {customCollections.map((col) => {
            const count = customCounts[col.slug] || 0
            const isZh = col.language === "zh"
            const bgGrad = isZh ? "from-[#b91c1c] to-[#7f1d1d]" : "from-[#1d4ed8] to-[#1e293b]"

            return (
              <div
                key={col.slug}
                className="bg-card rounded-3xl border-2 border-china-gold/40 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner */}
                <div className={`p-6 sm:p-8 bg-gradient-to-br ${bgGrad} text-white`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-0.5 bg-amber-400 text-china-ink text-xs font-bold rounded-full tracking-wider">
                        Bộ tự tạo
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white/90">
                          {count} thẻ từ
                        </span>
                        <button
                          onClick={(e) => handleDeleteCustomCollection(col.slug, e)}
                          title="Xóa bộ từ vựng này"
                          className="text-xs text-white/60 hover:text-white px-2 py-0.5 rounded bg-black/20"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white pt-1">
                      {col.title}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {col.subtitle}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-china-ink/80 leading-relaxed mb-4">
                      {col.description}
                    </p>

                    <div className="p-4 bg-china-paper rounded-2xl border border-border/80 text-xs text-muted space-y-1">
                      <p className="font-semibold text-china-ink">Đặc điểm bộ thẻ:</p>
                      <p>• Hỗ trợ công cụ tự dịch & điền Pinyin, Hán-Việt tự động.</p>
                      <p>• Dễ dàng thêm, chỉnh sửa hoặc xóa thẻ bất kỳ lúc nào.</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 grid grid-cols-2 gap-3">
                    <Link
                      href={`/bonus/${col.slug}?mode=flashcard`}
                      className="py-3 px-4 rounded-2xl bg-china-red text-white text-xs sm:text-sm font-bold hover:bg-china-red-hover transition-all shadow-xs active:scale-95 text-center"
                    >
                      Học Thẻ Flashcard
                    </Link>
                    <Link
                      href={`/bonus/${col.slug}?mode=gallery`}
                      className="py-3 px-4 rounded-2xl bg-white border border-border text-china-ink text-xs sm:text-sm font-semibold hover:bg-china-paper transition-all shadow-2xs active:scale-95 text-center"
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
                className="bg-card rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner */}
                <div className={`p-6 sm:p-8 bg-gradient-to-br ${col.bgGradient} text-white`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 bg-white/20 text-xs font-bold rounded-full border border-white/30 tracking-wider">
                        {col.badge}
                      </span>
                      <span className="text-xs font-medium text-white/80">
                        {totalCount} từ vựng {addedCustom > 0 && `(+${addedCustom} tự thêm)`}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white pt-1">
                      {col.title}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {col.subtitle}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-china-ink/80 leading-relaxed mb-4">
                      {col.description}
                    </p>

                    {/* Preview Words */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                        Từ vựng tiêu biểu
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {col.previewWords.map((pw, i) => (
                          <div
                            key={i}
                            className="px-2.5 py-1 bg-china-paper border border-border/80 rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <span className={`font-serif font-bold ${col.language === "zh" ? "text-china-ink text-sm" : "text-china-ink font-sans"}`}>
                              {pw.word}
                            </span>
                            <span className="text-muted text-[11px]">{pw.pinyin}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-5 pt-4 border-t border-border/60 space-y-2">
                      {col.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-china-ink/80">
                          <span className="text-china-red font-bold leading-tight">•</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 grid grid-cols-2 gap-3">
                    <Link
                      href={`/bonus/${col.slug}?mode=flashcard`}
                      className="py-3 px-4 rounded-2xl bg-china-red text-white text-xs sm:text-sm font-bold hover:bg-china-red-hover transition-all shadow-xs active:scale-95 text-center"
                    >
                      Học Thẻ Flashcard
                    </Link>
                    <Link
                      href={`/bonus/${col.slug}?mode=gallery`}
                      className="py-3 px-4 rounded-2xl bg-white border border-border text-china-ink text-xs sm:text-sm font-semibold hover:bg-china-paper transition-all shadow-2xs active:scale-95 text-center"
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

      {/* 3. Learning Methods Section */}
      <section className="bg-china-paper/60 rounded-3xl p-6 sm:p-8 border border-border space-y-4">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-china-ink">
          Tính Năng Trợ Lý Tự Thêm Thẻ & Dịch
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
            <div className="text-xs font-bold text-china-red uppercase tracking-wider">
              1. Thêm Thẻ Bất Kỳ
            </div>
            <h4 className="font-bold text-china-ink text-sm sm:text-base">Mở rộng kho từ vựng</h4>
            <p className="text-xs text-muted leading-relaxed">
              Bạn có thể tự thêm từ mới vào bất kỳ bộ thẻ nào (HSK 5, TOEIC hoặc bộ tự tạo) để ôn tập tập trung theo nhu cầu cá nhân.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
            <div className="text-xs font-bold text-china-jade uppercase tracking-wider">
              2. Trợ Lý Dịch & Điền Tự Động
            </div>
            <h4 className="font-bold text-china-ink text-sm sm:text-base">Tiết kiệm thời gian</h4>
            <p className="text-xs text-muted leading-relaxed">
              Chỉ cần gõ chữ Hán hoặc từ tiếng Anh, bấm nút <b>Dịch & Tự động điền</b> để máy tự tạo phiên âm, âm Hán-Việt, dịch nghĩa và câu ví dụ.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
            <div className="text-xs font-bold text-china-gold uppercase tracking-wider">
              3. Lưu Trữ An Toàn
            </div>
            <h4 className="font-bold text-china-ink text-sm sm:text-base">Học mọi lúc mọi nơi</h4>
            <p className="text-xs text-muted leading-relaxed">
              Các thẻ tự thêm được lưu bền vững trên trình duyệt, sẵn sàng ôn tập qua thẻ Flashcard 3D và nghe phát âm giọng đọc AI chuẩn.
            </p>
          </div>
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
