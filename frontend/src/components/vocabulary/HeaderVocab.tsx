import React from 'react'
import { BookOpen } from 'lucide-react'

interface HeaderVocabProps {
  totalWords?: number;
  studyingWords?: number;
}

const HeaderVocab = ({ totalWords = 0, studyingWords = 0 }: HeaderVocabProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-china-red tracking-wider relative group cursor-pointer">
          <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 inline-block">词汇集</span>
          <span className="absolute -inset-1 bg-china-red/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full z-0"></span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="hidden sm:inline-block text-xs text-muted font-bold tracking-widest uppercase">
            Vocabulary
          </span>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold">
            <span className="px-2.5 py-0.5 bg-china-ink text-china-paper rounded-full shadow-xs">
              {totalWords} từ
            </span>
            <span className="px-2.5 py-0.5 bg-china-jade text-white rounded-full shadow-xs flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {studyingWords} đang học
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderVocab