'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  Layers
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
      {/* Top Banner: Giới thiệu Giáo Trình Chuẩn HSK */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-china-ink to-slate-900 text-white p-6 md:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-china-gold" />
              <span>Giáo trình chính khóa HSK 1 – 6</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-china-paper tracking-tight">
              Giáo Trình Chuẩn HSK (Standard Course)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Học bám sát theo lộ trình từng bài học trong bộ <b>Giáo trình chuẩn HSK</b>. 
              Tích hợp sẵn từ vựng trọng tâm, bài khóa hội thoại tương tác chạm nghe đọc và hệ thống bài tập củng cố kiến thức.
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
            <span className="text-xs text-muted font-semibold">{books.length} giáo trình</span>
          </div>

          <div className="space-y-2">
            {books.map((book) => {
              const isSelected = selectedBook?.id === book.id
              return (
                <button
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-china-red shadow-sm ring-1 ring-china-red/20'
                      : 'bg-china-paper/60 border-border/80 hover:bg-white hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-gradient-to-br ${book.colorTheme}`}
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
                        <span className="font-chinese" lang="zh">{book.chineseTitle}</span> • {book.totalLessons} bài học
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
                      <span className="text-xs text-muted font-chinese" lang="zh">{selectedBook.chineseTitle}</span>
                    </div>
                    <h2 className="text-xl font-bold text-china-ink mt-0.5">
                      {selectedBook.title}
                    </h2>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {selectedBook.description}
                    </p>
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
                              <div className="w-10 h-10 rounded-xl bg-china-paper border border-border/70 flex items-center justify-center text-sm font-bold text-china-red shrink-0 group-hover:bg-china-red group-hover:text-white transition">
                                {lesson.lessonNumber}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-bold font-chinese text-china-ink group-hover:text-china-red transition" lang="zh">
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
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <Link
                                href={`/books/${selectedBook.id}/${lesson.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold transition shadow-xs active:scale-95"
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
                    <p className="text-sm font-semibold text-china-ink">Các bài học đang được hoàn thiện</p>
                    <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                      Nội dung giáo trình này sẽ được cập nhật sớm nhất trong các phiên bản tiếp theo.
                    </p>
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
