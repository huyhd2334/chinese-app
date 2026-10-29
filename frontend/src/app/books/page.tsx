'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  ChevronRight,
  Layers,
  Clock,
  CheckCircle2,
  Trophy,
  TrendingUp
} from 'lucide-react'
import { getAllBooks, getLessons } from '@/utils/curriculumStorage'
import { BookCourse, CurriculumLesson } from '@/types/curriculum'
import {
  getLessonProgress,
  getBookOverallProgress,
  formatStudyHours,
  formatStudyHoursShort,
  LessonProgressData
} from '@/utils/lessonProgress'

export default function BooksDirectoryPage() {
  const [books, setBooks] = useState<BookCourse[]>([])
  const [selectedBook, setSelectedBook] = useState<BookCourse | null>(null)
  const [lessons, setLessons] = useState<CurriculumLesson[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgressData>>({})

  const refreshProgress = (currentBookId: string, currentLessons: CurriculumLesson[]) => {
    const map: Record<string, LessonProgressData> = {}
    for (const l of currentLessons) {
      map[l.id] = getLessonProgress(currentBookId, l.id)
    }
    setProgressMap(map)
  }

  useEffect(() => {
    const loadedBooks = getAllBooks()
    setBooks(loadedBooks)
    if (loadedBooks.length > 0) {
      setSelectedBook(loadedBooks[0])
      const list = getLessons(loadedBooks[0].id)
      setLessons(list)
      refreshProgress(loadedBooks[0].id, list)
    }
  }, [])

  useEffect(() => {
    if (selectedBook && lessons.length > 0) {
      refreshProgress(selectedBook.id, lessons)
    }
  }, [selectedBook, lessons])

  useEffect(() => {
    const handleUpdate = () => {
      if (selectedBook && lessons.length > 0) {
        refreshProgress(selectedBook.id, lessons)
      }
    }
    window.addEventListener('lesson-progress-updated', handleUpdate)
    return () => window.removeEventListener('lesson-progress-updated', handleUpdate)
  }, [selectedBook, lessons])

  const handleSelectBook = (book: BookCourse) => {
    setSelectedBook(book)
    const list = getLessons(book.id)
    setLessons(list)
    refreshProgress(book.id, list)
  }

  // Calculate overall stats for selected book
  const overallStats = selectedBook
    ? getBookOverallProgress(
        selectedBook.id,
        lessons.map((l) => l.id)
      )
    : { totalLessons: 0, completedLessons: 0, avgPercent: 0, totalStudyTimeSeconds: 0 }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Header: Giáo trình HSK Chuẩn */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-slate-700">
              <BookOpen className="w-3.5 h-3.5 text-china-red" />
              <span>Giáo trình HSK 3.0</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-china-ink">
              Giáo trình Chuẩn HSK 3.0
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lộ trình học theo giáo trình chuẩn: từ vựng trọng tâm, bài khóa hội thoại tương tác, giải thích ngữ pháp và bài tập thực hành.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-muted">
            <span className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-border/80 font-medium text-slate-700">
              {books.length} cấp độ
            </span>
          </div>
        </div>
      </div>

      {/* Danh sách giáo trình theo cấp độ */}
      <section className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
          <div>
            <h2 className="text-base font-bold text-china-ink">
              Chọn cấp độ giáo trình
            </h2>
            <p className="text-xs text-muted">
              Chọn sách để xem bài khóa, từ vựng và bài tập của từng bài
            </p>
          </div>
          {selectedBook && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-china-red/10 text-china-red self-start sm:self-auto">
              Đang chọn: {selectedBook.title}
            </span>
          )}
        </div>

        {/* Books Grid */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {books.slice(0, 6).map((book) => {
              const isSelected = selectedBook?.id === book.id
              return (
                <button
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className={`group flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-50 border-china-red ring-1 ring-china-red shadow-xs'
                      : 'bg-white border-border hover:border-slate-300 hover:bg-neutral-50/60'
                  }`}
                >
                  {/* Book Cover Image */}
                  <div className="relative w-full aspect-[1/1.38] rounded-lg overflow-hidden bg-neutral-100 border border-border/60">
                    {book.coverImage ? (
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover"
                        priority={book.level <= 2}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-china-ink font-bold text-lg">
                        HSK {book.level}
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="mt-2.5 space-y-0.5 w-full">
                    <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-china-red' : 'text-china-ink group-hover:text-china-red'}`}>
                      HSK {book.level}
                    </h3>
                    <p className="text-[11px] text-muted truncate">
                      {book.totalLessons} bài học
                    </p>
                    <span className="inline-block text-[10px] font-medium text-slate-600">
                      {book.badge}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Selected Book Overview & Lessons List */}
      {selectedBook && (
        <section className="space-y-4">
          {/* Selected Book Header Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-14 sm:w-16 aspect-[1/1.38] shrink-0 rounded-lg overflow-hidden border border-border/70">
                {selectedBook.coverImage ? (
                  <Image
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-china-ink font-bold text-sm">
                    H{selectedBook.level}
                  </div>
                )}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-china-red">
                    HSK {selectedBook.level}
                  </span>
                  <span className="text-muted text-xs">•</span>
                  <span className="text-xs text-muted font-chinese" lang="zh">
                    {selectedBook.chineseTitle}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-china-ink truncate">
                  {selectedBook.title}
                </h2>
                <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                  {selectedBook.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-border font-medium text-slate-700">
                Đã học: <b className="text-china-ink">{overallStats.completedLessons}/{lessons.length} bài</b> ({overallStats.avgPercent}%)
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-border font-medium text-slate-700">
                Thời gian: <b className="text-china-ink font-mono">{formatStudyHoursShort(overallStats.totalStudyTimeSeconds)}</b>
              </span>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span>Danh sách bài học</span>
                <span className="text-[11px] font-normal text-muted">({lessons.length} bài)</span>
              </h3>
            </div>

            {lessons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lessons.map((lesson) => {
                  const vocabCount = lesson.vocabulary?.length || 0
                  const dialogueCount = lesson.dialogues?.length || 0
                  const p = progressMap[lesson.id] || {
                    percent: 0,
                    timeSpentSeconds: 0,
                    completedSections: [],
                    lastStudiedAt: 0,
                  }
                  const isCompleted = p.percent >= 100

                  return (
                    <div
                      key={lesson.id}
                      className="bg-white border border-border hover:border-slate-300 rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-slate-700'
                        }`}>
                          {isCompleted ? '✓' : lesson.lessonNumber}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <h4 className="text-sm font-bold font-chinese text-china-ink" lang="zh">
                              {lesson.title}
                            </h4>
                            {lesson.titlePinyin && (
                              <span className="text-xs text-slate-500 font-normal">
                                {lesson.titlePinyin}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                            {lesson.titleVi}
                          </p>

                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
                            <span>{vocabCount} từ vựng</span>
                            {dialogueCount > 0 && <span>• {dialogueCount} câu hội thoại</span>}
                            {p.timeSpentSeconds > 0 && <span>• {formatStudyHoursShort(p.timeSpentSeconds)}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                        <div className="text-[11px]">
                          {isCompleted ? (
                            <span className="font-semibold text-emerald-700">Đã hoàn thành</span>
                          ) : p.percent > 0 ? (
                            <span className="font-semibold text-slate-700">Tiến độ: {p.percent}%</span>
                          ) : (
                            <span className="text-muted">Chưa học</span>
                          )}
                        </div>

                        <Link
                          href={`/books/${selectedBook.id}/${lesson.id}`}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isCompleted
                              ? 'bg-neutral-100 text-slate-700 hover:bg-neutral-200'
                              : 'bg-china-red text-white hover:bg-china-red/90'
                          }`}
                        >
                          <span>{isCompleted ? 'Ôn lại' : p.percent > 0 ? 'Học tiếp' : 'Vào bài'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-2xl p-8 text-center space-y-2">
                <h4 className="text-sm font-bold text-china-ink">
                  Đang cập nhật nội dung HSK {selectedBook.level}
                </h4>
                <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                  Các bài học của cuốn sách này đang được chuẩn bị. Bạn có thể bắt đầu với <b>Giáo trình Chuẩn HSK 1</b> trước nhé!
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
