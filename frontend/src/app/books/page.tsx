'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Layers,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle,
  Crop
} from 'lucide-react'
import { getAllBooks, getLessons } from '@/utils/curriculumStorage'
import { BookCourse, CurriculumLesson } from '@/types/curriculum'

export default function BooksDirectoryPage() {
  const [books, setBooks] = useState<BookCourse[]>([])
  const [selectedBook, setSelectedBook] = useState<BookCourse | null>(null)
  const [lessons, setLessons] = useState<CurriculumLesson[]>([])

  useEffect(() => {
    const loadedBooks = getAllBooks()
    setBooks(loadedBooks)
    if (loadedBooks.length > 0) {
      setSelectedBook(loadedBooks[0])
      setLessons(getLessons(loadedBooks[0].id))
    }
  }, [])

  const handleSelectBook = (book: BookCourse) => {
    setSelectedBook(book)
    setLessons(getLessons(book.id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Banner: Digitizer Callout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-china-ink to-slate-900 text-white p-6 md:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Chương trình số hóa sách giáo trình</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-china-paper">
              Học Tiếng Trung Theo Giáo Trình Chuẩn
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Học bám sát theo cấu trúc từng bài học trong bộ <b>Giáo trình chuẩn HSK (1–6)</b>. 
              Bạn cũng có thể tự chụp trang sách mới và dùng công cụ <b>Khoanh vùng OCR</b> để mở rộng kho bài giảng trong nháy mắt.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/digitizer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-china-red hover:bg-china-red/90 text-white text-sm font-bold shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Crop className="w-4 h-4" />
              <span>Mở Studio Số Hóa (OCR)</span>
            </Link>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-[-20px] bottom-[-30px] text-white/5 font-serif text-[180px] font-bold select-none pointer-events-none">
          教程
        </div>
      </div>

      {/* Main Grid: Book Tabs + Lesson List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Book Shelf (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              Tủ Sách Giáo Trình
            </h2>
            <span className="text-xs text-muted">{books.length} giáo trình</span>
          </div>

          <div className="space-y-2">
            {books.map((book) => {
              const isSelected = selectedBook?.id === book.id
              return (
                <button
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white border-china-red shadow-sm ring-1 ring-china-red/20'
                      : 'bg-china-paper/60 border-border/80 hover:bg-white hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-serif font-bold text-white shadow-xs shrink-0 bg-gradient-to-br ${book.colorTheme}`}
                    >
                      H{book.level}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-china-red' : 'text-china-ink'}`}>
                          {book.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted truncate">
                        {book.chineseTitle} • {book.totalLessons} bài học
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-china-red/10 text-china-red'
                        : 'bg-neutral-100 text-muted'
                    }`}
                  >
                    {book.badge || `Cấp ${book.level}`}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Add custom book prompt */}
          <Link
            href="/digitizer"
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-border hover:border-china-red/40 hover:bg-white text-xs font-semibold text-muted hover:text-china-red transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Số hóa thêm sách / giáo trình khác</span>
          </Link>
        </div>

        {/* Right: Selected Book Lessons (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedBook && (
            <>
              {/* Selected Book Header Card */}
              <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-china-red uppercase tracking-wider">
                        {selectedBook.badge}
                      </span>
                      <span className="text-muted text-xs">•</span>
                      <span className="text-xs text-muted">{selectedBook.chineseTitle}</span>
                    </div>
                    <h2 className="text-xl font-bold font-serif text-china-ink mt-0.5">
                      {selectedBook.title}
                    </h2>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {selectedBook.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      href={`/digitizer?book=${selectedBook.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-china-paper hover:bg-neutral-100 border border-border text-xs font-semibold text-china-ink transition"
                    >
                      <Crop className="w-3.5 h-3.5 text-china-red" />
                      <span>Số hóa trang mới vào sách này</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                    Danh Sách Bài Học ({lessons.length} bài)
                  </h3>
                </div>

                {lessons.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {lessons.map((lesson) => {
                      const vocabCount = lesson.vocabulary?.length || 0
                      const dialogueCount = lesson.dialogues?.length || 0

                      return (
                        <div
                          key={lesson.id}
                          className="bg-white border border-border hover:border-china-red/30 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-china-paper border border-border/70 flex items-center justify-center text-sm font-bold font-serif text-china-red shrink-0 group-hover:bg-china-red group-hover:text-white transition">
                                {lesson.lessonNumber}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-bold font-serif text-china-ink group-hover:text-china-red transition">
                                    {lesson.title}
                                  </h4>
                                  {lesson.titlePinyin && (
                                    <span className="text-xs text-china-red font-medium">
                                      {lesson.titlePinyin}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-medium text-slate-600 mt-0.5">
                                  {lesson.titleVi}
                                </p>

                                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3 text-china-red" />
                                    {vocabCount} từ vựng
                                  </span>
                                  {dialogueCount > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Layers className="w-3 h-3 text-blue-600" />
                                      {dialogueCount} câu hội thoại
                                    </span>
                                  )}
                                  {lesson.isCustom && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                                      Đã số hóa
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <Link
                                href={`/books/${selectedBook.id}/${lesson.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold transition shadow-xs"
                              >
                                <span>Học bài này</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted">
                    <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-china-ink">Chưa có bài học số hóa trong sách này</p>
                    <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
                      Bạn có thể chụp trang sách giáo trình này và dùng Studio OCR để số hóa các bài tiếp theo trong nháy mắt!
                    </p>
                    <Link
                      href={`/digitizer?book=${selectedBook.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-china-red text-white text-xs font-bold hover:bg-china-red/90 transition"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Bắt đầu số hóa Bài 1</span>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
