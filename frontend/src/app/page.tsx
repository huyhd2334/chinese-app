"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db, type ReviewItem, type Word } from "../../db/database"
import { importHsk, importListening, importReading } from "../../db/importContent"
import { reviewRepository } from "../../repositories/reviewRepository"
import { wordRepository } from "../../repositories/wordRepository"
import {
  BookOpen,
  Layers,
  Target,
  Flame,
  ArrowRight,
  RotateCw,
  Volume2,
  PenTool,
  CheckCircle2,
  ChevronRight,
  Plus,
  Library,
  ReceiptText,
  AlertCircle,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { getHanViet } from "@/utils/hanviet"
import { playChineseAudio } from "@/utils/audioTts"
import { getShortMeaningVi } from "@/utils/formatMeaning"
import { RoadmapCard } from "@/components/roadmap/RoadmapCard"
import { RoadmapWizardModal } from "@/components/roadmap/RoadmapWizardModal"
import { useAuth } from "@/contexts/AuthContext"
import { autoSeedWordsForUser } from "@/utils/autoSeedWords"
import { FREE_REVIEW_LIMIT } from "@/utils/subscription"

const PROVERBS = [
  { cn: "千里之行，始于足下", pinyin: "Qiān lǐ zhī xíng, shǐ yú zú xià", vi: "Hành trình vạn dặm bắt đầu từ một bước chân" },
  { cn: "温故而知新", pinyin: "Wēn gù ér zhī xīn", vi: "Ôn chuyện cũ để hiểu thêm điều mới" },
  { cn: "熟能生巧", pinyin: "Shú néng shēng qiǎo", vi: "Trăm hay không bằng tay quen" },
  { cn: "学无止境", pinyin: "Xué wú zhǐ jìng", vi: "Biển học mênh mông không có bến bờ" },
  { cn: "万事开头难", pinyin: "Wàn shì kāi tóu nán", vi: "Vạn sự khởi đầu nan" },
]

const LEGACY_STREAK_KEY = "chinese_app_streak_config"
const getStreakKey = (uid?: string) =>
  uid ? `chinese_app_streak_config_${uid}` : LEGACY_STREAK_KEY

const getLocalDateStr = (date: Date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function Dashboard() {
  const { user, isDarkMode } = useAuth()
  const [wordCount, setWordCount] = useState(0)
  const [wordReview, setWordReview] = useState(0)
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [hskData, setHskData] = useState<{ name: string; total: number; learning: number }[]>([])
  const [difficultWords, setDifficultWords] = useState<{ review: ReviewItem; word: Word }[]>([])
  const [proverb, setProverb] = useState(PROVERBS[0])
  const [greeting, setGreeting] = useState("Chào buổi sáng")
  const [chineseDate, setChineseDate] = useState("")
  const [streak, setStreak] = useState(0)
  const [newWordsToday, setNewWordsToday] = useState(0)
  const [wordsStudiedToday, setWordsStudiedToday] = useState(0)
  const [remainingWordsInDict, setRemainingWordsInDict] = useState(0)
  const [effectiveTarget, setEffectiveTarget] = useState(10)
  const [isCondition1Met, setIsCondition1Met] = useState(false)
  const [dueCount, setDueCount] = useState(0)
  const [dailyTarget, setDailyTarget] = useState(10)
  const [isDailyGoalAchieved, setIsDailyGoalAchieved] = useState(false)
  const [streakToast, setStreakToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [dailyWord, setDailyWord] = useState<Word | null>(null)
  const [isDailyWordAdded, setIsDailyWordAdded] = useState(false)
  const [isRoadmapWizardOpen, setIsRoadmapWizardOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

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

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hsk-request-sync"))
      }
    } catch (err) {
      console.error("Dashboard initial load error:", err)
    } finally {
      setLoading(false)
    }

    if (typeof window !== "undefined") {
      setTimeout(() => {
        importReading().catch(console.error)
        importListening().catch(console.error)
      }, 1200)
    }
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    try {
      window.dispatchEvent(new CustomEvent("hsk-request-sync"))
      await getData()
      setStreakToast("Đã đồng bộ dữ liệu mới nhất")
      setTimeout(() => setStreakToast(null), 2500)
    } finally {
      setTimeout(() => setIsSyncing(false), 500)
    }
  }

  const loadData = async () => {
    const totalWordCount = await db.words.count()
    let allReviews = await reviewRepository.getAll()

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

    const due = allReviews.filter((r) => r.dueAt <= Date.now())
    setWordReview(due.length)
    setDueCount(due.length)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayStartTs = todayStart.getTime()

    const wordsAddedToday = allReviews.filter((r) => r.createdAt >= todayStartTs).length
    setNewWordsToday(wordsAddedToday)

    const studiedToday = allReviews.filter(
      (r) => r.updatedAt >= todayStartTs && (r.updatedAt !== r.createdAt || r.repetitions > 0)
    ).length
    setWordsStudiedToday(studiedToday)

    const reviewWordIds = new Set(allReviews.map((r) => r.wordId))
    const unlearnedCount = Math.max(0, totalWordCount - reviewWordIds.size)
    setRemainingWordsInDict(unlearnedCount)

    const hskLevelData = await Promise.all(
      [1, 2, 3, 4, 5, 6].map(async (level) => {
        const ids = (await wordRepository.getIdsByHsk(level)) as string[]
        const idSet = new Set(ids)
        const learning = allReviews.filter((r) => idSet.has(r.wordId)).length
        return {
          name: `HSK ${level}`,
          total: ids.length,
          learning,
        }
      })
    )
    setHskData(hskLevelData)

    const topDifficult = allReviews
      .filter((r) => r.wrongCount > 0)
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 6)

    if (topDifficult.length > 0) {
      const wordsMap = new Map<string, Word>()
      const fetchedWords = await db.words.bulkGet(topDifficult.map((r) => r.wordId))
      fetchedWords.forEach((w) => {
        if (w) wordsMap.set(w.id, w)
      })
      const diffList = topDifficult
        .map((r) => ({ review: r, word: wordsMap.get(r.wordId)! }))
        .filter((x) => x.word)
      setDifficultWords(diffList)
    } else {
      setDifficultWords([])
    }

    const todayStr = getLocalDateStr()
    const streakStorageKey = getStreakKey(user?.id)

    let storedConfig = {
      streak: 0,
      bestStreak: 0,
      targetNewWords: 10,
      lastCompletedDate: "",
      completedDates: [] as string[],
    }

    try {
      const saved = localStorage.getItem(streakStorageKey)
      if (saved) {
        storedConfig = { ...storedConfig, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error("Error reading streak config", e)
    }

    const target = storedConfig.targetNewWords || 10
    setDailyTarget(target)

    const effTarget = unlearnedCount > 0 ? Math.min(target, unlearnedCount) : 0
    setEffectiveTarget(effTarget > 0 ? effTarget : target)

    const cond1Met =
      (effTarget > 0 && wordsAddedToday >= effTarget) ||
      unlearnedCount === 0 ||
      studiedToday >= target ||
      (unlearnedCount > 0 && wordsAddedToday >= unlearnedCount)
    setIsCondition1Met(cond1Met)

    const cond2Met = due.length === 0
    const isTodayMet = cond1Met && cond2Met && allReviews.length > 0
    setIsDailyGoalAchieved(isTodayMet)

    let currentStreak = storedConfig.streak
    let currentBest = storedConfig.bestStreak
    let lastCompleted = storedConfig.lastCompletedDate
    const completedDates = storedConfig.completedDates || []

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
          // already counted
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
          completedDates,
        }
        localStorage.setItem(streakStorageKey, JSON.stringify(storedConfig))
      }
    } else {
      if (completedDates.includes(todayStr)) {
        setIsDailyGoalAchieved(true)
      } else {
        let diffDays = 0
        if (lastCompleted) {
          const lastDate = new Date(lastCompleted + "T00:00:00")
          const nowDate = new Date(todayStr + "T00:00:00")
          diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        }

        if (diffDays > 1) {
          currentStreak = 0
          storedConfig.streak = 0
          localStorage.setItem(streakStorageKey, JSON.stringify(storedConfig))
        }
      }
    }

    setStreak(currentStreak)

    if (totalWordCount > 0) {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 0)
      const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const picked = await db.words.offset(dayOfYear % totalWordCount).first()
      if (picked) {
        setDailyWord(picked)
        setIsDailyWordAdded(reviewWordIds.has(picked.id))
      }
    }

    setLoading(false)
  }

  const handleSetDailyTarget = (newTarget: number) => {
    setDailyTarget(newTarget)
    try {
      const streakStorageKey = getStreakKey(user?.id)
      const saved = localStorage.getItem(streakStorageKey)
      const conf = saved ? JSON.parse(saved) : {}
      conf.targetNewWords = newTarget
      localStorage.setItem(streakStorageKey, JSON.stringify(conf))
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
      const reviewWordIds = new Set(allReviews.map((r) => r.wordId))

      const toAddIds: string[] = []
      await db.words.each((w) => {
        if (toAddIds.length < 10 && !reviewWordIds.has(w.id)) {
          toAddIds.push(w.id)
        }
      })

      if (toAddIds.length === 0) {
        setStreakToast("Tất cả từ trong từ điển đã có trong danh sách học!")
        setTimeout(() => setStreakToast(null), 3000)
        await loadData()
        return
      }

      let addedCount = 0
      try {
        for (const id of toAddIds) {
          await reviewRepository.add(id)
          addedCount++
        }
        setStreakToast(`Đã nạp thêm ${addedCount} từ mới vào lộ trình ôn tập`)
      } catch {
        if (addedCount > 0) {
          setStreakToast(`Đã thêm ${addedCount} từ (Chạm giới hạn ${FREE_REVIEW_LIMIT} từ gói Miễn phí)`)
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
    getData()

    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Chào buổi sáng")
    else if (hour < 18) setGreeting("Chào buổi chiều")
    else setGreeting("Chào buổi tối")

    const d = new Date()
    const cnNums = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
    const toCnNum = (num: number) => {
      if (num <= 10) return cnNums[num]
      if (num < 20) return "十" + (num % 10 === 0 ? "" : cnNums[num % 10])
      return cnNums[Math.floor(num / 10)] + "十" + (num % 10 === 0 ? "" : cnNums[num % 10])
    }
    const year = d
      .getFullYear()
      .toString()
      .split("")
      .map((n) => cnNums[parseInt(n, 10)])
      .join("")
    const month = toCnNum(d.getMonth() + 1)
    const date = toCnNum(d.getDate())
    setChineseDate(`${year}年${month}月${date}日`)

    setProverb(PROVERBS[Math.floor(Math.random() * PROVERBS.length)])
  }, [])

  useEffect(() => {
    const handleSyncComplete = () => {
      loadData()
    }

    const handleAutoSeeded = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && customEvent.detail.message) {
        setStreakToast(customEvent.detail.message)
        setTimeout(() => setStreakToast(null), 4000)
      }
      loadData()
    }

    const handleSyncStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ syncing?: boolean }>
      if (typeof customEvent.detail?.syncing === "boolean") {
        setIsSyncing(customEvent.detail.syncing)
      }
    }

    window.addEventListener("hsk-cloud-synced", handleSyncComplete)
    window.addEventListener("hsk-srs-synced", handleSyncComplete)
    window.addEventListener("hsk-auto-seeded", handleAutoSeeded)
    window.addEventListener("hsk-words-updated", handleSyncComplete)
    window.addEventListener("hsk-sync-status", handleSyncStatus)
    window.addEventListener("hsk-auth-changed", handleSyncComplete)

    return () => {
      window.removeEventListener("hsk-cloud-synced", handleSyncComplete)
      window.removeEventListener("hsk-srs-synced", handleSyncComplete)
      window.removeEventListener("hsk-auto-seeded", handleAutoSeeded)
      window.removeEventListener("hsk-words-updated", handleSyncComplete)
      window.removeEventListener("hsk-sync-status", handleSyncStatus)
      window.removeEventListener("hsk-auth-changed", handleSyncComplete)
    }
  }, [user?.id])

  const learning = reviews.filter((r) => r.status === "learning").length
  const review = reviews.filter((r) => r.status === "review").length
  const mastered = reviews.filter((r) => r.status === "mastered").length

  const correct = reviews.reduce((sum, r) => sum + r.correctCount, 0)
  const wrong = reviews.reduce((sum, r) => sum + r.wrongCount, 0)
  const attempts = correct + wrong
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 100

  const heatmapData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    const nextD = new Date(d)
    nextD.setDate(d.getDate() + 1)

    const count = reviews.filter(
      (r) => r.updatedAt >= d.getTime() && r.updatedAt < nextD.getTime()
    ).length

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    return {
      day: dayNames[d.getDay()],
      activity: count,
    }
  })

  const displayName = user?.email?.split("@")[0]

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="w-6 h-6 border-2 border-china-red border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-muted">Đang tải dữ liệu học tập...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-foreground">
      {/* 1. Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {greeting}{displayName ? `, ${displayName}` : ""}
          </h1>
          <p className="text-xs sm:text-sm text-muted flex items-center gap-2 flex-wrap">
            <span className="font-chinese font-semibold text-foreground" lang="zh">
              {proverb.cn}
            </span>
            <span>·</span>
            <span>{proverb.pinyin}</span>
            <span className="hidden md:inline">— {proverb.vi}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              streak > 0
                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
                : "bg-card text-muted border-border"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? "fill-amber-500 text-amber-500" : ""}`} />
            <span>{streak} ngày liên tiếp</span>
          </div>

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            title={`Ngày âm/chữ Hán: ${chineseDate} · Bấm để đồng bộ ngay`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-china-paper text-xs font-medium text-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-60"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-china-red" : ""}`} />
            <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ"}</span>
          </button>
        </div>
      </header>

      {/* 2. Personal Study Roadmap */}
      <section>
        <RoadmapCard onOpenWizard={() => setIsRoadmapWizardOpen(true)} />
      </section>

      {/* 3. Today's Study Checklist */}
      <section className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Mục tiêu hôm nay
            </h2>
            {isDailyGoalAchieved ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã hoàn thành
              </span>
            ) : (
              <span className="text-xs text-muted">
                Hoàn thành cả 2 mục bên dưới để duy trì chuỗi ngày học
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Định mức ngày:</span>
            <select
              value={dailyTarget}
              onChange={(e) => handleSetDailyTarget(Number(e.target.value))}
              className="bg-china-paper border border-border rounded-lg px-2.5 py-1 font-semibold text-foreground focus:outline-none focus:border-china-red cursor-pointer"
            >
              <option value={5}>5 từ / ngày</option>
              <option value={10}>10 từ / ngày</option>
              <option value={15}>15 từ / ngày</option>
              <option value={20}>20 từ / ngày</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Task 1: New words / Active study */}
          <div className="p-4 rounded-xl bg-china-paper/50 dark:bg-white/[0.02] border border-border flex flex-col justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-muted" />
                  1. Nạp từ mới hoặc ôn luyện
                </span>
                <span className={`font-semibold ${isCondition1Met ? "text-china-jade" : "text-muted"}`}>
                  {remainingWordsInDict === 0
                    ? "Đã nạp hết từ điển"
                    : newWordsToday >= effectiveTarget
                    ? `${newWordsToday}/${effectiveTarget} từ mới`
                    : `${ Math.max(newWordsToday, wordsStudiedToday) }/${dailyTarget} từ`}
                </span>
              </div>

              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCondition1Met ? "bg-china-jade" : "bg-foreground"
                  }`}
                  style={{
                    width: `${
                      isCondition1Met
                        ? 100
                        : Math.min(
                            100,
                            Math.max(
                              effectiveTarget > 0 ? Math.round((newWordsToday / effectiveTarget) * 100) : 0,
                              Math.round((wordsStudiedToday / dailyTarget) * 100)
                            )
                          )
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted">
                {isCondition1Met
                  ? "Đã đạt chỉ tiêu từ vựng hôm nay"
                  : `Cần thêm ${Math.max(0, effectiveTarget - newWordsToday)} từ mới hoặc ôn ${Math.max(0, dailyTarget - wordsStudiedToday)} từ`}
              </span>
              {!isCondition1Met && remainingWordsInDict > 0 && (
                <button
                  onClick={handleQuickAdd10Dashboard}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card border border-border hover:border-foreground text-foreground font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Nạp {Math.min(10, remainingWordsInDict)} từ</span>
                </button>
              )}
            </div>
          </div>

          {/* Task 2: Due SRS Reviews */}
          <div className="p-4 rounded-xl bg-china-paper/50 dark:bg-white/[0.02] border border-border flex flex-col justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-muted" />
                  2. Ôn tập thẻ tới hạn (SRS)
                </span>
                <span className={`font-semibold ${dueCount === 0 ? "text-china-jade" : "text-china-red"}`}>
                  {dueCount === 0 ? "0 thẻ tồn đọng" : `${dueCount} thẻ cần ôn`}
                </span>
              </div>

              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dueCount === 0 ? "bg-china-jade w-full" : "bg-china-red w-1/3"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted">
                {dueCount === 0
                  ? "Không còn thẻ nào quá hạn ôn tập"
                  : "Ôn lại các từ sắp quên theo lịch ngắt quãng"}
              </span>
              {dueCount > 0 && (
                <Link
                  href="/review"
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-china-red hover:bg-china-red-hover text-white font-semibold transition-colors"
                >
                  <span>Ôn ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Study Modules */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Link
          href="/review"
          className="group bg-card rounded-2xl border border-border hover:border-foreground/30 p-5 flex flex-col justify-between gap-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-china-red/10 text-china-red flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className={`text-xs font-semibold ${wordReview > 0 ? "text-china-red" : "text-muted"}`}>
              {wordReview > 0 ? `${wordReview} cần ôn` : "Đã xong"}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground group-hover:text-china-red transition-colors flex items-center justify-between">
              <span>Ôn tập SRS</span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-china-red group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Lật thẻ lặp lại ngắt quãng để ghi nhớ từ vựng dài hạn.
            </p>
          </div>
        </Link>

        <Link
          href="/books"
          className="group bg-card rounded-2xl border border-border hover:border-foreground/30 p-5 flex flex-col justify-between gap-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-china-paper text-foreground flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted">HSK 1–3</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground group-hover:text-china-red transition-colors flex items-center justify-between">
              <span>Giáo trình chuẩn</span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-china-red group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Hội thoại phân vai có âm thanh, từ vựng và bài tập theo bài.
            </p>
          </div>
        </Link>

        <Link
          href="/vocabulary"
          className="group bg-card rounded-2xl border border-border hover:border-foreground/30 p-5 flex flex-col justify-between gap-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-china-paper text-foreground flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted">
              {wordCount.toLocaleString("vi-VN")} từ
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground group-hover:text-china-red transition-colors flex items-center justify-between">
              <span>Từ điển HSK</span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-china-red group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Tra cứu Hán-Việt, thứ tự nét viết và ví dụ từ HSK 1 đến HSK 7.
            </p>
          </div>
        </Link>

        <Link
          href="/bonus"
          className="group bg-card rounded-2xl border border-border hover:border-foreground/30 p-5 flex flex-col justify-between gap-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-china-paper text-foreground flex items-center justify-center">
              <Library className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted">Bộ thẻ riêng</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground group-hover:text-china-red transition-colors flex items-center justify-between">
              <span>Từ mở rộng</span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-china-red group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Chuyên đề nâng cao và tự tạo bộ thẻ từ vựng cá nhân.
            </p>
          </div>
        </Link>
      </section>

      {/* 5. Vocabulary Analytics & Word of the Day */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: HSK Distribution & Core Metrics */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Phân bố từ vựng HSK 1 – 6
                </h2>
                <p className="text-xs text-muted">
                  Tương quan số từ đã nạp học so với quy mô từng cấp độ
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-neutral-200 dark:bg-zinc-700" />
                  Tổng từ
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-china-red" />
                  Đã nạp học
                </span>
              </div>
            </div>

            {/* Summary KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-china-paper/60 dark:bg-white/[0.02] border border-border">
              <div>
                <div className="text-[11px] text-muted">Tổng đang nạp</div>
                <div className="text-lg font-bold text-foreground">{reviews.length.toLocaleString("vi-VN")}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted">Đang củng cố</div>
                <div className="text-lg font-bold text-foreground">{(learning + review).toLocaleString("vi-VN")}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted">Đã thuộc sâu</div>
                <div className="text-lg font-bold text-china-jade">{mastered.toLocaleString("vi-VN")}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted">Độ chính xác</div>
                <div className="text-lg font-bold text-foreground">{accuracy}%</div>
              </div>
            </div>
          </div>

          <div className="h-56 sm:h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hskData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={4}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 600, fill: isDarkMode ? "#a1a1aa" : "#52525b" }}
                  tickLine={false}
                  axisLine={{ stroke: isDarkMode ? "#27272a" : "#e5e5e5" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: isDarkMode ? "#71717a" : "#737373" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
                  content={<CustomHskBarTooltip />}
                />
                <Bar
                  dataKey="total"
                  name="Tổng từ"
                  fill={isDarkMode ? "#27272a" : "#e4e4e7"}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="learning"
                  name="Đã nạp học"
                  fill={isDarkMode ? "#ef4444" : "#b91c1c"}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Word of the Day + 7-Day Activity */}
        <div className="space-y-5 flex flex-col justify-between">
          {dailyWord && (
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">Từ vựng mỗi ngày</span>
                {dailyWord.hskLevel && dailyWord.hskLevel.length > 0 && (
                  <span className="px-2 py-0.5 rounded bg-china-paper border border-border text-[11px] font-semibold text-foreground">
                    HSK {dailyWord.hskLevel[0]}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-3xl font-chinese font-bold text-foreground" lang="zh">
                    {dailyWord.hanzi}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm font-semibold text-china-red">{dailyWord.pinyin}</span>
                    {getHanViet(dailyWord.hanzi, dailyWord.traditional, dailyWord.pinyinNumeric) && (
                      <span className="text-xs text-muted">
                        · {getHanViet(dailyWord.hanzi, dailyWord.traditional, dailyWord.pinyinNumeric)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => playAudio(dailyWord.hanzi, e)}
                  className="w-9 h-9 rounded-lg bg-china-paper hover:bg-china-red hover:text-white text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed line-clamp-2">
                {getShortMeaningVi(dailyWord)}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={`/vocabulary/${dailyWord.id}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border hover:bg-china-paper text-xs font-semibold text-foreground transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Chi tiết</span>
                </Link>
                <button
                  onClick={handleAddDailyWord}
                  disabled={isDailyWordAdded}
                  className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isDailyWordAdded
                      ? "bg-china-paper text-muted cursor-default"
                      : "bg-china-red hover:bg-china-red-hover text-white"
                  }`}
                >
                  {isDailyWordAdded ? "Đã trong Ôn tập" : "+ Ôn tập"}
                </button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted">Hoạt động 7 ngày qua</h3>
              <span className="text-xs font-semibold text-foreground">
                {heatmapData.reduce((s, d) => s + d.activity, 0)} lượt ôn
              </span>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData}>
                  <Tooltip
                    cursor={{ fill: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
                    content={<CustomHeatmapTooltip />}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: isDarkMode ? "#a1a1aa" : "#737373" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="activity"
                    fill={isDarkMode ? "#10b981" : "#047857"}
                    radius={[3, 3, 3, 3]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Difficult Words (Only displayed when user actually has missed words) */}
      {difficultWords.length > 0 && (
        <section className="bg-card rounded-2xl border border-border p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-china-red" />
                Từ vựng hay nhầm lẫn
              </h2>
              <p className="text-xs text-muted">Các từ có số lần trả lời sai cao nhất trong quá trình ôn tập</p>
            </div>
            <Link
              href="/review"
              className="text-xs font-semibold text-china-red hover:underline"
            >
              Ôn tập lại →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {difficultWords.map(({ word, review: rev }) => (
              <div
                key={rev.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-china-paper/50 dark:bg-white/[0.02] border border-border"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-chinese font-bold text-foreground" lang="zh">
                      {word.hanzi}
                    </span>
                    <span className="text-xs font-semibold text-china-red">{word.pinyin}</span>
                  </div>
                  <p className="text-xs text-muted truncate mt-0.5">
                    {getShortMeaningVi(word)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold text-china-red bg-china-red/10 px-2 py-0.5 rounded">
                    Sai {rev.wrongCount}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => playAudio(word.hanzi, e)}
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-card transition-colors cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Toast Notification */}
      {streakToast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-medium animate-toast-in">
          {streakToast}
        </div>
      )}

      {/* Roadmap Setup Modal */}
      <RoadmapWizardModal
        isOpen={isRoadmapWizardOpen}
        onClose={() => setIsRoadmapWizardOpen(false)}
      />
    </div>
  )
}

interface ChartTooltipEntry {
  dataKey?: string | number
  value?: number
}

interface ChartTooltipProps {
  active?: boolean
  payload?: ChartTooltipEntry[]
  label?: string | number
}

function CustomHskBarTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null
  const total = payload.find((p) => p.dataKey === "total")?.value || 0
  const learning = payload.find((p) => p.dataKey === "learning")?.value || 0
  const percent = total > 0 ? Math.round((learning / total) * 100) : 0

  return (
    <div className="rounded-xl p-3 shadow-lg border border-border bg-card min-w-[160px] space-y-1.5 text-xs">
      <div className="flex items-center justify-between font-bold text-foreground pb-1 border-b border-border">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="flex items-center justify-between text-muted">
        <span>Tổng số từ:</span>
        <span className="font-semibold text-foreground">{total.toLocaleString("vi-VN")}</span>
      </div>
      <div className="flex items-center justify-between text-muted">
        <span>Đã nạp học:</span>
        <span className="font-semibold text-china-red">{learning.toLocaleString("vi-VN")}</span>
      </div>
    </div>
  )
}

function CustomHeatmapTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null
  const activity = payload[0]?.value || 0
  return (
    <div className="rounded-lg px-2.5 py-1.5 shadow-md border border-border bg-card text-xs">
      <span className="text-muted">{label}: </span>
      <span className="font-semibold text-foreground">{activity} lượt ôn</span>
    </div>
  )
}
