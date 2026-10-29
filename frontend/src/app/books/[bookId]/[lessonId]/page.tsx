'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Layers,
  CheckCircle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Puzzle,
  RotateCw,
  HelpCircle,
  Bookmark,
  CheckCircle2,
  Trophy,
  ArrowUp,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react'
import { getBook, getLesson, getLessons } from '@/utils/curriculumStorage'
import { BookCourse, CurriculumLesson } from '@/types/curriculum'
import { db } from '../../../../../db/database'
import LessonFlashcards from '@/components/curriculum/LessonFlashcards'
import LessonExercises from '@/components/curriculum/LessonExercises'
import InteractiveReader from '@/components/curriculum/InteractiveReader'
import {
  getLessonProgress,
  saveLessonProgress,
  addLessonStudyTime,
  toggleLessonSection,
  markLessonComplete,
  formatStudyHours,
  LESSON_SECTIONS,
  LessonProgressData
} from '@/utils/lessonProgress'
import { playChineseAudio } from '@/utils/audioTts'

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = (params?.bookId as string) || ''
  const lessonId = (params?.lessonId as string) || ''

  const [book, setBook] = useState<BookCourse | null>(null)
  const [lesson, setLesson] = useState<CurriculumLesson | null>(null)
  const [allLessons, setAllLessons] = useState<CurriculumLesson[]>([])

  // Status for adding to Spaced Repetition
  const [addedReviewStatus, setAddedReviewStatus] = useState<string | null>(null)

  // Floating back to top button
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Lesson Progress & Study Hours Tracking
  const [progress, setProgress] = useState<LessonProgressData>({
    percent: 0,
    timeSpentSeconds: 0,
    completedSections: [],
    lastStudiedAt: 0,
  })

  useEffect(() => {
    if (bookId && lessonId) {
      const p = getLessonProgress(bookId, lessonId)
      setProgress(p)
    }
  }, [bookId, lessonId])

  // Real-time study timer: accumulate study seconds when user is actively on this tab
  useEffect(() => {
    if (!bookId || !lessonId) return

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        const newSec = addLessonStudyTime(bookId, lessonId, 5)
        setProgress((prev) => {
          const newPercent = prev.timeSpentSeconds < 30 && prev.percent === 0 ? 10 : prev.percent
          return {
            ...prev,
            timeSpentSeconds: newSec,
            percent: newPercent,
          }
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [bookId, lessonId])

  const handleToggleSection = (sectionId: string) => {
    if (!bookId || !lessonId) return
    const updated = toggleLessonSection(bookId, lessonId, sectionId)
    setProgress(updated)
  }

  const handleMarkComplete = () => {
    if (!bookId || !lessonId) return
    const updated = markLessonComplete(bookId, lessonId)
    setProgress(updated)
  }

  useEffect(() => {
    if (bookId) {
      const b = getBook(bookId)
      if (b) setBook(b)
      const list = getLessons(bookId)
      setAllLessons(list)
    }
    if (bookId && lessonId) {
      const l = getLesson(bookId, lessonId)
      if (l) setLesson(l)
    }
  }, [bookId, lessonId])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const playPronunciation = (text: string) => {
    playChineseAudio(text)
  }

  // Add all lesson vocabulary to Spaced Repetition review list in Dexie
  const handleAddAllToReview = async () => {
    if (!lesson || !lesson.vocabulary || lesson.vocabulary.length === 0) return

    try {
      const now = Date.now()
      let count = 0

      for (const w of lesson.vocabulary) {
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

      setAddedReviewStatus(`Đã nạp ${count > 0 ? count : lesson.vocabulary.length} từ vào hàng chờ Ôn tập!`)
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

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 hover:text-china-ink font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Giáo trình</span>
          </Link>
          <span className="text-border">/</span>
          <span className="font-medium text-slate-700">{book?.title || 'Giáo trình'}</span>
          <span className="text-border">/</span>
          <span className="text-china-ink font-semibold">Bài {lesson.lessonNumber}</span>
        </div>
      </div>

      {/* Lesson Header Banner */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-slate-700">
                HSK {book?.level || 1} • Bài {lesson.lessonNumber}
              </span>
              <span className="text-xs text-muted font-chinese" lang="zh">
                {book?.chineseTitle || '新HSK教程 1'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-0.5">
              <h1 className="text-2xl sm:text-3xl font-chinese font-bold text-china-ink" lang="zh">
                {lesson.title}
              </h1>
              {lesson.titlePinyin && (
                <span className="text-sm sm:text-base text-slate-500 font-normal">
                  {lesson.titlePinyin}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-700 font-medium">
              {lesson.titleVi}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5">
            <button
              onClick={handleAddAllToReview}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Thêm {lesson.vocabulary?.length || 0} từ vào Ôn tập</span>
            </button>
          </div>
        </div>

        {addedReviewStatus && (
          <div className="mt-4 p-3 bg-neutral-50 border border-border rounded-xl text-xs text-slate-700 flex items-center justify-between">
            <span className="font-medium">{addedReviewStatus}</span>
            <Link href="/review" className="underline font-semibold text-china-red">
              Xem danh sách ôn tập →
            </Link>
          </div>
        )}
      </div>

      {/* Tiến độ bài học & thời gian */}
      <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
              <span>Thời gian học:</span>
              <span className="font-bold text-china-ink font-mono">
                {formatStudyHours(progress.timeSpentSeconds)}
              </span>
            </div>
            <span className="text-border">•</span>
            <div className="text-xs">
              <span className="text-muted">Tiến độ: </span>
              <span className="font-bold text-china-ink">{progress.percent}%</span>
            </div>
          </div>

          {/* Quick Complete / Reset Action */}
          <div className="flex items-center gap-2">
            {progress.percent < 100 ? (
              <button
                onClick={handleMarkComplete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đánh dấu hoàn thành</span>
              </button>
            ) : (
              <button
                onClick={() => setProgress(saveLessonProgress(bookId, lessonId, { percent: 0, completedSections: [] }))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-slate-700 hover:bg-neutral-100 transition"
              >
                <RotateCw className="w-3 h-3" />
                <span>Học lại</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Chặng Mục Tiêu Trong Bài Học */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
          {LESSON_SECTIONS.map((sec, idx) => {
            const isDone = progress.completedSections?.includes(sec.id) || progress.percent >= 100
            return (
              <button
                key={sec.id}
                onClick={() => handleToggleSection(sec.id)}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  isDone
                    ? 'bg-neutral-50 border-slate-300 text-slate-800 font-semibold'
                    : 'bg-white border-border/70 text-muted hover:border-slate-300 hover:text-slate-700'
                }`}
                title="Bấm để đánh dấu phần này"
              >
                <span className="truncate">
                  {idx + 1}. {sec.label}
                </span>
                <span className={`text-[10px] shrink-0 ml-1 px-1 rounded ${
                  isDone ? 'text-emerald-700 font-bold' : 'text-muted'
                }`}>
                  {isDone ? '✓' : `+${sec.weight}%`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sticky Quick Nav Bar */}
      <div className="sticky top-2 z-20 bg-white/95 dark:bg-card/95 backdrop-blur-md border border-border rounded-xl p-1 shadow-xs flex items-center justify-between gap-1 overflow-x-auto text-xs font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={() => scrollToSection('sec-reader')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-china-ink dark:hover:text-white transition shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>I. Bài khóa</span>
        </button>

        <button
          onClick={() => scrollToSection('sec-vocab')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-china-ink dark:hover:text-white transition shrink-0 cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>II. Từ mới ({lesson.vocabulary?.length || 0})</span>
        </button>

        {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
          <button
            onClick={() => scrollToSection('sec-grammar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-china-ink dark:hover:text-white transition shrink-0 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>III. Ngữ pháp</span>
          </button>
        )}

        <button
          onClick={() => scrollToSection('sec-flashcards')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-china-ink dark:hover:text-white transition shrink-0 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>IV. Thẻ từ</span>
        </button>

        <button
          onClick={() => scrollToSection('sec-exercises')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-china-ink dark:hover:text-white transition shrink-0 cursor-pointer"
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span>V. Luyện tập</span>
        </button>
      </div>

      {/* PHẦN 1: BÀI KHÓA HỘI THOẠI & ĐOẠN VĂN */}
      <section id="sec-reader" className="space-y-4 pt-2 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
              I
            </span>
            <div>
              <h2 className="text-base font-bold text-china-ink">
                Bài khóa &amp; Đoạn văn đọc hiểu
              </h2>
              <p className="text-xs text-muted">
                Chạm vào từng chữ Hán để nghe phát âm và xem nghĩa
              </p>
            </div>
          </div>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {lesson.dialogues?.length || 0} câu hội thoại
          </span>
        </div>

        <InteractiveReader
          dialogues={lesson.dialogues || []}
          vocabulary={lesson.vocabulary}
          lessonTitle={lesson.title}
          readingPassage={lesson.readingPassage}
        />
      </section>

      {/* PHẦN 2: TỪ VỰNG BÀI HỌC */}
      <section id="sec-vocab" className="space-y-4 pt-4 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
              II
            </span>
            <div>
              <h2 className="text-base font-bold text-china-ink">
                Từ mới bài học
              </h2>
              <p className="text-xs text-muted">
                Từ vựng trọng tâm cần nhớ trong bài
              </p>
            </div>
          </div>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {lesson.vocabulary?.length || 0} từ vựng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.vocabulary.map((w, idx) => (
            <div
              key={w.id || idx}
              className="bg-white dark:bg-card border border-border hover:border-slate-300 dark:hover:border-slate-600 rounded-xl p-3.5 shadow-xs transition flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-neutral-100 dark:bg-white/10 text-muted dark:text-slate-400 text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>

                <div>
                  <div className="flex items-baseline gap-2">
                    <button
                      type="button"
                      onClick={() => playPronunciation(w.hanzi)}
                      className="font-chinese font-bold text-xl text-china-ink hover:text-china-red active:scale-95 transition cursor-pointer text-left"
                      lang="zh"
                      title="Chạm để nghe phát âm"
                    >
                      {w.hanzi}
                    </button>
                    <span className="text-xs font-semibold text-china-red">
                      {w.pinyin}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    {w.hanViet && (
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-white/10 px-1.5 py-0.2 rounded">
                        {w.hanViet}
                      </span>
                    )}
                    {w.partOfSpeech && (
                      <span className="text-[11px] text-muted italic">
                        ({w.partOfSpeech})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 font-medium">
                    {w.meaning}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => playPronunciation(w.hanzi)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-china-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition cursor-pointer"
                  title="Nghe phát âm"
                  aria-label={`Phát âm từ ${w.hanzi}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PHẦN 3: NGỮ PHÁP */}
      {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
        <section id="sec-grammar" className="space-y-4 pt-4 scroll-mt-16">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                III
              </span>
              <div>
                <h2 className="text-base font-bold text-china-ink">
                  Ngữ pháp &amp; Chú thích
                </h2>
                <p className="text-xs text-muted">
                  Giải thích cấu trúc câu và cách dùng từ
                </p>
              </div>
            </div>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {lesson.grammarNotes.length} điểm ngữ pháp
            </span>
          </div>

          <div className="bg-white dark:bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2.5">
            {lesson.grammarNotes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50/80 dark:bg-white/[0.04] border border-border/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-normal">{note}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PHẦN 4: THẺ FLASHCARD */}
      <section id="sec-flashcards" className="space-y-4 pt-4 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
              IV
            </span>
            <div>
              <h2 className="text-base font-bold text-china-ink">
                Luyện thẻ từ (Flashcard)
              </h2>
              <p className="text-xs text-muted">
                Lật thẻ ôn nhanh nghĩa và phiên âm
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-neutral-50/70 dark:bg-white/[0.03] border border-border rounded-2xl">
          <LessonFlashcards words={lesson.vocabulary} lessonTitle={lesson.title} />
        </div>
      </section>

      {/* PHẦN 5: BÀI TẬP THỰC HÀNH */}
      <section id="sec-exercises" className="space-y-4 pt-4 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
              V
            </span>
            <span className="w-6 h-6 rounded-md bg-neutral-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              V
            </span>
            <div>
              <h2 className="text-base font-bold text-china-ink">
                Bài tập thực hành
              </h2>
              <p className="text-xs text-muted">
                Nối từ, sắp xếp câu và luyện nghe theo bài học
              </p>
            </div>
          </div>
        </div>

        <LessonExercises
          words={lesson.vocabulary}
          dialogues={lesson.dialogues}
          lessonTitle={lesson.title}
          listeningExercises={lesson.listeningExercises}
        />
      </section>

      {/* FOOTER: BÀI TIẾP THEO */}
      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {prevLesson ? (
          <Link
            href={`/books/${bookId}/${prevLesson.id}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-border hover:bg-neutral-50 text-xs font-semibold text-slate-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bài trước: {prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/books/${bookId}/${nextLesson.id}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-semibold shadow-xs transition"
          >
            <span>Bài tiếp theo: Bài {nextLesson.lessonNumber} - {nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/books"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-semibold shadow-xs transition"
          >
            <Trophy className="w-4 h-4" />
            <span>Hoàn thành sách! Quay về tủ sách</span>
          </Link>
        )}
      </div>

      {/* Floating Scroll to Top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-china-ink text-white shadow-md hover:bg-black transition cursor-pointer"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
