"use client"

import { useEffect, useState } from "react"
import type { ListeningTriad } from "../../../db/database"
import { listeningRepository } from "../../../repositories/listeningRepository"

export default function ListeningPage() {
  const [question, setQuestion] = useState<ListeningTriad | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<"correct" | "false" | null>(null)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const fetchQuestion = async () => {
    setLoading(true)
    try {
      const data = await listeningRepository.getRandomUncompleted()
      setQuestion(data ?? null)
      setSelected(null)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestion()
    setShow(false)
  }, [])

  const handleSelect = async (choice: string, index: number) => {
    if (!question || selected !== null) return

    const letter = String.fromCharCode(65 + index)
    const isCorrect = letter === question.answer

    setSelected(choice)
    setResult(isCorrect ? "correct" : "false")

    await listeningRepository.complete(
      question.id,
      isCorrect ? "correct" : "false"
    )
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Listening</h1>
          <p className="mt-1 text-sm text-gray-500">Listen and choose the correct answer</p>
        </div>

        {question ? (
          <>
            <audio controls preload="none" className="mb-6 w-full" src={question.audio} />

            {question.audio_caption && (
              <div className="mb-6 rounded-xl bg-gray-50 p-4">
                <p className="mb-1 text-sm font-medium text-gray-500">Audio</p>
                <button className={`${show?"hidden":"underline"}`} onClick={() => {setShow(true)}}>Show</button>
                <p className={`${show?"":"hidden"}`}>{question.audio_caption}</p>
              </div>
            )}

            {question.image && (
              <div className="mb-6">
                <img src={question.image} alt={question.image_caption || "Listening image"} className="w-full rounded-xl" />
                {question.image_caption && <p className="mt-2 text-sm text-gray-500">{question.image_caption}</p>}
              </div>
            )}

            {question.context && (
              <div className="mb-6 rounded-xl border p-4">
                <p className="mb-1 text-sm font-medium text-gray-500">Context</p>
                <p>{question.context}</p>
              </div>
            )}

            <h2 className="mb-6 text-xl font-semibold">{question.question}</h2>

            <div className="space-y-3">
              {question.choices.map((choice, index) => {
                const letter = String.fromCharCode(65 + index)
                const isSelected = selected === choice
                const isCorrect = letter === question.answer

                let style = "border-gray-200 hover:bg-gray-50"

                if (selected !== null) {
                  if (isCorrect) style = "border-green-500 bg-green-50 text-green-700"
                  else if (isSelected) style = "border-red-500 bg-red-50 text-red-700"
                }

                return (
                  <button
                    key={choice}
                    disabled={selected !== null}
                    onClick={() => handleSelect(choice, index)}
                    className={`w-full rounded-xl border p-4 text-left transition ${style}`}
                  >
                    <span className="mr-3 font-semibold">{letter}.</span>
                    {choice}
                  </button>
                )
              })}
            </div>

            {result && (
              <>
                <div className={`mt-6 rounded-xl p-4 font-semibold ${result === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {result === "correct" ? "✓ Correct!" : `✗ Incorrect — Answer: ${question.answer}`}
                </div>

                <button
                  onClick={fetchQuestion}
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white hover:opacity-80 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Next question →"}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="py-20 text-center text-gray-500">
            {loading ? "Loading question..." : "No listening question"}
          </div>
        )}
      </div>
    </main>
  )
}