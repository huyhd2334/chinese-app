"use client"

import React, { useState, useMemo } from "react"
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  Calendar, 
  Clock, 
  Compass,
  AlertTriangle,
  Award,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  BookmarkCheck,
  Check,
  Info
} from "lucide-react"
import type { 
  RoadmapSetupInput, 
  RoadmapGoalType, 
  HskLevelNumber, 
  FocusSkill 
} from "@/types/roadmap"
import { HSK_CUMULATIVE_STANDARDS } from "@/utils/roadmapStorage"
import { useRoadmap } from "@/hooks/useRoadmap"

interface RoadmapWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

interface GoalConfig {
  id: RoadmapGoalType
  title: string
  subtitle: string
  icon: React.ElementType
  recommendedTarget: HskLevelNumber
  defaultSkills: FocusSkill[]
  description: string
}

const GOAL_OPTIONS: GoalConfig[] = [
  {
    id: "foundational",
    title: "Xây nền từ con số 0",
    subtitle: "Pinyin, nét chữ & từ vựng căn bản",
    icon: BookOpen,
    recommendedTarget: 1,
    defaultSkills: ["vocabulary", "speaking", "writing"],
    description: "Khởi đầu vững chắc với ngữ âm chuẩn Pinyin, quy tắc thuận bút và tích lũy vốn từ nền tảng đầu tiên.",
  },
  {
    id: "conversation",
    title: "Giao tiếp & Du lịch",
    subtitle: "Phản xạ nghe nói & sinh hoạt hàng ngày",
    icon: Headphones,
    recommendedTarget: 2,
    defaultSkills: ["listening", "speaking", "vocabulary"],
    description: "Tập trung phản xạ nghe hiểu, hỏi đường, mua sắm và kết bạn. Không bắt buộc phải học viết chữ Hán chuyên sâu.",
  },
  {
    id: "hsk_exam",
    title: "Luyện thi chứng chỉ HSK",
    subtitle: "Bài bản theo khung chuẩn HSK 3.0",
    icon: Award,
    recommendedTarget: 3,
    defaultSkills: ["vocabulary", "grammar", "listening", "writing"],
    description: "Bao quát toàn diện 4 kỹ năng (Nghe - Đọc - Viết - Ngữ pháp) để đạt điểm cao trong kỳ thi chứng chỉ chính thức.",
  },
  {
    id: "business",
    title: "Công việc & Thương mại",
    subtitle: "Đàm phán, email & giao dịch đối tác",
    icon: Target,
    recommendedTarget: 4,
    defaultSkills: ["vocabulary", "grammar", "listening"],
    description: "Nâng cao vốn từ kinh doanh, hợp đồng thương mại và giao tiếp văn phòng với đối tác Trung Quốc.",
  },
]

const SKILL_ITEMS: { id: FocusSkill; label: string; desc: string; icon: React.ElementType }[] = [
  { id: "vocabulary", label: "Từ vựng cốt lõi & Flashcards SRS", desc: "Ghi nhớ ngắt quãng chống quên từ", icon: BookOpen },
  { id: "listening", label: "Luyện nghe hiểu chuẩn bản xứ", desc: "Hội thoại thực tế có phiên âm và dịch nghĩa", icon: Headphones },
  { id: "speaking", label: "Khẩu ngữ & Ngữ điệu (Shadowing)", desc: "Nhại giọng video người bản xứ, sửa thanh điệu", icon: Mic },
  { id: "grammar", label: "Ngữ pháp & Cấu trúc câu thực hành", desc: "Mẫu câu ứng dụng trực tiếp vào giao tiếp và bài thi", icon: BookmarkCheck },
  { id: "writing", label: "Quy tắc thuận bút & Nét chữ Hán", desc: "Tập viết chữ chuẩn xác từng nét thuận bút", icon: PenTool },
]

export function RoadmapWizardModal({ isOpen, onClose }: RoadmapWizardModalProps) {
  const { roadmap, createOrUpdateRoadmap } = useRoadmap()

  // 4 Bước hợp lý, tinh gọn:
  // 1: Mục đích & Trình độ (Khởi điểm -> Mục tiêu)
  // 2: Thời hạn & Cam kết thời gian thực tế
  // 3: Kỹ năng trọng tâm
  // 4: Xem trước kế hoạch & Phê duyệt
  const [step, setStep] = useState<number>(1)

  // State Form
  const [goalType, setGoalType] = useState<RoadmapGoalType>(roadmap?.goalType || "hsk_exam")
  const [startLevel, setStartLevel] = useState<number>(roadmap?.startLevel ?? 0)
  const [targetLevel, setTargetLevel] = useState<HskLevelNumber>(
    roadmap?.targetLevel || (roadmap?.startLevel ? (Math.min(6, roadmap.startLevel + 1) as HskLevelNumber) : 2)
  )

  const [minutesPerDay, setMinutesPerDay] = useState<number>(roadmap?.minutesPerDay || 30)
  const [daysPerWeek, setDaysPerWeek] = useState<number>(roadmap?.daysPerWeek || 6)
  const [focusSkills, setFocusSkills] = useState<FocusSkill[]>(
    roadmap?.focusSkills || ["vocabulary", "listening", "speaking"]
  )

  // Tính số từ còn thiếu để đạt mục tiêu
  const totalTargetWords = HSK_CUMULATIVE_STANDARDS[targetLevel]?.words || 300
  const totalTargetLessons = HSK_CUMULATIVE_STANDARDS[targetLevel]?.lessons || 30
  const alreadyKnownWords = startLevel > 0 ? (HSK_CUMULATIVE_STANDARDS[startLevel as HskLevelNumber]?.words || 0) : 0
  const alreadyKnownLessons = startLevel > 0 ? (HSK_CUMULATIVE_STANDARDS[startLevel as HskLevelNumber]?.lessons || 0) : 0

  const remainingWords = Math.max(50, totalTargetWords - alreadyKnownWords)
  const remainingLessons = Math.max(1, totalTargetLessons - alreadyKnownLessons)

  // Tạo các mốc thời gian thực tế (Realistic Pace Presets) dựa trên khối lượng từ còn thiếu
  const pacePresets = useMemo(() => {
    // 1. Cấp tốc (Fast Track): ~5-6 từ mới/ngày
    const fastDays = Math.max(28, Math.round(remainingWords / 5.5))
    // 2. Tiêu chuẩn (Recommended): ~3-3.5 từ mới/ngày
    const standardDays = Math.max(50, Math.round(remainingWords / 3.2))
    // 3. Bền bỉ (Steady): ~2 từ mới/ngày
    const steadyDays = Math.max(80, Math.round(remainingWords / 2.0))

    const formatDateOffset = (days: number) => {
      const d = new Date()
      d.setDate(d.getDate() + days)
      return d.toISOString().split("T")[0]
    }

    return [
      {
        id: "fast",
        title: "Cấp tốc",
        days: fastDays,
        months: Math.max(1, Math.round((fastDays / 30) * 10) / 10),
        targetDate: formatDateOffset(fastDays),
        dailyWords: Math.ceil(remainingWords / fastDays),
        recommendedMinutes: remainingWords > 1000 ? 60 : 45,
        desc: "Học tập trung cao độ, tiến độ nhanh để kịp đợt thi.",
        badge: "Tăng tốc",
      },
      {
        id: "standard",
        title: "Tiêu chuẩn",
        days: standardDays,
        months: Math.max(1.5, Math.round((standardDays / 30) * 10) / 10),
        targetDate: formatDateOffset(standardDays),
        dailyWords: Math.ceil(remainingWords / standardDays),
        recommendedMinutes: 30,
        desc: "Cân bằng hoàn hảo giữa học tập và công việc, tỷ lệ ghi nhớ cao nhất.",
        badge: "Khuyên dùng",
        popular: true,
      },
      {
        id: "steady",
        title: "Bền bỉ",
        days: steadyDays,
        months: Math.max(2, Math.round((steadyDays / 30) * 10) / 10),
        targetDate: formatDateOffset(steadyDays),
        dailyWords: Math.ceil(remainingWords / steadyDays),
        recommendedMinutes: 15,
        desc: "Mỗi ngày một chút nhẹ nhàng, không áp lực, nhớ từ tự nhiên.",
        badge: "Thư thả",
      },
    ]
  }, [remainingWords])

  // Selected target date
  const [selectedPaceId, setSelectedPaceId] = useState<string>("standard")
  const [targetDate, setTargetDate] = useState<string>(() => {
    return roadmap?.targetDate || pacePresets[1].targetDate
  })
  const [isCustomDate, setIsCustomDate] = useState(false)

  // Tính số ngày còn lại theo targetDate hiện tại
  const daysDiff = useMemo(() => {
    const now = new Date()
    const targetObj = new Date(targetDate)
    const diff = Math.ceil((targetObj.getTime() - now.getTime()) / (1000 * 3600 * 24))
    return Math.max(1, diff)
  }, [targetDate])

  const requiredWordsPerDay = Math.ceil(remainingWords / daysDiff)
  const requiredLessonsPerWeek = parseFloat((remainingLessons / Math.max(1, daysDiff / 7)).toFixed(1))

  // Đánh giá tính khả thi thực tế
  const feasibility = useMemo(() => {
    if (requiredWordsPerDay > 25) {
      return {
        level: "danger",
        title: "Mục tiêu rất khó đạt",
        desc: `Cần nạp ~${requiredWordsPerDay} từ mới/ngày. Nhịp độ này quá tải và dễ bỏ cuộc. Khuyến nghị thời gian tối thiểu nên là ${pacePresets[0].months} tháng.`,
      }
    }
    if (requiredWordsPerDay > 12) {
      return {
        level: "warning",
        title: "Thách thức cao (Cần quyết tâm lớn)",
        desc: `Cần học ~${requiredWordsPerDay} từ/ngày. Bạn cần dành ít nhất ${Math.max(45, minutesPerDay)} phút mỗi ngày để ôn tập đúng hạn.`,
      }
    }
    return {
      level: "good",
      title: "Lộ trình thực tế & Khả thi cao",
      desc: `Chỉ cần ~${requiredWordsPerDay} từ mới/ngày. Với ${minutesPerDay} phút học hàng ngày, bạn hoàn toàn làm chủ mục tiêu!`,
    }
  }, [requiredWordsPerDay, minutesPerDay, pacePresets])

  if (!isOpen) return null

  // Khi đổi Mục đích: Tự động cập nhật Kỹ năng mặc định và Cấp độ mục tiêu khuyến nghị
  const handleSelectGoal = (g: GoalConfig) => {
    setGoalType(g.id)
    setFocusSkills(g.defaultSkills)
    if (g.recommendedTarget > startLevel) {
      setTargetLevel(g.recommendedTarget)
    } else {
      setTargetLevel(Math.min(6, startLevel + 1) as HskLevelNumber)
    }
  }

  // Khi đổi Trình độ khởi điểm
  const handleSelectStartLevel = (lvl: number) => {
    setStartLevel(lvl)
    if (targetLevel <= lvl) {
      setTargetLevel(Math.min(6, lvl + 1) as HskLevelNumber)
    }
  }

  // Khi bấm chọn gói nhịp độ thực tế
  const handleSelectPace = (preset: typeof pacePresets[0]) => {
    setSelectedPaceId(preset.id)
    setIsCustomDate(false)
    setTargetDate(preset.targetDate)
    setMinutesPerDay(preset.recommendedMinutes)
  }

  const handleSkillToggle = (skill: FocusSkill) => {
    if (focusSkills.includes(skill)) {
      if (focusSkills.length > 1) {
        setFocusSkills(focusSkills.filter((s) => s !== skill))
      }
    } else {
      setFocusSkills([...focusSkills, skill])
    }
  }

  const handleFinish = () => {
    const input: RoadmapSetupInput = {
      goalType,
      targetLevel,
      startLevel,
      targetDate,
      minutesPerDay,
      daysPerWeek,
      focusSkills,
    }
    createOrUpdateRoadmap(input)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Step Tracker */}
        <div className="p-4 sm:p-5 border-b border-border/70 bg-stone-50 dark:bg-stone-900/40 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-china-ink font-semibold text-xs sm:text-sm">
              <Compass className="w-4 h-4 text-china-red shrink-0" />
              <span>Thiết lập lộ trình học tập</span>
              <span className="text-muted font-normal text-xs">
                (Bước {step}/4: {
                  step === 1 ? "Mục đích & Trình độ" :
                  step === 2 ? "Kế hoạch thời gian" :
                  step === 3 ? "Kỹ năng ưu tiên" : "Duyệt lộ trình"
                })
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted hover:text-china-ink hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-china-red h-1 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-5">
          
          {/* BƯỚC 1: MỤC ĐÍCH HỌC & TRÌNH ĐỘ (RÀNG BUỘC LOGIC) */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-china-ink">
                  1. Mục đích học tiếng Trung của bạn là gì?
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Chọn mục đích chính để hệ thống tự động thiết lập cấp độ và kỹ năng tương ứng.
                </p>
              </div>

              {/* Goal Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GOAL_OPTIONS.map((g) => {
                  const Icon = g.icon
                  const isSelected = goalType === g.id
                  return (
                    <div
                      key={g.id}
                      onClick={() => handleSelectGoal(g)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-china-red/5 border-china-red text-china-ink shadow-xs" 
                          : "bg-card border-border hover:border-slate-300 dark:hover:border-stone-600 text-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isSelected ? "bg-china-red text-white" : "bg-stone-100 dark:bg-stone-800 text-muted"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-china-ink flex items-center gap-1.5">
                            <span>{g.title}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-china-red" />}
                          </div>
                          <div className="text-[11px] text-muted mt-0.5 leading-tight">{g.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Trình độ hiện tại */}
              <div className="pt-2 border-t border-border/70 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400">
                  Trình độ hiện tại của bạn:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { lvl: 0, label: "Mới bắt đầu", sub: "Chưa biết gì" },
                    { lvl: 1, label: "Đã có HSK 1", sub: "~150 từ" },
                    { lvl: 2, label: "Đã có HSK 2", sub: "~300 từ" },
                    { lvl: 3, label: "Đã có HSK 3", sub: "~600 từ" },
                    { lvl: 4, label: "Đã có HSK 4", sub: "~1200 từ" },
                    { lvl: 5, label: "Đã có HSK 5", sub: "~2500 từ" },
                  ].map((item) => {
                    const isSelected = startLevel === item.lvl
                    return (
                      <button
                        key={item.lvl}
                        type="button"
                        onClick={() => handleSelectStartLevel(item.lvl)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-900 border-slate-900 dark:border-stone-100 font-bold"
                            : "bg-card border-border text-slate-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60"
                        }`}
                      >
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{item.sub}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Cấp độ mục tiêu muốn đạt */}
              <div className="pt-2 border-t border-border/70 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400">
                    Cấp độ mục tiêu muốn đạt:
                  </label>
                  {startLevel > 0 && (
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ Đã miễn học HSK 1{startLevel > 1 ? `–${startLevel}` : ""}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {([1, 2, 3, 4, 5, 6] as HskLevelNumber[]).map((lvl) => {
                    const isBelowStart = lvl <= startLevel
                    const isSelected = targetLevel === lvl

                    return (
                      <button
                        key={lvl}
                        type="button"
                        disabled={isBelowStart}
                        onClick={() => setTargetLevel(lvl)}
                        className={`py-2.5 px-2 rounded-xl text-center border transition-all ${
                          isBelowStart
                            ? "bg-stone-100 dark:bg-stone-800/40 border-border/50 text-muted/50 cursor-not-allowed"
                            : isSelected
                            ? "bg-china-red border-china-red text-white font-bold shadow-xs"
                            : "bg-card border-border text-china-ink hover:border-slate-300 dark:hover:border-stone-600 cursor-pointer"
                        }`}
                      >
                        <div className="text-xs font-bold">HSK {lvl}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          {isBelowStart ? "Đã qua" : `${HSK_CUMULATIVE_STANDARDS[lvl].words} từ`}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 2: KẾ HOẠCH THỜI GIAN THỰC TẾ DỰA TRÊN SỐ TỪ CẦN HỌC */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-china-ink">
                  2. Kế hoạch thời gian thực tế
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Để từ <strong>HSK {startLevel === 0 ? "số 0" : startLevel}</strong> lên <strong>HSK {targetLevel}</strong>, bạn cần tích lũy thêm <strong>{remainingWords} từ vựng</strong> và <strong>{remainingLessons} bài học</strong>.
                </p>
              </div>

              {/* 3 Gói nhịp độ học thực tế (Pace Presets) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400">
                  Chọn nhịp độ học phù hợp với quỹ thời gian của bạn:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pacePresets.map((preset) => {
                    const isSelected = !isCustomDate && selectedPaceId === preset.id
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPace(preset)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? "bg-china-red/5 border-china-red text-china-ink shadow-xs"
                            : "bg-card border-border hover:border-slate-300 dark:hover:border-stone-600 text-muted"
                        }`}
                      >
                        {preset.popular && (
                          <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                            {preset.badge}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-china-ink">{preset.title}</span>
                            <span className="text-xs font-bold text-china-red">~{preset.months} tháng</span>
                          </div>
                          <div className="text-[11px] text-muted mt-1 leading-relaxed">
                            {preset.desc}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-border/60 text-[11px] flex items-center justify-between text-slate-700 dark:text-stone-300">
                          <span>~{preset.dailyWords} từ/ngày</span>
                          <span className="font-semibold">{preset.recommendedMinutes} phút/ngày</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tùy chỉnh ngày thi cụ thể */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-china-red" />
                    <span>Hoặc tự chọn ngày thi cụ thể:</span>
                  </label>
                  <span className="text-xs text-muted font-medium">
                    Còn <strong>{daysDiff} ngày</strong>
                  </span>
                </div>

                <input
                  type="date"
                  min={new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0]}
                  value={targetDate}
                  onChange={(e) => {
                    setTargetDate(e.target.value)
                    setIsCustomDate(true)
                  }}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-china-ink font-medium text-xs sm:text-sm focus:outline-none focus:border-china-red"
                />
              </div>

              {/* Quỹ thời gian mỗi ngày & Số ngày/tuần */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400 mb-1.5">
                    Thời gian dành mỗi ngày:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setMinutesPerDay(mins)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          minutesPerDay === mins
                            ? "bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-900 border-slate-900 dark:border-stone-100 font-bold"
                            : "bg-card border-border text-slate-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                      >
                        {mins}p
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400 mb-1.5">
                    Số ngày học / tuần:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[4, 5, 6, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDaysPerWeek(days)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          daysPerWeek === days
                            ? "bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-900 border-slate-900 dark:border-stone-100 font-bold"
                            : "bg-card border-border text-slate-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                      >
                        {days} ngày
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Đánh giá thực tế */}
              <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                feasibility.level === "danger" 
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200" 
                  : feasibility.level === "warning"
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              }`}>
                {feasibility.level === "danger" ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                ) : feasibility.level === "warning" ? (
                  <Clock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{feasibility.title}</div>
                  <div className="text-[11px] mt-0.5 opacity-90 leading-relaxed">{feasibility.desc}</div>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 3: KỸ NĂNG TRỌNG TÂM (ĐÃ PRE-FILL THÔNG MINH THEO BƯỚC 1) */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-china-ink">
                  3. Kỹ năng ưu tiên rèn luyện
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Đã tự động chọn theo mục đích <strong>{GOAL_OPTIONS.find(g => g.id === goalType)?.title}</strong>. Bạn có thể bật/tắt thêm theo nhu cầu cá nhân.
                </p>
              </div>

              <div className="space-y-2.5">
                {SKILL_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isChecked = focusSkills.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSkillToggle(item.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? "bg-china-red/5 border-china-red text-china-ink"
                          : "bg-card border-border hover:border-slate-300 dark:hover:border-stone-600 text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isChecked ? "bg-china-red text-white" : "bg-stone-100 dark:bg-stone-800 text-muted"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-china-ink">{item.label}</div>
                          <div className="text-[11px] text-muted">{item.desc}</div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked ? "bg-china-red border-china-red text-white" : "border-border"
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* BƯỚC 4: TỔNG QUAN KẾ HOẠCH & XÁC NHẬN */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-china-red/10 text-china-red flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-china-ink">
                  Kế hoạch học tập cá nhân hóa
                </h3>
                <p className="text-xs text-muted max-w-md mx-auto">
                  Kiểm tra lại toàn bộ thông số lộ trình trước khi kích hoạt theo dõi tiến độ.
                </p>
              </div>

              {/* Tóm tắt thông số cốt lõi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border text-center">
                  <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Mục tiêu</div>
                  <div className="text-base font-bold text-china-red mt-0.5">HSK {targetLevel}</div>
                  <div className="text-[10px] text-muted mt-0.5">
                    {startLevel > 0 ? `từ HSK ${startLevel}` : "từ con số 0"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border text-center">
                  <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Từ vựng cần nạp</div>
                  <div className="text-base font-bold text-china-ink mt-0.5">{remainingWords} từ</div>
                  <div className="text-[10px] text-muted mt-0.5">~{requiredWordsPerDay} từ / ngày</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border text-center">
                  <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Giáo trình HSK</div>
                  <div className="text-base font-bold text-china-ink mt-0.5">{remainingLessons} bài</div>
                  <div className="text-[10px] text-muted mt-0.5">~{requiredLessonsPerWeek} bài / tuần</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border text-center">
                  <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Cam kết học</div>
                  <div className="text-base font-bold text-china-ink mt-0.5">{minutesPerDay} phút</div>
                  <div className="text-[10px] text-muted mt-0.5">{daysPerWeek} ngày / tuần</div>
                </div>
              </div>

              {/* Chi tiết mục tiêu & thời hạn */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted">Mục đích chính:</span>
                  <span className="font-semibold text-china-ink">
                    {GOAL_OPTIONS.find(g => g.id === goalType)?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted">Ngày dự kiến hoàn thành:</span>
                  <span className="font-semibold text-china-ink font-mono">{targetDate} ({daysDiff} ngày tới)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Kỹ năng tập trung ({focusSkills.length}):</span>
                  <span className="font-semibold text-china-ink">
                    {focusSkills.map(s => SKILL_ITEMS.find(i => i.id === s)?.label.split("&")[0].trim()).join(", ")}
                  </span>
                </div>
              </div>

              {/* Thông báo khả thi */}
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-border flex items-center gap-2.5 text-xs text-slate-700 dark:text-stone-300">
                <Info className="w-4 h-4 shrink-0 text-china-red" />
                <span>
                  Hệ thống sẽ dựa vào lộ trình này để tự động phân bổ mục tiêu ôn tập từ vựng SRS và bài học giáo trình mỗi ngày.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-3.5 sm:p-4 border-t border-border bg-card shrink-0 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-border hover:bg-stone-100 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kích hoạt lộ trình</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
