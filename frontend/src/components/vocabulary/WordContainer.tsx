"use client"
import React, { useEffect, useState, useCallback } from 'react'
import useVocab from '../../../hooks/useVocab'
import type { Word, ReviewItem } from "../../../db/database"
import { db } from "../../../db/database"
import Link from 'next/link'
import { Volume2, CheckCircle2, AlertCircle, Star, Eye, EyeOff } from 'lucide-react'

interface WordContainerProps {
  level: number
  setCount: React.Dispatch<React.SetStateAction<number>>
  onWordAdded?: () => void
  scrollRef: React.RefObject<HTMLDivElement | null>
  searchQuery: string
  filter: string
  hidePinyin?: boolean
  hideMeaning?: boolean
  onWordsLoaded?: (words: Word[]) => void
}

const WordContainer = ({
  level, 
  setCount, 
  onWordAdded, 
  scrollRef, 
  searchQuery, 
  filter,
  hidePinyin = false,
  hideMeaning = false,
  onWordsLoaded
}: WordContainerProps) => {
    const {loading, loadingAdd, getHskVocabPaginated, getHskVocabCount, addToReview} = useVocab()
    const [allWords, setAllWords] = useState<Word[]>([])
    const [reviewItems, setReviewItems] = useState<Map<string, ReviewItem>>(new Map())
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [addedId, setAddedId] = useState<string | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [revealedPinyin, setRevealedPinyin] = useState<Set<string>>(new Set())
    const [revealedMeaning, setRevealedMeaning] = useState<Set<string>>(new Set())

    const [page, setPage] = useState(0)
    const itemsPerPage = 50

    // Load favorites from localStorage
    useEffect(() => {
      try {
        const stored = localStorage.getItem("vocab_favorites")
        if (stored) {
          setFavorites(new Set(JSON.parse(stored)))
        }
      } catch (e) {
        console.error(e)
      }
    }, [])

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setFavorites(prev => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        try {
          localStorage.setItem("vocab_favorites", JSON.stringify(Array.from(next)))
        } catch (err) {
          console.error(err)
        }
        return next
      })
    }

    useEffect(() => {
       const loadInitData = async () => {
          const count = await getHskVocabCount(level)
          setCount(count)

          const reviews = await db.reviewItems.toArray()
          const reviewMap = new Map(reviews.map(r => [r.wordId, r]))
          setReviewItems(reviewMap)
       }
       loadInitData()
    }, [level, getHskVocabCount, setCount])
    
    useEffect(() => {
      const handleGetWords = async () => {
        const count = await getHskVocabCount(level)
        const res = await getHskVocabPaginated(level, 0, count || 5000)
        setAllWords(res)
        onWordsLoaded?.(res)

        const scroll = sessionStorage.getItem("vocab-scroll")
        if (scroll) {
          setTimeout(() => {
            scrollRef.current?.scrollTo(0, Number(scroll))
            sessionStorage.removeItem("vocab-scroll")
          }, 100)
        }
      }
      handleGetWords()
    }, [level, getHskVocabPaginated, getHskVocabCount, onWordsLoaded])

    const handleAddLearn = async (id: string) => {
      try {
        await addToReview(id)
        setAddedId(id)
        
        const newReview = await db.reviewItems.where('wordId').equals(id).first()
        if (newReview) {
          setReviewItems(prev => {
            const next = new Map(prev)
            next.set(id, newReview)
            return next
          })
        }

        onWordAdded?.()
        setToastMessage("Đã thêm vào lộ trình ôn tập ✓")
        setTimeout(() => {
          setAddedId(null)
          setToastMessage(null)
        }, 2000)
      } catch (error) {
        console.error(error)
      }
    }

    const playAudio = (text: string, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "zh-CN"
        utterance.rate = 0.85
        window.speechSynthesis.speak(utterance)
      }
    }

    const filteredWords = allWords.filter(w => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = q === "" || 
        w.hanzi.includes(q) || 
        (w.pinyin && w.pinyin.toLowerCase().includes(q)) || 
        (w.meanings_vi && w.meanings_vi.some(m => m.toLowerCase().includes(q))) ||
        (w.meanings && w.meanings.some(m => m.toLowerCase().includes(q)))
      
      if (!matchesSearch) return false

      const review = reviewItems.get(w.id)
      const status = review?.status || "new"
      
      if (filter === "all") return true
      if (filter === "studying" && (status === "learning" || status === "review")) return true
      if (filter === "new" && status === "new") return true
      if (filter === "mastered" && status === "mastered") return true
      if (filter === "favorites" && favorites.has(w.id)) return true
      
      return false
    })

    const totalPages = Math.ceil(filteredWords.length / itemsPerPage)
    const displayedWords = filteredWords.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

    useEffect(() => {
      setPage(0)
    }, [searchQuery, filter])

  return (
    <div className='flex flex-col h-full relative'>
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-china-jade text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          {toastMessage}
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4'>
        {loading && allWords.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted font-medium flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-china-red/30 border-t-china-red rounded-full animate-spin"></div>
            Đang tải dữ liệu từ vựng...
          </div>
        ) : (
            displayedWords.length > 0 ? (
              displayedWords.map((w) => {
                  const review = reviewItems.get(w.id)
                  const isAdded = !!review
                  const status = review?.status || 'new'
                  const isFav = favorites.has(w.id)
                  
                  let dotColor = 'bg-border'
                  if (status === 'mastered') dotColor = 'bg-china-jade'
                  else if (status === 'learning' || status === 'review') dotColor = 'bg-china-gold'

                  const isJustAdded = addedId === w.id
                  const isPinyinHidden = hidePinyin && !revealedPinyin.has(w.id)
                  const isMeaningHidden = hideMeaning && !revealedMeaning.has(w.id)

                  return (
                  <Link
                    key={w.id}
                    href={`/vocabulary/${w.id}`}
                    className={`flex flex-col border border-border bg-white p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden
                      ${isJustAdded ? 'ring-2 ring-china-jade/50 bg-china-jade/5 scale-[1.02]' : 'hover:shadow-xl hover:border-china-red/40 hover:-translate-y-1'}`}
                    onClick={() => {
                      sessionStorage.setItem("vocab-scroll", String(scrollRef.current?.scrollTop || 0))
                      sessionStorage.setItem("vocab-page", String(page))
                    }}>
                  
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      title={isFav ? "Bỏ yêu thích" : "Yêu thích"}
                      onClick={(e) => toggleFavorite(w.id, e)}
                      className={`p-1 rounded-full transition-colors ${
                        isFav ? "text-china-gold fill-china-gold" : "text-muted/40 hover:text-china-gold"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFav ? "fill-china-gold" : ""}`} />
                    </button>
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm`} title={`Trạng thái: ${status}`}></span>
                  </div>

                  <div className='flex flex-row items-start justify-between gap-3 mb-6 mt-2'>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-end gap-3 flex-wrap">
                          <h3 className={`font-serif font-bold text-china-ink group-hover:text-china-red transition-colors whitespace-nowrap ${
                            w.hanzi.length <= 1
                              ? 'text-5xl md:text-6xl'
                              : w.hanzi.length === 2
                              ? 'text-4xl md:text-5xl'
                              : w.hanzi.length === 3
                              ? 'text-3xl md:text-4xl'
                              : 'text-2xl md:text-3xl'
                          }`}>{w.hanzi}</h3>
                          {w.traditional && w.traditional !== w.hanzi && (
                            <p className='text-base md:text-xl text-muted font-serif mb-1 opacity-70'>{w.traditional}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span 
                            onClick={(e) => {
                              if (hidePinyin) {
                                e.preventDefault()
                                e.stopPropagation()
                                setRevealedPinyin(prev => new Set(prev).add(w.id))
                              }
                            }}
                            className={`text-lg font-medium text-china-red transition-all cursor-pointer ${
                              isPinyinHidden 
                                ? "blur-sm bg-china-red/10 px-2 rounded hover:blur-none" 
                                : ""
                            }`}
                            title={isPinyinHidden ? "Nhấn để xem Pinyin" : ""}
                          >
                            {w.pinyin}
                          </span>
                          <button 
                            title="Phát âm tiếng Trung"
                            onClick={(e) => playAudio(w.hanzi, e)}
                            className="p-1.5 text-muted hover:text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  </div>
                  
                  <div className="space-y-3 mt-auto">
                    {w.radical && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Bộ thủ</span>
                        <span className="text-sm font-serif bg-china-paper px-2 py-0.5 rounded border border-border">{w.radical}</span>
                      </div>
                    )}
                    
                    <div 
                      onClick={(e) => {
                        if (hideMeaning) {
                          e.preventDefault()
                          e.stopPropagation()
                          setRevealedMeaning(prev => new Set(prev).add(w.id))
                        }
                      }}
                      className="line-clamp-2 cursor-pointer"
                      title={isMeaningHidden ? "Nhấn để xem nghĩa" : ""}
                    >
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Ý nghĩa</span>
                      <span className={`text-sm font-medium text-china-ink transition-all ${
                        isMeaningHidden ? "blur-sm bg-china-paper px-2 py-0.5 rounded inline-block hover:blur-none" : ""
                      }`}>
                        {w.meanings_vi ? w.meanings_vi.join(", ") : w.meanings?.join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex gap-1.5 flex-wrap">
                        {w.partOfSpeech && w.partOfSpeech.slice(0,2).map((pos, i) => (
                          <span key={i} className='text-[10px] px-2 py-1 bg-gray-100 text-china-ink rounded font-semibold uppercase tracking-wider'>
                            {pos}
                          </span>
                        ))}
                      </div>
                      
                      <button onClick={(e) => {
                                e.stopPropagation(); e.preventDefault(); 
                                if (!isAdded) handleAddLearn(w.id);
                              }} 
                              disabled={isAdded}
                              className={`text-xs px-4 py-1.5 font-bold rounded-lg transition-all duration-300 ease-out border shadow-sm
                                          ${isAdded 
                                              ? "bg-gray-50 text-muted border-border cursor-not-allowed" 
                                              : loadingAdd === w.id
                                                ? "bg-china-red/70 text-white border-transparent"
                                                : "bg-white text-china-red border-china-red/30 hover:bg-china-red hover:text-white hover:border-china-red hover:shadow-md"
                                          }`}
                      > 
                        {isAdded ? "✓ Đang học" : loadingAdd === w.id ? "Đang thêm..." : "+ Ôn tập"} 
                      </button>
                    </div>
                  </div>
                </Link>
                )
              })
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted font-medium">
                <AlertCircle className="w-12 h-12 mb-4 text-border" />
                <p>Không tìm thấy từ vựng nào khớp với điều kiện lọc.</p>
              </div>
            )
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-2 py-8 mt-auto">
          <button 
            disabled={page === 0}
            onClick={() => { setPage(p => p - 1); scrollRef.current?.scrollTo(0, 0) }}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-border bg-white text-china-ink disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Trước
          </button>
          
          <div className="flex items-center gap-1 mx-2">
            {[...Array(totalPages)].map((_, i) => {
              if (i === 0 || i === totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
                return (
                  <button
                    key={i}
                    onClick={() => { setPage(i); scrollRef.current?.scrollTo(0, 0) }}
                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                      page === i 
                        ? 'bg-china-red text-white' 
                        : 'bg-white border border-border text-china-ink hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              }
              if (i === page - 2 || i === page + 2) {
                return <span key={i} className="text-muted">...</span>
              }
              return null
            })}
          </div>

          <button 
            disabled={page === totalPages - 1}
            onClick={() => { setPage(p => p + 1); scrollRef.current?.scrollTo(0, 0) }}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-border bg-white text-china-ink disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  )
}

export default WordContainer