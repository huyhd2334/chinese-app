"use client"

import HeaderVocab from "@/components/vocabulary/HeaderVocab"
import WordContainer from "@/components/vocabulary/WordContainer"
import FlashcardModal from "@/components/vocabulary/FlashcardModal"
import VocabQuizModal from "@/components/vocabulary/VocabQuizModal"
import { useEffect, useRef, useState } from "react"
import useVocab from "../../../hooks/useVocab"
import { db, type Word } from "../../../db/database"
import { Search, Plus, Sparkles, Eye, EyeOff, Trophy } from "lucide-react"

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

  // Flashcard & Quiz modal states
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [currentLevelWords, setCurrentLevelWords] = useState<Word[]>([])

  const { getHskVocabIds, addToReview } = useVocab()

  useEffect(() => {
    const savedLevel = sessionStorage.getItem("vocab-level")
    if (savedLevel) setLevel(Number(savedLevel))
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
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

  const handleQuickAdd10 = async () => {
    const ids = await getHskVocabIds(level)
    const reviews = await db.reviewItems.toArray()
    const reviewWordIds = new Set(reviews.map(r => r.wordId))
    
    const newWords = ids.filter(id => !reviewWordIds.has(id)).slice(0, 10)
    for (const id of newWords) {
      await addToReview(id)
    }
    setLearningCount(prev => prev + newWords.length)
    setNewCount(prev => prev - newWords.length)
  }

  const progressPercentage = count > 0 ? ((learningCount + masteredCount) / count) * 100 : 0

  return (
    <div className="flex flex-col min-h-full bg-china-paper/20 px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-5">
      {/* Header */}
      <header className="shrink-0">
        <HeaderVocab totalWords={count} studyingWords={learningCount} />
      </header>
      
      {/* Top Controls Strip */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-card/60 p-3 sm:p-4 rounded-2xl border border-border/70 shadow-xs">
        {/* Level Progress */}
        <div className="w-full lg:w-1/3 space-y-1.5">
          <div className="flex justify-between text-xs sm:text-sm font-medium text-china-ink">
            <span>Tiến độ HSK {level}</span>
            <span className="text-china-jade font-serif font-bold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-china-gold to-china-jade transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-medium text-muted">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-border"></span> Mới: {newCount}</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-china-gold"></span> Đang học: {learningCount}</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-china-jade"></span> Thuần thục: {masteredCount}</span>
          </div>
        </div>

        {/* Action Buttons & Search */}
        <div className="w-full lg:w-2/3 flex flex-wrap gap-2.5 items-center justify-start lg:justify-end">
          {/* Search Box */}
          <div className="relative w-full sm:w-56 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-china-red transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm chữ Hán, pinyin..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-china-red/20 focus:border-china-red transition-all shadow-xs"
            />
          </div>

          {/* Active Recall Toggles */}
          <div className="flex items-center bg-white border border-border p-0.5 rounded-xl shadow-xs text-xs font-medium">
            <button
              onClick={() => setHidePinyin(!hidePinyin)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                hidePinyin ? "bg-china-red text-white" : "text-muted hover:text-china-ink hover:bg-gray-50"
              }`}
              title="Ẩn Pinyin để tự kiểm tra mặt chữ"
            >
              {hidePinyin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hidePinyin ? "Ẩn Pinyin" : "Pinyin"}</span>
            </button>
            <button
              onClick={() => setHideMeaning(!hideMeaning)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                hideMeaning ? "bg-china-red text-white" : "text-muted hover:text-china-ink hover:bg-gray-50"
              }`}
              title="Ẩn Nghĩa để tự suy nghĩ"
            >
              {hideMeaning ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{hideMeaning ? "Ẩn Nghĩa" : "Nghĩa"}</span>
            </button>
          </div>

          {/* Quick Actions */}
          <button 
            onClick={() => setIsFlashcardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-china-red to-[#b30d25] hover:opacity-95 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" /> Flashcard
          </button>

          <button 
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-china-jade to-[#204a3e] hover:opacity-95 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-95"
            title="Trắc nghiệm phản xạ 4 đáp án & Chế độ luyện nghe"
          >
            <Trophy className="w-3.5 h-3.5" /> Mini Quiz
          </button>

          <button 
            onClick={handleQuickAdd10}
            className="flex items-center gap-1 px-3 py-1.5 bg-china-ink hover:bg-china-ink/80 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-xs active:scale-95"
            title="Thêm nhanh 10 từ chưa học vào danh sách ôn tập"
          >
            <Plus className="w-3.5 h-3.5" /> +10 từ
          </button>
        </div>
      </div>

      {/* Filter Tabs & HSK Levels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex bg-white border border-border p-1 rounded-xl shadow-xs overflow-x-auto scrollbar-hide gap-1">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'studying', label: 'Đang học' },
            { id: 'new', label: 'Từ mới' },
            { id: 'mastered', label: 'Thuần thục' },
            { id: 'favorites', label: 'Yêu thích ⭐' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                filter === f.id 
                  ? 'bg-china-red text-white shadow-xs font-bold' 
                  : 'text-muted hover:text-china-ink hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* HSK Level Tabs with horizontal swipe */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border/60 pb-0.5">
          {[...Array(levels)].map((_, index) => {
            const lv = index + 1
            return (
              <button
                key={lv}
                onClick={() => {
                  setLevel(lv)
                  sessionStorage.setItem("vocab-level", String(lv))
                }}              
                className={`flex items-center gap-1 px-2.5 py-1.5 font-medium transition-all text-xs rounded-t-xl border-b-2 whitespace-nowrap ${
                  level === lv 
                    ? "border-china-red text-china-red bg-white font-bold shadow-xs" 
                    : "border-transparent text-muted hover:text-china-ink hover:bg-gray-50"
                }`}
              >
                HSK {lv}
                <span className={`text-[10px] px-1 py-0.2 rounded ${level === lv ? 'bg-china-red/10 text-china-red font-semibold' : 'bg-border/60 text-muted'}`}>
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
          onWordsLoaded={(words) => setCurrentLevelWords(words)}
        />
      </div>

      {/* Flashcard Modal */}
      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        words={currentLevelWords.length > 0 ? currentLevelWords.slice(0, 30) : []}
        onMarkLearned={async (wordId) => {
          await addToReview(wordId)
          setLearningCount(prev => prev + 1)
        }}
      />

      {/* Mini Quiz Modal */}
      <VocabQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        words={currentLevelWords.length > 0 ? currentLevelWords : []}
        onWordMastered={async (wordId) => {
          await addToReview(wordId)
          setLearningCount(prev => prev + 1)
        }}
      />
    </div>
  )
}

export default Page