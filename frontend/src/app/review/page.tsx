"use client"

import { useEffect, useState } from "react"
import useVocab from "../../../hooks/useVocab"
import Link from "next/link"

export default function ReviewPage() {
  const {loading, cards, loadReview, markKnown, markUnknown, markHard, markEasy} = useVocab()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)


  useEffect(() => {
    loadReview()
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
    setShowAnswer(false)
  }, [cards])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading review...
        </div>
      </div>
    )
  }

  if (!cards.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-8">
        <div className="w-full max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-5xl">🎉</div>
          <h1 className="mb-2 text-2xl font-bold">
            No reviews for now
          </h1>
          <p className="text-sm text-gray-500">
            Bạn đã hoàn thành tất cả các từ cần ôn.
          </p>
          <Link className="text-sm text-gray-700 font-semibold hover:underline animate-pulse " href={'/dashboard'}>Check Your Achives</Link>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIndex]

  if (!currentCard) {
    return null
  }

  const total = cards.length
  const progress = ((currentIndex + 1) / total) * 100

  const handleResult = async (action: "again" | "hard" | "good" | "easy") => {
    try {
      if (action === "again") {
        await markUnknown(currentCard.reviewId)
      }

      if (action === "hard") {
        await markHard(currentCard.reviewId)
      }

      if (action === "good") {
        await markKnown(currentCard.reviewId)
      }

      if (action === "easy") {
        await markEasy(currentCard.reviewId)
      }

      if (currentIndex >= cards.length - 1) {
        await loadReview()
        return
      }

      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
    } catch (error) {
      console.error(
        "Review update error:",
        error
      )
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Review
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Ôn lại những từ bạn đang học
            </p>
          </div>

          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
            {currentIndex + 1} / {total}
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-black transition-all duration-300"
            style={{
              width: `${progress}%`
            }}
          />
        </div>
      </div>

      <div className="rounded-3xl border bg-white shadow-sm">
        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12">
          <div className="mb-10 text-center">
            <div className="mb-6 text-8xl font-semibold tracking-wide">
              {currentCard.word.hanzi}
              <p className="text-sm font-medium border-l-2 border-r-2 mt-4">Status: {currentCard.status_learning} word</p>
            </div>

            {showAnswer ? (
              <div className="space-y-3">
                <div className="text-2xl font-medium text-gray-700">
                  {currentCard.word.pinyin}
                </div>

                <div className="text-lg text-gray-500">
                  {currentCard.word.meanings.join(
                    ", "
                  )}
                </div>

                {currentCard.word.partOfSpeech
                  ?.length > 0 && (
                  <div className="text-sm text-gray-400">
                    {currentCard.word.partOfSpeech.join(
                      " · "
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() =>
                  setShowAnswer(true)
                }
                className="rounded-xl border px-8 py-3 text-sm font-medium transition hover:bg-gray-50"
              >
                Show answer
              </button>
            )}
          </div>
        </div>

        {showAnswer && (
          <div className="border-t bg-gray-50/70 p-6">
            <div className="mb-4 text-center text-sm text-gray-500">
              How well did you remember this word?
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                onClick={() =>
                  handleResult("again")
                }
                className="rounded-xl border border-red-200 bg-white px-4 py-4 transition hover:bg-red-50"
              >
                <div className="font-semibold text-red-600">
                  Again
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Không nhớ
                </div>
              </button>

              <button
                onClick={() =>
                  handleResult("hard")
                }
                className="rounded-xl border border-orange-200 bg-white px-4 py-4 transition hover:bg-orange-50"
              >
                <div className="font-semibold text-orange-600">
                  Hard
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Khó nhớ
                </div>
              </button>

              <button
                onClick={() =>
                  handleResult("good")
                }
                className="rounded-xl border border-green-200 bg-white px-4 py-4 transition hover:bg-green-50"
              >
                <div className="font-semibold text-green-600">
                  Good
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Nhớ được
                </div>
              </button>

              <button
                onClick={() =>
                  handleResult("easy")
                }
                className="rounded-xl border border-blue-200 bg-white px-4 py-4 transition hover:bg-blue-50"
              >
                <div className="font-semibold text-blue-600">
                  Easy
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Rất dễ
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}