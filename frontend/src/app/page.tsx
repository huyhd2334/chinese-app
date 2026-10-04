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
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return {
      day: dayNames[d.getDay()],
      activity: count
    }
  })

  // Milestones
  const achievements = [
    { id: 'first_step', name: 'First Step', desc: 'Start your journey', icon: <Compass className="w-5 h-5" />, unlocked: reviews.length > 0 },
    { id: 'getting_started', name: 'Getting Started', desc: '10+ learning', icon: <Play className="w-5 h-5" />, unlocked: learning >= 10 },
    { id: 'scholar', name: 'Scholar', desc: '50+ learning', icon: <BookOpen className="w-5 h-5" />, unlocked: learning >= 50 },
    { id: 'master', name: 'Master', desc: 'Master a word', icon: <Medal className="w-5 h-5" />, unlocked: mastered > 0 },
    { id: 'persistent', name: 'Persistent', desc: '100+ total reviews', icon: <Flame className="w-5 h-5" />, unlocked: attempts >= 100 },
    { id: 'accuracy_king', name: 'Accuracy King', desc: '80%+ accuracy', icon: <Star className="w-5 h-5" />, unlocked: attempts > 10 && accuracy >= 80 },
  ]

  if (loading) {
    return <div className="min-h-screen bg-transparent p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-china-red"></div>
    </div>
  }

  return (
    <main className="min-h-screen bg-transparent p-4 sm:p-8 text-china-ink space-y-10">
      
      {/* 1. Dynamic Greeting */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-china-red tracking-wide">
              {greeting}
            </h1>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-china-gold/10 text-china-gold border border-china-gold/30">
                <Flame className="w-4 h-4 fill-china-gold" />
                <span className="font-bold text-sm">{streak} Day Streak</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-xl font-serif text-china-ink">{proverb.cn}</p>
            <p className="text-sm text-muted">{proverb.pinyin} • {proverb.en}</p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <p className="font-serif text-2xl text-china-jade">{chineseDate}</p>
          <button
            onClick={getData}
            className="mt-2 text-sm text-muted hover:text-china-red transition-colors flex items-center gap-1"
          >
            <History className="w-4 h-4" />
            Sync Data
          </button>
        </div>
      </header>

      {/* 2. Quick Action Cards (Hero Section) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/review" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-china-red to-[#8b0000] p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Target className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-serif font-bold mb-2">Start Review</h3>
            <p className="text-white/80 text-sm mb-6">Practice your due vocabulary</p>
            <div className="flex items-center justify-between">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                {wordReview > 0 && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                {wordReview} due today
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/vocabulary" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-china-jade to-[#1e4d3f] p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <BookMarked className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-serif font-bold mb-2">Learn Words</h3>
            <p className="text-white/80 text-sm mb-6">Explore the HSK dictionary</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {wordCount} available
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/reading" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <BookOpen className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-serif font-bold mb-2">Reading</h3>
            <p className="text-white/80 text-sm mb-6">Practice reading stories</p>
            <div className="flex items-center justify-end mt-auto h-[28px]">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/listening" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-china-gold to-[#b38b1d] p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Ear className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-serif font-bold mb-2">Listening</h3>
            <p className="text-white/80 text-sm mb-6">Train your ears</p>
            <div className="flex items-center justify-end mt-auto h-[28px]">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </section>

      {/* 2.5 Word of the Day Section */}
      {dailyWord && (
        <section className="bg-gradient-to-r from-card via-china-paper to-card rounded-2xl p-6 border border-china-gold/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-china-gold/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start md:items-center gap-6">
              {/* Hanzi Box */}
              <div className="relative shrink-0">
                <div className={`rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center font-serif font-bold text-china-ink group-hover:text-china-red transition-colors whitespace-nowrap px-4 py-2 h-20 sm:h-24 ${
                  dailyWord.hanzi.length <= 1 
                    ? "w-20 sm:w-24 text-4xl sm:text-5xl" 
                    : dailyWord.hanzi.length === 2
                    ? "min-w-[5.5rem] sm:min-w-[6.5rem] text-3xl sm:text-4xl"
                    : dailyWord.hanzi.length === 3
                    ? "min-w-[7rem] sm:min-w-[8rem] text-2xl sm:text-3xl"
                    : "min-w-[8.5rem] sm:min-w-[10rem] text-xl sm:text-2xl"
                }`}>
                  {dailyWord.hanzi}
                </div>
                {dailyWord.hskLevel && dailyWord.hskLevel.length > 0 && (
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-china-red text-white text-[10px] font-bold rounded-md shadow-sm">
                    HSK {dailyWord.hskLevel[0]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-china-gold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Từ vựng trong ngày
                  </span>
                  {dailyWord.radical && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-china-paper border border-border text-muted">
                      Bộ: {dailyWord.radical}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-serif font-bold text-china-red">
                    {dailyWord.pinyin}
                  </h3>
                  <button
                    title="Nghe phát âm"
                    onClick={(e) => playAudio(dailyWord.hanzi, e)}
                    className="p-1.5 text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-base text-china-ink font-medium max-w-lg">
                  {dailyWord.meanings_vi ? dailyWord.meanings_vi.join(", ") : dailyWord.meanings?.join(", ")}
                </p>
              </div>
            </div>

            {/* Quick Actions for Word */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href={`/vocabulary/${dailyWord.id}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-china-ink hover:text-china-red hover:border-china-red/30 text-sm font-medium transition-all shadow-sm"
              >
                <PenTool className="w-4 h-4" /> Luyện viết chữ
              </Link>
              <button
                onClick={handleAddDailyWord}
                disabled={isDailyWordAdded}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
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
      <section className="bg-card rounded-2xl p-6 shadow-sm border border-border grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-border">
        <StatBar title="Words Learning" value={learning} icon={<Brain className="text-china-jade" />} color="bg-china-jade" delay="0ms" />
        <StatBar title="To Review" value={review} icon={<Target className="text-china-gold" />} color="bg-china-gold" delay="100ms" pl />
        <StatBar title="Mastered" value={mastered} icon={<Trophy className="text-china-red" />} color="bg-china-red" delay="200ms" pl />
        <StatBar title="Total Known" value={learning + mastered} icon={<BookOpen className="text-china-ink" />} color="bg-china-ink" delay="300ms" pl />
      </section>

      {/* 4. Learning Progress & 5. Heatmap Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* HSK Progress Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-card p-6 shadow-sm border border-border flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-semibold font-serif flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-china-jade" />
              HSK Progress
            </h2>
            <p className="text-sm text-muted">Your vocabulary coverage across HSK levels</p>
          </div>
          <div className="flex-grow h-64 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#8c857d" tickLine={false} axisLine={false} />
                <YAxis stroke="#8c857d" tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f5f0ea', opacity: 0.4}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="total" name="Available" fill="#eae0d5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="learning" name="Learning" fill="#366c5d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vocabulary Status & Heatmap */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold font-serif mb-4 text-center">Status</h2>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={["#366c5d", "#d4af37", "#c8102e", "#8c857d"][i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-serif font-bold text-china-ink">{learning + review + mastered}</span>
                <span className="text-xs text-muted">Total</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
            <h2 className="text-sm font-semibold font-serif mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-china-gold" />
              7-Day Activity
            </h2>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData}>
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '8px', border: 'none', padding: '4px 8px'}} 
                  />
                  <XAxis dataKey="day" stroke="#8c857d" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <Bar dataKey="activity" fill="#d4af37" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Difficult Words & 7. Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Difficult Words */}
        <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold font-serif flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-china-red" />
                Focus Needed
              </h2>
              <p className="text-sm text-muted">Words you often struggle with</p>
            </div>
            {difficultWords.length > 0 && (
              <Link href="/review" className="text-sm font-medium text-china-red hover:text-china-red-hover flex items-center gap-1 bg-china-red/10 px-3 py-1.5 rounded-full transition-colors">
                Practice These
              </Link>
            )}
          </div>

          {difficultWords.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {difficultWords.map(({ word, review }) => (
                <div key={review.id} className="min-w-[200px] flex-shrink-0 snap-start bg-china-paper border border-border rounded-xl p-5 hover:border-china-red/30 transition-colors">
                  <div className="text-4xl font-serif text-center text-china-ink mb-1">{word?.hanzi}</div>
                  <div className="text-center text-china-red text-sm mb-2 font-medium">{word?.pinyin}</div>
                  <p className="text-sm text-center text-muted line-clamp-2 mb-4 h-10">
                    {word?.meanings_vi ? word.meanings_vi.join(', ') : word?.meanings?.join(', ')}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs font-medium text-china-red/70 bg-china-red/5 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    {review.wrongCount} mistakes
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted">
              <CircleCheckBig className="w-12 h-12 text-china-jade mb-3 opacity-50" />
              <p>No difficult words yet!</p>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold font-serif mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-china-gold" />
            Achievements
          </h2>
          <p className="text-sm text-muted mb-6">Unlock milestones as you learn</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {achievements.map(a => (
              <div key={a.id} className={`flex flex-col items-center p-4 rounded-xl border transition-all ${a.unlocked ? 'bg-china-gold/5 border-china-gold/30 text-china-ink shadow-sm' : 'bg-transparent border-border/50 text-muted/50 grayscale'}`}>
                <div className={`p-3 rounded-full mb-3 ${a.unlocked ? 'bg-china-gold text-white shadow-md shadow-china-gold/20' : 'bg-muted/20'}`}>
                  {a.icon}
                </div>
                <p className="font-semibold text-sm text-center">{a.name}</p>
                <p className="text-xs text-center mt-1 opacity-70">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 8. Overall Progress Footer */}
      <section className="bg-china-ink text-china-paper rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex items-center gap-8">
          {/* CSS Circular Progress */}
          <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-china-ink"
            style={{
              background: `conic-gradient(#366c5d ${progress * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
            }}
          >
            <div className="absolute w-20 h-20 bg-china-ink rounded-full flex items-center justify-center">
              <span className="text-2xl font-serif font-bold text-china-jade">{progress}%</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-serif font-bold mb-1">Overall Progress</h2>
            <p className="text-white/60">{mastered} out of {wordCount} words mastered</p>
          </div>
        </div>

        <div className="flex gap-12 text-center">
          <div>
            <p className="text-4xl font-serif font-bold text-china-gold mb-1">{accuracy}%</p>
            <p className="text-sm text-white/60 uppercase tracking-wider">Accuracy</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-bold text-white mb-1">
              {studyTimeHours}<span className="text-xl">h</span> {studyTimeMins}<span className="text-xl">m</span>
            </p>
            <p className="text-sm text-white/60 uppercase tracking-wider">Study Time</p>
          </div>
        </div>
      </section>

      {/* Styles for scrollbar hiding in difficult words */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  )
}

function StatBar({ title, value, icon, color, delay, pl = false }: { title: string, value: number, icon: React.ReactNode, color: string, delay: string, pl?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 ${pl ? 'pl-6' : ''} animate-[fadeIn_0.5s_ease-out_forwards] opacity-0`} style={{ animationDelay: delay }}>
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-serif font-bold text-china-ink">{value}</span>
      </div>
      <div className={`h-1 w-12 rounded-full ${color}`}></div>
    </div>
  )
}