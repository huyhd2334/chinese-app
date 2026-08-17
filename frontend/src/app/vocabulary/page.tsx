"use client"

import HeaderVocab from "@/components/vocabulary/HeaderVocab"
import WordContainer from "@/components/vocabulary/WordContainer"
import { useState } from "react"

const Page = () => {
  const levels = 7
  const [level, setLevel] = useState(1)
  const [count, setCount] = useState(0)
  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* Header */}
      <header className="flex shrink-0 justify-between px-8 pt-8 text-4xl items-end">
        <HeaderVocab />
        <div className="text-sm text-gray-600">Hsk{level} - Total words: {count}</div>
      </header>

      <hr className="mx-auto my-4 w-[95%] shrink-0 border-t border-gray-300" />

      {/* HSK tabs */}
      <div className="flex shrink-0 gap-2.5 px-8 pt-4">
        {[...Array(levels)].map((_, index) => {
          const lv = index + 1
          return (<button key={lv} onClick={() => setLevel(lv)}
              className={`border-b-2 border-transparent
                ${level === lv ? "border-b-red-400" : ""}`}
            >
              HSK {lv}
            </button>
          )
        })}
      </div>

      <hr className="mx-auto my-4 w-[95%] shrink-0 border-t border-gray-300" />

      <div className="min-h-0 flex-1 overflow-y-auto px-8 mt-5">
        <WordContainer level={level} setCount={setCount} />
      </div>

    </div>
  )
}

export default Page