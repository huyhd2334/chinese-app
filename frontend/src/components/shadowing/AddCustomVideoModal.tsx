"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  X,
  Crown,
  Plus,
  Video,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Music,
  Radio,
  Cpu,
  FileText,
  Clock,
  ArrowRight,
  Loader2,
  Wand2,
  Terminal,
} from "lucide-react"
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

// Chuyển timestamp định dạng 00:01:23.450 hoặc 01:23,450 sang giây
function timeStringToSeconds(timeStr: string): number {
  const clean = timeStr.trim().replace(",", ".")
  const parts = clean.split(":")
  if (parts.length === 3) {
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2])
  } else if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1])
  }
  return parseFloat(clean) || 0
}

// Bóc tách tự động SRT / WebVTT hoặc định dạng gạch đứng |
function parseSubtitlesOrText(rawText: string): ShadowingSentence[] {
  const text = rawText.trim()
  if (!text) return []

  // 1. Kiểm tra nếu là SRT hoặc WebVTT (chứa mốc -->)
  if (text.includes("-->")) {
    const srtBlocks = text
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter((b) => b.length > 0 && b.includes("-->"))

    const sentences: ShadowingSentence[] = []
    let idCounter = 1

    for (const block of srtBlocks) {
      const lines = block.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
      const arrowLine = lines.find((l) => l.includes("-->"))
      if (!arrowLine) continue

      const [startStr, endStr] = arrowLine.split("-->").map((s) => s.trim())
      const startTime = Math.round(timeStringToSeconds(startStr) * 10) / 10
      const endTime = Math.max(startTime + 1, Math.round(timeStringToSeconds(endStr) * 10) / 10)

      // Các dòng sau mốc thời gian là nội dung thoại
      const contentLines = lines.slice(lines.indexOf(arrowLine) + 1)
      const content = contentLines.join(" ")

      if (!content) continue

      // Kiểm tra xem dòng nội dung có chia phần "Chữ Hán | Pinyin | Dịch" không
      const parts = content.split("|").map((p) => p.trim())
      sentences.push({
        id: idCounter++,
        startTime,
        endTime,
        chinese: parts[0] || "",
        pinyin: parts[1] || "",
        vietnamese: parts[2] || parts[0] || "",
      })
    }

    if (sentences.length > 0) return sentences
  }

  // 2. Định dạng gạch đứng "Chữ Hán | Pinyin | Tiếng Việt"
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  let currentTime = 1.0
  return lines.map((line, index) => {
    // Có thể có tiền tố mốc giờ: [00:12 - 00:15] Chữ Hán | Pinyin | Nghĩa
    let cleanLine = line
    let customStart = currentTime
    let customEnd = currentTime + 4.5

    const timePrefixMatch = cleanLine.match(/^\[([\d:.,]+)\s*[-~–]\s*([\d:.,]+)\]\s*(.*)$/)
    if (timePrefixMatch) {
      customStart = Math.round(timeStringToSeconds(timePrefixMatch[1]) * 10) / 10
      customEnd = Math.round(timeStringToSeconds(timePrefixMatch[2]) * 10) / 10
      cleanLine = timePrefixMatch[3].trim()
    } else {
      // Ước tính thời lượng dựa theo độ dài câu (khoảng 0.3s mỗi ký tự)
      const estDuration = Math.max(3.0, Math.min(8.0, cleanLine.length * 0.35))
      customStart = Math.round(currentTime * 10) / 10
      customEnd = Math.round((currentTime + estDuration) * 10) / 10
      currentTime = customEnd + 0.8
    }

    const parts = cleanLine.split("|").map((p) => p.trim())
    return {
      id: index + 1,
      startTime: customStart,
      endTime: customEnd,
      chinese: parts[0] || "你好",
      pinyin: parts[1] || "",
      vietnamese: parts[2] || parts[0] || "",
    }
  })
}

// Các mẫu clip thực tế có sẵn dưới 30 phút để Pro test nhanh
const DEMO_TEMPLATES = [
  {
    title: "Phỏng vấn đường phố Bắc Kinh: Bạn thích gì ở giới trẻ?",
    youtubeUrl: "https://www.youtube.com/watch?v=24Oj4bOACk0",
    level: "HSK 3-4" as const,
    category: "Giao tiếp đời sống" as const,
    description: "Hội thoại đời sống đường phố tự nhiên, ngữ điệu thực tế của người bản xứ dưới 10 phút.",
    subtitles: `00:00:01.200 --> 00:00:04.500
你好！请问可以采访你一下吗？ | Nǐ hǎo! Qǐngwèn kěyǐ cǎifǎng nǐ yíxià ma? | Xin chào! Cho hỏi tôi có thể phỏng vấn bạn một chút được không?

00:00:05.100 --> 00:00:08.800
当然可以，有什么问题吗？ | Dāngrán kěyǐ, yǒu shénme wèntí ma? | Đương nhiên được rồi, có câu hỏi gì thế?

00:00:09.300 --> 00:00:14.200
你觉得北京最吸引年轻人的地方是什么？ | Nǐ juéde Běijīng zuì xīyǐn niánqīngrén de dìfang shì shénme? | Bạn thấy điểm thu hút nhất của Bắc Kinh đối với giới trẻ là gì?

00:00:15.000 --> 00:00:20.500
我觉得是这里有很多机会，而且文化非常多元。 | Wǒ juéde shì zhèlǐ yǒu hěn duō jīhuì, érqiě wénhuà fēicháng duōyuán. | Tôi nghĩ là ở đây có rất nhiều cơ hội, vả lại văn hóa vô cùng đa dạng.`,
  },
  {
    title: "Vlog ẩm thực Thượng Hải: Thưởng thức Tiểu Long Bao",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    level: "HSK 2-3" as const,
    category: "Ẩm thực & Mua sắm" as const,
    description: "Khám phá món ngon phố cổ Thượng Hải, cách gọi món và nhận xét hương vị.",
    subtitles: `今天我们来到上海最有名的小吃店。 | Jīntiān wǒmen láidào Shànghǎi zuì yǒumíng de xiǎochīdiàn. | Hôm nay chúng ta đến quán ăn vặt nổi tiếng nhất Thượng Hải.
这里的生煎包和小笼包特别有名。 | Zhèlǐ de shēngjiānbāo hé xiǎolóngbāo tèbié yǒumíng. | Bánh bao chiên và tiểu long bao ở đây cực kỳ nổi tiếng.
老板，请给我们来两屉小笼包！ | Lǎobǎn, qǐng gěi wǒmen lái liǎng tì xiǎolóngbāo! | Ông chủ, cho chúng tôi hai lồng tiểu long bao nhé!
汤汁非常鲜美，大家一定要尝尝。 | Tāngzhī fēicháng xiānměi, dàjiā yídìng yào chángchang. | Nước súp rất đậm đà thơm ngon, mọi người nhất định phải nếm thử.`,
  },
]

export default function AddCustomVideoModal({
  isOpen,
  onClose,
  isPro,
  onAddVideo,
}: AddCustomVideoModalProps) {
  const [activeTab, setActiveTab] = useState<"link" | "subtitles">("link")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [title, setTitle] = useState("")
  const [level, setLevel] = useState<ShadowingVideo["level"]>("HSK 2-3")
  const [category, setCategory] = useState<ShadowingVideo["category"]>("Giao tiếp đời sống")
  const [description, setDescription] = useState("")
  const [sentencesText, setSentencesText] = useState(
    `你好！很高兴认识你。 | Nǐ hǎo! Hěn gāoxìng rènshì nǐ. | Xin chào! Rất vui được quen bạn.\n你想吃什么？ | Nǐ xiǎng chī shénme? | Bạn muốn ăn gì?\n我们一起学中文吧！ | Wǒmen yīqǐ xué zhōngwén ba! | Chúng ta cùng nhau học tiếng Trung nhé!`
  )
  const [formError, setFormError] = useState<string | null>(null)
  const [isFetchingInfo, setIsFetchingInfo] = useState(false)

  // AI Processing Pipeline States
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStep, setProcessStep] = useState(1)
  const [processPercent, setProcessPercent] = useState(0)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])

  const processingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Tự động lấy tiêu đề video từ YouTube khi dán link
  const handleUrlBlur = async () => {
    const trimmed = youtubeUrl.trim()
    const ytId = extractYouTubeId(trimmed)
    if (ytId && !title) {
      try {
        setIsFetchingInfo(true)
        const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.title) {
            setTitle(data.title)
          }
        }
      } catch {
        // Fallback im lặng nếu oEmbed bị chặn
      } finally {
        setIsFetchingInfo(false)
      }
    }
  }

  // Nạp mẫu sẵn cho Pro
  const handleApplyTemplate = (tpl: typeof DEMO_TEMPLATES[0]) => {
    setYoutubeUrl(tpl.youtubeUrl)
    setTitle(tpl.title)
    setLevel(tpl.level)
    setCategory(tpl.category)
    setDescription(tpl.description)
    setSentencesText(tpl.subtitles)
    setFormError(null)
  }

  if (!isOpen) return null

  const handleProUpgrade = () => {
    onClose()
    triggerUpgradeModal("manual")
  }

  // Khởi động Animation xử lý video AI
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

    const parsedSentences = parseSubtitlesOrText(sentencesText)
    if (parsedSentences.length === 0) {
      setFormError("Vui lòng nhập ít nhất một câu thoại hoặc dán phụ đề SRT/VTT để luyện tập.")
      return
    }

    // Bắt đầu chuỗi hiệu ứng AI Processing
    setIsProcessing(true)
    setProcessPercent(5)
    setProcessStep(1)
    setTerminalLogs([
      `[00:01] 📡 Đang kết nối video stream: https://youtu.be/${ytId}...`,
      `[00:02] ⏱️ Xác thực thời lượng video: Thỏa mãn điều kiện Pro (< 30 phút).`,
    ])

    let step = 1
    let pct = 10

    if (processingTimerRef.current) clearInterval(processingTimerRef.current)

    processingTimerRef.current = setInterval(() => {
      pct += Math.floor(Math.random() * 8) + 5
      if (pct > 95) pct = 95

      if (pct >= 25 && step === 1) {
        step = 2
        setProcessStep(2)
        setTerminalLogs((prev) => [
          ...prev,
          `[00:03] 🎧 Đang trích xuất dải tần âm thanh 44.1kHz & Lọc tạp âm môi trường...`,
        ])
      } else if (pct >= 50 && step === 2) {
        step = 3
        setProcessStep(3)
        setTerminalLogs((prev) => [
          ...prev,
          `[00:04] 🤖 AI Voice Activity Detection: Bóc tách thành công ${parsedSentences.length} mốc câu thoại chuẩn xác.`,
        ])
      } else if (pct >= 75 && step === 3) {
        step = 4
        setProcessStep(4)
        setTerminalLogs((prev) => [
          ...prev,
          `[00:05] 🇨🇳 Sinh phiên âm Pinyin thanh điệu chuẩn & Đối chiếu ngữ cảnh Hán-Việt...`,
        ])
      }

      setProcessPercent(pct)

      // Khi hoàn tất 100%
      if (pct >= 95) {
        if (processingTimerRef.current) clearInterval(processingTimerRef.current)
        setProcessPercent(100)
        setProcessStep(5)
        setTerminalLogs((prev) => [
          ...prev,
          `[00:06] ✨ Hoàn tất đóng gói! Đang khởi động sân khấu Shadowing Studio...`,
        ])

        setTimeout(() => {
          const newVideo: ShadowingVideo = {
            id: "custom-" + Date.now(),
            title: title.trim(),
            level,
            levelBadgeColor: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700",
            duration: `< 30 phút (${parsedSentences.length} câu)`,
            category,
            description: description.trim() || `Bài luyện Shadowing tự tạo bởi học viên Pro (${parsedSentences.length} câu thoại).`,
            youtubeId: ytId,
            sentencesCount: parsedSentences.length,
            isFree: false,
            sentences: parsedSentences,
          }

          setIsProcessing(false)
          onAddVideo(newVideo)
          onClose()
        }, 800)
      }
    }, 180)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-[#16161d] border border-border/80 shadow-2xl flex flex-col text-stone-900 dark:text-stone-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng modal */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full text-china-ink/60 hover:text-china-ink hover:bg-china-paper dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MÀN HÌNH XỬ LÝ VIDEO VỚI HIỆU ỨNG AI SỐNG ĐỘNG (PROCESSING SCREEN) */}
        {/* ------------------------------------------------------------- */}
        {isProcessing ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
            {/* Visualizer sóng âm thanh sống động (Dynamic Audio Waveform) */}
            <div className="relative w-full max-w-md h-24 rounded-2xl bg-gradient-to-br from-stone-900 to-black p-4 flex flex-col items-center justify-center border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.15)] overflow-hidden">
              {/* Tia quét Laser scanner */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-[pulse_2s_infinite] pointer-events-none" />

              {/* Thanh equalizer sóng âm thanh nhảy theo nhịp */}
              <div className="flex items-end justify-center gap-1.5 h-12 w-full z-10">
                {[40, 75, 25, 90, 60, 100, 45, 80, 95, 30, 85, 50, 70, 95, 35, 60].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-gradient-to-t from-china-red via-amber-400 to-yellow-300 transition-all duration-150 animate-pulse"
                    style={{
                      height: `${Math.max(15, (h * (processPercent + 20)) / 120)}%`,
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Nhãn trạng thái */}
              <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-amber-300 font-semibold tracking-wide">
                <Radio className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>AI AUDIO EXTRACTION ENGINE • DƯỚI 30 PHÚT</span>
              </div>
            </div>

            {/* Thông tin tiến trình % */}
            <div className="space-y-2 w-full max-w-md">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1.5 text-china-red dark:text-red-400">
                  <Cpu className="w-4 h-4 animate-spin" />
                  Đang xử lý nội dung video...
                </span>
                <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                  {processPercent}%
                </span>
              </div>

              {/* Progress bar với ánh vàng hoàng kim */}
              <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
                <div
                  className="h-full bg-gradient-to-r from-china-red via-amber-500 to-yellow-400 rounded-full transition-all duration-200 shadow-md"
                  style={{ width: `${processPercent}%` }}
                />
              </div>
            </div>

            {/* 5 Bước quy trình xử lý trực quan (Stepper) */}
            <div className="w-full max-w-md grid grid-cols-5 gap-1 text-[10px] sm:text-xs">
              {[
                { label: "Kiểm tra", icon: Clock, step: 1 },
                { label: "Tách audio", icon: Music, step: 2 },
                { label: "Cắt mốc câu", icon: Wand2, step: 3 },
                { label: "Pinyin & Dịch", icon: FileText, step: 4 },
                { label: "Khởi tạo", icon: Sparkles, step: 5 },
              ].map((s) => {
                const isDone = processStep > s.step
                const isCurrent = processStep === s.step
                const IconComponent = s.icon

                return (
                  <div
                    key={s.step}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      isDone
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                        : isCurrent
                        ? "bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-800 dark:text-amber-300 font-bold shadow-sm scale-105"
                        : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400"
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isCurrent ? "animate-bounce" : ""}`} />
                    <span className="text-[10px] truncate max-w-full">{s.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Terminal log giả lập chạy mượt mà */}
            <div className="w-full max-w-md bg-stone-900 text-stone-200 p-3 rounded-2xl border border-stone-700/80 text-left font-mono text-[11px] space-y-1 h-28 overflow-y-auto shadow-inner">
              <div className="flex items-center gap-1.5 text-stone-400 text-[10px] pb-1 border-b border-stone-800">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>AI_VIDEO_PROCESSING_STREAM // LIVE LOGS</span>
              </div>
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed animate-fade-in text-stone-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        ) : !isPro ? (
          /* ------------------------------------------------------------- */
          /* PRO UPSELL GATE DÀNH CHO NGƯỜI DÙNG MIỄN PHÍ */
          /* ------------------------------------------------------------- */
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600 flex items-center justify-center shadow-inner">
              <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                <Crown className="w-3.5 h-3.5" />
                <span>ĐẶC QUYỀN GÓI PRO 👑</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-china-ink">
                Tự Do Thêm Video Dưới 30 Phút
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                Nâng cấp Gói Pro để dán bất kỳ link video YouTube nào (phim ảnh, talkshow, vlog thực tế dưới 30 phút), tự động trích xuất âm thanh và đồng bộ kịch bản Shadowing nhại giọng!
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-4 text-left space-y-2.5 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-china-ink">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Hỗ trợ video dài tới 30 phút</strong> (khoảng 300 - 500 câu thoại)</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Nhận diện mốc thời gian tự động hoặc dán phụ đề SRT / VTT chuẩn xác</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Tự động tạo Pinyin có thanh điệu & Dịch nghĩa tiếng Việt</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Thu âm đối chiếu giọng bản xứ không giới hạn số lượt</span>
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
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                Để sau, tôi học video có sẵn
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* FORM NHẬP VIDEO CHO NGƯỜI DÙNG PRO */
          /* ------------------------------------------------------------- */
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            {/* Header modal */}
            <div className="p-5 sm:p-6 pb-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950/60 dark:to-amber-900/40 border border-amber-300 dark:border-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Video className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-china-ink">
                      Thêm Video Shadowing Mới
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-600 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-600" />
                      PRO &bull; TỐI ĐA 30 PHÚT
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Dán link YouTube và tạo kịch bản luyện nhại giọng đồng bộ mốc thời gian
                  </p>
                </div>
              </div>
            </div>

            {/* Thân modal có thể cuộn */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Dán link video YouTube */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-china-ink flex items-center gap-1.5">
                    Link Video YouTube (Dưới 30 phút): <span className="text-china-red">*</span>
                  </label>
                  {isFetchingInfo && (
                    <span className="text-[11px] text-amber-600 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Đang lấy thông tin video...
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="Ví dụ: https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-china-red/30 focus:border-china-red bg-white dark:bg-stone-900"
                />
              </div>

              {/* Tiêu đề bài học */}
              <div>
                <label className="block text-xs font-bold text-china-ink mb-1.5">
                  Tiêu đề bài học: <span className="text-china-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Luyện đối thoại trinh thám / Phỏng vấn đời thường..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-china-red/30 focus:border-china-red bg-white dark:bg-stone-900"
                />
              </div>

              {/* Phân loại & Cấp độ */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-china-ink mb-1.5">Cấp độ HSK:</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as ShadowingVideo["level"])}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-china-red/30 bg-white dark:bg-stone-900"
                  >
                    <option value="HSK 1-2">HSK 1-2 (Cơ bản)</option>
                    <option value="HSK 2-3">HSK 2-3 (Sơ - Trung cấp)</option>
                    <option value="HSK 3-4">HSK 3-4 (Trung cấp)</option>
                    <option value="HSK 4+">HSK 4+ (Nâng cao)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-china-ink mb-1.5">Chủ đề:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ShadowingVideo["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-china-red/30 bg-white dark:bg-stone-900"
                  >
                    <option value="Giao tiếp đời sống">Giao tiếp đời sống</option>
                    <option value="Ẩm thực & Mua sắm">Ẩm thực & Mua sắm</option>
                    <option value="Phim hoạt hình ngắn">Phim hoạt hình ngắn</option>
                    <option value="Công sở & Phỏng vấn">Công sở & Phỏng vấn</option>
                  </select>
                </div>
              </div>

              {/* Nút nạp nhanh mẫu có sẵn (Quick Template) */}
              <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-[11px] text-amber-900 dark:text-amber-200">
                  <span className="font-bold">💡 Thử nghiệm nhanh với video mẫu chuẩn:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 text-amber-900 dark:text-amber-200 transition-colors cursor-pointer"
                    >
                      {i === 0 ? "🎤 Phỏng vấn đường phố" : "🍜 Vlog ẩm thực"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhập kịch bản câu thoại hoặc Dán phụ đề SRT / VTT */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-china-ink">
                    Kịch bản câu thoại hoặc Phụ đề SRT / WebVTT:
                  </label>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Hỗ trợ mốc giây chuẩn
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={sentencesText}
                  onChange={(e) => setSentencesText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-china-red/30 bg-white dark:bg-stone-900 leading-relaxed"
                  placeholder="Dán phụ đề SRT / VTT hoặc nhập từng dòng:&#10;00:00:01.000 --> 00:00:04.500&#10;你好！很高兴认识你。 | Nǐ hǎo! | Xin chào!&#10;&#10;Hoặc định dạng rút gọn:&#10;Chữ Hán | Pinyin | Tiếng Việt"
                />
                <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
                  <p>
                    ✨ <strong>Định dạng chấp nhận:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-[10px] text-stone-500">
                    <li>Dán trực tiếp khối phụ đề <strong>SRT / WebVTT</strong> (tự động nhận mốc thời gian <code>00:01:23 --&gt; 00:01:28</code>).</li>
                    <li>Hoặc gõ định dạng nhanh: <code>Chữ Hán | Pinyin | Nghĩa tiếng Việt</code> (hệ thống sẽ tự phân bổ nhịp thời gian tự nhiên).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer nút hành động */}
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/50 flex items-center justify-between">
              <div className="text-[11px] text-stone-500 hidden sm:flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Giới hạn Pro: Video dưới 30 phút</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-china-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Bắt đầu xử lý AI & Khởi tạo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
