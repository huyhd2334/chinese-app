'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Layers,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  Crop,
  ChevronRight,
  Plus
} from 'lucide-react'
import { getBook, getLesson } from '@/utils/curriculumStorage'
import { BookCourse, CurriculumLesson, CurriculumWord } from '@/types/curriculum'
import { db } from '../../../../../db/database'

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = (params?.bookId as string) || ''
  const lessonId = (params?.lessonId as string) || ''

  const [book, setBook] = useState<BookCourse | null>(null)
  const [lesson, setLesson] = useState<CurriculumLesson | null>(null)
  const [activeTab, setActiveTab] = useState<'vocab' | 'dialogue' | 'grammar'>('vocab')

  // Dialogue Display Toggles
  const [showPinyin, setShowPinyin] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)

  // Status for adding to Spaced Repetition
  const [addedReviewStatus, setAddedReviewStatus] = useState<string | null>(null)

  useEffect(() => {
    if (bookId) {
      const b = getBook(bookId)
      if (b) setBook(b)
    }
    if (bookId && lessonId) {
      const l = getLesson(bookId, lessonId)
      if (l) setLesson(l)
    }
  }, [bookId, lessonId])

  const playPronunciation = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  // Add all lesson vocabulary to Spaced Repetition review list in Dexie
  const handleAddAllToReview = async () => {
    if (!lesson || !lesson.vocabulary || lesson.vocabulary.length === 0) return

    try {
      const now = Date.now()
      let count = 0

      for (const w of lesson.vocabulary) {
        // Find or create word in db.words
        let wordRecord = await db.words.where('hanzi').equals(w.hanzi).first()

        let wordId = wordRecord?.id
        if (!wordId) {
          wordId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
          await db.words.put({
            id: wordId,
            hanzi: w.hanzi,
            pinyin: w.pinyin,
            meanings_vi: w.meaning ? [w.meaning] : [],
            meanings: [w.meaning || ''],
            hskLevel: [book?.level || 1],
            hskLevels: [book?.level || 1],
            sourceLevels: [`HSK${book?.level || 1}`],
            partOfSpeech: w.partOfSpeech ? [w.partOfSpeech] : [],
          })
        }

        // Check if already in reviewItems
        const existingReview = await db.reviewItems.where('wordId').equals(wordId).first()
        if (!existingReview) {
          await db.reviewItems.put({
            id: `rev_${wordId}`,
            wordId: wordId,
            status: 'new',
            dueAt: now,
            interval: 0,
            easeFactor: 2.5,
            repetitions: 0,
            correctCount: 0,
            wrongCount: 0,
            createdAt: now,
            updatedAt: now,
          })
          count++
        }
      }

      setAddedReviewStatus(`Đã thêm ${count > 0 ? count : lesson.vocabulary.length} từ vào hàng chờ Ôn tập!`)
      setTimeout(() => setAddedReviewStatus(null), 4000)
    } catch (e) {
      console.error(e)
      alert('Không thể thêm vào Ôn tập!')
    }
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted">Đang tải bài học...</p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-4 py-2 bg-china-red text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Giáo trình</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-3 text-xs text-muted">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 hover:text-china-ink font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tủ sách</span>
        </Link>
        <span className="text-border">/</span>
        <span className="font-medium text-china-ink">{book?.title || 'Giáo trình'}</span>
        <span className="text-border">/</span>
        <span className="text-china-red font-semibold">Bài {lesson.lessonNumber}</span>
      </div>

      {/* Lesson Hero Banner */}
      <div className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-china-red/10 text-china-red border border-china-red/20">
                Bài {lesson.lessonNumber}
              </span>
              <span className="text-xs text-muted">
                {book?.chineseTitle} • Cấp {book?.level || 1}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-serif font-bold text-china-ink">
                {lesson.title}
              </h1>
              {lesson.titlePinyin && (
                <span className="text-base text-china-red font-medium">
                  {lesson.titlePinyin}
                </span>
              )}
            </div>
            <p className="text-base font-medium text-slate-600 mt-1">
              {lesson.titleVi}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddAllToReview}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold transition shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Đưa toàn bộ vào Ôn tập</span>
            </button>

            <Link
              href={`/digitizer?book=${bookId}&lesson=${lesson.lessonNumber}`}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-china-paper hover:bg-neutral-100 border border-border text-xs font-semibold text-china-ink transition"
            >
              <Crop className="w-3.5 h-3.5 text-china-red" />
              <span>Số hóa thêm từ (OCR)</span>
            </Link>
          </div>
        </div>

        {addedReviewStatus && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <span className="font-semibold">{addedReviewStatus}</span>
            <Link href="/review" className="underline font-bold text-emerald-900">
              Vào trang Ôn tập ngay →
            </Link>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('vocab')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'vocab'
              ? 'bg-china-red text-white shadow-xs'
              : 'text-muted hover:text-china-ink hover:bg-neutral-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Từ vựng bài học ({lesson.vocabulary?.length || 0})</span>
        </button>

        {lesson.dialogues && lesson.dialogues.length > 0 && (
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'dialogue'
                ? 'bg-china-red text-white shadow-xs'
                : 'text-muted hover:text-china-ink hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bài khóa / Đoạn hội thoại ({lesson.dialogues.length})</span>
          </button>
        )}

        {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'grammar'
                ? 'bg-china-red text-white shadow-xs'
                : 'text-muted hover:text-china-ink hover:bg-neutral-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ngữ pháp &amp; Chú thích ({lesson.grammarNotes.length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: VOCABULARY */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {lesson.vocabulary.map((w, idx) => (
              <div
                key={w.id || idx}
                className="bg-white border border-border rounded-2xl p-4.5 shadow-xs hover:border-china-red/30 transition flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-china-paper text-muted text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-2xl text-china-ink">
                        {w.hanzi}
                      </span>
                      <span className="text-sm font-medium text-china-red font-sans">
                        {w.pinyin}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      {w.hanViet && (
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Âm HV: {w.hanViet}
                        </span>
                      )}
                      {w.partOfSpeech && (
                        <span className="text-[11px] text-muted italic">
                          ({w.partOfSpeech})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-800 mt-2 font-medium leading-relaxed">
                      {w.meaning}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => playPronunciation(w.hanzi)}
                    className="p-2 rounded-xl text-muted hover:text-china-red hover:bg-china-paper transition"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIALOGUE */}
      {activeTab === 'dialogue' && lesson.dialogues && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-china-ink">Đoạn hội thoại chuẩn</h3>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setShowPinyin((prev) => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                  showPinyin
                    ? 'bg-china-red/10 border-china-red/30 text-china-red'
                    : 'bg-china-paper border-border text-muted'
                }`}
              >
                {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Pinyin</span>
              </button>

              <button
                onClick={() => setShowTranslation((prev) => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                  showTranslation
                    ? 'bg-china-red/10 border-china-red/30 text-china-red'
                    : 'bg-china-paper border-border text-muted'
                }`}
              >
                {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Dịch nghĩa</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {lesson.dialogues.map((d, idx) => (
              <div
                key={d.id || idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-china-paper/60 border border-border/80 hover:bg-china-paper transition"
              >
                {d.role && (
                  <div className="w-8 h-8 rounded-full bg-china-red text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {d.role}
                  </div>
                )}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif font-bold text-lg text-china-ink">
                      {d.chinese}
                    </p>
                    <button
                      onClick={() => playPronunciation(d.chinese)}
                      className="p-1.5 text-muted hover:text-china-red rounded-lg transition"
                      title="Nghe đọc câu"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {showPinyin && d.pinyin && (
                    <p className="text-xs text-china-red font-medium">
                      {d.pinyin}
                    </p>
                  )}

                  {showTranslation && d.vietnamese && (
                    <p className="text-xs text-slate-600 font-medium pt-0.5">
                      {d.vietnamese}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GRAMMAR */}
      {activeTab === 'grammar' && lesson.grammarNotes && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-china-ink pb-2 border-b border-border">
            Điểm ngữ pháp &amp; Chú ý trong bài
          </h3>
          <ul className="space-y-3">
            {lesson.grammarNotes.map((note, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-china-paper/50 border border-border/70 text-xs text-china-ink leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-china-red/10 text-china-red font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
