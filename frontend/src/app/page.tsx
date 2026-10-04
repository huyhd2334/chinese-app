"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db, type ReviewItem, type Word } from "../../db/database"
import { importHsk, importListening, importReading } from "../../db/importContent"
import { reviewRepository } from "../../repositories/reviewRepository"
import { 
  CircleCheckBig, BookOpen, Brain, Trophy, Target, 
  Play, Ear, Flame, Medal, Compass, Star, TrendingUp, 
  Clock, AlertCircle, ArrowRight, BookMarked, History,
  Volume2, PenTool, Sparkles
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const PROVERBS = [
  { cn: "千里之行，始于足下", pinyin: "Qiān lǐ zhī xíng, shǐ yú zú xià", en: "A journey of a thousand miles begins with a single step" },
  { cn: "温故而知新", pinyin: "Wēn gù ér zhī xīn", en: "Review the old and know the new" },
  { cn: "熟能生巧", pinyin: "Shú néng shēng qiǎo", en: "Practice makes perfect" },
  { cn: "学无止境", pinyin: "Xué wú zhǐ jìng", en: "Learning has no bounds" },
  { cn: "万事开头难", pinyin: "Wàn shì kāi tóu nán", en: "All things are difficult before they are easy" }
]

export default function Dashboard() {
  const [wordCount, setWordCount] = useState(0)
  const [wordReview, setWordReview] = useState(0)
  const [words, setWords] = useState<Word[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [proverb, setProverb] = useState(PROVERBS[0])
  const [greeting, setGreeting] = useState("Good morning")
  const [chineseDate, setChineseDate] = useState("")
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dailyWord, setDailyWord] = useState<Word | null>(null)
  const [isDailyWordAdded, setIsDailyWordAdded] = useState(false)

  const playAudio = (text: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const getData = async () => {
    setLoading(true)
    const count = await importHsk()
    await importReading()
    setWordCount(count)
    await loadData()
    await importListening()
  }

  const loadData = async () => {
    const allWords = await db.words.toArray()
    const allReviews = await reviewRepository.getAll()

    setWords(allWords)
    setReviews(allReviews)
    setWordCount(allWords.length)
    
    const due = allReviews.filter(r => r.dueAt <= Date.now())
    setWordReview(due.length)
    
    // Calculate streak
    if (allReviews.length > 0) {
      const firstReviewTime = Math.min(...allReviews.map(r => r.createdAt))
      const daysSince = Math.floor((Date.now() - firstReviewTime) / (1000 * 60 * 60 * 24))
      setStreak(daysSince + 1)
    } else {
      setStreak(0)
    }

    // Pick Word of the Day (deterministic based on today's day of year)
    if (allWords.length > 0) {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 0)
      const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const picked = allWords[dayOfYear % allWords.length]
      setDailyWord(picked)
      const isAdded = allReviews.some(r => r.wordId === picked.id)
      setIsDailyWordAdded(isAdded)
    }
    
    setLoading(false)
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

  const hskData = [1, 2, 3, 4, 5, 6].map(level => {
    const levelWords = words.filter(w => w.hskLevels?.includes(level))
    const ids = new Set(levelWords.map(w => w.id))
    return {
      name: `HSK ${level}`,
      total: levelWords.length,
      learning: reviews.filter(r => ids.has(r.wordId)).length
    }
  })

  const statusData = [
    { name: "Learning", value: learning },
    { name: "Review", value: review },
    { name: "Mastered", value: mastered },
    { name: "New", value: newWords }
  ].filter(x => x.value > 0)

  const difficultWords = reviews
    .filter(r => r.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 10)
    .map(r => ({
      review: r,
      word: words.find(w => w.id === r.wordId)
    }))
    .filter(x => x.word)

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
    return <div className="min-h-[50vh] bg-transparent p-4 sm:p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-china-red"></div>
    </div>
  }

  return (
    <main className="min-h-screen bg-transparent p-3 sm:p-6 md:p-8 text-china-ink space-y-6 sm:space-y-8">
      
      {/* 1. Dynamic Greeting */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-border/50">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-china-red tracking-wide">
              {greeting}
            </h1>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-china-gold/10 text-china-gold border border-china-gold/30 text-xs sm:text-sm font-bold shadow-2xs">
                <Flame className="w-3.5 h-3.5 fill-china-gold" />
                <span>{streak} Ngày</span>
              </div>
            )}
          </div>
          
          <div className="space-y-0.5">
            <p className="text-base sm:text-xl font-serif text-china-ink">{proverb.cn}</p>
            <p className="text-xs sm:text-sm text-muted">{proverb.pinyin} • {proverb.en}</p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
          <p className="font-serif text-lg sm:text-2xl text-china-jade">{chineseDate}</p>
          <button
            onClick={getData}
            className="mt-1 text-xs sm:text-sm text-muted hover:text-china-red transition-colors flex items-center gap-1"
          >
            <History className="w-3.5 h-3.5" />
            Đồng bộ dữ liệu
          </button>
        </div>
      </header>

      {/* 2. Quick Action Cards (Hero Section) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <Link href="/review" className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-china-red to-[#8b0000] p-3.5 sm:p-5 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 sm:p-5 opacity-15 group-hover:scale-110 transition-transform duration-500">
            <Target className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div className="relative z-10">
            <h3 className="text-base sm:text-xl font-serif font-bold mb-1">Ôn tập</h3>
            <p className="text-white/80 text-[11px] sm:text-xs mb-3 sm:mb-5 line-clamp-1">Từ cần ôn hôm nay</p>
            <div className="flex items-center justify-between">
              <span className="bg-white/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs backdrop-blur-xs flex items-center gap-1">
                {wordReview > 0 && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {wordReview} từ
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/vocabulary" className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-china-jade to-[#1e4d3f] p-3.5 sm:p-5 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 sm:p-5 opacity-15 group-hover:scale-110 transition-transform duration-500">
            <BookMarked className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div className="relative z-10">
            <h3 className="text-base sm:text-xl font-serif font-bold mb-1">Từ vựng</h3>
            <p className="text-white/80 text-[11px] sm:text-xs mb-3 sm:mb-5 line-clamp-1">Khám phá từ HSK</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="bg-white/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs backdrop-blur-xs">
                {wordCount} từ
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/reading" className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] p-3.5 sm:p-5 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 sm:p-5 opacity-15 group-hover:scale-110 transition-transform duration-500">
            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div className="relative z-10">
            <h3 className="text-base sm:text-xl font-serif font-bold mb-1">Luyện đọc</h3>
            <p className="text-white/80 text-[11px] sm:text-xs mb-3 sm:mb-5 line-clamp-1">Bài đọc & ngữ cảnh</p>
            <div className="flex items-center justify-end mt-auto h-[24px]">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/listening" className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-china-gold to-[#b38b1d] p-3.5 sm:p-5 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 sm:p-5 opacity-15 group-hover:scale-110 transition-transform duration-500">
            <Ear className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div className="relative z-10">
            <h3 className="text-base sm:text-xl font-serif font-bold mb-1">Luyện nghe</h3>
            <p className="text-white/80 text-[11px] sm:text-xs mb-3 sm:mb-5 line-clamp-1">Phản xạ âm thanh</p>
            <div className="flex items-center justify-end mt-auto h-[24px]">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </section>

      {/* 2.5 Word of the Day Section */}
      {dailyWord && (
        <section className="bg-gradient-to-r from-card via-china-paper to-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-china-gold/30 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-china-gold/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full md:w-auto">
              {/* Hanzi Box */}
              <div className="relative shrink-0">
                <div className={`rounded-xl sm:rounded-2xl bg-white border border-border shadow-xs flex items-center justify-center font-serif font-bold text-china-ink group-hover:text-china-red transition-colors whitespace-nowrap px-3 sm:px-4 py-2 h-16 sm:h-20 md:h-24 ${
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
                  <span className="text-[11px] font-bold uppercase tracking-wider text-china-gold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Từ vựng hôm nay
                  </span>
                  {dailyWord.radical && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-china-paper border border-border text-muted">
                      Bộ: {dailyWord.radical}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-china-red">
                    {dailyWord.pinyin}
                  </h3>
                  <button
                    title="Nghe phát âm"
                    onClick={(e) => playAudio(dailyWord.hanzi, e)}
                    className="p-1 text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
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
                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-border bg-white text-china-ink hover:text-china-red hover:border-china-red/30 text-xs sm:text-sm font-medium transition-all shadow-xs"
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
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl font-semibold font-serif flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-china-jade" />
              Tiến độ cấp độ HSK
            </h2>
            <p className="text-xs sm:text-sm text-muted">Số lượng từ vựng bạn đã mở khóa theo từng cấp</p>
          </div>
          <div className="flex-grow h-52 sm:h-64 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hskData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#8c857d" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                <YAxis stroke="#8c857d" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f5f0ea', opacity: 0.4}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} 
                />
                <Bar dataKey="total" name="Tổng từ" fill="#eae0d5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="learning" name="Đang học" fill="#366c5d" radius={[4, 4, 0, 0]} />
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
                      <Cell key={i} fill={["#366c5d", "#d4af37", "#c8102e", "#8c857d"][i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
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
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '8px', border: 'none', padding: '4px 8px', fontSize: '11px'}} 
                  />
                  <XAxis dataKey="day" stroke="#8c857d" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <Bar dataKey="activity" fill="#d4af37" radius={[3, 3, 3, 3]} />
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
                <div key={review.id} className="min-w-[150px] sm:min-w-[190px] flex-shrink-0 snap-start bg-china-paper border border-border rounded-xl p-3.5 sm:p-4 hover:border-china-red/30 transition-colors">
                  <div className="text-3xl sm:text-4xl font-serif text-center text-china-ink mb-1">{word?.hanzi}</div>
                  <div className="text-center text-china-red text-xs sm:text-sm mb-1.5 font-medium">{word?.pinyin}</div>
                  <p className="text-xs text-center text-muted line-clamp-2 mb-3 h-8">
                    {word?.meanings_vi ? word.meanings_vi.join(', ') : word?.meanings?.join(', ')}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-china-red/80 bg-china-red/5 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    {review.wrongCount} lần sai
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
      <section className="bg-china-ink text-china-paper rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
          {/* CSS Circular Progress */}
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center rounded-full bg-china-ink"
            style={{
              background: `conic-gradient(#366c5d ${progress * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
            }}
          >
            <div className="absolute w-14 h-14 sm:w-18 sm:h-18 bg-china-ink rounded-full flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-serif font-bold text-china-jade">{progress}%</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold mb-0.5">Tiến độ tổng thể</h2>
            <p className="text-white/60 text-xs sm:text-sm">{mastered} / {wordCount} từ đã thuần thục</p>
          </div>
        </div>

        <div className="flex justify-around w-full md:w-auto gap-4 sm:gap-10 text-center pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
          <div>
            <p className="text-2xl sm:text-4xl font-serif font-bold text-china-gold mb-0.5">{accuracy}%</p>
            <p className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wider">Độ chính xác</p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-serif font-bold text-white mb-0.5">
              {studyTimeHours}<span className="text-sm sm:text-lg">h</span> {studyTimeMins}<span className="text-sm sm:text-lg">m</span>
            </p>
            <p className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wider">Thời gian học</p>
          </div>
        </div>
      </section>
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