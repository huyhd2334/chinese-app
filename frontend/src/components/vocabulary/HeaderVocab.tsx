import React from 'react'
import { BookOpen } from 'lucide-react'

interface HeaderVocabProps {
  totalWords?: number;
  studyingWords?: number;
}

const HeaderVocab = ({ totalWords = 0, studyingWords = 0 }: HeaderVocabProps) => {
  return (
    <div className="flex flex-col w-full gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-china-red tracking-widest relative group cursor-pointer">
          <span className="relative z-10 transition-transform duration-500 group-hover:scale-105 inline-block">词汇集</span>
          <span className="absolute -inset-2 bg-china-red/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full z-0"></span>
        </h1>
        <div className="flex flex-col gap-1 ml-4">
          <span className="text-sm text-china-ink/70 font-medium tracking-wide uppercase">Vocabulary</span>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-2 py-1 bg-china-ink text-china-paper rounded-full shadow-sm">
              Total {totalWords}
            </span>
            <span className="px-2 py-1 bg-china-jade text-white rounded-full shadow-sm flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {studyingWords} Studying
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderVocab