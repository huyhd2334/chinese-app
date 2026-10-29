"use client"

import React, { useState } from "react"
import { X, Crown, Plus, Video, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { ShadowingVideo, ShadowingSentence } from "@/data/shadowingData"
import { triggerUpgradeModal } from "@/utils/subscription"

interface AddCustomVideoModalProps {
  isOpen: boolean
  onClose: () => void
  isPro: boolean
  onAddVideo: (video: ShadowingVideo) => void
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  )
  return match ? match[1] : null
}

export default function AddCustomVideoModal({
  isOpen,
  onClose,
  isPro,
  onAddVideo,
}: AddCustomVideoModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [title, setTitle] = useState("")
  const [level, setLevel] = useState<ShadowingVideo["level"]>("HSK 2-3")
  const [category, setCategory] = useState<ShadowingVideo["category"]>("Giao tiếp đời sống")
  const [description, setDescription] = useState("")
  const [sentencesText, setSentencesText] = useState(
    `你好！很高兴认识你。 | Nǐ hǎo! Hěn gāoxìng rènshì nǐ. | Xin chào! Rất vui được quen bạn.\n你想吃什么？ | Nǐ xiǎng chī shénme? | Bạn muốn ăn gì?\n我们一起学中文吧！ | Wǒmen yīqǐ xué zhōngwén ba! | Chúng ta cùng nhau học tiếng Trung nhé!`
  )
  const [formError, setFormError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleProUpgrade = () => {
    onClose()
    triggerUpgradeModal("manual")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!isPro) {
      handleProUpgrade()
      return
    }

    const trimmedUrl = youtubeUrl.trim()
    const ytId = extractYouTubeId(trimmedUrl)
    if (!ytId) {
      setFormError("Link YouTube không hợp lệ. Vui lòng dán link dạng https://www.youtube.com/watch?v=... hoặc https://youtu.be/...")
      return
    }

    if (!title.trim()) {
      setFormError("Vui lòng nhập tiêu đề cho bài luyện Shadowing.")
      return
    }

    // Parse sentences lines: "Hán tự | Pinyin | Nghĩa tiếng Việt"
    const lines = sentencesText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    if (lines.length === 0) {
      setFormError("Vui lòng nhập ít nhất một câu phụ đề để luyện tập.")
      return
    }

    const parsedSentences: ShadowingSentence[] = lines.map((line, index) => {
      const parts = line.split("|").map((p) => p.trim())
      return {
        id: index + 1,
        startTime: index * 5,
        endTime: (index + 1) * 5,
        chinese: parts[0] || "你好",
        pinyin: parts[1] || "",
        vietnamese: parts[2] || "",
      }
    })

    const newVideo: ShadowingVideo = {
      id: "custom-" + Date.now(),
      title: title.trim(),
      level,
      levelBadgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      duration: "Tự tạo",
      category,
      description: description.trim() || "Bài luyện Shadowing tự thêm bởi học viên Pro.",
      youtubeId: ytId,
      sentencesCount: parsedSentences.length,
      isFree: false,
      sentences: parsedSentences,
    }

    onAddVideo(newVideo)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-border shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-china-ink/60 hover:text-china-ink hover:bg-china-paper transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPro ? (
          /* PRO UPSELL GATE FOR FREE USERS */
          <div className="text-center space-y-4 pt-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-inner">
              <Crown className="w-8 h-8 text-china-gold" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span>ĐẶC QUYỀN GÓI PRO 👑</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-china-ink">
                Tự Thêm Video Shadowing Bất Kỳ
              </h3>
              <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto leading-relaxed">
                Nâng cấp Gói Pro để dán bất kỳ link video YouTube nào bạn thích (phim, talkshow, MV ca nhạc, vlog) và tự do tạo bài luyện nhại giọng cá nhân hóa!
              </p>
            </div>

            <div className="bg-china-paper/70 rounded-2xl p-4 text-left space-y-2 border border-border/70 text-xs sm:text-sm text-china-ink">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Không giới hạn số lượng video YouTube tự thêm</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tùy chỉnh phụ đề tiếng Trung, Pinyin & Tiếng Việt</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ghi âm & nghe lại so sánh không giới hạn số lần</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleProUpgrade}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-china-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Nâng cấp Gói Pro mở khóa tính năng</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-muted hover:text-china-ink transition-colors"
              >
                Để sau, tôi học video có sẵn
              </button>
            </div>
          </div>
        ) : (
          /* FORM FOR PRO USERS */
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-china-ink">Thêm Video Shadowing Mới</h3>
                <p className="text-xs text-muted">Dán link YouTube & nhập câu thoại để luyện tập</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-china-ink mb-1">
                Link Video YouTube: <span className="text-china-red">*</span>
              </label>
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-china-red/30 focus:border-china-red bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-china-ink mb-1">
                Tiêu đề bài học: <span className="text-china-red">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Luyện đối thoại phim ngắn / Bài hát tiếng Trung..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-china-red/30 focus:border-china-red bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-china-ink mb-1">Cấp độ HSK:</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as ShadowingVideo["level"])}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-china-red/30 bg-white"
                >
                  <option value="HSK 1-2">HSK 1-2</option>
                  <option value="HSK 2-3">HSK 2-3</option>
                  <option value="HSK 3-4">HSK 3-4</option>
                  <option value="HSK 4+">HSK 4+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-china-ink mb-1">Chủ đề:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ShadowingVideo["category"])}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-china-red/30 bg-white"
                >
                  <option value="Giao tiếp đời sống">Giao tiếp đời sống</option>
                  <option value="Ẩm thực & Mua sắm">Ẩm thực & Mua sắm</option>
                  <option value="Phim hoạt hình ngắn">Phim hoạt hình ngắn</option>
                  <option value="Công sở & Phỏng vấn">Công sở & Phỏng vấn</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-china-ink mb-1">
                Danh sách câu thoại (Mỗi dòng: Chữ Hán | Pinyin | Tiếng Việt):
              </label>
              <textarea
                rows={5}
                value={sentencesText}
                onChange={(e) => setSentencesText(e.target.value)}
                className="w-full p-3 rounded-xl border border-border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-china-red/30 bg-white leading-relaxed"
                placeholder="你好！ | Nǐ hǎo! | Xin chào!&#10;谢谢你。 | Xièxie nǐ. | Cảm ơn bạn."
              />
              <p className="text-[11px] text-muted mt-1">
                💡 Định dạng chuẩn: <code>Chữ Hán | Pinyin | Tiếng Việt</code> (ngăn cách nhau bằng dấu gạch đứng <code>|</code>)
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted hover:text-china-ink hover:bg-china-paper transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-china-red hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm bài luyện tập</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
