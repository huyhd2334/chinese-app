"use client"

import React from "react"
import Link from "next/link"

export default function BonusHubPage() {
  const collections = [
    {
      slug: "hsk5",
      title: "Tổng Hợp Từ Vựng HSK 5",
      subtitle: "Phiên bản 3.0 Mới Nhất",
      language: "zh",
      itemCount: 1070,
      badge: "HSK 3.0",
      bgGradient: "from-[#c8102e] via-[#940d23] to-[#5a0011]",
      description: "Toàn bộ 1,070 từ vựng HSK 5 chuẩn phiên bản 3.0 mới nhất với phiên âm Pinyin, âm Hán-Việt, loại từ, nghĩa tiếng Việt và 100% câu ví dụ thực tế kèm phiên âm.",
      previewWords: [
        { word: "安慰", pinyin: "ānwèi", mean: "An ủi, vỗ về" },
        { word: "岸", pinyin: "àn", mean: "Bờ (sông, biển)" },
        { word: "按摩", pinyin: "ànmó", mean: "Xoa bóp, mát-xa" },
        { word: "拔", pinyin: "bá", mean: "Nhổ, kéo ra, rút" },
        { word: "拜访", pinyin: "bàifǎng", mean: "Thăm, viếng thăm" },
        { word: "包围", pinyin: "bāowéi", mean: "Bao vây, vây quanh" }
      ],
      features: [
        "1,070 từ vựng cao cấp chuẩn HSK 3.0",
        "Có phiên âm Pinyin & âm Hán-Việt",
        "100% câu ví dụ kèm phiên âm chi tiết",
        "Tích hợp phát âm giọng đọc tiếng Trung",
        "Hỗ trợ chế độ Flashcard 3D & Lưới Gallery"
      ]
    },
    {
      slug: "toeic",
      title: "Bộ Từ Vựng TOEIC Chuyên Sâu",
      subtitle: "Công Sở, Thương Mại & Đàm Phán",
      language: "en",
      itemCount: 986,
      badge: "TOEIC 550 - 900+",
      bgGradient: "from-[#1e3a8a] via-[#1e293b] to-[#0f172a]",
      description: "Kho gần 1,000 từ vựng và cụm từ TOEIC thiết yếu chia theo 12+ chủ đề thực tế: Hợp đồng, Đầu tư, Thuế, Báo cáo tài chính, Nhân sự, Giao tiếp công sở với phiên âm IPA chuẩn.",
      previewWords: [
        { word: "contract", pinyin: "/ˈkɑːn.trækt/", mean: "hợp đồng" },
        { word: "finalize", pinyin: "/ˈfaɪ.nəl.aɪz/", mean: "hoàn thiện" },
        { word: "application", pinyin: "/ˌæp.ləˈkeɪ.ʃən/", mean: "đơn ứng tuyển" },
        { word: "competitor", pinyin: "/kəmˈpet̬.ə.t̬ɚ/", mean: "đối thủ cạnh tranh" },
        { word: "reimbursement", pinyin: "/ˌriː.ɪmˈbɝːs.mənt/", mean: "hoàn trả công tác" },
        { word: "negotiation", pinyin: "/nəˌɡoʊ.ʃiˈeɪ.ʃən/", mean: "đàm phán" }
      ],
      features: [
        "986 từ & cụm từ thiết yếu cho bài thi TOEIC",
        "Phiên âm IPA chuẩn quốc tế",
        "12+ chủ đề công sở, đầu tư & thương mại",
        "Kèm từ đồng nghĩa & cụm động từ quan trọng",
        "Tích hợp phát âm giọng đọc tiếng Anh"
      ]
    }
  ]

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
            Dữ liệu từ vựng mở rộng chất lượng cao được xử lý và trích xuất chuẩn xác. 
            Bao gồm <b>1,070 từ HSK 5 phiên bản 3.0</b> và <b>986 từ vựng TOEIC công sở</b>, 
            sẵn sàng học ngay với thẻ ghi nhớ 3D và lưới tra cứu trực quan.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-china-paper/90">
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="font-bold text-china-gold">2,056</span> từ vựng tuyển chọn
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="font-bold text-emerald-400">100%</span> phát âm chuẩn
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="font-bold text-sky-400">2</span> chế độ: Flashcard & Gallery
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gallery of Collections */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-china-ink">
            Bộ Sưu Tập Thẻ Từ Vựng
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Chọn bộ tài liệu bạn muốn luyện tập để bắt đầu học với Thẻ Flashcard hoặc xem toàn bộ danh mục
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div
              key={col.slug}
              className="bg-card rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Banner */}
              <div className={`p-6 sm:p-8 bg-gradient-to-br ${col.bgGradient} text-white`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-white/20 text-xs font-bold rounded-full border border-white/30 tracking-wider">
                      {col.badge}
                    </span>
                    <span className="text-xs font-medium text-white/80">
                      {col.itemCount} từ vựng
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

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-china-ink/80 leading-relaxed mb-4">
                    {col.description}
                  </p>

                  {/* Sample Words Preview */}
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

                  {/* Highlights Bullet List */}
                  <div className="mt-5 pt-4 border-t border-border/60 space-y-2">
                    {col.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-china-ink/80">
                        <span className="text-china-red font-bold leading-tight">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 grid grid-cols-2 gap-3">
                  <Link
                    href={`/bonus/${col.slug}?mode=flashcard`}
                    className="py-3 px-4 rounded-2xl bg-china-red text-white text-xs sm:text-sm font-bold hover:bg-china-red-hover transition-all shadow-xs active:scale-95 text-center"
                  >
                    Học Thẻ Flashcard
                  </Link>
                  <Link
                    href={`/bonus/${col.slug}?mode=gallery`}
                    className="py-3 px-4 rounded-2xl bg-white border border-border text-china-ink text-xs sm:text-sm font-semibold hover:bg-china-paper hover:border-china-ink/20 transition-all shadow-2xs active:scale-95 text-center"
                  >
                    Xem Gallery Thẻ
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Learning Methods Section */}
      <section className="bg-china-paper/60 rounded-3xl p-6 sm:p-8 border border-border space-y-4">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-china-ink">
          Phương Pháp Học Với Mục Bonus
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
            <div className="text-xs font-bold text-china-red uppercase tracking-wider">
              Bước 1
            </div>
            <h4 className="font-bold text-china-ink text-sm sm:text-base">Thẻ Ghi Nhớ 3D</h4>
            <p className="text-xs text-muted leading-relaxed">
              Mặt trước hiển thị từ vựng để kích thích tư duy nhớ lại, lật mặt sau để kiểm tra Pinyin/IPA, âm Hán-Việt, nghĩa và câu ví dụ.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
            <div className="text-xs font-bold text-china-jade uppercase tracking-wider">
              Bước 2
            </div>
            <h4 className="font-bold text-china-ink text-sm sm:text-base">Tự Kiểm Tra Trực Quan</h4>
            <p className="text-xs text-muted leading-relaxed">
              Trong chế độ Gallery, sử dụng nút <b>Ẩn phiên âm</b> hoặc <b>Ẩn nghĩa</b> để tự nhẩm và đối chiếu ngay trên màn hình.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
            <div className="text-xs font-bold text-china-gold uppercase tracking-wider">
              Bước 3
            </div>
            <h4 className="font-bold text-china-ink text-sm sm:text-base">Luyện Nghe & Đánh Dấu</h4>
            <p className="text-xs text-muted leading-relaxed">
              Bấm vào biểu tượng loa để nghe giọng đọc chuẩn AI. Nhấp vào ngôi sao ⭐ để đánh dấu những từ khó cần ôn lại.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
