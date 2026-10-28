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
      {/* Top Banner: Giới thiệu Giáo Trình Chuẩn HSK 3.0 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-china-ink to-slate-900 text-white p-6 md:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
              <span>Hệ thống Giáo Trình HSK 3.0 Mới Nhất</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-china-paper tracking-tight">
              Giáo Trình Chuẩn HSK 3.0 (New HSK Standard)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Học bám sát theo lộ trình bộ <b>Giáo trình HSK 3.0</b>. 
              Tích hợp sẵn từ vựng 300 từ cốt lõi, đoạn văn đọc hiểu (短文阅读), bài khóa hội thoại tương tác chạm nghe và hệ thống bài tập luyện nghe (听力) chuẩn sách.
            </p>
          </div>
        </div>

        {/* Mascot Tiểu Lu Thư Sinh đồng hành cùng Giáo Trình */}
        <div className="absolute right-4 bottom-1 w-28 h-28 hidden md:block pointer-events-none select-none drop-shadow-md transition-transform hover:scale-105">
          <Image
            src="/chibi-brush.svg"
            alt="Tiểu Lu Thư Sinh"
            width={112}
            height={112}
            priority
            className="object-contain"
          />
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-[-20px] bottom-[-30px] text-white/5 font-chinese text-[180px] font-bold select-none pointer-events-none" lang="zh">
          3.0
        </div>
      </div>

      {/* 6 Real Books Bookshelf Showcase */}
      <section className="bg-white border border-border/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        {/* Shelf Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-china-red/10 text-china-red flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-china-ink">
                Tủ Sách Giáo Trình Chuẩn HSK 3.0
              </h2>
              <p className="text-xs text-muted">
                Nhấp vào bìa sách để mở danh sách bài học, đoạn văn đọc hiểu và bài luyện nghe
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-china-paper border border-border text-muted">
            <span>Chuẩn HSK 3.0 Mới Nhất</span>
          </div>
        </div>

        {/* 6 Real 3D Books Grid */}
        <div className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6 items-end justify-items-center">
            {books.slice(0, 6).map((book) => {
              const isSelected = selectedBook?.id === book.id
              return (
                <button
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className="group flex flex-col items-center text-center focus:outline-none cursor-pointer w-full max-w-[150px]"
                >
                  {/* 3D Book Cover Graphic */}
                  <div
                    className={`relative w-full aspect-[1/1.42] rounded-r-xl rounded-l-xs overflow-hidden transition-all duration-300 ease-out select-none ${
                      isSelected
                        ? '-translate-y-3 scale-[1.04] shadow-[0_22px_35px_-5px_rgba(200,16,46,0.35)] ring-3 ring-china-red ring-offset-2 ring-offset-white'
                        : 'shadow-[0_8px_16px_-4px_rgba(0,0,0,0.2)] group-hover:shadow-[0_18px_28px_-4px_rgba(0,0,0,0.3)] group-hover:-translate-y-2 group-hover:scale-[1.02]'
                    }`}
                  >
                    {/* Real Book Cover Image */}
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
                      <div className={`w-full h-full bg-gradient-to-br ${book.colorTheme} flex items-center justify-center text-white font-bold text-2xl`}>
                        H{book.level}
                      </div>
                    )}

                    {/* Realistic 3D Book Spine Effect (Left Side Lighting & Crease) */}
                    <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/35 via-white/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 left-3 w-[1px] bg-black/15 pointer-events-none" />

                    {/* Realistic Book Page Edge Sheen (Right Side Edge) */}
                    <div className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-black/20 via-white/10 to-transparent pointer-events-none" />

                    {/* Level Badge Overlay on Book */}
                    <div className="absolute top-2 right-2 bg-china-ink/80 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      HSK {book.level}
                    </div>

                    {/* Selected Indicator Ribbon */}
                    {isSelected && (
                      <div className="absolute bottom-0 inset-x-0 bg-china-red text-white text-[10px] font-bold py-1 text-center shadow-md animate-fade-in flex items-center justify-center gap-1">
                        <span>✓ Đang mở</span>
                      </div>
                    )}
                  </div>

                  {/* Book Info Underneath */}
                  <div className="mt-3 space-y-0.5 w-full">
                    <h3 className={`text-xs font-bold transition-colors truncate ${isSelected ? 'text-china-red font-black' : 'text-china-ink group-hover:text-china-red'}`}>
                      HSK {book.level}
                    </h3>
                    <p className="text-[11px] text-muted truncate">
                      {book.totalLessons} bài học
                    </p>
                    <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-china-red/10 text-china-red font-bold' : 'bg-neutral-100 text-muted'}`}>
                      {book.badge}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Realistic Wooden Shelf Ledge */}
          <div className="mt-5 pt-1 border-b-4 border-amber-900/20 rounded-full mx-2 shadow-[0_2px_4px_rgba(0,0,0,0.06)]" />
        </div>
      </section>

      {/* Selected Book Overview & Lessons List */}
      {selectedBook && (
        <section className="space-y-4">
          {/* Selected Book Header Card */}
          <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              {/* Selected Book Real Cover Miniature */}
              <div className="relative w-16 sm:w-20 aspect-[1/1.42] shrink-0 rounded-r-lg rounded-l-xs overflow-hidden shadow-md ring-2 ring-china-red/20">
                {selectedBook.coverImage ? (
                  <Image
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${selectedBook.colorTheme} flex items-center justify-center text-white font-bold`}>
                    H{selectedBook.level}
                  </div>
                )}
                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/30 via-white/20 to-transparent pointer-events-none" />
              </div>

              {/* Book Details */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-china-red uppercase tracking-wider">
                    {selectedBook.badge || `Cấp ${selectedBook.level}`}
                  </span>
                  <span className="text-muted text-xs">•</span>
                  <span className="text-xs text-muted font-chinese" lang="zh">
                    {selectedBook.chineseTitle}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-china-ink truncate">
                  {selectedBook.title}
                </h2>
                <p className="text-xs text-muted leading-relaxed line-clamp-2 max-w-2xl">
                  {selectedBook.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-end md:items-end gap-2.5 shrink-0 self-start md:self-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-china-ink bg-china-paper px-3 py-1.5 rounded-xl border border-border flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-china-red" />
                  Tiến độ sách: <b className="text-china-red">{overallStats.avgPercent}%</b>
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-china-paper text-china-ink border border-border">
                  {overallStats.completedLessons}/{lessons.length} bài xong
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Clock className="w-3.5 h-3.5 text-china-red" />
                <span>Tổng giờ học sách:</span>
                <span className="font-bold text-china-ink font-mono">
                  {formatStudyHours(overallStats.totalStudyTimeSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Book Progress Bar */}
          <div className="bg-china-paper/60 border border-border/80 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-china-red" />
                <span>Tiến độ hoàn thành giáo trình {selectedBook.title}</span>
              </span>
              <span className="font-bold text-china-red font-mono">{overallStats.avgPercent}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-border/70 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-china-red via-china-red/90 to-china-gold transition-all duration-500"
                style={{ width: `${Math.max(overallStats.avgPercent, overallStats.totalStudyTimeSeconds > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                <span>Danh Sách Bài Học</span>
                <span className="text-[11px] font-normal text-muted">({lessons.length} bài)</span>
              </h3>
            </div>

            {lessons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                      className="bg-white border border-border hover:border-china-red/30 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold shrink-0 transition ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-china-paper border-border/70 text-china-red group-hover:bg-china-red group-hover:text-white'
                        }`}>
                          {isCompleted ? '✓' : lesson.lessonNumber}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold font-chinese text-china-ink group-hover:text-china-red transition" lang="zh">
                              {lesson.title}
                            </h4>
                            {lesson.titlePinyin && (
                              <span className="text-xs text-china-red font-medium">
                                {lesson.titlePinyin}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-600 mt-0.5 line-clamp-1">
                            {lesson.titleVi}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-china-red" />
                              {vocabCount} từ vựng
                            </span>
                            {dialogueCount > 0 && (
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3 text-china-ink" />
                                {dialogueCount} câu hội thoại
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Thanh Tiến Độ & Số Giờ Học Của Bài */}
                      <div className="pt-2 space-y-1.5 border-t border-border/40">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-china-red shrink-0" />
                            <span>Đã học:</span>
                            <span className="font-bold text-china-ink font-mono">
                              {formatStudyHoursShort(p.timeSpentSeconds)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                100% Hoàn thành
                              </span>
                            ) : p.percent > 0 ? (
                              <span className="font-bold text-china-red font-mono">
                                {p.percent}%
                              </span>
                            ) : (
                              <span className="text-muted text-[10px]">Chưa học</span>
                            )}
                          </div>
                        </div>

                        {/* Thanh Tiến Độ Ngang */}
                        <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-border/60 p-[1px]">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : p.percent > 0
                                ? 'bg-gradient-to-r from-china-red to-china-gold'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${Math.max(p.percent, p.timeSpentSeconds > 0 ? 5 : 0)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/30">
                        <div className="text-[11px] text-muted">
                          {p.completedSections && p.completedSections.length > 0 ? (
                            <span>{p.completedSections.length}/5 phần</span>
                          ) : (
                            <span>5 phần học</span>
                          )}
                        </div>

                        <Link
                          href={`/books/${selectedBook.id}/${lesson.id}`}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-china-red hover:bg-china-red/90 text-white'
                          }`}
                        >
                          <span>{isCompleted ? 'Ôn tập lại' : p.percent > 0 ? 'Tiếp tục học' : 'Học bài này'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-3xl p-8 sm:p-12 text-center space-y-3">
                <div className="w-24 h-24 mx-auto drop-shadow-sm">
                  <Image
                    src="/chibi-brush.svg"
                    alt="Tiểu Lu đang chuẩn bị bài học"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <h4 className="text-base font-bold text-china-ink">
                  Tiểu Lu đang biên soạn Giáo trình Chuẩn HSK {selectedBook.level}!
                </h4>
                <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                  Nội dung đầy đủ của <b>{selectedBook.title}</b> bao gồm từ vựng, hội thoại mẫu và ngữ pháp đang được hoàn thiện và sẽ sớm ra mắt bạn. Hãy bắt đầu ôn tập với <b>Giáo trình Chuẩn HSK 1</b> nhé!
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
