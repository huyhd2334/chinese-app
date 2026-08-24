"use client"

import { useEffect, useState } from "react"
import useVocab from "../../../hooks/useVocab"
import Link from "next/link"

export default function ReviewPage() {
  const {loading, cards, loadReview, markKnown, markUnknown, markHard, markEasy} = useVocab()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  
  type FilterType = "due" | "new" | "learning" | "review" | "mastered" | "all";
  const [filter, setFilter] = useState<FilterType>("due")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filterOptions = [
    { value: "due", label: "Due for review" },
    { value: "new", label: "New" },
    { value: "learning", label: "Learning" },
    { value: "review", label: "Review" },
    { value: "mastered", label: "Mastered" },
    { value: "all", label: "All Words" },
  ]

  useEffect(() => {
    loadReview(filter)
  }, [filter, loadReview])

  useEffect(() => {
    setCurrentIndex(0)
    setShowAnswer(false)
  }, [cards])

  const currentCard = cards[currentIndex]
  const total = cards.length
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0

  const handleResult = async (action: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return
    try {
      if (action === "again") await markUnknown(currentCard.reviewId)
      if (action === "hard") await markHard(currentCard.reviewId)
      if (action === "good") await markKnown(currentCard.reviewId)
      if (action === "easy") await markEasy(currentCard.reviewId)

      if (currentIndex >= cards.length - 1) {
        await loadReview(filter)
        return
      }
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
    } catch (error) {
      console.error("Review update error:", error)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-china-red">
              Review
            </h1>
            <p className="mt-1 text-sm text-muted">
              Review your vocabulary
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-china-ink shadow-sm hover:border-china-red/30 hover:shadow-md transition-all outline-none focus:ring-2 focus:ring-china-red/20 min-w-[140px] justify-between group"
              >
                <span className="group-hover:text-china-red transition-colors">{filterOptions.find(o => o.value === filter)?.label}</span>
                <svg className={`w-4 h-4 text-muted group-hover:text-china-red transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-xl shadow-china-ink/5 z-20 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1">
                      {filterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setFilter(opt.value as FilterType)
                            setIsFilterOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                            filter === opt.value 
                              ? 'bg-china-red/5 text-china-red font-semibold' 
                              : 'text-china-ink hover:bg-border/30 hover:text-china-red'
                          }`}
                        >
                          {opt.label}
                          {filter === opt.value && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            {cards.length > 0 && (
              <div className="rounded-full bg-border px-4 py-2 text-sm font-medium text-china-ink">
                {currentIndex + 1} / {total}
              </div>
            )}
          </div>
        </div>

        {cards.length > 0 && (
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-china-red transition-all duration-300"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        )}
      </div>

      {loading && cards.length === 0 ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-sm text-gray-500">
            Loading review...
          </div>
        </div>
      ) : !cards.length ? (
        <div className="flex min-h-[50vh] items-center justify-center p-8">
          <div className="w-full max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🎉</div>
            <h1 className="mb-2 text-2xl font-bold">
              No words found
            </h1>
            <p className="text-sm text-gray-500">
              You have completed your reviews or there are no words in this category.
            </p>
            <Link className="mt-4 inline-block text-sm text-china-red font-semibold hover:underline animate-pulse" href={'/vocabulary'}>
              Learn new words
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12">
            <div className="mb-10 text-center">
              <div className="mb-6 text-8xl font-bold tracking-wide font-serif text-china-ink">
                {currentCard.word.hanzi}
                <p className="text-sm font-sans text-muted border-l-2 border-r-2 border-border mt-6">Status: {currentCard.status_learning} word</p>
              </div>

              {showAnswer ? (
                <div className="space-y-3 font-sans">
                  <div className="text-3xl font-medium text-china-red">
                    {currentCard.word.pinyin}
                  </div>

                  <div className="text-lg text-china-ink font-medium">
                    {currentCard.word.meanings_vi ? currentCard.word.meanings_vi.join(", ") : currentCard.word.meanings.join(", ")}
                  </div>

                  {currentCard.word.partOfSpeech?.length > 0 && (
                    <div className="text-sm text-muted">
                      {currentCard.word.partOfSpeech.join(" · ")}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="rounded-xl border border-border px-8 py-3 text-sm font-medium transition hover:bg-border/50 text-china-ink hover:text-china-red"
                >
                  Show answer
                </button>
              )}
            </div>
          </div>

          {showAnswer && (
            <div className="border-t border-border bg-china-paper p-6 rounded-b-3xl">
              <div className="mb-4 text-center text-sm text-gray-500">
                How well did you remember this word?
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  onClick={() => handleResult("again")}
                  className="rounded-xl border border-red-200 bg-white px-4 py-4 transition hover:bg-red-50"
                >
                  <div className="font-semibold text-red-600">Again</div>
                  <div className="mt-1 text-xs text-gray-400">Forgot it</div>
                </button>

                <button
                  onClick={() => handleResult("hard")}
                  className="rounded-xl border border-orange-200 bg-white px-4 py-4 transition hover:bg-orange-50"
                >
                  <div className="font-semibold text-orange-600">Hard</div>
                  <div className="mt-1 text-xs text-gray-400">Barely remembered</div>
                </button>

                <button
                  onClick={() => handleResult("good")}
                  className="rounded-xl border border-green-200 bg-white px-4 py-4 transition hover:bg-green-50"
                >
                  <div className="font-semibold text-green-600">Good</div>
                  <div className="mt-1 text-xs text-gray-400">Remembered</div>
                </button>

                <button
                  onClick={() => handleResult("easy")}
                  className="rounded-xl border border-blue-200 bg-white px-4 py-4 transition hover:bg-blue-50"
                >
                  <div className="font-semibold text-blue-600">Easy</div>
                  <div className="mt-1 text-xs text-gray-400">Very easy</div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}