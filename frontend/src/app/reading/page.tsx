"use client"
import { useEffect, useState } from "react"
import { readingRepository } from "../../../repositories/readingRepository"
import type { Reading } from "../../../db/database"

export default function ReadingPage() {
  const [questions, setQuestions] = useState<Reading[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadReading = async () => {
    setLoading(true)

    const data = await readingRepository.getRandomSet()

    if (data) {
      setQuestions(data.questions)
      setQuestionIndex(0)
      setSelected(null)
      setShowAnswer(false)
    } else {
      setQuestions([])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadReading()
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  if (!questions.length) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Reading</h1>
        <p className="mt-4">Bạn đã hoàn thành tất cả bài đọc 🎉</p>
      </main>
    )
  }

  const reading = questions[questionIndex]

  const handleAnswer = (index: number) => {
    if (showAnswer) return

    setSelected(index)
    setShowAnswer(true)
  }

  const handleNext = async () => {
    await readingRepository.complete(reading.id)

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1)
      setSelected(null)
      setShowAnswer(false)
    } else {
      await loadReading()
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 mt-3">
      <h1 className="text-3xl font-semibold mb-6">Reading Practice</h1>
      <hr></hr>
      <section className="border rounded-xl p-6 mb-6 mt-6">
        <p className="text-lg leading-9">
          {reading.passage}
        </p>
      </section>

      <section className="border rounded-xl p-6">
        <div className="flex justify-between mb-5">
          <h2 className="text-xl font-semibold">
            {reading.question}
          </h2>

          <span className="text-gray-500">
            {questionIndex + 1}/{questions.length}
          </span>
        </div>

        <div className="space-y-3">
          {reading.options.map((option, index) => {
            const isCorrect = index === reading.answerIndex
            const isSelected = selected === index

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border ${
                  showAnswer && isCorrect
                    ? "bg-green-100 border-green-500"
                    : showAnswer && isSelected
                      ? "bg-red-100 border-red-500"
                      : "hover:bg-gray-50"
                }`}
              >
                <b>{String.fromCharCode(65 + index)}.</b>{" "}
                {option}
              </button>
            )
          })}
        </div>

        {showAnswer && (
          <div className="mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">Explanation</p>
              <p className="mt-2">{reading.explanation}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg mt-3">
              <p className="font-semibold">Evidence</p>
              <p className="mt-2">{reading.evidence}</p>
            </div>

            {reading.vocabulary.length > 0 && (
              <div className="mt-5">
                <p className="font-semibold mb-3">Vocabulary</p>

                <div className="grid grid-cols-2 gap-3">
                  {reading.vocabulary.map(word => (
                    <div
                      key={word.word}
                      className="border rounded-lg p-3"
                    >
                      <p className="font-semibold">{word.word}</p>
                      <p className="text-gray-500">{word.pinyin}</p>
                      <p>{word.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full mt-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              {questionIndex === questions.length - 1
                ? "Next Reading →"
                : "Next Question →"}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}