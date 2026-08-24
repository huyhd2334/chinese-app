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
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-sm text-china-ink animate-pulse">Loading word details...</div>
      </div>
    )
  }

  return (
    <div className="h-full min-h-0 flex flex-col p-4 md:p-8 bg-china-paper/30 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-china-ink hover:text-china-red bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to List
        </button>
        <h1 className="text-2xl font-serif font-bold text-china-red">Word Details</h1>
        <div className="w-[100px]" /> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Column - Word Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-china-red/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-china-gold/10 rounded-tr-full -ml-8 -mb-8 transition-transform group-hover:scale-110"></div>
            
            {/* Tags */}
            <div className="absolute top-4 left-4 flex gap-2">
              {word.hskLevel && word.hskLevel.length > 0 && (
                <span className="px-3 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-lg border border-china-red/20">
                  HSK {word.hskLevel[0]}
                </span>
              )}
            </div>

            <h1 className="text-7xl md:text-[9rem] font-serif font-bold text-china-ink mt-8 mb-4 relative z-10 leading-none">
              {word.hanzi}
            </h1>
            
            {word.traditional && word.traditional !== word.hanzi && (
              <p className="text-xl md:text-2xl font-serif text-muted mb-2 relative z-10">
                {word.traditional} <span className="text-sm font-sans">(Phồn thể)</span>
              </p>
            )}

            <p className="text-2xl md:text-4xl font-medium text-china-red relative z-10">
              {word.pinyin}
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-semibold text-china-ink mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-china-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              Meaning & Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted mb-1 uppercase tracking-wider font-semibold">Vietnamese</p>
                <p className="text-lg text-china-ink font-medium">
                  {word.meanings_vi ? word.meanings_vi.join(", ") : "No translation available"}
                </p>
              </div>

              {word.meanings && word.meanings.length > 0 && (
                <div>
                  <p className="text-sm text-muted mb-1 uppercase tracking-wider font-semibold">English</p>
                  <p className="text-base text-china-ink">
                    {word.meanings.join(", ")}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                {word.partOfSpeech && word.partOfSpeech.length > 0 && (
                  <div>
                    <p className="text-sm text-muted mb-1 uppercase tracking-wider font-semibold">Part of Speech</p>
                    <div className="flex flex-wrap gap-1">
                      {word.partOfSpeech.map((pos, idx) => (
                        <span key={idx} className="px-2 py-1 bg-border/50 text-china-ink text-xs rounded-md font-medium">
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {word.classifiers && word.classifiers.length > 0 && (
                  <div>
                    <p className="text-sm text-muted mb-1 uppercase tracking-wider font-semibold">Classifiers</p>
                    <p className="text-sm font-serif text-china-ink font-bold text-lg">{word.classifiers}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Writing Practice */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <h3 className="text-xl font-serif font-semibold text-china-ink flex items-center gap-2">
                <svg className="w-5 h-5 text-china-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Writing Practice
              </h3>
              <p className="text-xs text-muted font-medium bg-border/30 px-3 py-1 rounded-full">Interactive Canvas</p>
            </div>
            
            <div className="flex-1 min-h-[400px]">
              <WritingPractice hanzi={word.hanzi} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}