'use client'

import React, { useState } from 'react'
import { Volume2, Eye, EyeOff, BookOpen, Sparkles, X, Plus } from 'lucide-react'
import { CurriculumDialogue, CurriculumWord } from '@/types/curriculum'
import { getHanViet } from '@/utils/hanviet'
import { db } from '../../../db/database'

interface InteractiveReaderProps {
  dialogues: CurriculumDialogue[]
  vocabulary: CurriculumWord[]
  lessonTitle?: string
}

export default function InteractiveReader({
  dialogues,
  vocabulary,
  lessonTitle,
}: InteractiveReaderProps) {
  const [showPinyin, setShowPinyin] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)

  // Floating word popover state
  const [activeWordInfo, setActiveWordInfo] = useState<{
    hanzi: string
    pinyin?: string
    hanViet?: string
    meaning?: string
  } | null>(null)

  const playAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleWordClick = async (char: string) => {
    if (!char || !char.trim() || /[，。？！、\s0-9]/.test(char)) return

    playAudio(char)

    // Lookup in vocabulary list or db.words
    const foundInVocab = vocabulary.find((w) => w.hanzi === char || w.hanzi.includes(char))
    let pinyin = foundInVocab?.pinyin || ''
    let meaning = foundInVocab?.meaning || ''
    const hanViet = getHanViet(char) || ''

    if (!foundInVocab) {
      try {
        const dbWord = await db.words.where('hanzi').equals(char).first()
        if (dbWord) {
          pinyin = dbWord.pinyin || ''
          meaning = dbWord.meanings_vi?.[0] || dbWord.meanings?.[0] || ''
        }
      } catch (e) {
        console.warn(e)
      }
    }

    setActiveWordInfo({
      hanzi: char,
      pinyin,
      hanViet,
      meaning: meaning || 'Chạm để tra cứu thêm trong từ điển',
    })
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Reader Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-china-red/10 text-china-red flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-china-ink">Sách Bài Khóa Tương Tác</h3>
            <p className="text-[11px] text-muted">Bấm vào bất kỳ từ nào để tra nghĩa &amp; nghe phát âm</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPinyin((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              showPinyin
                ? 'bg-china-red/10 border-china-red/30 text-china-red'
                : 'bg-china-paper border-border text-muted hover:text-china-ink'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Pinyin</span>
          </button>

          <button
            onClick={() => setShowTranslation((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              showTranslation
                ? 'bg-china-red/10 border-china-red/30 text-china-red'
                : 'bg-china-paper border-border text-muted hover:text-china-ink'
            }`}
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Dịch nghĩa</span>
          </button>
        </div>
      </div>

      {/* Interactive Dialogue Bubbles */}
      <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-4">
        {dialogues && dialogues.length > 0 ? (
          dialogues.map((d, idx) => (
            <div
              key={d.id || idx}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-china-paper/60 border border-border/70 hover:bg-china-paper transition"
            >
              {d.role && (
                <div className="w-9 h-9 rounded-full bg-china-red text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {d.role}
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  {/* Clickable Hanzi characters */}
                  <div className="flex flex-wrap items-center gap-1 font-serif text-xl sm:text-2xl font-bold text-china-ink">
                    {Array.from(d.chinese).map((char, cIdx) => {
                      const isPunctuation = /[，。？！、\s]/.test(char)
                      if (isPunctuation) {
                        return <span key={cIdx} className="text-muted">{char}</span>
                      }
                      return (
                        <button
                          key={cIdx}
                          onClick={() => handleWordClick(char)}
                          className="hover:text-china-red hover:underline decoration-china-red decoration-2 underline-offset-4 cursor-pointer transition rounded px-0.5"
                          title="Bấm để xem từ điển"
                        >
                          {char}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => playAudio(d.chinese)}
                    className="p-1.5 rounded-xl text-muted hover:text-china-red hover:bg-white transition shrink-0"
                    title="Nghe câu này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {showPinyin && d.pinyin && (
                  <p className="text-xs font-medium text-china-red font-sans">
                    {d.pinyin}
                  </p>
                )}

                {showTranslation && d.vietnamese && (
                  <p className="text-xs font-medium text-slate-700 pt-0.5 leading-relaxed">
                    {d.vietnamese}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted text-xs">
            Chưa có bài khóa hội thoại trong bài học này.
          </div>
        )}
      </div>

      {/* Floating Word Card Popover */}
      {activeWordInfo && (
        <div className="p-4 bg-white border border-china-red/30 rounded-2xl shadow-lg flex items-start justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-3xl font-bold text-china-ink">
                {activeWordInfo.hanzi}
              </span>
              {activeWordInfo.pinyin && (
                <span className="text-sm font-bold text-china-red font-sans">
                  {activeWordInfo.pinyin}
                </span>
              )}
              {activeWordInfo.hanViet && (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Hán-Việt: {activeWordInfo.hanViet}
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-slate-800 pt-1">
              {activeWordInfo.meaning}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => playAudio(activeWordInfo.hanzi)}
              className="p-2 text-china-red hover:bg-china-red/10 rounded-xl transition"
              title="Nghe lại"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveWordInfo(null)}
              className="p-2 text-muted hover:text-china-ink hover:bg-neutral-100 rounded-xl transition"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
