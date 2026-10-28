'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Upload,
  Crop,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  BookOpen,
  Save,
  Download,
  RotateCcw,
  Maximize2,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import { createWorker } from 'tesseract.js'
import { CurriculumWord, BookCourse } from '@/types/curriculum'
import { matchAndStructureOcrText } from '@/utils/ocrMatcher'
import { getAllBooks, saveLesson, saveCustomBook } from '@/utils/curriculumStorage'
import { getHanViet } from '@/utils/hanviet'
import Link from 'next/link'

interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export default function OcrStudio() {
  // Mode: "image" or "text"
  const [inputMode, setInputMode] = useState<'image' | 'text'>('image')

  // Image & Canvas State
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [cropRect, setCropRect] = useState<CropRect | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  // OCR Processing State
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrStatusText, setOcrStatusText] = useState('')
  const [rawExtractedText, setRawExtractedText] = useState('')

  // Verified Words List
  const [words, setWords] = useState<CurriculumWord[]>([])

  // Curriculum Destination
  const [books, setBooks] = useState<BookCourse[]>([])
  const [selectedBookId, setSelectedBookId] = useState('hsk1_standard')
  const [lessonNumber, setLessonNumber] = useState(1)
  const [lessonTitle, setLessonTitle] = useState('Bài 1: 你好 - Xin chào')
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // New Word Form modal/inline
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHanzi, setNewHanzi] = useState('')

  // Canvas Refs
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

  // Load books on mount
  useEffect(() => {
    setBooks(getAllBooks())
  }, [])

  // Paste image listener from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          if (blob) {
            const url = URL.createObjectURL(blob)
            setImageSrc(url)
            setCropRect(null)
            setInputMode('image')
          }
          break
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageSrc(url)
      setCropRect(null)
    }
  }

  // Load sample HSK page (SVG-based high-res realistic page for instant testing)
  const handleLoadSamplePage = () => {
    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
      <rect width="900" height="600" fill="#faf9f6" />
      <rect x="40" y="40" width="820" height="520" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
      <text x="80" y="90" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="#b91c1c">第1课：你好 - Lesson 1: Hello</text>
      <line x1="80" y1="110" x2="820" y2="110" stroke="#f1f5f9" stroke-width="2" />
      <text x="80" y="145" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#334155">生词 - Từ mới (Vocabulary):</text>
      
      <!-- Word Table Box -->
      <rect x="80" y="165" width="740" height="260" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4" />
      
      <text x="110" y="210" font-family="'Noto Serif SC', serif" font-size="28" font-weight="bold" fill="#0f172a">1. 你</text>
      <text x="210" y="210" font-family="sans-serif" font-size="18" fill="#64748b">nǐ</text>
      <text x="320" y="210" font-family="sans-serif" font-size="16" fill="#334155">[Đại từ] Bạn, anh, chị (ngôi thứ hai)</text>
      
      <text x="110" y="260" font-family="'Noto Serif SC', serif" font-size="28" font-weight="bold" fill="#0f172a">2. 好</text>
      <text x="210" y="260" font-family="sans-serif" font-size="18" fill="#64748b">hǎo</text>
      <text x="320" y="260" font-family="sans-serif" font-size="16" fill="#334155">[Tính từ] Tốt, đẹp, khỏe, an lành</text>

      <text x="110" y="310" font-family="'Noto Serif SC', serif" font-size="28" font-weight="bold" fill="#0f172a">3. 您</text>
      <text x="210" y="310" font-family="sans-serif" font-size="18" fill="#64748b">nín</text>
      <text x="320" y="310" font-family="sans-serif" font-size="16" fill="#334155">[Đại từ] Ngài, ông, thầy (kính ngữ)</text>

      <text x="110" y="360" font-family="'Noto Serif SC', serif" font-size="28" font-weight="bold" fill="#0f172a">4. 谢谢</text>
      <text x="210" y="360" font-family="sans-serif" font-size="18" fill="#64748b">xièxie</text>
      <text x="320" y="360" font-family="sans-serif" font-size="16" fill="#334155">[Động từ] Cảm ơn</text>

      <text x="110" y="405" font-family="'Noto Serif SC', serif" font-size="28" font-weight="bold" fill="#0f172a">5. 不客气</text>
      <text x="210" y="405" font-family="sans-serif" font-size="18" fill="#64748b">bú kèqi</text>
      <text x="320" y="405" font-family="sans-serif" font-size="16" fill="#334155">[Cụm từ] Đừng khách sáo, không có gì</text>

      <text x="80" y="465" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#334155">课文 - Bài khóa (Dialogue):</text>
      <text x="110" y="500" font-family="'Noto Serif SC', serif" font-size="20" fill="#1e293b">A: 你好！</text>
      <text x="110" y="530" font-family="'Noto Serif SC', serif" font-size="20" fill="#1e293b">B: 你好！</text>
    </svg>`

    const blob = new Blob([sampleSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    setImageSrc(url)
    // Pre-select the bounding box around vocabulary table
    setCropRect({
      x: 8,
      y: 26,
      width: 84,
      height: 46,
    })
  }

  // Mouse drag handler on image container
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasContainerRef.current) return
    const rect = canvasContainerRef.current.getBoundingClientRect()
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

    setIsDragging(true)
    setDragStart({ x: xPct, y: yPct })
    setCropRect({ x: xPct, y: yPct, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart || !canvasContainerRef.current) return
    const rect = canvasContainerRef.current.getBoundingClientRect()
    const currentXPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const currentYPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

    const x = Math.min(dragStart.x, currentXPct)
    const y = Math.min(dragStart.y, currentYPct)
    const width = Math.abs(currentXPct - dragStart.x)
    const height = Math.abs(currentYPct - dragStart.y)

    setCropRect({ x, y, width, height })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  // Select whole image
  const handleSelectAll = () => {
    setCropRect({ x: 0, y: 0, width: 100, height: 100 })
  }

  // Reset crop
  const handleResetCrop = () => {
    setCropRect(null)
  }

  // Execute OCR
  const runOcrOnSelection = async () => {
    if (!imageSrc || !imageRef.current) return

    setIsProcessing(true)
    setOcrProgress(5)
    setOcrStatusText('Đang chuẩn bị ảnh vùng chọn...')

    try {
      // 1. Create temporary canvas to crop the bounding box area
      const img = imageRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Cannot get canvas 2D context')

      const naturalW = img.naturalWidth || img.width
      const naturalH = img.naturalHeight || img.height

      let sx = 0
      let sy = 0
      let sWidth = naturalW
      let sHeight = naturalH

      if (cropRect && cropRect.width > 2 && cropRect.height > 2) {
        sx = (cropRect.x / 100) * naturalW
        sy = (cropRect.y / 100) * naturalH
        sWidth = (cropRect.width / 100) * naturalW
        sHeight = (cropRect.height / 100) * naturalH
      }

      canvas.width = Math.max(10, sWidth)
      canvas.height = Math.max(10, sHeight)

      // Draw cropped region
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height)

      // 2. Run Tesseract worker
      setOcrProgress(20)
      setOcrStatusText('Đang nạp mô hình AI tiếng Trung (chi_sim)...')

      const worker = await createWorker('chi_sim', undefined, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(20 + m.progress * 70))
            setOcrStatusText(`Đang nhận diện chữ Hán (${Math.round(m.progress * 100)}%)...`)
          }
        },
      })

      const ret = await worker.recognize(canvas)
      await worker.terminate()

      const text = ret.data.text
      setRawExtractedText(text)
      setOcrProgress(95)
      setOcrStatusText('Đang đối soát tự động với Từ điển 11.470 từ...')

      // 3. Match with DB and auto-fill pinyin, hán-việt, nghĩa
      const structuredWords = await matchAndStructureOcrText(text)
      setWords((prev) => [...prev, ...structuredWords])

      setOcrProgress(100)
      setOcrStatusText('Hoàn tất số hóa!')
      setTimeout(() => setIsProcessing(false), 600)
    } catch (err: any) {
      console.error('OCR Error:', err)
      setOcrStatusText(`Lỗi OCR: ${err?.message || 'Không thể nhận diện'}`)
      setIsProcessing(false)
    }
  }

  // Handle direct text paste parsing
  const handleParseRawText = async () => {
    if (!rawExtractedText.trim()) return
    setIsProcessing(true)
    setOcrStatusText('Đang đối soát từ điển...')
    try {
      const structuredWords = await matchAndStructureOcrText(rawExtractedText)
      setWords((prev) => [...prev, ...structuredWords])
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  // Inline edit handlers
  const handleUpdateWord = (index: number, field: keyof CurriculumWord, value: string) => {
    setWords((prev) => {
      const next = [...prev]
      const target = { ...next[index], [field]: value }

      // Auto update HanViet if Hanzi changes
      if (field === 'hanzi') {
        target.hanViet = getHanViet(value) || ''
      }
      next[index] = target
      return next
    })
  }

  const handleDeleteWord = (index: number) => {
    setWords((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddNewWord = () => {
    if (!newHanzi.trim()) return
    const hanViet = getHanViet(newHanzi) || ''
    const newWord: CurriculumWord = {
      id: `manual_${Date.now()}`,
      hanzi: newHanzi.trim(),
      pinyin: '',
      hanViet: hanViet,
      meaning: '',
      verified: true,
    }
    setWords((prev) => [...prev, newWord])
    setNewHanzi('')
    setShowAddModal(false)
  }

  // Audio pronounce
  const playPronunciation = (hanzi: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(hanzi)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  // Save to Curriculum
  const handleSaveToCurriculum = () => {
    if (words.length === 0) {
      alert('Vui lòng quét hoặc thêm ít nhất 1 từ vựng trước khi lưu!')
      return
    }

    try {
      const lessonId = `${selectedBookId}_${lessonNumber}`
      saveLesson({
        id: lessonId,
        bookId: selectedBookId,
        lessonNumber: Number(lessonNumber),
        title: lessonTitle.split('-')[0]?.trim() || `Bài ${lessonNumber}`,
        titleVi: lessonTitle.split('-')[1]?.trim() || lessonTitle,
        vocabulary: words,
        isCustom: true,
      })

      setSaveSuccess(`Đã lưu thành công ${words.length} từ vào ${lessonTitle}!`)
      setTimeout(() => setSaveSuccess(null), 5000)
    } catch (e) {
      alert('Có lỗi xảy ra khi lưu bài học!')
    }
  }

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(words, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `${selectedBookId}_lesson_${lessonNumber}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-china-red/10 text-china-red border border-china-red/20">
              Studio Số hóa
            </span>
            <span className="text-xs text-muted">HSK Standard Course Digitizer</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-china-ink mt-1">
            Khoanh Vùng &amp; Nhận Diện Sách (Bounding Box OCR)
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Kéo chuột khoanh đoạn chữ Hán trên trang sách giáo trình, AI sẽ tự động đọc chữ, tra Pinyin, âm Hán-Việt và nghĩa tiếng Việt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/books"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-muted hover:text-china-ink bg-white border border-border rounded-xl shadow-xs transition"
          >
            <BookOpen className="w-4 h-4 text-china-red" />
            <span>Vào danh mục Giáo trình</span>
          </Link>
        </div>
      </div>

      {/* Target Book & Lesson Picker Banner */}
      <div className="bg-china-paper/60 border border-border/80 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              1. Chọn bộ Giáo trình lưu vào
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded-xl text-sm font-medium text-china-ink focus:outline-china-red shadow-xs"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.chineseTitle})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              2. Bài học số mấy?
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Bài</span>
              <input
                type="number"
                min={1}
                max={50}
                value={lessonNumber}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setLessonNumber(val)
                  setLessonTitle(`Bài ${val}: Từ mới bài ${val}`)
                }}
                className="w-20 px-3 py-2 bg-white border border-border rounded-xl text-sm font-bold text-center text-china-ink focus:outline-china-red shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              3. Tiêu đề bài học
            </label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="VD: Bài 1: 你好 - Xin chào"
              className="w-full px-3 py-2 bg-white border border-border rounded-xl text-sm text-china-ink focus:outline-china-red shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setInputMode('image')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            inputMode === 'image'
              ? 'bg-china-red text-white shadow-xs'
              : 'text-muted hover:text-china-ink hover:bg-neutral-100'
          }`}
        >
          <Crop className="w-4 h-4" />
          <span>Khoanh vùng trên ảnh chụp (OCR Canvas)</span>
        </button>

        <button
          onClick={() => setInputMode('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            inputMode === 'text'
              ? 'bg-china-red text-white shadow-xs'
              : 'text-muted hover:text-china-ink hover:bg-neutral-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dán văn bản trực tiếp (Text Mode)</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      {inputMode === 'image' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas Section (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white border border-border rounded-xl shadow-xs">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-china-paper hover:bg-neutral-100 border border-border rounded-lg text-xs font-semibold text-china-ink transition">
                  <Upload className="w-3.5 h-3.5 text-china-red" />
                  <span>Tải ảnh lên</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  onClick={handleLoadSamplePage}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-china-paper hover:bg-neutral-100 border border-border rounded-lg text-xs font-semibold text-china-ink transition"
                  title="Tải ảnh trang mẫu Giáo trình chuẩn HSK 1 để thử ngay"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Trang mẫu HSK 1</span>
                </button>
              </div>

              {imageSrc && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSelectAll}
                    className="px-2.5 py-1 text-xs text-muted hover:text-china-ink rounded-lg hover:bg-neutral-100 transition"
                    title="Chọn toàn bộ ảnh"
                  >
                    <Maximize2 className="w-3.5 h-3.5 inline mr-1" />
                    Toàn trang
                  </button>
                  <button
                    onClick={handleResetCrop}
                    className="px-2.5 py-1 text-xs text-muted hover:text-china-ink rounded-lg hover:bg-neutral-100 transition"
                    title="Xóa vùng khoanh"
                  >
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                    Hủy chọn
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Canvas Viewport */}
            <div
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`relative min-h-[420px] max-h-[580px] bg-neutral-900/90 rounded-2xl overflow-hidden border border-border flex items-center justify-center select-none shadow-inner ${
                imageSrc ? 'cursor-crosshair' : ''
              }`}
            >
              {imageSrc ? (
                <>
                  {/* The Document Image */}
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Book Page"
                    className="max-h-[560px] w-auto max-w-full object-contain pointer-events-none"
                    draggable={false}
                  />

                  {/* Bounding Box Selection Highlight */}
                  {cropRect && cropRect.width > 0 && cropRect.height > 0 && (
                    <div
                      style={{
                        left: `${cropRect.x}%`,
                        top: `${cropRect.y}%`,
                        width: `${cropRect.width}%`,
                        height: `${cropRect.height}%`,
                      }}
                      className="absolute border-2 border-china-red bg-china-red/20 shadow-[0_0_15px_rgba(185,28,28,0.5)] transition-all pointer-events-none"
                    >
                      {/* Corner Badges */}
                      <span className="absolute -top-6 left-0 bg-china-red text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Vùng quét ({Math.round(cropRect.width)}% × {Math.round(cropRect.height)}%)
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-white/70">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Crop className="w-8 h-8 text-china-red" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Chưa có ảnh trang sách nào</h3>
                  <p className="text-xs text-white/60 max-w-sm mb-4">
                    Tải ảnh chụp trang sách, dán ảnh từ clipboard (Ctrl + V), hoặc bấm nút &quot;Trang mẫu HSK 1&quot; bên trên để trải nghiệm.
                  </p>
                  <button
                    onClick={handleLoadSamplePage}
                    className="px-4 py-2 bg-china-red hover:bg-china-red/90 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    Thử với Trang Mẫu Giáo trình HSK 1
                  </button>
                </div>
              )}
            </div>

            {/* Instruction Footer */}
            <div className="flex items-center justify-between text-xs text-muted px-1">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-china-red" />
                Mẹo: Bạn có thể nhấn <b>Ctrl + V</b> mọi lúc trên bàn phím để dán ảnh chụp màn hình!
              </span>
              {cropRect && (
                <span className="font-mono text-[11px] text-china-red">
                  Đã khoanh: X={Math.round(cropRect.x)}% Y={Math.round(cropRect.y)}%
                </span>
              )}
            </div>
          </div>

          {/* Right Action & Trigger Section (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-china-red/10 rounded-xl text-china-red">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-china-ink">Nhận dạng chữ Hán AI</h3>
                  <p className="text-xs text-muted">Mô hình Tesseract OCR (chi_sim) xử lý trực tiếp</p>
                </div>
              </div>

              {/* Progress status if running */}
              {isProcessing && (
                <div className="space-y-2 p-3 bg-china-paper rounded-xl border border-border">
                  <div className="flex justify-between text-xs font-semibold text-china-ink">
                    <span>{ocrStatusText}</span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-china-red h-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Run OCR button */}
              <button
                disabled={!imageSrc || isProcessing}
                onClick={runOcrOnSelection}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-china-red hover:bg-china-red/90 disabled:opacity-50 disabled:pointer-events-none transition shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {cropRect
                    ? 'Nhận diện vùng đã khoanh (OCR Selection)'
                    : 'Nhận diện toàn bộ ảnh (Scan All)'}
                </span>
              </button>

              <div className="pt-2 border-t border-border">
                <div className="text-xs font-semibold text-muted mb-2 flex items-center justify-between">
                  <span>Văn bản thô OCR nhận diện được:</span>
                  {rawExtractedText && (
                    <button
                      onClick={() => setRawExtractedText('')}
                      className="text-[11px] text-muted hover:text-china-ink underline"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={rawExtractedText}
                  onChange={(e) => setRawExtractedText(e.target.value)}
                  placeholder="Văn bản bóc tách từ ảnh sẽ hiển thị tại đây..."
                  className="w-full p-2.5 bg-china-paper border border-border rounded-xl text-xs font-mono text-china-ink focus:outline-china-red resize-none"
                />
                {rawExtractedText && (
                  <button
                    onClick={handleParseRawText}
                    className="mt-2 w-full text-xs font-semibold py-1.5 bg-neutral-100 hover:bg-neutral-200 text-china-ink rounded-lg transition"
                  >
                    Bóc tách lại vào bảng duyệt bên dưới
                  </button>
                )}
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="bg-china-paper/70 border border-border rounded-2xl p-4 text-xs space-y-2">
              <div className="font-semibold text-china-ink flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cơ chế Đối Soát Thông Minh (Auto-Verification)</span>
              </div>
              <p className="text-muted leading-relaxed">
                Khi chữ Hán được nhận diện, hệ thống tự động tra vào cơ sở dữ liệu <b>11.470 từ HSK</b> của app để lấy đúng <b>100% Pinyin có thanh điệu chuẩn</b> và nghĩa tiếng Việt, không sợ lỗi mờ dấu thanh như OCR truyền thống!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Text Direct Mode */
        <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-china-ink">Dán văn bản giáo trình hoặc danh sách từ</h3>
            <p className="text-xs text-muted">
              Dán đoạn văn, bảng từ vựng hoặc danh sách chữ Hán từ file PDF / Word / E-book vào đây:
            </p>
          </div>

          <textarea
            rows={8}
            value={rawExtractedText}
            onChange={(e) => setRawExtractedText(e.target.value)}
            placeholder={`VD:\n你 nǐ bạn, anh\n好 hǎo tốt, khỏe\n谢谢 xièxie cảm ơn\n或者直接粘贴一段中文文章...`}
            className="w-full p-3.5 bg-china-paper border border-border rounded-xl text-sm font-mono text-china-ink focus:outline-china-red resize-y"
          />

          <button
            disabled={!rawExtractedText.trim() || isProcessing}
            onClick={handleParseRawText}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-bold text-white bg-china-red hover:bg-china-red/90 disabled:opacity-50 transition shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Phân tích &amp; Điền tự động Pinyin, Hán-Việt, Nghĩa</span>
          </button>
        </div>
      )}

      {/* Verification & Review Section (The Heart of Digitization) */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif text-china-ink">
                Bảng Duyệt &amp; Hiệu Đính Từ Vựng ({words.length} từ)
              </h2>
              {words.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Sẵn sàng lưu
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Bạn có thể nghe phát âm thử, bấm trực tiếp vào ô để sửa lỗi OCR (nếu có), hoặc xóa dòng thừa trước khi lưu vào giáo trình.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-china-ink rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm từ thủ công</span>
            </button>

            {words.length > 0 && (
              <>
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-china-ink rounded-xl text-xs font-semibold transition"
                  title="Tải file JSON dự phòng"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất JSON</span>
                </button>

                <button
                  onClick={handleSaveToCurriculum}
                  className="flex items-center gap-1.5 px-4 py-2 bg-china-red hover:bg-china-red/90 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu vào Bài Học</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{saveSuccess}</span>
            </div>
            <Link
              href={`/books`}
              className="font-bold underline flex items-center gap-1 text-emerald-900 hover:text-emerald-700"
            >
              <span>Xem bài học trong Giáo trình</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Words Table */}
        {words.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-china-paper text-muted text-xs uppercase font-semibold border-b border-border">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3 w-32">Chữ Hán</th>
                  <th className="py-2.5 px-3 w-32">Pinyin</th>
                  <th className="py-2.5 px-3 w-32">Hán-Việt</th>
                  <th className="py-2.5 px-3">Nghĩa tiếng Việt</th>
                  <th className="py-2.5 px-3 w-28">Loại từ</th>
                  <th className="py-2.5 px-2 w-24 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {words.map((w, idx) => (
                  <tr key={w.id || idx} className="hover:bg-china-paper/40 transition">
                    <td className="py-2 px-3 text-center text-xs text-muted font-mono">
                      {idx + 1}
                    </td>

                    {/* Hanzi */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={w.hanzi}
                          onChange={(e) => handleUpdateWord(idx, 'hanzi', e.target.value)}
                          className="w-full font-serif font-bold text-lg text-china-ink bg-transparent hover:bg-white focus:bg-white focus:outline-china-red rounded px-1.5 py-0.5 border border-transparent hover:border-border transition"
                        />
                        <button
                          type="button"
                          onClick={() => playPronunciation(w.hanzi)}
                          className="p-1 text-muted hover:text-china-red rounded hover:bg-neutral-100 transition"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Pinyin */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={w.pinyin}
                        onChange={(e) => handleUpdateWord(idx, 'pinyin', e.target.value)}
                        placeholder="pīnyīn..."
                        className="w-full font-sans text-sm text-china-red bg-transparent hover:bg-white focus:bg-white focus:outline-china-red rounded px-1.5 py-0.5 border border-transparent hover:border-border transition"
                      />
                    </td>

                    {/* Han-Viet */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={w.hanViet}
                        onChange={(e) => handleUpdateWord(idx, 'hanViet', e.target.value)}
                        placeholder="Hán-Việt..."
                        className="w-full font-sans text-xs font-semibold text-slate-700 bg-transparent hover:bg-white focus:bg-white focus:outline-china-red rounded px-1.5 py-0.5 border border-transparent hover:border-border transition"
                      />
                    </td>

                    {/* Meaning */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={w.meaning}
                        onChange={(e) => handleUpdateWord(idx, 'meaning', e.target.value)}
                        placeholder="Nghĩa tiếng Việt..."
                        className="w-full text-xs text-china-ink bg-transparent hover:bg-white focus:bg-white focus:outline-china-red rounded px-1.5 py-0.5 border border-transparent hover:border-border transition"
                      />
                    </td>

                    {/* Part of Speech */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={w.partOfSpeech || ''}
                        onChange={(e) => handleUpdateWord(idx, 'partOfSpeech', e.target.value)}
                        placeholder="Danh từ, Động từ..."
                        className="w-full text-[11px] text-muted bg-transparent hover:bg-white focus:bg-white focus:outline-china-red rounded px-1.5 py-0.5 border border-transparent hover:border-border transition"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteWord(idx)}
                        className="p-1 text-muted hover:text-china-red rounded hover:bg-neutral-100 transition"
                        title="Xóa từ này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-muted border-2 border-dashed border-border rounded-xl">
            <Crop className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-china-ink">Chưa có từ vựng nào được quét</p>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1">
              Hãy tải ảnh trang sách và khoanh vùng bảng từ vựng, hoặc dán chữ Hán để bắt đầu số hóa.
            </p>
          </div>
        )}
      </div>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-border">
            <h3 className="text-base font-bold text-china-ink">Thêm từ mới thủ công</h3>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">
                Nhập Chữ Hán
              </label>
              <input
                type="text"
                autoFocus
                value={newHanzi}
                onChange={(e) => setNewHanzi(e.target.value)}
                placeholder="VD: 学习"
                className="w-full px-3 py-2 border border-border rounded-xl text-lg font-serif focus:outline-china-red"
              />
              {newHanzi && (
                <p className="text-xs text-muted mt-1">
                  Âm Hán-Việt tự động: <b className="text-china-red">{getHanViet(newHanzi)}</b>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewHanzi('')
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted hover:bg-neutral-100"
              >
                Hủy
              </button>
              <button
                disabled={!newHanzi.trim()}
                onClick={handleAddNewWord}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-china-red hover:bg-china-red/90 disabled:opacity-50"
              >
                Thêm vào bảng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
