"use client"

import HeaderVocab from "@/components/vocabulary/HeaderVocab"
import WordContainer from "@/components/vocabulary/WordContainer"
import { useEffect, useRef, useState } from "react"
import useVocab from "../../../hooks/useVocab"
import { db } from "../../../db/database"
import { importHsk } from "../../../db/importContent"
import { Search, Eye, EyeOff } from "lucide-react"

const Page = () => {
  const levels = 7
  const [level, setLevel] = useState(1)
  const [count, setCount] = useState(0)
  const [learningCount, setLearningCount] = useState(0)
  const [newCount, setNewCount] = useState(0)
  const [masteredCount, setMasteredCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all") // all, studying, new, mastered, favorites
  const [hskCounts, setHskCounts] = useState<Record<number, number>>({})

  // Active recall controls
  const [hidePinyin, setHidePinyin] = useState(false)
  const [hideMeaning, setHideMeaning] = useState(false)

  const { getHskVocabIds } = useVocab()

  useEffect(() => {
    const savedLevel = sessionStorage.getItem("vocab-level")
    if (savedLevel) setLevel(Number(savedLevel))
    const savedFilter = sessionStorage.getItem("vocab-filter")
    if (savedFilter) setFilter(savedFilter)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sample = await db.words.where("hanzi").equals("面包").first()
        if (!sample || !sample.meanings_vi || sample.meanings_vi.length === 0) {
          await importHsk(true)
        }
      } catch {}

      const ids = await getHskVocabIds(level)
      setCount(ids.length)
      
      const reviews = await db.reviewItems.toArray()
      const reviewMap = new Map(reviews.map(r => [r.wordId, r.status]))
      
      let learning = 0
      let mastered = 0
      for (const id of ids) {
        const status = reviewMap.get(id)
        if (status === 'mastered') mastered++
        else if (status) learning++
      }
      setLearningCount(learning)
      setMasteredCount(mastered)
      setNewCount(ids.length - learning - mastered)
    }
    fetchStats()
  }, [level, getHskVocabIds])

  useEffect(() => {
    const fetchAllCounts = async () => {
      const counts: Record<number, number> = {}
      for (let i = 1; i <= levels; i++) {
        const ids = await getHskVocabIds(i)
        counts[i] = ids.length
      }
      setHskCounts(counts)
    }
    fetchAllCounts()
  }, [getHskVocabIds])

  const progressPercentage = count > 0 ? ((learningCount + masteredCount) / count) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {/* Header */}
      <header className="shrink-0">
        <HeaderVocab totalWords={count} studyingWords={learningCount} />
      </header>
      
      {/* Top Controls Strip */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-card p-4 rounded-2xl border border-border">
        {/* Level Progress */}
        <div className="w-full lg:w-1/3 space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-foreground">
            <span>Tiến độ HSK {level}</span>
            <span className="text-china-jade font-bold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-china-jade transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted">
            <span>Mới: {newCount}</span>
            <span>Đang học: {learningCount}</span>
            <span>Thuần thục: {masteredCount}</span>
          </div>
        </div>

        {/* Action Buttons & Search */}
        <div className="w-full lg:w-2/3 flex flex-wrap gap-2.5 items-center justify-start lg:justify-end">
          {/* Search Box */}
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-china-red transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm chữ Hán, pinyin..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-china-paper/60 dark:bg-card text-foreground border border-border rounded-lg focus:outline-none focus:border-china-red transition-colors"
            />
          </div>

          {/* Active Recall Toggles */}
          <div className="flex items-center bg-china-paper border border-border p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setHidePinyin(!hidePinyin)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                hidePinyin ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
              title="Ẩn Pinyin để tự kiểm tra mặt chữ"
            >
              {hidePinyin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hidePinyin ? "Ẩn Pinyin" : "Pinyin"}</span>
            </button>
            <button
              onClick={() => setHideMeaning(!hideMeaning)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                hideMeaning ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
              title="Ẩn Nghĩa để tự suy nghĩ"
            >
              {hideMeaning ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hideMeaning ? "Ẩn Nghĩa" : "Nghĩa"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & HSK Levels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex bg-china-paper border border-border p-1 rounded-xl overflow-x-auto scrollbar-hide gap-1">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'studying', label: 'Đang học' },
            { id: 'new', label: 'Từ mới' },
            { id: 'mastered', label: 'Thuần thục' },
            { id: 'favorites', label: 'Đã lưu' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setFilter(f.id)
                sessionStorage.setItem("vocab-filter", f.id)
                sessionStorage.setItem("vocab-page", "0")
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filter === f.id 
                  ? 'bg-card text-foreground font-semibold shadow-2xs' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* HSK Level Tabs with horizontal swipe */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border pb-0.5">
          {[...Array(levels)].map((_, index) => {
            const lv = index + 1
            return (
              <button
                key={lv}
                onClick={() => {
                  setLevel(lv)
                  sessionStorage.setItem("vocab-level", String(lv))
                  sessionStorage.setItem("vocab-page", "0")
                }}              
                className={`flex items-center gap-1 px-2.5 py-1.5 font-medium transition-colors text-xs border-b-2 whitespace-nowrap cursor-pointer ${
                  level === lv 
                    ? "border-china-red text-china-red font-semibold" 
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                HSK {lv}
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${level === lv ? 'bg-china-red/10 text-china-red font-semibold' : 'bg-china-paper text-muted'}`}>
                  {hskCounts[lv] || 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Word Container (Natural flow on mobile, no trapped nested scroll) */}
      <div ref={scrollRef} className="w-full">
        <WordContainer
          level={level}
          setCount={setCount} 
          onWordAdded={() => {
            setLearningCount(prev => prev + 1)
            setNewCount(prev => prev - 1)
          }}
          scrollRef={scrollRef}
          searchQuery={searchQuery}
          filter={filter}
          hidePinyin={hidePinyin}
          hideMeaning={hideMeaning}
        />
      </div>
    </div>
  )
}

export default Page
