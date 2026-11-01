"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import {
  Clock,
  BookOpen,
  Headset,
  FileText,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Square
} from "lucide-react"
import { ALL_EXAMS } from "@/data/examsManifest"
import { playChineseAudio, stopAllAudio } from "@/utils/audioTts"

interface UnifiedQuestion {
  id: number
  section: "listening" | "reading" | "writing"
  prompt?: string
  stem?: string
  context?: string
  options?: string[]
  correctIndex?: number
  correctOption?: string
  explanation?: string
  audioUrl?: string
  words?: string[]
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const examMeta = ALL_EXAMS.find((e) => e.id === id) || ALL_EXAMS[0]

  const [questions, setQuestions] = useState<UnifiedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"listening" | "reading" | "writing">("listening")
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(examMeta.timeMinutes * 60)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [playingQId, setPlayingQId] = useState<number | null>(null)

  const handlePlayAudio = (q: UnifiedQuestion) => {
    if (playingQId === q.id) {
      stopAllAudio()
      setPlayingQId(null)
      return
    }

    stopAllAudio()
    setPlayingQId(q.id)

    // Chuẩn bị nội dung để đọc
    let textToSpeak = q.context || q.prompt || q.stem || ""
    textToSpeak = textToSpeak.replace(/^录音\s*[:：]?\s*/g, "").trim()

    // 1. Thử phát từ audioUrl (qua proxy nếu là URL ngoài để vượt tường lửa CORS)
    if (q.audioUrl && (q.audioUrl.startsWith("http://") || q.audioUrl.startsWith("https://"))) {
      const proxiedUrl = `/api/audio-proxy?url=${encodeURIComponent(q.audioUrl)}`
      const audio = new Audio(proxiedUrl)
      audio.onended = () => setPlayingQId(null)
      audio.onerror = () => {
        // Fallback sang TTS nếu URL hỏng
        if (textToSpeak) {
          playChineseAudio(textToSpeak, { rate: 0.9, lang: "zh" })
          setTimeout(() => setPlayingQId(null), 4000)
        } else {
          setPlayingQId(null)
        }
      }
      audio.play().catch(() => {
        if (textToSpeak) {
          playChineseAudio(textToSpeak, { rate: 0.9, lang: "zh" })
          setTimeout(() => setPlayingQId(null), 4000)
        } else {
          setPlayingQId(null)
        }
      })
      return
    }

    // 2. Sử dụng Speech Engine / TTS tích hợp
    if (textToSpeak) {
      playChineseAudio(textToSpeak, { rate: 0.88, lang: "zh" })
      // Tự động reset icon sau thời gian ước lượng
      const estimatedDurationMs = Math.max(3000, textToSpeak.length * 280)
      setTimeout(() => {
        setPlayingQId((curr) => (curr === q.id ? null : curr))
      }, estimatedDurationMs)
    } else {
      setPlayingQId(null)
    }
  }

  // Load and adapt exam data
  useEffect(() => {
    async function loadExam() {
      setLoading(true)
      try {
        const res = await fetch(examMeta.sourceFile)
        const data = await res.json()

        const unified: UnifiedQuestion[] = []

        if (examMeta.type === "hsk4_mock" && Array.isArray(data.questions)) {
          // Format Make-dream-clear HSK 4
          data.questions.forEach((q: {
            number: number
            type: string
            stem?: string
            text?: string
            prompt?: string
            audio?: string
            options?: string[]
            correct_answer_index?: number
          }) => {
            const isListening = q.type?.includes("listening")
            const isWriting = q.type?.includes("writing")
            const section: "listening" | "reading" | "writing" = isListening
              ? "listening"
              : isWriting
              ? "writing"
              : "reading"

            unified.push({
              id: q.number,
              section,
              prompt: q.text || q.prompt || q.stem || (isListening ? "Nghe và chọn đáp án đúng" : "Chọn đáp án đúng"),
              options: q.options || [],
              correctIndex: q.correct_answer_index,
              audioUrl: q.audio,
            })
          })
        } else if (Array.isArray(data.items)) {
          // Format Shengdabai HSK 1-6
          data.items.forEach((item: {
            id: string
            sectionCode?: string
            questionTypeCode?: string
            prompt?: string
            stem?: string
            context?: string
            explanation?: string
            options?: Array<{ id: string; label: string; text: string }>
            correctOptionId?: string
            audioUrl?: string
          }, idx: number) => {
            const secStr = item.sectionCode || ""
            const section: "listening" | "reading" | "writing" = secStr.includes("listen")
              ? "listening"
              : secStr.includes("writ")
              ? "writing"
              : "reading"

            const opts = item.options?.map((o) => o.text || o.label) || []
            const corrIdx = item.options?.findIndex((o) => o.id === item.correctOptionId || o.label === item.correctOptionId)

            unified.push({
              id: idx + 1,
              section,
              stem: item.stem,
              prompt: item.prompt,
              context: item.context,
              options: opts,
              correctIndex: corrIdx !== -1 ? corrIdx : undefined,
              correctOption: item.correctOptionId,
              explanation: item.explanation,
              audioUrl: item.audioUrl,
            })
          })
        }

        setQuestions(unified)
      } catch (err) {
        console.error("Failed to load exam data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadExam()
  }, [examMeta])

  // Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isSubmitted, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (isSubmitted) return
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }))
  }

  const filteredQuestions = questions.filter((q) => q.section === activeTab)

  // Calculate score
  const totalGraded = questions.filter((q) => q.correctIndex !== undefined).length
  const correctCount = questions.reduce((acc, q) => {
    if (q.correctIndex !== undefined && answers[q.id] === q.correctIndex) {
      return acc + 1
    }
    return acc
  }, 0)
  const scorePercent = totalGraded > 0 ? Math.round((correctCount / totalGraded) * 100) : 0
  const isPassed = scorePercent >= 60

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-china-red/30 border-t-china-red rounded-full animate-spin" />
        <p className="text-sm text-china-ink font-medium">Đang tải nội dung đề thi...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-background text-china-ink">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link
            href="/exams"
            className="flex items-center justify-center w-10 h-10 border border-border bg-card hover:bg-border/30 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-china-red/10 text-china-red text-xs font-bold rounded">
                HSK {examMeta.level}
              </span>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-china-ink">
                {examMeta.title}
              </h1>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Tổng số {questions.length} câu hỏi · Thời gian: {examMeta.timeMinutes} phút
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-2xl shadow-sm">
            <Clock className={`w-5 h-5 ${timeLeft < 300 ? "text-china-red animate-pulse" : "text-china-gold"}`} />
            <span className="font-mono font-bold text-base md:text-lg">{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              className="px-5 py-2.5 bg-china-red text-white hover:bg-china-red-hover rounded-2xl font-semibold shadow-md shadow-china-red/10 transition-colors text-sm"
            >
              Nộp bài thi
            </button>
          ) : (
            <button
              onClick={() => {
                setAnswers({})
                setIsSubmitted(false)
                setTimeLeft(examMeta.timeMinutes * 60)
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-card border border-border text-china-ink hover:bg-border/20 rounded-2xl font-semibold transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại
            </button>
          )}
        </div>
      </div>

      {/* Result Card after submit */}
      {isSubmitted && (
        <div className="max-w-7xl mx-auto w-full mb-8 p-6 rounded-3xl border border-border bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isPassed ? (
                <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-sm rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> ĐẠT YÊU CẦU (PASS)
                </span>
              ) : (
                <span className="px-3 py-1 bg-china-red/10 text-china-red font-bold text-sm rounded-full flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> CHƯA ĐẠT (Cần ôn luyện thêm)
                </span>
              )}
            </div>
            <h2 className="text-2xl font-serif font-bold text-china-ink">
              Điểm số: {scorePercent}% ({correctCount}/{totalGraded} câu đúng)
            </h2>
            <p className="text-xs text-muted mt-1">
              Điểm chuẩn đỗ HSK là 60%. Bạn có thể xem lại chi tiết từng câu hỏi bên dưới.
            </p>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="p-3 bg-border/20 rounded-2xl min-w-[90px]">
              <p className="text-xs text-muted">Đã làm</p>
              <p className="text-lg font-bold text-china-ink">{Object.keys(answers).length}/{questions.length}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-2xl min-w-[90px]">
              <p className="text-xs text-green-600 dark:text-green-400">Số câu đúng</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{correctCount}</p>
            </div>
            <div className="p-3 bg-china-red/10 rounded-2xl min-w-[90px]">
              <p className="text-xs text-china-red">Số câu sai</p>
              <p className="text-lg font-bold text-china-red">{totalGraded - correctCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6 max-w-7xl mx-auto w-full">
        {(["listening", "reading", "writing"] as const).map((tab) => {
          const count = questions.filter((q) => q.section === tab).length
          if (count === 0) return null
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold border-b-2 transition-colors capitalize flex items-center gap-2 text-sm ${
                activeTab === tab
                  ? "border-china-red text-china-red"
                  : "border-transparent text-muted hover:text-china-ink"
              }`}
            >
              {tab === "listening" && <Headset className="w-4 h-4" />}
              {tab === "reading" && <BookOpen className="w-4 h-4" />}
              {tab === "writing" && <FileText className="w-4 h-4" />}
              <span>{tab === "listening" ? "Phần Nghe" : tab === "reading" ? "Phần Đọc" : "Phần Viết"}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-border/40 text-muted font-mono">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Questions List */}
      <div className="max-w-7xl mx-auto w-full space-y-4 flex-1">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm">
            Không có câu hỏi nào trong phần này.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const userAnswer = answers[q.id]
            const isAnswered = userAnswer !== undefined
            const isCorrect = isAnswered && q.correctIndex !== undefined && userAnswer === q.correctIndex
            const isWrong = isSubmitted && isAnswered && !isCorrect

            return (
              <div
                key={q.id}
                className={`bg-card border rounded-3xl p-5 md:p-6 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? "border-green-500/40 bg-green-500/[0.02]"
                      : isWrong
                      ? "border-china-red/40 bg-china-red/[0.02]"
                      : "border-border"
                    : "border-border"
                }`}
              >
                {/* Header question */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 flex items-center justify-center bg-china-red/10 text-china-red rounded-lg text-xs font-bold font-mono">
                      {q.id}
                    </span>
                    {q.stem && <span className="text-xs text-muted font-medium">{q.stem}</span>}
                  </div>

                  {isSubmitted && q.correctIndex !== undefined && (
                    <div>
                      {isCorrect ? (
                        <span className="px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-lg flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Sai
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Audio Player for Listening or question prompt */}
                {q.section === "listening" ? (
                  <div className="mb-4 flex flex-wrap items-center gap-3 p-3 bg-border/20 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(q)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                        playingQId === q.id
                          ? "bg-china-red text-white shadow-china-red/20 animate-pulse"
                          : "bg-card border border-border text-china-ink hover:border-china-red hover:text-china-red"
                      }`}
                    >
                      {playingQId === q.id ? (
                        <Square className="w-4 h-4 fill-current text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-china-red" />
                      )}
                      <span>
                        {playingQId === q.id ? "Đang phát âm thanh... (Bấm để dừng)" : "Phát bài nghe Audio"}
                      </span>
                    </button>

                    <span className="text-xs text-muted">
                      (Bấm để nghe đoạn hội thoại và câu hỏi)
                    </span>
                  </div>
                ) : (
                  // If reading/writing has prompt, provide small audio button
                  q.prompt && (
                    <div className="mb-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(q)}
                        className="p-1.5 rounded-lg border border-border bg-card hover:bg-border/30 text-muted hover:text-china-ink transition-colors"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                )}

                {/* Context (Transcript bài nghe: Ẩn khi đang làm bài nghe, hiện khi nộp bài; Bài đọc: Hiện bình thường) */}
                {q.context && (q.section !== "listening" || isSubmitted) && (
                  <div className="p-3.5 rounded-2xl bg-border/20 text-sm leading-relaxed text-china-ink mb-4 font-serif">
                    {q.section === "listening" && (
                      <span className="block text-xs font-bold text-china-red mb-1 font-sans">
                        [Transcript bài nghe]:
                      </span>
                    )}
                    {q.context}
                  </div>
                )}

                {/* Prompt */}
                {q.prompt && (
                  <p className="text-base font-medium text-china-ink mb-4">
                    {q.prompt}
                  </p>
                )}

                {/* Options */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const optLabel = ["A", "B", "C", "D", "E", "F"][optIdx] || `${optIdx + 1}`
                      const isSelected = userAnswer === optIdx
                      const isActualCorrect = isSubmitted && q.correctIndex === optIdx

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`text-left p-3.5 rounded-2xl border text-sm font-medium transition-all flex items-center gap-3 ${
                            isActualCorrect
                              ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 font-semibold"
                              : isSelected
                              ? isWrong
                                ? "border-china-red bg-china-red/10 text-china-red"
                                : "border-china-red bg-china-red/5 text-china-red shadow-sm"
                              : "border-border hover:border-china-red/30 hover:bg-border/10 text-china-ink"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 ${
                              isActualCorrect
                                ? "bg-green-500 text-white"
                                : isSelected
                                ? isWrong
                                  ? "bg-china-red text-white"
                                  : "bg-china-red text-white"
                                : "bg-border text-muted"
                            }`}
                          >
                            {optLabel}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Explanation if submitted */}
                {isSubmitted && q.explanation && (
                  <div className="mt-4 p-3.5 bg-china-gold/10 border border-china-gold/20 rounded-2xl text-xs text-china-ink flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-china-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Giải thích: </span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
