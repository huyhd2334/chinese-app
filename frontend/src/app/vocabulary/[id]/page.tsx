"use client"

import { useEffect, useState } from "react"
import { wordRepository } from "../../../../repositories/wordRepository"
import type { Word } from "../../../../db/database"
import WritingPractice from "@/components/vocabulary/WritingPractice"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function WordDetailPage({ params }: PageProps) {
  const [word, setWord] = useState<Word | undefined>()

  useEffect(() => {
    const loadWord = async () => {
      const { id } = await params
      const result = await wordRepository.getById(id)
      setWord(result)
    }

    loadWord()
  }, [params])

  if (!word) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
      <div>
        <h1 className="text-2xl md:text-4xl">Word Details</h1>
        <hr className="mb-10 mt-2"></hr>
        <h1 className="text-xl md:text-9xl">
          {word.hanzi}
        </h1>

        <p className="text-base md:text-2xl">
          {word.pinyin}
        </p>

        <p>
          Meaning: {word.meanings.join(", ")}
        </p>
      </div>
            
      <div className="mt-8">
        <WritingPractice hanzi={word.hanzi} />
      </div>
    </div>
  )
}