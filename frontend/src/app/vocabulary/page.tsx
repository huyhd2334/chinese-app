"use client"

import HeaderVocab from "@/components/vocabulary/HeaderVocab"
import WordContainer from "@/components/vocabulary/WordContainer"
import { useEffect, useRef, useState } from "react"
import useVocab from "../../../hooks/useVocab"
import { db } from "../../../db/database"

const Page = () => {
  const levels = 7
  const [level, setLevel] = useState(1)
  const [count, setCount] = useState(0)
  const [learningCount, setLearningCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { getHskVocabIds } = useVocab()

  useEffect(() => {
    const savedLevel = sessionStorage.getItem("vocab-level")
    if (savedLevel) setLevel(Number(savedLevel))
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      const ids = await getHskVocabIds(level)
      setCount(ids.length)
      
      const reviews = await db.reviewItems.toArray()
      const reviewWordIds = new Set(reviews.map(r => r.wordId))
      
      let learning = 0
      for (const id of ids) {
        if (reviewWordIds.has(id)) learning++
      }
      setLearningCount(learning)
    }
    fetchStats()
  }, [level, getHskVocabIds])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 justify-between px-8 pt-8 text-4xl items-end text-china-red font-serif">
        <HeaderVocab />
      </header>
      
      <div className="px-8 mt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-sm font-medium text-china-ink mb-2">
            <span>HSK {level} Progress - {((learningCount / count) * 100).toFixed(2)} % </span>
            <span>{learningCount} / {count} Studying</span>
          </div>
          <div className="h-3 w-full bg-border/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-china-jade transition-all duration-500 ease-out rounded-full"
              style={{ width: count > 0 ? `${(learningCount / count) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted mt-1.5">
            <span>Studying: {learningCount}</span>
            <span>New: {count - learningCount}</span>
          </div>
        </div>
      </div>

      <hr className="mx-auto my-4 w-[95%] shrink-0 border-t border-border" />

      <div className="flex shrink-0 gap-4 px-8 pt-0 sm:pt-4 lg:pt-4">
        {[...Array(levels)].map((_, index) => {
          const lv = index + 1
          return (
            <button
              key={lv}
              onClick={() => {
                setLevel(lv)
                sessionStorage.setItem("vocab-level", String(lv))
              }}              
              className={`pb-2 border-b-2 font-medium transition-colors text-sm sm:text-sm lg:text-sm ${
                level === lv ? "border-china-red text-china-red" : "border-transparent text-muted hover:text-china-ink"
              }`}
            >
              HSK {lv}
            </button>
          )
        })}
      </div>

      <hr className="mx-auto my-4 w-[95%] shrink-0 border-t border-border" />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-8">
        <WordContainer
          level={level}
          setCount={() => {}} 
          onWordAdded={() => setLearningCount(prev => prev + 1)}
          scrollRef={scrollRef}
        />
      </div>
    </div>
  )
}

export default Page