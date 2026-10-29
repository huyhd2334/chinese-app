"use client"

import React, { useState } from "react"
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Calendar, 
  Clock, 
  Compass,
  AlertTriangle,
  Flame,
  Award,
  BookOpen
} from "lucide-react"
import type { 
  RoadmapSetupInput, 
  RoadmapGoalType, 
  HskLevelNumber, 
  FocusSkill 
} from "@/types/roadmap"
import { HSK_CUMULATIVE_STANDARDS, HSK_LEVEL_INCREMENTS } from "@/utils/roadmapStorage"
import { useRoadmap } from "@/hooks/useRoadmap"

interface RoadmapWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RoadmapWizardModal({ isOpen, onClose }: RoadmapWizardModalProps) {
  const { roadmap, createOrUpdateRoadmap } = useRoadmap()

  // Step state (1 to 6)
  const [step, setStep] = useState<number>(1)

  // Form states
  const [goalType, setGoalType] = useState<RoadmapGoalType>(roadmap?.goalType || "hsk_exam")
  const [targetLevel, setTargetLevel] = useState<HskLevelNumber>(roadmap?.targetLevel || 2)
  const [startLevel, setStartLevel] = useState<number>(roadmap?.startLevel ?? 0)
  
  // Target date (mặc định 60 ngày tới)
  const defaultDate = roadmap?.targetDate || new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split("T")[0]
  const [targetDate, setTargetDate] = useState<string>(defaultDate)
  
  const [minutesPerDay, setMinutesPerDay] = useState<number>(roadmap?.minutesPerDay || 30)
  const [daysPerWeek, setDaysPerWeek] = useState<number>(roadmap?.daysPerWeek || 6)
  const [focusSkills, setFocusSkills] = useState<FocusSkill[]>(
    roadmap?.focusSkills || ["vocabulary", "listening", "speaking"]
  )

  if (!isOpen) return null

  // Tính toán nhanh dự báo
  const now = new Date()
  const targetDateObj = new Date(targetDate)
  const daysDiff = Math.max(1, Math.ceil((targetDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24)))
  
  const totalTargetWords = HSK_CUMULATIVE_STANDARDS[targetLevel]?.words || 300
  const totalTargetLessons = HSK_CUMULATIVE_STANDARDS[targetLevel]?.lessons || 30
  
  // Trừ bớt nếu đã biết các cấp trước
  const alreadyKnownWords = startLevel > 0 ? (HSK_CUMULATIVE_STANDARDS[startLevel as HskLevelNumber]?.words || 0) : 0
  const alreadyKnownLessons = startLevel > 0 ? (HSK_CUMULATIVE_STANDARDS[startLevel as HskLevelNumber]?.lessons || 0) : 0
  
  const remainingWordsToLearn = Math.max(0, totalTargetWords - alreadyKnownWords)
  const remainingLessonsToLearn = Math.max(0, totalTargetLessons - alreadyKnownLessons)
  
  const requiredWordsPerDay = Math.ceil(remainingWordsToLearn / daysDiff)
  const requiredLessonsPerWeek = parseFloat(((remainingLessonsToLearn / (daysDiff / 7))).toFixed(1))
  
  const isPaceChallenging = requiredWordsPerDay > (minutesPerDay * 0.8)

  const handleNext = () => {
    if (step < 6) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Progress Bar */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-secondary/20 shrink-0">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs sm:text-sm">
              <Compass className="w-4 h-4 shrink-0" />
              <span>Thiết lập Lộ trình (Bước {step}/6)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Dots / Bar */}
          <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body: Steps Content */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 min-h-0 space-y-5 sm:space-y-6">
          {/* BƯỚC 1: MỤC TIÊU & CẤP ĐỘ HSK */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="text-xl font-bold text-foreground">1. Mục đích học tiếng Trung của bạn là gì?</h4>
                <p className="text-sm text-muted-foreground mt-1">Chọn mục tiêu chính để hệ thống cá nhân hóa trọng tâm bài học cho bạn.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "hsk_exam", title: "Luyện thi chứng chỉ HSK", desc: "Học bài bản theo chuẩn kỳ thi mới nhất", icon: Award },
                  { id: "conversation", title: "Giao tiếp & Du lịch", desc: "Tập trung phản xạ nghe nói đời sống", icon: Sparkles },
                  { id: "business", title: "Công việc & Thương mại", desc: "Giao dịch, đàm phán với đối tác", icon: Target },
                  { id: "foundational", title: "Xây gốc từ con số 0", desc: "Học chuẩn phát âm, nét chữ và từ căn bản", icon: BookOpen },
                ].map((item) => {
                  const Icon = item.icon
                  const isSelected = goalType === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => setGoalType(item.id as RoadmapGoalType)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-indigo-500/15 border-indigo-500 text-foreground ring-2 ring-indigo-500/30 shadow-sm" 
                          : "bg-secondary/20 border-border/70 hover:bg-secondary/50 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Cấp độ mục tiêu muốn chinh phục:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {([1, 2, 3, 4, 5, 6] as HskLevelNumber[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTargetLevel(lvl)}
                      className={`py-3 px-2 rounded-xl font-bold text-center border transition-all ${
                        targetLevel === lvl
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105"
                          : "bg-secondary/40 border-border/70 text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      <div className="text-sm">HSK {lvl}</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">
                        {HSK_CUMULATIVE_STANDARDS[lvl].words} từ
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 2: TRÌNH ĐỘ HIỆN TẠI */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="text-xl font-bold text-foreground">2. Trình độ tiếng Trung hiện tại của bạn?</h4>
                <p className="text-sm text-muted-foreground mt-1">Chúng tôi sẽ trừ đi phần bạn đã biết để tính toán đúng khối lượng còn thiếu.</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { level: 0, title: "Người mới bắt đầu (Chưa biết gì)", desc: "Bắt đầu học từ bảng chữ cái Pinyin và phát âm" },
                  { level: 1, title: "Đã vững Pinyin & một số từ cơ bản", desc: "Đã biết chào hỏi, số đếm (~50-100 từ vựng)" },
                  { level: 2, title: "Đã có trình độ tương đương HSK 1", desc: "Đã thuộc ~150 từ cơ bản, sẵn sàng học lên HSK 2" },
                  { level: 3, title: "Đã có trình độ tương đương HSK 2", desc: "Đã thuộc ~300 từ, tự tin với hội thoại ngắn" },
                  { level: 4, title: "Đã có trình độ tương đương HSK 3", desc: "Đã thuộc ~600 từ, muốn bứt phá lên trung cấp" },
                ].map((item) => {
                  const isSelected = startLevel === item.level
                  return (
                    <div
                      key={item.level}
                      onClick={() => setStartLevel(item.level)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-indigo-500/15 border-indigo-500 text-foreground ring-2 ring-indigo-500/30" 
                          : "bg-secondary/20 border-border/70 hover:bg-secondary/50 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-foreground text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* BƯỚC 3: THỜI HẠN MỤC TIÊU (TARGET DATE) */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="text-xl font-bold text-foreground">3. Bạn muốn đạt mục tiêu này khi nào?</h4>
                <p className="text-sm text-muted-foreground mt-1">Thời hạn càng cụ thể, hệ thống phân bổ bài tập mỗi ngày càng chính xác.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { days: 30, label: "1 Tháng", desc: "Tốc độ nhanh" },
                  { days: 60, label: "2 Tháng", desc: "Cân bằng" },
                  { days: 90, label: "3 Tháng", desc: "Đề xuất chuẩn" },
                  { days: 180, label: "6 Tháng", desc: "Vững chắc" },
                ].map((opt) => {
                  const optDate = new Date(Date.now() + opt.days * 24 * 3600 * 1000).toISOString().split("T")[0]
                  const isSelected = targetDate === optDate
                  return (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setTargetDate(optDate)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20" 
                          : "bg-secondary/30 border-border/70 text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      <div className="font-bold text-sm">{opt.label}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{opt.desc}</div>
                    </button>
                  )
                })}
              </div>

              <div className="p-4 rounded-xl bg-secondary/30 border border-border/70 space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Hoặc chọn chính xác ngày bạn thi:
                </label>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <input
                    type="date"
                    min={new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0]}
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="bg-card border border-border/80 rounded-lg px-3 py-2 text-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-muted-foreground font-medium">
                    (Còn <strong>{daysDiff} ngày</strong>)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 4: QUỸ THỜI GIAN CAM KẾT */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="text-xl font-bold text-foreground">4. Quỹ thời gian bạn có thể cam kết mỗi ngày?</h4>
                <p className="text-sm text-muted-foreground mt-1">Học đều đặn 20-30 phút mỗi ngày mang lại hiệu quả gấp 5 lần học dồn cuối tuần.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { mins: 15, title: "15 Phút / ngày", desc: "Duy trì nhịp, nhẹ nhàng cho người bận rộn" },
                  { mins: 30, title: "30 Phút / ngày", desc: "Mức đề xuất vàng để ghi nhớ tốt nhất", popular: true },
                  { mins: 45, title: "45 Phút / ngày", desc: "Tăng tốc thi lấy chứng chỉ sớm" },
                  { mins: 60, title: "60+ Phút / ngày", desc: "Chinh phục cấp tốc và nâng cao toàn diện" },
                ].map((item) => {
                  const isSelected = minutesPerDay === item.mins
                  return (
                    <div
                      key={item.mins}
                      onClick={() => setMinutesPerDay(item.mins)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-indigo-500/15 border-indigo-500 text-foreground ring-2 ring-indigo-500/30" 
                          : "bg-secondary/20 border-border/70 hover:bg-secondary/50 text-muted-foreground"
                      }`}
                    >
                      {item.popular && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                          Khuyên dùng
                        </span>
                      )}
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        {item.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Số ngày học mỗi tuần:
                </label>
                <div className="flex gap-2">
                  {[4, 5, 6, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysPerWeek(days)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        daysPerWeek === days 
                          ? "bg-indigo-600 text-white border-indigo-500" 
                          : "bg-secondary/30 text-muted-foreground border-border/70 hover:bg-secondary"
                      }`}
                    >
                      {days} ngày / tuần
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 5: KỸ NĂNG TRỌNG TÂM */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="text-xl font-bold text-foreground">5. Bạn muốn ưu tiên kỹ năng nào nhất?</h4>
                <p className="text-sm text-muted-foreground mt-1">Chọn các kỹ năng bạn mong muốn cải thiện (có thể chọn nhiều).</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "vocabulary", label: "Từ vựng cốt lõi & Phản xạ Flashcards SRS", desc: "Ghi nhớ lâu theo thuật toán ngắt quãng" },
                  { id: "listening", label: "Luyện nghe hiểu chuẩn bản xứ (Listening)", desc: "Bài nghe thực tế có transcript và dịch nghĩa" },
                  { id: "speaking", label: "Khẩu ngữ & Ngữ điệu (Shadowing)", desc: "Nhại giọng theo video người bản xứ, sửa thanh điệu" },
                  { id: "grammar", label: "Ngữ pháp & Cấu trúc câu thực hành", desc: "Làm chủ các mẫu câu giao tiếp và bài thi" },
                  { id: "writing", label: "Quy tắc thuận bút & Nét chữ Hán", desc: "Tập vẽ chữ Hán theo từng nét chuẩn mực" },
                ].map((skill) => {
                  const isChecked = focusSkills.includes(skill.id as FocusSkill)
                  return (
                    <div
                      key={skill.id}
                      onClick={() => handleSkillToggle(skill.id as FocusSkill)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked 
                          ? "bg-indigo-500/15 border-indigo-500 text-foreground" 
                          : "bg-secondary/20 border-border/70 hover:bg-secondary/50 text-muted-foreground"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-foreground text-sm">{skill.label}</div>
                        <div className="text-xs text-muted-foreground">{skill.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isChecked ? "bg-indigo-600 border-indigo-500 text-white" : "border-muted-foreground/40"
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* BƯỚC 6: XEM TRƯỚC LỘ TRÌNH & DỰ BÁO CÁN ĐÍCH */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-xl font-bold text-foreground">
                  Lộ trình học cá nhân hóa của bạn đã sẵn sàng!
                </h4>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Dựa trên năng lực hiện tại và quỹ thời gian của bạn, hệ thống đã tính toán phương án học tối ưu nhất.
                </p>
              </div>

              {/* Dự báo tổng quan */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-500/30 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-card/60 border border-border/50">
                    <div className="text-xs text-muted-foreground">Khối lượng còn thiếu</div>
                    <div className="text-lg font-bold text-foreground mt-1">
                      {remainingWordsToLearn} <span className="text-xs font-normal text-muted-foreground">từ</span>
                    </div>
                    <div className="text-[11px] text-indigo-400 font-medium">
                      ({remainingLessonsToLearn} bài học)
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-card/60 border border-border/50">
                    <div className="text-xs text-muted-foreground">Tốc độ yêu cầu</div>
                    <div className="text-lg font-bold text-amber-400 mt-1">
                      ~{requiredWordsPerDay} <span className="text-xs font-normal text-muted-foreground">từ / ngày</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      (~{requiredLessonsPerWeek} bài / tuần)
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-card/60 border border-border/50 col-span-2 sm:col-span-1">
                    <div className="text-xs text-muted-foreground">Thời gian dự kiến</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">
                      {daysDiff} <span className="text-xs font-normal text-muted-foreground">ngày</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Cán đích {targetDate}
                    </div>
                  </div>
                </div>

                {/* Nhận xét / Cảnh báo khả thi */}
                {isPaceChallenging ? (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Mục tiêu này khá gắt với quỹ thời gian {minutesPerDay} phút/ngày. Bạn nên cân nhắc tăng lên 45 phút hoặc kéo dài thêm 2-3 tuần để học không bị quá tải.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Kế hoạch rất khả thi và cân bằng! Duy trì {minutesPerDay} phút mỗi ngày bạn sẽ chắc chắn về đích đúng hạn.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-3.5 sm:p-4 border-t border-border/70 bg-card/95 backdrop-blur-md shrink-0 flex items-center justify-between gap-3 shadow-lg">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl border border-border/70 hover:bg-secondary text-foreground text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={handleNext}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5 min-w-[110px]"
            >
              <span>Tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:from-indigo-700 active:to-purple-700 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>🚀 Bắt đầu ngay</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
