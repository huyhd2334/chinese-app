'use client'

import React, { useState } from 'react'
import {
  Volume2,
  Eye,
  EyeOff,
  BookOpen,
  X,
  Plus,
  FileText,
  MessageSquare,
  Play,
  Square
} from 'lucide-react'
import {
  CurriculumDialogue,
  CurriculumWord,
  CurriculumReadingPassage
} from '@/types/curriculum'
import { getHanViet } from '@/utils/hanviet'
import { db } from '../../../db/database'

interface InteractiveReaderProps {
  dialogues: CurriculumDialogue[]
  vocabulary: CurriculumWord[]
  lessonTitle?: string
  readingPassage?: CurriculumReadingPassage
}

export default function InteractiveReader({
  dialogues,
  vocabulary,
  lessonTitle,
  readingPassage,
}: InteractiveReaderProps) {
  // Default to 'passage' if available so user immediately sees the reading text
  const [activeTab, setActiveTab] = useState<'passage' | 'dialogue'>('passage')
  const [showPinyin, setShowPinyin] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [isPlayingPassage, setIsPlayingPassage] = useState(false)

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

  const handlePlayFullPassage = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !readingPassage) return

    if (isPlayingPassage) {
      window.speechSynthesis.cancel()
      setIsPlayingPassage(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(readingPassage.content)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.82
    utterance.onend = () => setIsPlayingPassage(false)
    utterance.onerror = () => setIsPlayingPassage(false)
    setIsPlayingPassage(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleWordClick = async (char: string) => {
    if (!char || !char.trim() || /[，。？！、“”‘’\s0-9:：]/.test(char)) return

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
        {/* Switch View Tabs */}
        <div className="flex items-center gap-1.5 bg-china-paper p-1 rounded-xl border border-border/80">
          <button
            onClick={() => setActiveTab('passage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'passage'
                ? 'bg-china-red text-white shadow-xs'
                : 'text-muted hover:text-china-ink'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Đoạn văn đọc hiểu (短文)</span>
          </button>

          <button
            onClick={() => setActiveTab('dialogue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'dialogue'
                ? 'bg-china-red text-white shadow-xs'
                : 'text-muted hover:text-china-ink'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Hội thoại phân vai ({dialogues?.length || 0})</span>
          </button>
        </div>

        {/* Visibility Toggles */}
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

      {/* ========================================================= */}
      {/* TAB 1: ĐOẠN VĂN ĐỌC HIỂU (READING PASSAGE / 短文阅读) */}
      {/* ========================================================= */}
      {activeTab === 'passage' && (
        <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {readingPassage ? (
            <div className="space-y-6">
              {/* Passage Title & Audio Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
                <div>
                  <span className="text-[11px] font-bold text-china-red uppercase tracking-wider">
                    HSK 3.0 • 短文阅读 (Đoạn văn đọc hiểu)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-china-ink mt-0.5">
                    {readingPassage.title || lessonTitle}
                  </h3>
                </div>

                <button
                  onClick={handlePlayFullPassage}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs self-start sm:self-auto ${
                    isPlayingPassage
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-china-red text-white hover:bg-china-red/90'
                  }`}
                >
                  {isPlayingPassage ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Dừng phát âm</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Nghe toàn bộ bài đọc</span>
                    </>
                  )}
                </button>
              </div>

              {/* Chinese Passage Content with interactive clickable characters */}
              <div className="p-6 rounded-2xl bg-china-paper/60 border border-border/80">
                <p className="text-xs text-muted mb-4 font-sans flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-china-red"></span>
                  <span>Bấm vào từng chữ Hán để tra cứu từ điển và nghe phát âm chuẩn:</span>
                </p>

                <div className="text-2xl sm:text-3xl font-serif text-china-ink leading-[2.3] sm:leading-[2.4] tracking-wide select-text">
                  {Array.from(readingPassage.content).map((char, cIdx) => {
                    const isPunctuation = /[，。？！、“”‘’\s:：]/.test(char)
                    if (isPunctuation) {
                      return (
                        <span key={cIdx} className="text-muted/80 font-serif">
                          {char}
                        </span>
                      )
                    }
                    return (
                      <button
                        key={cIdx}
                        onClick={() => handleWordClick(char)}
                        className="hover:text-china-red hover:bg-china-red/5 hover:underline decoration-china-red decoration-2 underline-offset-4 cursor-pointer transition rounded px-0.5"
                        title="Bấm tra từ điển"
                      >
                        {char}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Pinyin Transcription */}
              {showPinyin && readingPassage.pinyin && (
                <div className="p-4 sm:p-5 rounded-2xl bg-china-paper border border-border space-y-1.5">
                  <span className="text-[11px] font-bold text-china-red uppercase tracking-wider block">
                    Phiên âm Pinyin:
                  </span>
                  <p className="text-xs sm:text-sm text-china-ink font-sans leading-relaxed">
                    {readingPassage.pinyin}
                  </p>
                </div>
              )}

              {/* Vietnamese Translation */}
              {showTranslation && readingPassage.vietnamese && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border space-y-1.5">
                  <span className="text-[11px] font-bold text-china-ink/70 uppercase tracking-wider block">
                    Bản dịch tiếng Việt tham khảo:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {readingPassage.vietnamese}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-muted text-xs">
              Đang tải đoạn văn đọc hiểu của bài học...
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: HỘI THOẠI PHÂN VAI (DIALOGUES / 课文对话) */}
      {/* ========================================================= */}
      {activeTab === 'dialogue' && (
        <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-4">
          {dialogues && dialogues.length > 0 ? (
            dialogues.map((d, idx) => (
              <div
                key={d.id || idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-china-paper/60 border border-border/70 hover:bg-china-paper transition"
              >
                {d.role && (
                  <div className="px-2.5 py-1.5 rounded-xl bg-china-red/10 text-china-red border border-china-red/20 font-serif font-bold text-xs shrink-0 whitespace-nowrap">
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
                          return (
                            <span key={cIdx} className="text-muted">
                              {char}
                            </span>
                          )
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
      )}

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

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => playAudio(activeWordInfo.hanzi)}
              className="p-2 rounded-xl bg-china-paper hover:bg-china-red/10 text-china-ink hover:text-china-red transition"
              title="Phát âm lại"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveWordInfo(null)}
              className="p-2 rounded-xl hover:bg-neutral-100 text-muted transition"
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
