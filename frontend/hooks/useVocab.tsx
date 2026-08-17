import React, { useState } from 'react'
import {wordRepository} from '../repositories/wordRepository'
import { db, ReviewItem, Word } from '../db/database'
import { reviewRepository } from '../repositories/reviewRepository'

interface ReviewCard {
  word: Word
  reviewId: string
  status_learning: string
}

const useVocab = () => {
    const [loading, setLoading] = useState<Boolean>(false)
    const [loadingAdd, setLoadingAdd] = useState<string | null>(null) 
    const [cards, setCards] = useState<ReviewCard[]>([])

    const {getByHsk} = wordRepository
    const {markKnown, markUnknown, markHard, markEasy} = reviewRepository

    const getHskVocab = async(level: number): Promise<Word[]> => {
        try {
            setLoading(true)
            const words = await getByHsk(level)
            return words ?? []
        } catch (error) {
            setLoading(false)
            console.error(error)
            return []
        }finally{setLoading(false)}
    }
    
    const addToReview = async (
        wordId: string
        ) => {
        try {
            setLoadingAdd(wordId)
            return await reviewRepository.add(
            wordId
            )
        } finally {
            setLoadingAdd(null)
        }
    }

    const loadReview = async () => {
        try {
            setLoading(true)

            const reviewItems = await reviewRepository.getDueReviews()
            const result: ReviewCard[] = []

            for (const item of reviewItems) {
            const word = await db.words.get(item.wordId)
            if (!word) continue
            result.push({word, reviewId: item.id, status_learning: item.status})}

            setCards(result)
            
            return result
        } finally {
            setLoading(false)
        }
    }
  return{getHskVocab, addToReview, loadReview, loading, loadingAdd, cards, markKnown, markUnknown, markHard, markEasy}
}

export default useVocab