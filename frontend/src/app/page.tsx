"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import ChibiLoading from "@/components/common/ChibiLoading"
import { db, type ReviewItem, type Word } from "../../db/database"
import { importHsk, importListening, importReading } from "../../db/importContent"
import { reviewRepository } from "../../repositories/reviewRepository"
import { wordRepository } from "../../repositories/wordRepository"
import { 
  CircleCheckBig, BookOpen, Brain, Trophy, Target, 
  Play, Ear, Flame, Medal, Compass, Star, TrendingUp, 
  Clock, AlertCircle, ArrowRight, BookMarked, History,
  Volume2, PenTool, CheckCircle2, ChevronRight,
  Settings2, Plus, Zap
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { getHanViet } from "@/utils/hanviet"
import { playChineseAudio } from "@/utils/audioTts"
import { RoadmapCard } from "@/components/roadmap/RoadmapCard"
import { RoadmapWizardModal } from "@/components/roadmap/RoadmapWizardModal"
import { useAuth } from "@/contexts/AuthContext"
import { autoSeedWordsForUser } from "@/utils/autoSeedWords"

const PROVERBS = [
  { cn: "千里之行，始于足下", pinyin: "Qiān lǐ zhī xíng, shǐ yú zú xià", en: "A journey of a thousand miles begins with a single step" },
  { cn: "温故而知新", pinyin: "Wēn gù ér zhī xīn", en: "Review the old and know the new" },
  { cn: "熟能生巧", pinyin: "Shú néng shēng qiǎo", en: "Practice makes perfect" },
  { cn: "学无止境", pinyin: "Xué wú zhǐ jìng", en: "Learning has no bounds" },
  { cn: "万事开头难", pinyin: "Wàn shì kāi tóu nán", en: "All things are difficult before they are easy" }
]

const STREAK_STORAGE_KEY = "chinese_app_streak_config"

const getLocalDateStr = (date: Date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getYesterdayDateStr = (): string => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return getLocalDateStr(d)
}

export default function Dashboard() {
  const { user, isDarkMode } = useAuth()
  const [wordCount, setWordCount] = useState(0)
  const [wordReview, setWordReview] = useState(0)
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [hskData, setHskData] = useState<{ name: string; total: number; learning: number }[]>([])
  const [difficultWords, setDifficultWords] = useState<{ review: ReviewItem; word: Word }[]>([])
  const [proverb, setProverb] = useState(PROVERBS[0])
  const [greeting, setGreeting] = useState("Good morning")
  const [chineseDate, setChineseDate] = useState("")
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [newWordsToday, setNewWordsToday] = useState(0)
  const [wordsStudiedToday, setWordsStudiedToday] = useState(0)
  const [remainingWordsInDict, setRemainingWordsInDict] = useState(0)
  const [effectiveTarget, setEffectiveTarget] = useState(10)
  const [isCondition1Met, setIsCondition1Met] = useState(false)
  const [isCondition2Met, setIsCondition2Met] = useState(false)
  const [dueCount, setDueCount] = useState(0)
  const [dailyTarget, setDailyTarget] = useState(10)
  const [isDailyGoalAchieved, setIsDailyGoalAchieved] = useState(false)
  const [streakToast, setStreakToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [dailyWord, setDailyWord] = useState<Word | null>(null)
  const [isDailyWordAdded, setIsDailyWordAdded] = useState(false)
  const [isRoadmapWizardOpen, setIsRoadmapWizardOpen] = useState(false)

  const playAudio = (text: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    playChineseAudio(text)
  }

  const getData = async () => {
    setLoading(true)
    try {
      const count = await importHsk()
      setWordCount(count)
      await loadData()
    } catch (err) {
      console.error("Dashboard initial load error:", err)
    } finally {
      setLoading(false)
    }

    // Defer non-critical imports (Reading & Listening) to background idle time
    if (typeof window !== "undefined") {
      setTimeout(() => {
        importReading().catch(console.error)
        importListening().catch(console.error)
      }, 1200)
    }
  }

  const loadData = async () => {
    // High-performance index count: takes <1ms instead of loading 5,000 words into memory
    const totalWordCount = await db.words.count()
    let allReviews = await reviewRepository.getAll()

    // Tự động lấy từ khi người dùng chưa có từ nào trong kho ôn tập (chưa có tiến độ / người dùng mới)
    if (allReviews.length === 0 && totalWordCount > 0) {
      try {
        const seedResult = await autoSeedWordsForUser(user?.id)
        if (seedResult.addedCount > 0) {
          allReviews = await reviewRepository.getAll()
          if (seedResult.message) {
            setStreakToast(seedResult.message)
            setTimeout(() => setStreakToast(null), 4000)
          }
        }
      } catch (err) {
        console.warn("Auto-seed words error:", err)
      }
    }

    setReviews(allReviews)
    setWordCount(totalWordCount)
    
    const due = allReviews.filter(r => r.dueAt <= Date.now())
    setWordReview(due.length)
    setDueCount(due.length)

    // Calculate words added and words reviewed/studied today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayStartTs = todayStart.getTime()
    
    const wordsAddedToday = allReviews.filter(r => r.createdAt >= todayStartTs).length
    setNewWordsToday(wordsAddedToday)

    const studiedToday = allReviews.filter(r => r.updatedAt >= todayStartTs && (r.updatedAt !== r.createdAt || r.repetitions > 0)).length
    setWordsStudiedToday(studiedToday)

    // Count unlearned words remaining in the entire dictionary
    const reviewWordIds = new Set(allReviews.map(r => r.wordId))
    const unlearnedCount = Math.max(0, totalWordCount - reviewWordIds.size)
    setRemainingWordsInDict(unlearnedCount)

    // Load HSK levels distribution efficiently via ID indexes
    const hskLevelData = await Promise.all([1, 2, 3, 4, 5, 6].map(async (level) => {
      const ids = (await wordRepository.getIdsByHsk(level)) as string[]
      const idSet = new Set(ids)
      const learning = allReviews.filter(r => idSet.has(r.wordId)).length
      return {
        name: `HSK ${level}`,
        total: ids.length,
        learning
      }
    }))
    setHskData(hskLevelData)

    // Top difficult words: only fetch the needed 10 records with bulkGet!
    const topDifficult = allReviews
      .filter(r => r.wrongCount > 0)
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 10)

    if (topDifficult.length > 0) {
      const wordsMap = new Map<string, Word>()
      const fetchedWords = await db.words.bulkGet(topDifficult.map(r => r.wordId))
      fetchedWords.forEach(w => { if (w) wordsMap.set(w.id, w) })
      const diffList = topDifficult
        .map(r => ({ review: r, word: wordsMap.get(r.wordId)! }))
        .filter(x => x.word)
      setDifficultWords(diffList)
    } else {
      setDifficultWords([])
    }
    
    // Load streak configuration
    const todayStr = getLocalDateStr()
    const yesterdayStr = getYesterdayDateStr()

    let storedConfig = {
      streak: 0,
      bestStreak: 0,
      targetNewWords: 10,
      lastCompletedDate: "",
      completedDates: [] as string[]
    }

    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY)
      if (saved) {
        storedConfig = { ...storedConfig, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error("Error reading streak config", e)
    }

    const target = storedConfig.targetNewWords || 10
    setDailyTarget(target)

    // Effective target: if remaining words in dict is fewer than target, adjust
    const effTarget = unlearnedCount > 0 ? Math.min(target, unlearnedCount) : 0
    setEffectiveTarget(effTarget > 0 ? effTarget : target)

    // Condition 1: "Từ mới & Hoạt động học hôm nay"
    // Satisfied if:
    // 1. Added >= target new words today (or >= effective target)
    // 2. OR unlearnedCount === 0 (all words in the dictionary have been added to study list!)
    // 3. OR user studied/reviewed >= target words today (active review progress counts!)
    // 4. OR remaining words < target and user added all remaining words today
    const cond1Met = 
      (effTarget > 0 && wordsAddedToday >= effTarget) ||
      unlearnedCount === 0 ||
      studiedToday >= target ||
      (unlearnedCount > 0 && wordsAddedToday >= unlearnedCount)
    setIsCondition1Met(cond1Met)

    // Condition 2: "Ôn tập từ tới hạn"
    // Satisfied if all due items have been reviewed (due.length === 0)
    const cond2Met = due.length === 0
    setIsCondition2Met(cond2Met)

    // Daily Goal achieved if both conditions are met and user has review items
    const isTodayMet = cond1Met && cond2Met && allReviews.length > 0
    setIsDailyGoalAchieved(isTodayMet)

    let currentStreak = storedConfig.streak
    let currentBest = storedConfig.bestStreak
    let lastCompleted = storedConfig.lastCompletedDate
    let completedDates = storedConfig.completedDates || []

    if (isTodayMet) {
      if (!completedDates.includes(todayStr)) {
        completedDates.push(todayStr)

        let diffDays = 999
        if (lastCompleted) {
          const lastDate = new Date(lastCompleted + "T00:00:00")
          const nowDate = new Date(todayStr + "T00:00:00")
          diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        }

        if (diffDays === 1 || (diffDays === 999 && currentStreak > 0)) {
          currentStreak += 1
        } else if (diffDays === 0) {
          // already counted today
        } else {
          currentStreak = 1
        }

        lastCompleted = todayStr
        currentBest = Math.max(currentBest, currentStreak)
        storedConfig = {
          ...storedConfig,
          streak: currentStreak,
          bestStreak: currentBest,
          lastCompletedDate: lastCompleted,
          completedDates
        }
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(storedConfig))
      }
    } else {
      if (completedDates.includes(todayStr)) {
        // Was already marked complete today
        setIsDailyGoalAchieved(true)
      } else {
        // Streak is only broken if at least 1 FULL DAY was skipped (diffDays > 1)
        let diffDays = 0
        if (lastCompleted) {
          const lastDate = new Date(lastCompleted + "T00:00:00")
          const nowDate = new Date(todayStr + "T00:00:00")
          diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        }

        if (diffDays > 1) {
          currentStreak = 0
          storedConfig.streak = 0
          localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(storedConfig))
        }
        // If diffDays <= 1: do NOT reset to 0! Streak remains pending today's completion.
      }
    }

    setStreak(currentStreak)
    setBestStreak(currentBest)

    // Pick Word of the Day (deterministic based on today's day of year)
    if (totalWordCount > 0) {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 0)
      const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const picked = await db.words.offset(dayOfYear % totalWordCount).first()
      if (picked) {
        setDailyWord(picked)
        const isAdded = reviewWordIds.has(picked.id)
        setIsDailyWordAdded(isAdded)
      }
    }
    
    setLoading(false)
  }

  const handleSetDailyTarget = (newTarget: number) => {
    setDailyTarget(newTarget)
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY)
      const conf = saved ? JSON.parse(saved) : {}
      conf.targetNewWords = newTarget
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(conf))
      setStreakToast(`Đã đổi mục tiêu thành ${newTarget} từ/ngày`)
      setTimeout(() => setStreakToast(null), 2500)
    } catch (e) {
      console.error(e)
    }
    loadData()
  }

  const handleQuickAdd10Dashboard = async () => {
    try {
      const allReviews = await reviewRepository.getAll()
      const reviewWordIds = new Set(allReviews.map(r => r.wordId))
      
      const toAddIds: string[] = []
      await db.words.each(w => {
        if (toAddIds.length < 10 && !reviewWordIds.has(w.id)) {
          toAddIds.push(w.id)
        }
      })

      if (toAddIds.length === 0) {
        setStreakToast("Tất cả từ trong từ điển đã có trong danh sách học! Mục tiêu từ mới tự động hoàn thành ✓")
        setTimeout(() => setStreakToast(null), 3500)
        await loadData()
        return
      }

      let addedCount = 0
      try {
        for (const id of toAddIds) {
          await reviewRepository.add(id)
          addedCount++
        }
        setStreakToast(`Đã thêm ${addedCount} từ mới vào lộ trình hôm nay! ✓`)
      } catch {
        if (addedCount > 0) {
          setStreakToast(`Đã thêm ${addedCount} từ (Chạm giới hạn 500 từ gói Miễn phí)`)
        }
      }

      setTimeout(() => setStreakToast(null), 3000)
      await loadData()
    } catch (e) {
      console.error("Error adding words:", e)
    }
  }

  const handleAddDailyWord = async () => {
    if (!dailyWord) return
    try {
      await reviewRepository.add(dailyWord.id)
      setIsDailyWordAdded(true)
      await loadData()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
    
    // Set time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
    
    // Set Chinese date
    const d = new Date()
    const cnNums = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
    const toCnNum = (num: number) => {
      if (num <= 10) return cnNums[num]
      if (num < 20) return "十" + (num % 10 === 0 ? "" : cnNums[num % 10])
      return cnNums[Math.floor(num / 10)] + "十" + (num % 10 === 0 ? "" : cnNums[num % 10])
    }
    const year = d.getFullYear().toString().split('').map(n => cnNums[parseInt(n)]).join('')
    const month = toCnNum(d.getMonth() + 1)
    const date = toCnNum(d.getDate())
    setChineseDate(`${year}年${month}月${date}日`)
    
    // Set random proverb
    setProverb(PROVERBS[Math.floor(Math.random() * PROVERBS.length)])
  }, [])

  useEffect(() => {
    const handleAutoSeeded = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && customEvent.detail.message) {
        setStreakToast(customEvent.detail.message)
        setTimeout(() => setStreakToast(null), 4000)
      }
      loadData()
    }

    const handleWordsUpdated = () => {
      loadData()
    }

    window.addEventListener("hsk-auto-seeded", handleAutoSeeded)
    window.addEventListener("hsk-words-updated", handleWordsUpdated)

    return () => {
      window.removeEventListener("hsk-auto-seeded", handleAutoSeeded)
      window.removeEventListener("hsk-words-updated", handleWordsUpdated)
    }
  }, [user?.id])

  const learning = reviews.filter(r => r.status === "learning").length
  const review = reviews.filter(r => r.status === "review").length
  const mastered = reviews.filter(r => r.status === "mastered").length
  const newWords = reviews.filter(r => r.status === "new").length

  const correct = reviews.reduce((sum, r) => sum + r.correctCount, 0)
  const wrong = reviews.reduce((sum, r) => sum + r.wrongCount, 0)
  const attempts = correct + wrong
  const accuracy = attempts ? Math.round(correct / attempts * 100) : 0
  const progress = wordCount ? Math.round(mastered / wordCount * 100) : 0
  
  // Calculate estimated study time (assume 1 min per attempt)
  const studyTimeHours = Math.floor(attempts / 60)
  const studyTimeMins = attempts % 60

  const statusData = [
    { name: "Learning", value: learning },
    { name: "Review", value: review },
    { name: "Mastered", value: mastered },
    { name: "New", value: newWords }
  ].filter(x => x.value > 0)

  // Calculate 7-day activity based on updatedAt
  const heatmapData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    const nextD = new Date(d)
    nextD.setDate(d.getDate() + 1)
    
    const count = reviews.filter(r => r.updatedAt >= d.getTime() && r.updatedAt < nextD.getTime()).length
    
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return {
      day: dayNames[d.getDay()],
      activity: count
    }
  })

  // Milestones
  const achievements = [
    { id: 'first_step', name: 'Khởi đầu', desc: 'Bắt đầu học từ', icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" />, unlocked: reviews.length > 0 },
    { id: 'getting_started', name: 'Nhập môn', desc: '10+ từ đang học', icon: <Play className="w-4 h-4 sm:w-5 sm:h-5" />, unlocked: learning >= 10 },
    { id: 'scholar', name: 'Học giả', desc: '50+ từ đang học', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />, unlocked: learning >= 50 },
    { id: 'master', name: 'Bậc thầy', desc: 'Thuần thục 1 từ', icon: <Medal className="w-4 h-4 sm:w-5 sm:h-5" />, unlocked: mastered > 0 },
    { id: 'persistent', name: 'Kiên trì', desc: '100+ lần ôn tập', icon: <Flame className="w-4 h-4 sm:w-5 sm:h-5" />, unlocked: attempts >= 100 },
    { id: 'accuracy_king', name: 'Chính xác', desc: 'Độ chuẩn ≥80%', icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />, unlocked: attempts > 10 && accuracy >= 80 },
  ]

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <ChibiLoading
          variant="loading"
          size="md"
          title="Tiểu Lu đang mở sách..."
          description="Đang chuẩn bị từ vựng và tiến độ ôn tập cho bạn nhé!"
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-transparent p-3 sm:p-6 md:p-8 text-china-ink space-y-6 sm:space-y-8">
      
      {/* 1. Dynamic Greeting with Chibi Mascot */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-border/50">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none drop-shadow-xs p-1 bg-card rounded-2xl border border-border/80 shadow-2xs flex items-center justify-center">
            <Image
              src={isDailyGoalAchieved ? "/chibi-cheer.svg" : "/chibi-loading.svg"}
              alt="Tiểu Lu"
              width={60}
              height={60}
              priority
              className="object-contain hover:scale-105 transition-transform"
            />
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-china-red tracking-wide">
                {greeting}
              </h1>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs sm:text-sm font-bold shadow-2xs transition-all ${
                streak > 0 
                  ? (isDailyGoalAchieved 
                      ? "bg-china-gold/15 text-china-gold border-china-gold/40" 
                      : "bg-amber-500/10 text-amber-600 border-amber-500/30")
                  : "bg-muted/10 text-muted border-border"
              }`}>
                <Flame className={`w-3.5 h-3.5 ${streak > 0 ? "fill-current" : ""}`} />
                <span>{streak} Ngày {isDailyGoalAchieved ? "🔥" : "(Chờ đạt)"}</span>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <p className="text-base sm:text-xl font-chinese font-bold text-china-ink" lang="zh">{proverb.cn}</p>
              <p className="text-xs sm:text-sm text-muted font-medium">{proverb.pinyin} • {proverb.en}</p>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
          <p className="font-chinese text-base sm:text-xl text-china-jade font-semibold" lang="zh">{chineseDate}</p>
          <button
            onClick={getData}
            className="mt-1 text-xs sm:text-sm text-muted hover:text-china-red transition-colors flex items-center gap-1 font-semibold cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            Đồng bộ dữ liệu
          </button>
        </div>
      </header>

      {/* 1.2. Roadmap & "Cần gì để đạt mục tiêu" Section */}
      <section>
        <RoadmapCard onOpenWizard={() => setIsRoadmapWizardOpen(true)} />
      </section>

      {/* 1.5. Daily Goal & Streak Requirement Bar */}
      <section className={`relative rounded-2xl p-4 sm:p-5 border transition-all ${
        isDailyGoalAchieved 
          ? "bg-card border-emerald-600/30 dark:border-emerald-500/35 shadow-xs" 
          : "bg-card border-border/80 shadow-xs"
      }`}>
        {/* Tiểu Lu Lấp Ló bên Thang Trạng Thái */}
        <div className="absolute -top-7 sm:-top-9 right-6 sm:right-12 w-16 sm:w-20 h-10 sm:h-12 z-10 pointer-events-none select-none transition-transform hover:scale-110">
          <Image
            src="/chibi-peek.svg"
            alt="Tiểu Lu lấp ló"
            width={80}
            height={52}
            priority
            className="object-contain drop-shadow-xs"
          />
        </div>

        {/* Header of Streak Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
              isDailyGoalAchieved 
                ? "bg-china-gold text-white shadow-xs shadow-china-gold/30" 
                : "bg-china-gold/10 text-china-gold border border-china-gold/30"
            }`}>
              <Flame className={`w-5 h-5 ${streak > 0 ? "fill-current" : ""}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-serif font-bold text-china-ink">
                  Mục tiêu chuỗi ngày (Streak)
                </h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isDailyGoalAchieved
                    ? "bg-china-jade/15 text-china-jade border-china-jade/30"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                }`}>
                  {isDailyGoalAchieved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã duy trì chuỗi hôm nay!
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      Chưa hoàn thành hôm nay
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {isDailyGoalAchieved 
                  ? `Xuất sắc! Bạn đã duy trì chuỗi ${streak} ngày liên tiếp.` 
                  : remainingWordsInDict === 0
                  ? `Kho từ đã học hết! Chỉ cần ôn sạch ${dueCount > 0 ? dueCount : ""} từ tới hạn để duy trì chuỗi.`
                  : `Học tối thiểu ${effectiveTarget} từ mới (hoặc ôn ${dailyTarget} từ) và ôn sạch từ tới hạn để được set chuỗi hôm nay.`}
              </p>
            </div>
          </div>

          {/* Right controls: target selector & streak count */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {/* Quick target selector dropdown */}
            <div className="flex items-center gap-1.5 bg-china-paper border border-border rounded-lg px-2.5 py-1 text-xs text-muted shadow-2xs">
              <Settings2 className="w-3.5 h-3.5 text-china-gold" />
              <span>Mục tiêu:</span>
              <select 
                value={dailyTarget} 
                onChange={(e) => handleSetDailyTarget(Number(e.target.value))}
                className="bg-transparent font-semibold text-china-ink focus:outline-hidden cursor-pointer"
              >
                <option value={5}>5 từ</option>
                <option value={10}>10 từ (Chuẩn)</option>
                <option value={15}>15 từ</option>
                <option value={20}>20 từ</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-china-gold/10 text-china-gold border border-china-gold/30 font-bold text-xs sm:text-sm shadow-2xs">
              <Zap className="w-4 h-4 fill-china-gold" />
              <span>{streak} Ngày</span>
            </div>
          </div>
        </div>

        {/* 2 Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pt-3.5">
          {/* Requirement 1: New words or active study today */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            isCondition1Met 
              ? "bg-china-jade/5 border-china-jade/30" 
              : "bg-china-paper/60 border-border"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className={`w-4 h-4 ${isCondition1Met ? "text-china-jade" : "text-china-gold"}`} />
                <span className="text-xs sm:text-sm font-semibold text-china-ink">
                  1. Từ mới / Học tập hôm nay
                </span>
              </div>
              <span className={`text-xs font-bold ${isCondition1Met ? "text-china-jade" : "text-china-ink"}`}>
                {remainingWordsInDict === 0 
                  ? "Đã học hết kho từ ✓"
                  : newWordsToday >= effectiveTarget
                  ? `${newWordsToday}/${effectiveTarget} từ mới`
                  : wordsStudiedToday >= dailyTarget
                  ? `${wordsStudiedToday}/${dailyTarget} từ đã ôn`
                  : `${newWordsToday}/${effectiveTarget} từ mới (${wordsStudiedToday}/${dailyTarget} đã ôn)`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full bg-border/60 rounded-full overflow-hidden mb-2.5">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isCondition1Met ? "bg-china-jade" : "bg-china-gold"
                }`}
                style={{ 
                  width: `${isCondition1Met 
                    ? 100 
                    : Math.min(100, Math.max(
                        effectiveTarget > 0 ? Math.round((newWordsToday / effectiveTarget) * 100) : 0,
                        Math.round((wordsStudiedToday / dailyTarget) * 100)
                      ))}%` 
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-muted">
                {remainingWordsInDict === 0
                  ? "✓ Kho từ vựng đã thêm hết, điều kiện tự động hoàn thành!"
                  : isCondition1Met
                  ? (newWordsToday >= effectiveTarget 
                      ? "✓ Đã học đủ số từ mới hôm nay" 
                      : `✓ Đã ôn tập ${wordsStudiedToday} từ hôm nay`)
                  : `Cần thêm ${Math.max(0, effectiveTarget - newWordsToday)} từ mới HOẶC ôn ${Math.max(0, dailyTarget - wordsStudiedToday)} từ`}
              </span>
              {!isCondition1Met && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {remainingWordsInDict > 0 && (
                    <button
                      onClick={handleQuickAdd10Dashboard}
                      className="text-[11px] font-semibold text-china-red hover:text-white bg-china-red/10 hover:bg-china-red px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3 h-3" /> +{Math.min(10, remainingWordsInDict)} từ nhanh
                    </button>
                  )}
                  <Link
                    href="/vocabulary"
                    className="text-[11px] text-muted hover:text-china-ink underline transition-colors"
                  >
                    Kho từ
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Requirement 2: Due reviews */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            dueCount === 0 && reviews.length > 0
              ? "bg-china-jade/5 border-china-jade/30" 
              : dueCount > 0 
              ? "bg-china-red/5 border-china-red/30"
              : "bg-china-paper/60 border-border"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className={`w-4 h-4 ${dueCount === 0 ? "text-china-jade" : "text-china-red"}`} />
                <span className="text-xs sm:text-sm font-semibold text-china-ink">
                  2. Ôn tập từ tới hạn
                </span>
              </div>
              <span className={`text-xs font-bold ${dueCount === 0 ? "text-china-jade" : "text-china-red"}`}>
                {dueCount === 0 ? "Đã hoàn thành" : `Còn ${dueCount} từ cần ôn`}
              </span>
            </div>

            {/* Progress / Status display */}
            <div className="h-2 w-full bg-border/60 rounded-full overflow-hidden mb-2.5">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  dueCount === 0 ? "bg-china-jade w-full" : "bg-china-red w-1/3 animate-pulse"
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">
                {dueCount === 0 
                  ? "✓ Không còn từ nào bị trễ hạn" 
                  : "Cần ôn tập hết từ tới hạn để duy trì chuỗi"}
              </span>
              {dueCount > 0 && (
                <Link
                  href="/review"
                  className="text-[11px] font-semibold text-white bg-china-red hover:bg-china-red-hover px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0 shadow-xs active:scale-95"
                >
                  Ôn ngay ({dueCount}) <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bàn Học Tiểu Lu - 4 Không Gian Luyện Tập (Tứ Bảo Thư Phòng) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-china-red" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-china-ink">
              Không Gian Luyện Tập Của Tiểu Lu
            </h2>
          </div>
          <span className="text-[11px] text-muted font-medium">Bấm vào để bắt đầu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Ôn tập SRS (Phục Tập - 溫故知新) */}
          <Link 
            href="/review" 
            className="group relative overflow-hidden rounded-3xl bg-card dark:bg-[#1a1624] border border-border/80 dark:border-[#382c47] hover:border-china-red/50 hover:shadow-lg p-5 text-china-ink transition-all duration-300 flex flex-col justify-between min-h-[195px]"
          >
            {/* Calligraphy Watermark chìm nghệ thuật */}
            <div className="absolute right-2 -bottom-4 text-stone-200/50 dark:text-stone-700/25 font-chinese text-8xl font-black select-none pointer-events-none group-hover:text-china-red/5 transition-colors" lang="zh">
              省
            </div>

            {/* Top row: Dấu triện Hán cổ & Huy hiệu số lượng */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="font-chinese text-xs font-bold px-2 py-0.5 rounded-md bg-china-red/10 text-china-red border border-china-red/20 shadow-2xs tracking-widest" lang="zh">
                印 • 復習
              </span>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800/90 border border-border dark:border-stone-700 text-china-ink inline-flex items-center gap-1.5">
                {wordReview > 0 ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-china-red animate-pulse" />
                    <span className="text-china-red font-bold">{wordReview} từ cần ôn</span>
                  </>
                ) : (
                  <span>Đã ôn sạch ✓</span>
                )}
              </span>
            </div>

            {/* Middle: Tiêu đề & Tiểu Lu Mascot */}
            <div className="relative z-10 my-3 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h3 className="text-lg font-bold text-china-ink group-hover:text-china-red transition-colors">
                  Ôn tập SRS
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-300 leading-relaxed line-clamp-2">
                  Lặp lại ngắt quãng theo đường cong trí nhớ
                </p>
              </div>

              {/* Mascot Art Frame */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-2xl bg-stone-100 dark:bg-[#120f1a] border border-border/60 dark:border-[#382c47] p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2 shadow-2xs">
                <Image
                  src="/chibi-loading.svg"
                  alt="Tiểu Lu Ôn Tập"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom: Action Link */}
            <div className="relative z-10 pt-2 border-t border-border/50 dark:border-[#382c47] flex items-center justify-between text-xs font-semibold text-china-ink group-hover:text-china-red transition-colors">
              <span>Vào thư phòng ôn tập</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Kho Từ Vựng HSK (Tự Hải - 字海尋珠) */}
          <Link 
            href="/vocabulary" 
            className="group relative overflow-hidden rounded-3xl bg-card dark:bg-[#1a1624] border border-border/80 dark:border-[#382c47] hover:border-china-red/50 hover:shadow-lg p-5 text-china-ink transition-all duration-300 flex flex-col justify-between min-h-[195px]"
          >
            {/* Calligraphy Watermark chìm */}
            <div className="absolute right-2 -bottom-4 text-stone-200/50 dark:text-stone-700/25 font-chinese text-8xl font-black select-none pointer-events-none group-hover:text-china-red/5 transition-colors" lang="zh">
              詞
            </div>

            {/* Top row */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="font-chinese text-xs font-bold px-2 py-0.5 rounded-md bg-china-red/10 text-china-red border border-china-red/20 shadow-2xs tracking-widest" lang="zh">
                印 • 詞海
              </span>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800/90 border border-border dark:border-stone-700 text-china-ink">
                {wordCount} từ HSK
              </span>
            </div>

            {/* Middle */}
            <div className="relative z-10 my-3 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h3 className="text-lg font-bold text-china-ink group-hover:text-china-red transition-colors">
                  Từ vựng HSK
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-300 leading-relaxed line-clamp-2">
                  Tra cứu và học từ vựng toàn bộ cấp độ HSK 1–6
                </p>
              </div>

              {/* Mascot Art Frame */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-2xl bg-stone-100 dark:bg-[#120f1a] border border-border/60 dark:border-[#382c47] p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2 shadow-2xs">
                <Image
                  src="/chibi-peek.svg"
                  alt="Tiểu Lu Kho Từ"
                  width={60}
                  height={44}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom */}
            <div className="relative z-10 pt-2 border-t border-border/50 dark:border-[#382c47] flex items-center justify-between text-xs font-semibold text-china-ink group-hover:text-china-red transition-colors">
              <span>Mở kho từ vựng</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Giáo Trình Chuẩn HSK (Kinh Thư - 經書正課) */}
          <Link 
            href="/books" 
            className="group relative overflow-hidden rounded-3xl bg-card dark:bg-[#1a1624] border border-border/80 dark:border-[#382c47] hover:border-china-red/50 hover:shadow-lg p-5 text-china-ink transition-all duration-300 flex flex-col justify-between min-h-[195px]"
          >
            {/* Calligraphy Watermark chìm */}
            <div className="absolute right-2 -bottom-4 text-stone-200/50 dark:text-stone-700/25 font-chinese text-8xl font-black select-none pointer-events-none group-hover:text-china-red/5 transition-colors" lang="zh">
              書
            </div>

            {/* Top row */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="font-chinese text-xs font-bold px-2 py-0.5 rounded-md bg-china-red/10 text-china-red border border-china-red/20 shadow-2xs tracking-widest" lang="zh">
                印 • 教程
              </span>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800/90 border border-border dark:border-stone-700 text-china-ink">
                Chuẩn HSK 3.0
              </span>
            </div>

            {/* Middle */}
            <div className="relative z-10 my-3 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h3 className="text-lg font-bold text-china-ink group-hover:text-china-red transition-colors">
                  Giáo trình HSK 3.0
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-300 leading-relaxed line-clamp-2">
                  Đoạn văn đọc hiểu, bài khóa tương tác &amp; bài tập luyện nghe
                </p>
              </div>

              {/* Mascot Art Frame */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-2xl bg-stone-100 dark:bg-[#120f1a] border border-border/60 dark:border-[#382c47] p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2 shadow-2xs">
                <Image
                  src="/chibi-brush.svg"
                  alt="Tiểu Lu Thư Sinh"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom */}
            <div className="relative z-10 pt-2 border-t border-border/50 dark:border-[#382c47] flex items-center justify-between text-xs font-semibold text-china-ink group-hover:text-china-red transition-colors">
              <span>Vào kệ sách chính khóa</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Từ Mở Rộng & Bổ Trợ (Thác Triển - 博採眾長) */}
          <Link 
            href="/bonus" 
            className="group relative overflow-hidden rounded-3xl bg-card dark:bg-[#1a1624] border border-border/80 dark:border-[#382c47] hover:border-china-red/50 hover:shadow-lg p-5 text-china-ink transition-all duration-300 flex flex-col justify-between min-h-[195px]"
          >
            {/* Calligraphy Watermark chìm */}
            <div className="absolute right-2 -bottom-4 text-stone-200/50 dark:text-stone-700/25 font-chinese text-8xl font-black select-none pointer-events-none group-hover:text-china-red/5 transition-colors" lang="zh">
              博
            </div>

            {/* Top row */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="font-chinese text-xs font-bold px-2 py-0.5 rounded-md bg-china-red/10 text-china-red border border-china-red/20 shadow-2xs tracking-widest" lang="zh">
                印 • 拓展
              </span>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800/90 border border-border dark:border-stone-700 text-china-ink">
                2,056 từ bổ trợ
              </span>
            </div>

            {/* Middle */}
            <div className="relative z-10 my-3 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h3 className="text-lg font-bold text-china-ink group-hover:text-china-red transition-colors">
                  Từ mở rộng
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-300 leading-relaxed line-clamp-2">
                  Bộ từ nâng cao HSK 5+ và chuyên đề giao tiếp đời sống
                </p>
              </div>

              {/* Mascot Art Frame */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-2xl bg-stone-100 dark:bg-[#120f1a] border border-border/60 dark:border-[#382c47] p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2 shadow-2xs">
                <Image
                  src="/chibi-cheer.svg"
                  alt="Tiểu Lu Cổ Vũ"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom */}
            <div className="relative z-10 pt-2 border-t border-border/50 dark:border-[#382c47] flex items-center justify-between text-xs font-semibold text-china-ink group-hover:text-china-red transition-colors">
              <span>Khám phá kho tàng thư</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 2.5 Word of the Day Section */}
      {dailyWord && (
        <section className="bg-card rounded-2xl p-4 sm:p-6 border border-border/80 shadow-xs relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full md:w-auto">
              {/* Hanzi Box */}
              <div className="relative shrink-0">
                <div className={`rounded-xl sm:rounded-2xl bg-card border border-border shadow-xs flex items-center justify-center font-serif font-bold text-china-ink group-hover:text-china-red transition-colors whitespace-nowrap px-3 sm:px-4 py-2 h-16 sm:h-20 md:h-24 ${
                  dailyWord.hanzi.length <= 1 
                    ? "w-16 sm:w-20 md:w-24 text-3xl sm:text-4xl md:text-5xl" 
                    : dailyWord.hanzi.length === 2
                    ? "min-w-[4.5rem] sm:min-w-[6rem] text-2xl sm:text-3xl md:text-4xl"
                    : dailyWord.hanzi.length === 3
                    ? "min-w-[6rem] sm:min-w-[7.5rem] text-xl sm:text-2xl md:text-3xl"
                    : "min-w-[7.5rem] sm:min-w-[9rem] text-lg sm:text-xl md:text-2xl"
                }`}>
                  {dailyWord.hanzi}
                </div>
                {dailyWord.hskLevel && dailyWord.hskLevel.length > 0 && (
                  <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.2 bg-china-red text-white text-[9px] sm:text-[10px] font-bold rounded-md shadow-xs">
                    HSK {dailyWord.hskLevel[0]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-china-gold">
                    Từ vựng hôm nay
                  </span>
                  {dailyWord.radical && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-china-paper border border-border text-muted">
                      Bộ: {dailyWord.radical}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-china-red">
                    {dailyWord.pinyin}
                  </h3>
                  <button
                    type="button"
                    title="Nghe phát âm"
                    onClick={(e) => playAudio(dailyWord.hanzi, e)}
                    className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-china-red hover:bg-china-red/10 active:bg-china-red/20 rounded-full transition-colors active:scale-95 touch-manipulation cursor-pointer"
                    aria-label="Phát âm từ vựng hôm nay"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {getHanViet(dailyWord.hanzi, dailyWord.traditional, dailyWord.pinyinNumeric) && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 rounded-md text-[11px] sm:text-xs font-semibold">
                      Hán-Việt: {getHanViet(dailyWord.hanzi, dailyWord.traditional, dailyWord.pinyinNumeric)}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-china-ink font-medium max-w-lg line-clamp-2">
                  {dailyWord.meanings_vi ? dailyWord.meanings_vi.join(", ") : dailyWord.meanings?.join(", ")}
                </p>
              </div>
            </div>

            {/* Quick Actions for Word */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Link
                href={`/vocabulary/${dailyWord.id}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-border bg-card text-china-ink hover:text-china-red hover:border-china-red/30 text-xs sm:text-sm font-medium transition-all shadow-xs"
              >
                <PenTool className="w-3.5 h-3.5" /> Luyện viết chữ
              </Link>
              <button
                onClick={handleAddDailyWord}
                disabled={isDailyWordAdded}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                  isDailyWordAdded
                    ? "bg-china-jade/10 text-china-jade border border-china-jade/30 cursor-not-allowed"
                    : "bg-china-red text-white hover:bg-china-red-hover active:scale-95"
                }`}
              >
                {isDailyWordAdded ? "✓ Đang học" : "+ Thêm vào ôn tập"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. Today's Stats Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-border/80 shadow-xs">
          <StatBar title="Đang học" value={learning} icon={<Brain className="text-china-jade w-4 h-4" />} color="bg-china-jade" delay="0ms" />
        </div>
        <div className="bg-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-border/80 shadow-xs">
          <StatBar title="Cần ôn" value={review} icon={<Target className="text-china-gold w-4 h-4" />} color="bg-china-gold" delay="100ms" />
        </div>
        <div className="bg-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-border/80 shadow-xs">
          <StatBar title="Thuần thục" value={mastered} icon={<Trophy className="text-china-red w-4 h-4" />} color="bg-china-red" delay="200ms" />
        </div>
        <div className="bg-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-border/80 shadow-xs">
          <StatBar title="Tổng từ biết" value={learning + mastered} icon={<BookOpen className="text-china-ink w-4 h-4" />} color="bg-china-ink" delay="300ms" />
        </div>
      </section>

      {/* 4. Learning Progress & 5. Heatmap Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* HSK Progress Chart */}
        <div className="lg:col-span-2 rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-xs border border-border flex flex-col">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-xl font-semibold font-serif flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-china-jade" />
                Tiến độ cấp độ HSK
              </h2>
              <p className="text-xs sm:text-sm text-muted">Số lượng từ vựng bạn đã mở khóa theo từng cấp</p>
            </div>
            
            {/* Legend HSK Pills */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-border/80">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-purple-500" />
                Tổng từ HSK 1–6
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đang học
              </span>
            </div>
          </div>

          <div className="flex-grow h-56 sm:h-68 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hskData} margin={{ top: 15, right: 10, left: -22, bottom: 5 }}>
                <defs>
                  {HSK_LEVEL_CONFIG.map((cfg) => (
                    <linearGradient key={`hsk-grad-total-${cfg.level}`} id={`hsk-grad-total-${cfg.level}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDarkMode ? cfg.darkColor : cfg.gradFrom} stopOpacity={isDarkMode ? 0.95 : 0.9} />
                      <stop offset="100%" stopColor={isDarkMode ? cfg.gradFrom : cfg.lightColor} stopOpacity={isDarkMode ? 0.75 : 0.8} />
                    </linearGradient>
                  ))}
                  <linearGradient id="hsk-grad-learning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <XAxis 
                  dataKey="name" 
                  stroke={isDarkMode ? "#a39e93" : "#8c857d"} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: isDarkMode ? "#e2ddf0" : "#475569" }} 
                  tickLine={false} 
                  axisLine={{ stroke: isDarkMode ? "#2d2d3a" : "#e2e8f0" }} 
                />
                <YAxis 
                  stroke={isDarkMode ? "#a39e93" : "#8c857d"} 
                  tick={{ fontSize: 10, fill: isDarkMode ? "#a39e93" : "#8c857d" }} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' }} 
                  content={<CustomHskBarTooltip />}
                />
                <Bar dataKey="total" name="Tổng từ" radius={[6, 6, 0, 0]}>
                  {hskData.map((_, index) => (
                    <Cell key={`cell-total-${index}`} fill={`url(#hsk-grad-total-${index + 1})`} />
                  ))}
                </Bar>
                <Bar dataKey="learning" name="Đang học" fill="url(#hsk-grad-learning)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vocabulary Status & Heatmap */}
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-xs border border-border">
            <h2 className="text-base sm:text-xl font-semibold font-serif mb-3 text-center">Trạng thái từ vựng</h2>
            <div className="h-40 sm:h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {statusData.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={
                          isDarkMode 
                            ? ["#10b981", "#f59e0b", "#ff4d5e", "#64748b"][i] 
                            : ["#2d6a4f", "#d97706", "#c8102e", "#94a3b8"][i]
                        } 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-china-ink">{learning + review + mastered}</span>
                <span className="text-[11px] text-muted">Tổng cộng</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-5 shadow-xs border border-border">
            <h2 className="text-xs sm:text-sm font-semibold font-serif mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-china-gold" />
              Hoạt động 7 ngày qua
            </h2>
            <div className="h-20 sm:h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData}>
                  <defs>
                    <linearGradient id="heatmap-bar-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDarkMode ? "#fbbf24" : "#f59e0b"} stopOpacity={1} />
                      <stop offset="100%" stopColor={isDarkMode ? "#d97706" : "#b45309"} stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    cursor={{fill: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}}
                    content={<CustomHeatmapTooltip />} 
                  />
                  <XAxis 
                    dataKey="day" 
                    stroke={isDarkMode ? "#a39e93" : "#8c857d"} 
                    tick={{fontSize: 10, fill: isDarkMode ? "#a39e93" : "#8c857d"}} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Bar dataKey="activity" fill="url(#heatmap-bar-grad)" radius={[3, 3, 3, 3]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Difficult Words & 7. Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Difficult Words */}
        <div className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-xs border border-border">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-xl font-semibold font-serif flex items-center gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-china-red" />
                Từ hay sai
              </h2>
              <p className="text-xs sm:text-sm text-muted">Những từ bạn cần tập trung ôn luyện thêm</p>
            </div>
            {difficultWords.length > 0 && (
              <Link href="/review" className="text-xs sm:text-sm font-medium text-china-red hover:text-china-red-hover flex items-center gap-1 bg-china-red/10 px-2.5 py-1 rounded-full transition-colors">
                Luyện ngay
              </Link>
            )}
          </div>

          {difficultWords.length > 0 ? (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 snap-x scrollbar-hide">
              {difficultWords.map(({ word, review }) => (
                <div 
                  key={review.id} 
                  className="w-48 sm:w-56 max-w-[230px] shrink-0 snap-start bg-china-paper border border-border rounded-xl p-3.5 sm:p-4 hover:border-china-red/30 hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-center gap-1.5 mb-1 w-full">
                      <span className="text-3xl sm:text-4xl font-serif text-china-ink text-center select-all">{word?.hanzi}</span>
                      <button 
                        onClick={(e) => playAudio(word?.hanzi || "", e)}
                        className="text-muted hover:text-china-red p-1 rounded-full transition-colors shrink-0"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-center text-xs sm:text-sm mb-1.5 font-medium truncate w-full">
                      <span className="text-china-red">{word?.pinyin}</span>
                      {word && getHanViet(word.hanzi, word.traditional, word.pinyinNumeric) && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.2 rounded font-medium">
                          {getHanViet(word.hanzi, word.traditional, word.pinyinNumeric)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-center text-muted line-clamp-2 mb-3 h-8 w-full break-words px-1" title={word?.meanings_vi ? word.meanings_vi.join(', ') : word?.meanings?.join(', ')}>
                      {word?.meanings_vi ? word.meanings_vi.join(', ') : word?.meanings?.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-china-red/90 bg-china-red/5 py-1 px-2.5 rounded-full w-full shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{review.wrongCount} lần sai</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 sm:h-44 text-muted text-xs sm:text-sm">
              <CircleCheckBig className="w-10 h-10 text-china-jade mb-2 opacity-50" />
              <p>Chưa có từ nào bị sai nhiều!</p>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-xs border border-border">
          <h2 className="text-base sm:text-xl font-semibold font-serif mb-1 flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-china-gold" />
            Huy hiệu thành tích
          </h2>
          <p className="text-xs sm:text-sm text-muted mb-4 sm:mb-6">Mở khóa các cột mốc trong quá trình học</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {achievements.map(a => (
              <div key={a.id} className={`flex flex-col items-center p-3 rounded-xl border transition-all ${a.unlocked ? 'bg-china-gold/5 border-china-gold/30 text-china-ink shadow-2xs' : 'bg-transparent border-border/50 text-muted/50 grayscale'}`}>
                <div className={`p-2.5 rounded-full mb-2 ${a.unlocked ? 'bg-china-gold text-white shadow-xs shadow-china-gold/20' : 'bg-muted/20'}`}>
                  {a.icon}
                </div>
                <p className="font-semibold text-xs sm:text-sm text-center">{a.name}</p>
                <p className="text-[10px] text-center mt-0.5 opacity-70">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 8. Overall Progress Footer */}
      <section className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
        
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
          {/* CSS Circular Progress */}
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center rounded-full bg-china-paper"
            style={{
              background: `conic-gradient(#366c5d ${progress * 3.6}deg, rgba(0,0,0,0.08) 0deg)`
            }}
          >
            <div className="absolute w-14 h-14 sm:w-18 sm:h-18 bg-card rounded-full flex items-center justify-center shadow-xs">
              <span className="text-lg sm:text-2xl font-serif font-bold text-china-jade">{progress}%</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-china-ink mb-0.5">Tiến độ tổng thể</h2>
            <p className="text-muted text-xs sm:text-sm">{mastered} / {wordCount} từ đã thuần thục</p>
          </div>
        </div>

        <div className="flex justify-around w-full md:w-auto gap-4 sm:gap-10 text-center pt-3 md:pt-0 border-t md:border-t-0 border-border">
          <div>
            <p className="text-2xl sm:text-4xl font-serif font-bold text-china-gold mb-0.5">{accuracy}%</p>
            <p className="text-[11px] sm:text-xs text-muted uppercase tracking-wider font-semibold">Độ chính xác</p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-serif font-bold text-china-ink mb-0.5">
              {studyTimeHours}<span className="text-sm sm:text-lg">h</span> {studyTimeMins}<span className="text-sm sm:text-lg">m</span>
            </p>
            <p className="text-[11px] sm:text-xs text-muted uppercase tracking-wider font-semibold">Thời gian học</p>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {streakToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-china-ink text-china-paper px-4 py-2.5 rounded-xl shadow-xl border border-china-gold/40 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          {streakToast}
        </div>
      )}

      {/* Roadmap Setup Modal */}
      <RoadmapWizardModal
        isOpen={isRoadmapWizardOpen}
        onClose={() => setIsRoadmapWizardOpen(false)}
      />
    </main>
  )
}

function StatBar({ title, value, icon, color, delay }: { title: string, value: number, icon: React.ReactNode, color: string, delay: string }) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-1.5 text-muted">
        {icon}
        <span className="text-xs font-medium">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl sm:text-3xl font-serif font-bold text-china-ink">{value}</span>
      </div>
      <div className={`h-1 w-8 sm:w-10 rounded-full ${color}`}></div>
    </div>
  )
}

const HSK_LEVEL_CONFIG = [
  { level: 1, name: "HSK 1", label: "Căn bản", lightColor: "#d97706", darkColor: "#fbbf24", gradFrom: "#f59e0b", gradTo: "#fef08a" },
  { level: 2, name: "HSK 2", label: "Sơ cấp 1", lightColor: "#0d9488", darkColor: "#2dd4bf", gradFrom: "#14b8a6", gradTo: "#99f6e4" },
  { level: 3, name: "HSK 3", label: "Sơ cấp 2", lightColor: "#ea580c", darkColor: "#fb923c", gradFrom: "#f97316", gradTo: "#fed7aa" },
  { level: 4, name: "HSK 4", label: "Trung cấp 1", lightColor: "#e11d48", darkColor: "#fb7185", gradFrom: "#f43f5e", gradTo: "#fecdd3" },
  { level: 5, name: "HSK 5", label: "Trung cấp 2", lightColor: "#2563eb", darkColor: "#60a5fa", gradFrom: "#3b82f6", gradTo: "#bfdbfe" },
  { level: 6, name: "HSK 6", label: "Cao cấp", lightColor: "#7c3aed", darkColor: "#c084fc", gradFrom: "#a855f7", gradTo: "#e9d5ff" },
]

function CustomHskBarTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null
  const lvlNum = parseInt(label?.replace("HSK ", "") || "1", 10)
  const cfg = HSK_LEVEL_CONFIG[lvlNum - 1] || HSK_LEVEL_CONFIG[0]
  const total = payload.find((p: any) => p.dataKey === "total")?.value || 0
  const learning = payload.find((p: any) => p.dataKey === "learning")?.value || 0
  const percent = total > 0 ? Math.round((learning / total) * 100) : 0

  return (
    <div className="rounded-xl p-3 shadow-xl backdrop-blur-md border border-border/80 bg-white/95 dark:bg-[#1a1624]/95 dark:border-[#382c47] min-w-[170px] space-y-2 text-xs">
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/60 dark:border-stone-800">
        <span className="font-bold text-china-ink dark:text-stone-100 flex items-center gap-1.5">
          <span 
            className="w-2.5 h-2.5 rounded-full shrink-0" 
            style={{ backgroundColor: cfg.darkColor }}
          />
          {label}
        </span>
        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
          {cfg.label}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-muted text-[11px]">
          <span>Tổng số từ:</span>
          <span className="font-bold font-mono text-china-ink dark:text-stone-200">
            {total.toLocaleString()} từ
          </span>
        </div>
        <div className="flex items-center justify-between text-muted text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đã nạp / Đang học:
          </span>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {learning.toLocaleString()} từ
          </span>
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="pt-1">
        <div className="flex justify-between text-[10px] text-muted mb-1">
          <span>Tiến độ:</span>
          <span className="font-bold text-china-ink dark:text-stone-200">{percent}%</span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300" 
            style={{ 
              width: `${Math.min(100, Math.max(percent > 0 ? percent : 2, 0))}%`,
              backgroundColor: cfg.darkColor 
            }} 
          />
        </div>
      </div>
    </div>
  )
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0]
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl backdrop-blur-md border border-border/80 bg-white/95 dark:bg-[#1a1624]/95 dark:border-[#382c47] text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.payload.fill || data.color }} />
        <span className="text-muted">{data.name}:</span>
        <span className="font-bold font-mono text-china-ink dark:text-stone-100">{data.value} từ</span>
      </div>
    </div>
  )
}

function CustomHeatmapTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null
  const activity = payload[0]?.value || 0
  return (
    <div className="rounded-lg px-2.5 py-1.5 shadow-lg border border-border/80 bg-white/95 dark:bg-[#1a1624]/95 dark:border-[#382c47] text-[11px]">
      <span className="text-muted">{label}: </span>
      <span className="font-bold text-amber-500 font-mono">{activity} lượt học</span>
    </div>
  )
}