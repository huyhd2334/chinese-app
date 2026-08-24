"use client"
import React, { useEffect, useState } from 'react'
import useVocab from '../../../hooks/useVocab'
import type { Word } from "../../../db/database"
import { db } from "../../../db/database"
import Link from 'next/link'

interface WordContainerProps {
  level: number
  setCount: React.Dispatch<React.SetStateAction<number>>
  onWordAdded?: () => void
  scrollRef: React.RefObject<HTMLDivElement | null>
}

const WordContainer = ({level, setCount, onWordAdded, scrollRef}: WordContainerProps) => {
    const {loading, loadingAdd, getHskVocabPaginated, getHskVocabCount, addToReview} = useVocab()
    const [words, setWords] = useState<Word[]>([])
    const [addedId, setAddedId] = useState<string | null>(null)
    const [addedWords, setAddedWords] = useState<Set<string>>(new Set())

    const [page, setPage] = useState(0)
    const [totalWords, setTotalWords] = useState(0)
    const itemsPerPage = 100

    // Load total count and added words initially or when level changes
    useEffect(() => {
       const loadInitData = async () => {
          const count = await getHskVocabCount(level)
          setTotalWords(count)
          setCount(count)

          const reviews = await db.reviewItems.toArray()
          setAddedWords(new Set(reviews.map(r => r.wordId)))
       }
       loadInitData()
    }, [level, getHskVocabCount, setCount])
    
    // Fetch paginated words when page or level changes
    useEffect(() => {
      const handleGetWords = async () => {
        const savedPage = sessionStorage.getItem("vocab-page")
        const targetPage = savedPage ? Number(savedPage) : page

        if (savedPage) {
           setPage(targetPage)
           sessionStorage.removeItem("vocab-page")
        }

        const res = await getHskVocabPaginated(level, targetPage * itemsPerPage, itemsPerPage)
        setWords(res)

        const scroll = sessionStorage.getItem("vocab-scroll")
        if (scroll) {
          setTimeout(() => {
            scrollRef.current?.scrollTo(0, Number(scroll))
            sessionStorage.removeItem("vocab-scroll")
          }, 100)
        }
      }

      handleGetWords()
    }, [level, page, getHskVocabPaginated])

  const handleAddLearn = async (id: string) => {
    try {
      await addToReview(id)
      setAddedId(id)
      setAddedWords(prev => new Set(prev).add(id))
      onWordAdded?.()
      setTimeout(() => {
        setAddedId(null)
      }, 1200)
    } catch (error) {
      console.error(error)
    }
  }

  const totalPages = Math.ceil(totalWords / itemsPerPage)
  const displayedWords = words

  return (
    <div className='flex flex-col h-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4'>
        {loading?(<div className="col-span-full py-10 text-center text-muted font-medium">Loading......</div>):(
            displayedWords.length > 0 ?(
              displayedWords.map((w, idx) => {
                  const isAdded = addedWords.has(w.id)
                  return (
                  <Link
                  key={w.id}
                  href={`/vocabulary/${w.id}`}
                  className="flex flex-col border border-border bg-card p-5 rounded-2xl hover:shadow-md hover:border-china-red/30 transition-all group relative overflow-hidden"
                  onClick={() => {
                    sessionStorage.setItem("vocab-scroll", String(scrollRef.current?.scrollTop || 0))
                    sessionStorage.setItem("vocab-page", String(page))
                  }}>                
                  <div className='flex flex-row items-start justify-between gap-3 mb-4'>
                      <div className="flex items-end gap-2">
                        <h3 className='text-4xl md:text-5xl font-serif font-bold text-china-ink group-hover:text-china-red transition-colors'>{w.hanzi}</h3>
                        <p className='text-sm md:text-lg text-muted font-serif mb-1'>{w.traditional}</p>
                      </div>
                      <button onClick={(e) => {
                                e.stopPropagation(); e.preventDefault(); 
                                if (!isAdded) handleAddLearn(w.id);
                              }} 
                              disabled={isAdded}
                              className={`text-xs px-3 py-1 font-medium rounded-full transition-all duration-300 ease-out border 
                                          ${isAdded 
                                              ? "bg-china-jade/10 text-china-jade border-china-jade/30 cursor-not-allowed" 
                                              : loadingAdd === w.id
                                                ? "bg-china-red/70 text-white border-transparent"
                                                : "bg-white text-china-red border-china-red hover:bg-china-red hover:text-white"
                                          }`}
                      > 
                        {isAdded ? "✓ Studying" : loadingAdd === w.id ? "..." : "+ Add"} 
                      </button>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className='text-sm font-medium text-china-ink'><span className="text-muted font-normal mr-1">Pinyin:</span> {w.pinyin}</p>
                    <p className='text-sm font-medium text-china-ink'><span className="text-muted font-normal mr-1">Meaning:</span> {w.meanings_vi ? w.meanings_vi.join(", ") : w.meanings.join(", ")}</p>
                    {(w.classifiers && w.classifiers.length > 0) && <p className='text-sm text-china-ink'><span className="text-muted font-normal mr-1">Classifiers:</span> {w.classifiers}</p>}
                    {(w.partOfSpeech && w.partOfSpeech.length > 0) && <p className='text-xs inline-block mt-2 px-2 py-1 bg-border/50 text-china-ink rounded-md font-medium'>{w.partOfSpeech.join(" · ")}</p>}
                  </div>
                </Link>
                )
              })
            ):(<div className="col-span-full py-10 text-center text-muted font-medium">No words found.</div>)
        )}
      </div>

      {totalPages > 1 && !loading && (
        <div className="flex shrink-0 items-center justify-center gap-4 py-6 border-t border-border mt-auto">
          <button 
            disabled={page === 0}
            onClick={() => { setPage(p => p - 1); scrollRef.current?.scrollTo(0, 0) }}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-china-ink disabled:opacity-50 hover:bg-border/50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-muted">
            Page {page + 1} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages - 1}
            onClick={() => { setPage(p => p + 1); scrollRef.current?.scrollTo(0, 0) }}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-china-ink disabled:opacity-50 hover:bg-border/50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default WordContainer