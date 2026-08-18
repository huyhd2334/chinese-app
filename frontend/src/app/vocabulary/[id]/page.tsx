"use client"

import { useEffect, useState } from "react"
import { wordRepository } from "../../../../repositories/wordRepository"
import type { Word } from "../../../../db/database"
import WritingPractice from "@/components/vocabulary/WritingPractice"
import { useRouter } from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function WordDetailPage({ params }: PageProps) {
  const [word, setWord] = useState<Word | undefined>()
  const router = useRouter()

  useEffect(() => {
    const loadWord = async () => {
      const { id } = await params
      const result = await wordRepository.getById(id)
      setWord(result)
    }

    loadWord()
  }, [params])

  const handleBack = () => {
    router.back()
  }

  if (!word) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
      <div>
        <div className="flex flex-row gap-4">
          <h1 className="text-2xl md:text-4xl">Word Details</h1>
          <button
            className="text-sm border border-gray-300 pl-1 pr-1 rounded-lg"
            onClick={handleBack}
          >
            Back
          </button>
        </div>

        <hr className="mb-10 mt-2" />

        <h1 className="text-xl md:text-9xl">{word.hanzi}</h1>

        <p className="text-base md:text-2xl">{word.pinyin}</p>

        <p>Meaning: {word.meanings.join(", ")}</p>
      </div>

      <div className="mt-8">
        <WritingPractice hanzi={word.hanzi} />
      </div>
    </div>
  )
}