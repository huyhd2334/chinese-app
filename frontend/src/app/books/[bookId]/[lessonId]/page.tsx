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
            <span>Tủ sách</span>
          </Link>
          <span className="text-border">/</span>
          <span className="font-medium text-china-ink">{book?.title || 'Giáo trình'}</span>
          <span className="text-border">/</span>
          <span className="text-china-red font-semibold">Bài {lesson.lessonNumber}</span>
        </div>
      </div>

      {/* Book Cover Header Banner with Mascot Tiểu Lu Đạo Sĩ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-china-paper to-amber-50/40 border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-china-red text-white shadow-xs">
                HSK 3.0 • Bài {lesson.lessonNumber}
              </span>
              <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-border">
                {book?.chineseTitle || '新HSK教程 1 (3.0)'} • Cấp {book?.level || 1}
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-china-ink tracking-tight" lang="zh">
                {lesson.title}
              </h1>
              {lesson.titlePinyin && (
                <span className="text-base sm:text-lg text-china-red font-medium font-sans">
                  {lesson.titlePinyin}
                </span>
              )}
            </div>

            <p className="text-base text-slate-700 font-medium">
              {lesson.titleVi}
            </p>

            <p className="text-xs text-muted pt-1 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-china-red" />
              <span>Dạng sách tương tác: Bài khóa đọc hiểu đặt trên đầu trang. Chạm vào chữ Hán để nghe đọc và làm bài tập ngay!</span>
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-center gap-3">
            <button
              onClick={handleAddAllToReview}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Đưa {lesson.vocabulary?.length || 0} từ vào Ôn tập</span>
            </button>

            {/* Mascot Tiểu Lu Đạo Sĩ Thanh Vân */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 border border-border shadow-2xs">
              <div className="w-10 h-10 shrink-0">
                <Image
                  src="/chibi-taoist.svg"
                  alt="Tiểu Lu Đạo Sĩ"
                  width={40}
                  height={40}
                  priority
                  className="object-contain"
                />
              </div>
              <div className="text-[11px] leading-tight text-left">
                <p className="font-bold text-china-ink">Tiểu Lu Đạo Sĩ</p>
                <p className="text-muted text-[10px]">Cùng bạn luyện đọc</p>
              </div>
            </div>
          </div>
        </div>

        {addedReviewStatus && (
          <div className="relative z-10 mt-4 p-3.5 bg-china-paper border border-china-gold/40 rounded-2xl text-xs text-china-ink flex items-center justify-between">
            <span className="font-semibold text-china-red">{addedReviewStatus}</span>
            <Link href="/review" className="underline font-bold text-china-red">
              Vào trang Ôn tập Spaced Repetition ngay →
            </Link>
          </div>
        )}

        {/* Watermark character */}
        <div className="absolute right-[-10px] bottom-[-25px] font-chinese text-[130px] font-bold text-black/[0.03] select-none pointer-events-none" lang="zh">
          {lesson.title.slice(0, 2)}
        </div>
      </div>

      {/* ======================================================== */}
      {/* THANH TIẾN ĐỘ & SỐ GIỜ HỌC CỦA BÀI (PROGRESS & STUDY HOURS) */}
      {/* ======================================================== */}
      <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-china-red flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Tiến độ bài học
              </span>
              {progress.percent >= 100 ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Đã hoàn thành 100%
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-china-paper border border-border text-china-ink">
                  Đang học ({progress.percent}%)
                </span>
              )}
            </div>

            {/* Số giờ học */}
            <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-700">
              <Clock className="w-4 h-4 text-china-red shrink-0" />
              <span className="font-semibold">Thời gian học bài này:</span>
              <span className="font-bold text-china-ink bg-china-paper px-2.5 py-0.5 rounded-md border border-border font-mono text-xs">
                {formatStudyHours(progress.timeSpentSeconds)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đang ghi nhận
              </span>
            </div>
          </div>

          {/* Quick Complete / Reset Action */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {progress.percent < 100 ? (
              <button
                onClick={handleMarkComplete}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-china-paper hover:bg-china-red hover:text-white border border-border text-china-ink text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-china-red" />
                <span>Đánh dấu hoàn thành (100%)</span>
              </button>
            ) : (
              <button
                onClick={() => setProgress(saveLessonProgress(bookId, lessonId, { percent: 0, completedSections: [] }))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted hover:text-china-ink hover:bg-china-paper transition"
                title="Bấm nếu muốn học lại từ đầu"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Học lại từ đầu</span>
              </button>
            )}
          </div>
        </div>

        {/* Thanh Tiến Độ Chi Tiết */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-china-ink">Hoàn thành các nội dung trọng tâm</span>
            <span className="text-china-red font-mono text-sm">{progress.percent}%</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden p-0.5 border border-border/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress.percent >= 100
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-china-red via-china-red/90 to-china-gold'
              }`}
              style={{ width: `${Math.max(progress.percent, progress.timeSpentSeconds > 0 ? 5 : 0)}%` }}
            />
          </div>
        </div>

        {/* 5 Chặng Mục Tiêu Trong Bài Học */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {LESSON_SECTIONS.map((sec, idx) => {
            const isDone = progress.completedSections?.includes(sec.id) || progress.percent >= 100
            return (
              <button
                key={sec.id}
                onClick={() => handleToggleSection(sec.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                  isDone
                    ? 'bg-china-red/10 border-china-red/40 text-china-red font-bold shadow-2xs'
                    : 'bg-china-paper/60 border-border/80 text-muted hover:border-china-ink/30 hover:text-china-ink'
                }`}
                title="Bấm để tích hoàn thành phần này"
              >
                <span className="truncate">
                  {idx + 1}. {sec.label}
                </span>
                <span className={`text-[10px] shrink-0 font-bold ml-1 px-1.5 py-0.5 rounded ${
                  isDone ? 'bg-china-red text-white' : 'bg-neutral-200/80 text-muted'
                }`}>
                  {isDone ? '✓' : `+${sec.weight}%`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sticky Table of Contents Quick Nav Bar (BÀI KHÓA LÊN ĐẦU TIÊN) */}
      <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md border border-border/90 rounded-2xl p-1.5 shadow-sm flex items-center justify-between gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => scrollToSection('sec-reader')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-china-red" />
          <span>I. Bài Khóa &amp; Đọc Hiểu</span>
        </button>

        <button
          onClick={() => scrollToSection('sec-vocab')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0 cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-china-ink" />
          <span>II. Từ Mới ({lesson.vocabulary?.length || 0})</span>
        </button>

        {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
          <button
            onClick={() => scrollToSection('sec-grammar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-china-gold" />
            <span>III. Ngữ Pháp</span>
          </button>
        )}

        <button
          onClick={() => scrollToSection('sec-flashcards')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-china-ink" />
          <span>IV. Flashcard 3D</span>
        </button>

        <button
          onClick={() => scrollToSection('sec-exercises')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-china-red/10 text-china-red hover:bg-china-red hover:text-white transition shrink-0 font-bold cursor-pointer"
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span>V. Bài Tập &amp; Luyện Nghe</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* PHẦN 1: SÁCH BÀI KHÓA HỘI THOẠI & ĐOẠN VĂN (ĐƯỢC ĐƯA LÊN ĐẦU TRANG) */}
      {/* ======================================================== */}
      <section id="sec-reader" className="space-y-4 pt-2 scroll-mt-16">
        <div className="flex items-center justify-between pb-3 border-b-2 border-china-red/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-china-red text-white flex items-center justify-center font-bold text-sm shadow-xs">
              I
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-china-ink">
                  课文与短文 - Bài Khóa &amp; Đoạn Văn Đọc Hiểu
                </h2>
                <span className="hidden sm:inline-block font-chinese text-[11px] font-bold px-2 py-0.5 rounded-md bg-china-red/10 text-china-red border border-china-red/20" lang="zh">
                  印 • 朗读
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Đọc bài khóa trước tiên, chạm vào từng chữ Hán để nghe phát âm giọng chuẩn và dịch nghĩa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-china-paper border border-border text-china-ink">
              {lesson.dialogues?.length || 0} câu hội thoại
            </span>
            {/* Mascot Tiểu Lu Đạo Sĩ Thanh Vân (Skin Xanh Ngọc) */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform hover:scale-110" title="Tiểu Lu Đạo Sĩ cùng bạn luyện đọc bài khóa">
              <Image
                src="/chibi-taoist.svg"
                alt="Tiểu Lu Đạo Sĩ"
                width={56}
                height={56}
                priority
                className="object-contain drop-shadow-xs"
              />
            </div>
          </div>
        </div>

        <InteractiveReader
          dialogues={lesson.dialogues || []}
          vocabulary={lesson.vocabulary}
          lessonTitle={lesson.title}
          readingPassage={lesson.readingPassage}
        />
      </section>

      {/* ======================================================== */}
      {/* PHẦN 2: TỪ VỰNG BÀI HỌC (生词 - VOCABULARY) */}
      {/* ======================================================== */}
      <section id="sec-vocab" className="space-y-4 pt-6 scroll-mt-16">
        <div className="flex items-center justify-between pb-3 border-b-2 border-china-red/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-china-ink text-white flex items-center justify-center font-bold text-sm shadow-xs">
              II
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-china-ink">
                  生词 - Bảng Từ Mới Bài Học
                </h2>
                <span className="hidden sm:inline-block font-chinese text-[11px] font-bold px-2 py-0.5 rounded-md bg-china-red/10 text-china-red border border-china-red/20" lang="zh">
                  印 • 字词
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Chạm vào biểu tượng loa để nghe phát âm, học âm Hán-Việt và từ loại
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-china-paper border border-border text-china-ink">
              {lesson.vocabulary?.length || 0} từ vựng
            </span>
            {/* Mascot Tiểu Lu Thư Sinh (Skin Áo Đỏ Thưởng Trà) */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform hover:scale-110" title="Tiểu Lu chăm chỉ học từ mới">
              <Image
                src="/chibi-loading.svg"
                alt="Tiểu Lu Thư Sinh"
                width={56}
                height={56}
                className="object-contain drop-shadow-xs"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {lesson.vocabulary.map((w, idx) => (
            <div
              key={w.id || idx}
              className="bg-white border border-border hover:border-china-red/40 rounded-2xl p-4 shadow-xs transition flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-china-paper text-muted text-xs font-mono flex items-center justify-center shrink-0 mt-0.5 border border-border/60">
                  {idx + 1}
                </span>

                <div>
                  <div className="flex items-baseline gap-2">
                    <button
                      type="button"
                      onClick={() => playPronunciation(w.hanzi)}
                      className="font-chinese font-bold text-2xl text-china-ink group-hover:text-china-red hover:text-china-red active:text-china-red active:scale-95 transition touch-manipulation cursor-pointer text-left"
                      lang="zh"
                      title="Chạm để nghe phát âm"
                    >
                      {w.hanzi}
                    </button>
                    <span className="text-sm font-semibold text-china-red font-sans">
                      {w.pinyin}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {w.hanViet && (
                      <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                        Âm HV: {w.hanViet}
                      </span>
                    )}
                    {w.partOfSpeech && (
                      <span className="text-[11px] text-muted italic">
                        ({w.partOfSpeech})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-china-ink mt-2 font-medium leading-relaxed">
                    {w.meaning}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => playPronunciation(w.hanzi)}
                  className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-china-paper/70 hover:bg-china-red/10 active:bg-china-red/20 text-muted hover:text-china-red active:text-china-red transition active:scale-95 touch-manipulation cursor-pointer"
                  title="Nghe phát âm chuẩn"
                  aria-label={`Phát âm từ ${w.hanzi}`}
                >
                  <Volume2 className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* PHẦN 3: NGỮ PHÁP & CHÚ THÍCH TRỌNG TÂM (小语讲堂 / GRAMMAR) */}
      {/* ======================================================== */}
      {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
        <section id="sec-grammar" className="space-y-4 pt-6 scroll-mt-16">
          <div className="flex items-center justify-between pb-3 border-b-2 border-china-gold/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-china-gold text-white flex items-center justify-center font-bold text-sm shadow-xs">
                III
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif text-china-ink">
                    语法注释 - Điểm Ngữ Pháp &amp; Chú Thích Trọng Tâm
                  </h2>
                  <span className="hidden sm:inline-block font-chinese text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200" lang="zh">
                    印 • 讲解
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Quy tắc ngữ pháp, cấu trúc câu và các bài vè luyện đọc chuẩn trong sách
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-china-paper border border-border text-china-ink">
                {lesson.grammarNotes.length} điểm ngữ pháp
              </span>
              {/* Mascot Tiểu Lu Trạng Nguyên Hoàng Gia (Skin Vàng Kim Gấm) */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform hover:scale-110" title="Tiểu Lu Trạng Nguyên giảng bài ngữ pháp">
                <Image
                  src="/chibi-scholar-gold.svg"
                  alt="Tiểu Lu Trạng Nguyên"
                  width={56}
                  height={56}
                  className="object-contain drop-shadow-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-3.5">
            {lesson.grammarNotes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-china-paper/60 border border-border/80 text-xs sm:text-sm text-china-ink leading-relaxed hover:bg-china-paper transition"
              >
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                  {idx + 1}
                </span>
                <span className="font-medium">{note}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* PHẦN 4: BỘ FLASHCARD 3D TƯƠNG TÁC */}
      {/* ======================================================== */}
      <section id="sec-flashcards" className="space-y-4 pt-6 scroll-mt-16">
        <div className="flex items-center justify-between pb-3 border-b-2 border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              IV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-china-ink">
                  卡片 - Lật Thẻ Flashcard 3D Ôn Nhanh
                </h2>
                <span className="hidden sm:inline-block font-chinese text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200" lang="zh">
                  印 • 记忆
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Bấm vào thẻ để lật xem nghĩa &amp; pinyin, phím cách (Space) hoặc bấm &quot;Đã thuộc&quot; để sang từ tiếp
              </p>
            </div>
          </div>

          {/* Mascot Tiểu Lu Múa Bút Thư Pháp */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform hover:scale-110" title="Tiểu Lu múa bút viết chữ flashcard">
            <Image
              src="/chibi-brush.svg"
              alt="Tiểu Lu Múa Bút"
              width={56}
              height={56}
              className="object-contain drop-shadow-xs"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-china-paper/60 border border-border rounded-3xl">
          <LessonFlashcards words={lesson.vocabulary} lessonTitle={lesson.title} />
        </div>
      </section>

      {/* ======================================================== */}
      {/* PHẦN 5: BÀI TẬP THỰC HÀNH SÁCH (练习 - WORKBOOK EXERCISES) */}
      {/* ======================================================== */}
      <section id="sec-exercises" className="space-y-4 pt-6 scroll-mt-16">
        <div className="flex items-center justify-between pb-3 border-b-2 border-china-red/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-china-red text-white flex items-center justify-center font-bold text-sm shadow-xs">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-china-ink">
                  练习 - Bài Tập Củng Cố Trong Sách (Workbook)
                </h2>
                <span className="hidden sm:inline-block font-chinese text-[11px] font-bold px-2 py-0.5 rounded-md bg-china-red/10 text-china-red border border-china-red/20" lang="zh">
                  印 • 习题
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Thực hành nối từ, xếp câu, trắc nghiệm và luyện nghe chọn chữ trực tiếp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-china-paper border border-border text-china-ink">
              Tương tác trực tiếp
            </span>
            {/* Mascot Tiểu Lu Hiệp Khách Giang Hồ (Skin Nón Lá Trúc) */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform hover:scale-110" title="Tiểu Lu Hiệp Khách cùng bạn vượt ải bài tập">
              <Image
                src="/chibi-wuxia.svg"
                alt="Tiểu Lu Hiệp Khách"
                width={56}
                height={56}
                className="object-contain drop-shadow-xs"
              />
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

      {/* ======================================================== */}
      {/* FOOTER: BÀI TIẾP THEO / HOÀN THÀNH */}
      {/* ======================================================== */}
      <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/books/${bookId}/${prevLesson.id}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-border hover:bg-china-paper text-xs font-bold text-china-ink shadow-xs transition"
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold shadow-md transition transform hover:-translate-y-0.5"
          >
            <span>Học tiếp Bài {nextLesson.lessonNumber}: {nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/books"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold shadow-md transition"
          >
            <Trophy className="w-4 h-4" />
            <span>Bạn đã hoàn thành sách! Về Tủ Sách</span>
          </Link>
        )}
      </div>

      {/* Floating Scroll to Top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-china-red text-white shadow-xl hover:bg-china-red/90 transition transform hover:scale-105 cursor-pointer"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
