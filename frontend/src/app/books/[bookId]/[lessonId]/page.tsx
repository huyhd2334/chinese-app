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
  Crop,
  ChevronRight,
  ChevronLeft,
  Puzzle,
  RotateCw,
  HelpCircle,
  Bookmark,
  CheckCircle2,
  Trophy,
  ArrowUp
} from 'lucide-react'
import { getBook, getLesson, getLessons } from '@/utils/curriculumStorage'
import { BookCourse, CurriculumLesson } from '@/types/curriculum'
import { db } from '../../../../../db/database'
import LessonFlashcards from '@/components/curriculum/LessonFlashcards'
import LessonExercises from '@/components/curriculum/LessonExercises'
import InteractiveReader from '@/components/curriculum/InteractiveReader'

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

        <Link
          href={`/digitizer?book=${bookId}&lesson=${lesson.lessonNumber}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-china-paper hover:bg-neutral-100 border border-border text-xs font-semibold text-china-ink transition"
        >
          <Crop className="w-3.5 h-3.5 text-china-red" />
          <span>Số hóa thêm từ (OCR)</span>
        </Link>
      </div>

      {/* Book Cover Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-china-paper to-amber-50/40 border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-china-red text-white shadow-xs">
                Bài {lesson.lessonNumber}
              </span>
              <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-border">
                {book?.chineseTitle} • Cấp {book?.level || 1}
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-china-ink tracking-tight">
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
              <span>Dạng sách tương tác: Lướt từ trên xuống dưới, chỗ nào có chữ Hán đều có thể chạm để nghe đọc và làm bài tập ngay!</span>
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5">
            <button
              onClick={handleAddAllToReview}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold transition shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Đưa {lesson.vocabulary?.length || 0} từ vào Ôn tập</span>
            </button>
          </div>
        </div>

        {addedReviewStatus && (
          <div className="relative z-10 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
            <span className="font-semibold">{addedReviewStatus}</span>
            <Link href="/review" className="underline font-bold text-emerald-900">
              Vào trang Ôn tập Spaced Repetition ngay →
            </Link>
          </div>
        )}

        {/* Watermark character */}
        <div className="absolute right-[-10px] bottom-[-25px] font-serif text-[130px] font-bold text-black/[0.03] select-none pointer-events-none">
          {lesson.title.slice(0, 2)}
        </div>
      </div>

      {/* Sticky Table of Contents Quick Nav Bar */}
      <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md border border-border/90 rounded-2xl p-1.5 shadow-sm flex items-center justify-between gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => scrollToSection('sec-vocab')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 text-china-red" />
          <span>I. Từ mới ({lesson.vocabulary?.length || 0})</span>
        </button>

        <button
          onClick={() => scrollToSection('sec-flashcards')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0"
        >
          <RotateCw className="w-3.5 h-3.5 text-amber-600" />
          <span>II. Flashcard 3D</span>
        </button>

        <button
          onClick={() => scrollToSection('sec-reader')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0"
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>III. Bài Khóa ({lesson.dialogues?.length || 0})</span>
        </button>

        {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
          <button
            onClick={() => scrollToSection('sec-grammar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-china-paper text-china-ink hover:text-china-red transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>IV. Ngữ Pháp</span>
          </button>
        )}

        <button
          onClick={() => scrollToSection('sec-exercises')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-china-red/10 text-china-red hover:bg-china-red hover:text-white transition shrink-0 font-bold"
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span>V. Bài Tập (Workbook)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* PHẦN 1: TỪ VỰNG BÀI HỌC (生词 - VOCABULARY) */}
      {/* ======================================================== */}
      <section id="sec-vocab" className="space-y-4 pt-4 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b-2 border-china-red/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-china-red text-white flex items-center justify-center font-bold text-xs">
              I
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-china-ink">
                生词 - Bảng Từ Mới Bài Học
              </h2>
              <p className="text-xs text-muted">
                Chạm vào biểu tượng loa để nghe phát âm giọng chuẩn bản xứ
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-china-paper border border-border text-muted">
            {lesson.vocabulary?.length || 0} từ vựng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {lesson.vocabulary.map((w, idx) => (
            <div
              key={w.id || idx}
              className="bg-white border border-border hover:border-china-red/40 rounded-2xl p-4 shadow-xs transition flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-china-paper text-muted text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-2xl text-china-ink group-hover:text-china-red transition">
                      {w.hanzi}
                    </span>
                    <span className="text-sm font-semibold text-china-red font-sans">
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
      </section>

      {/* ======================================================== */}
      {/* PHẦN 2: BỘ FLASHCARD 3D TƯƠNG TÁC (TÍCH HỢP LIỀN MẠCH) */}
      {/* ======================================================== */}
      <section id="sec-flashcards" className="space-y-4 pt-6 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              II
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-china-ink">
                Lật Thẻ Flashcard 3D Ôn Nhanh Từ Mới
              </h2>
              <p className="text-xs text-muted">
                Bấm vào thẻ để lật xem nghĩa &amp; pinyin, phím cách (Space) hoặc bấm &quot;Đã thuộc&quot; để sang từ tiếp
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-china-paper/60 border border-border rounded-3xl">
          <LessonFlashcards words={lesson.vocabulary} lessonTitle={lesson.title} />
        </div>
      </section>

      {/* ======================================================== */}
      {/* PHẦN 3: SÁCH BÀI KHÓA HỘI THOẠI (课文 - DIALOGUES) */}
      {/* ======================================================== */}
      <section id="sec-reader" className="space-y-4 pt-6 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b-2 border-blue-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              III
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-china-ink">
                课文 - Bài Khóa Hội Thoại Tương Tác
              </h2>
              <p className="text-xs text-muted">
                Bấm vào bất kỳ chữ Hán nào trong câu để tra từ điển tức thì và nghe phát âm
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {lesson.dialogues?.length || 0} câu hội thoại
          </span>
        </div>

        <InteractiveReader
          dialogues={lesson.dialogues || []}
          vocabulary={lesson.vocabulary}
          lessonTitle={lesson.title}
        />
      </section>

      {/* ======================================================== */}
      {/* PHẦN 4: NGỮ PHÁP & CHÚ THÍCH (小语讲堂 / GRAMMAR) */}
      {/* ======================================================== */}
      {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
        <section id="sec-grammar" className="space-y-4 pt-6 scroll-mt-16">
          <div className="flex items-center justify-between pb-2 border-b-2 border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                IV
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-china-ink">
                  小语讲堂 - Điểm Ngữ Pháp &amp; Chú Thích Trọng Tâm
                </h2>
                <p className="text-xs text-muted">
                  Quy tắc ngữ pháp, cấu trúc câu và các bài vè luyện đọc chuẩn trong sách
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-3.5">
            {lesson.grammarNotes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-china-paper/60 border border-border/80 text-xs sm:text-sm text-china-ink leading-relaxed hover:bg-china-paper transition"
              >
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium">{note}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* PHẦN 5: BÀI TẬP THỰC HÀNH SÁCH (练习 - WORKBOOK EXERCISES) */}
      {/* ======================================================== */}
      <section id="sec-exercises" className="space-y-4 pt-6 scroll-mt-16">
        <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              V
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-china-ink">
                练习 - Bài Tập Củng Cố Trong Sách (Workbook)
              </h2>
              <p className="text-xs text-muted">
                Thực hành nối từ, xếp câu, trắc nghiệm và luyện nghe chọn chữ trực tiếp
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Tương tác trực tiếp
          </span>
        </div>

        <LessonExercises
          words={lesson.vocabulary}
          dialogues={lesson.dialogues}
          lessonTitle={lesson.title}
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
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
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-china-red text-white shadow-xl hover:bg-china-red/90 transition transform hover:scale-105"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
