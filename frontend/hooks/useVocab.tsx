import React, { useState, useCallback } from 'react'
import { wordRepository } from '../repositories/wordRepository'
import { db, ReviewItem, Word } from '../db/database'
import { reviewRepository } from '../repositories/reviewRepository'

export interface ReviewCard {
  word: Word
  reviewId: string
  status_learning: string
  reviewItem: ReviewItem
}

const useVocab = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingAdd, setLoadingAdd] = useState<string | null>(null)
  const [cards, setCards] = useState<ReviewCard[]>([])

  const { markKnown, markUnknown, markHard, markEasy } = reviewRepository

  const getHskVocab = useCallback(async (level: number): Promise<Word[]> => {
    try {
      setLoading(true)
      const words = await wordRepository.getByHsk(level)
      return words ?? []
    } catch (error) {
      console.error(error)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getHskVocabPaginated = useCallback(async (level: number, offset: number, limit: number): Promise<Word[]> => {
    try {
      setLoading(true)
      const words = await wordRepository.getByHskPaginated(level, offset, limit)
      return words ?? []
    } catch (error) {
      console.error(error)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getHskVocabCount = useCallback(async (level: number): Promise<number> => {
    try {
      return await wordRepository.getCountByHsk(level)
    } catch (error) {
      console.error(error)
      return 0
    }
  }, [])

  const getHskVocabIds = useCallback(async (level: number): Promise<string[]> => {
    try {
      return (await wordRepository.getIdsByHsk(level)) as string[]
    } catch (error) {
      console.error(error)
      return []
    }
  }, [])

  const addToReview = async (wordId: string) => {
    try {
      setLoadingAdd(wordId)
      return await reviewRepository.add(wordId)
    } finally {
      setLoadingAdd(null)
    }
  }

  const loadReview = useCallback(async (filter: "due" | "new" | "learning" | "review" | "mastered" | "all" = "due") => {
    try {
      setLoading(true)

      const reviewItems = await reviewRepository.getReviewsByFilter(filter)
      if (!reviewItems || reviewItems.length === 0) {
        setCards([])
        return []
      }

      // High-performance bulk lookup: 1 transaction instead of N sequential queries
      const wordIds = reviewItems.map(item => item.wordId)
      const words = await db.words.bulkGet(wordIds)
      const wordMap = new Map<string, Word>()
      words.forEach(w => {
        if (w) wordMap.set(w.id, w)
      })

      const result: ReviewCard[] = []
      for (const item of reviewItems) {
        const word = wordMap.get(item.wordId)
        if (!word) continue
        result.push({
          word,
          reviewId: item.id,
          status_learning: item.status,
          reviewItem: item,
        })
      }

      setCards(result)
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    getHskVocab,
    getHskVocabPaginated,
    getHskVocabCount,
    getHskVocabIds,
    addToReview,
    loadReview,
    loading,
    loadingAdd,
    cards,
    markKnown,
    markUnknown,
    markHard,
    markEasy,
  }
}

export default useVocab
