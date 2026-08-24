"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Clock, Award, BookOpen, Headset, FileText, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface Question {
  id: number
  type: string
  options?: string[]
  words?: string[]
  prompt?: string
}

interface ExamData {
  test_id: string
  level: number
  listening: {
    audio_url: string
    questions: Question[]
  }
  reading: {
    questions: Question[]
    passages: string[]
  }
  writing: {
    questions: Question[]
  }
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const [exam, setExam] = useState<ExamData | null>(null)
  const [activeTab, setActiveTab] = useState<"listening" | "reading" | "writing">("listening")
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [writingAnswers, setWritingAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(125 * 60) // 125 minutes
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/content/hsk5_exams/${id}_structured.json`)
      .then((res) => res.json())
      .then((data) => setExam(data))
      .catch((err) => console.error(err))
  }, [id])

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isSubmitted, timeLeft])

  if (!exam) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-sm text-china-ink animate-pulse">Loading exam content...</div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSelectAnswer = (qId: number, option: string) => {
    if (isSubmitted) return
    setAnswers((prev) => ({ ...prev, [qId]: option }))
  }

  const handleWritingChange = (qId: number, val: string) => {
    if (isSubmitted) return
    setWritingAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  return (
    <div className="h-full min-h-0 flex flex-col p-4 md:p-8 bg-china-paper/30 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/exams"
            className="flex items-center justify-center w-10 h-10 border border-border bg-card hover:bg-border/30 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-china-ink">
              {exam.test_id} - HSK {exam.level} Practice
            </h1>
            <p className="text-sm text-muted">Test your Chinese language proficiency</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-2xl shadow-sm text-china-ink">
            <Clock className="w-5 h-5 text-china-gold" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-china-red text-white hover:bg-china-red-hover rounded-2xl font-semibold shadow-md shadow-china-red/10 transition-colors"
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        {(["listening", "reading", "writing"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold border-b-2 transition-colors capitalize flex items-center gap-2 ${
              activeTab === tab 
                ? "border-china-red text-china-red" 
                : "border-transparent text-muted hover:text-china-ink"
            }`}
          >
            {tab === "listening" && <Headset className="w-4 h-4" />}
            {tab === "reading" && <BookOpen className="w-4 h-4" />}
            {tab === "writing" && <FileText className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full flex-1">
        
        {/* Left Side: Exam content */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === "listening" && (
            <div className="space-y-6">
              {/* Audio player card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-china-ink">Listening Section Audio</h3>
                  <p className="text-xs text-muted">Play the audio file to listen to the test questions</p>
                </div>
                {exam.listening.audio_url ? (
                  <audio controls className="w-full md:max-w-md">
                    <source src={exam.listening.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <p className="text-sm text-china-red font-medium">Audio not available</p>
                )}
              </div>

              {/* Listening questions list */}
              <div className="space-y-4">
                {exam.listening.questions.map((q) => (
                  <div key={q.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-china-red/5 text-china-red border border-china-red/10 rounded-lg text-sm font-bold">
                        {q.id}
                      </span>
                      <span className="text-xs text-muted">Listening Multiple Choice</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {q.options?.map((opt, idx) => {
                        const optChar = ["A", "B", "C", "D"][idx]
                        const isSelected = answers[q.id] === optChar
                        return (
                          <button
                            key={idx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectAnswer(q.id, optChar)}
                            className={`text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                              isSelected
                                ? "border-china-red bg-china-red/5 text-china-red shadow-sm"
                                : "border-border hover:border-china-red/30 hover:bg-border/10 text-china-ink"
                            }`}
                          >
                            <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${
                              isSelected ? "bg-china-red text-white" : "bg-border text-muted"
                            }`}>{optChar}</span>
                            <span>{opt}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reading" && (
            <div className="space-y-6">
              {/* Passages display */}
              {exam.reading.passages && exam.reading.passages.length > 0 && (
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm max-h-[400px] overflow-y-auto space-y-4">
                  <h3 className="font-serif font-bold text-lg text-china-ink border-b border-border pb-2">Reading Passages</h3>
                  {exam.reading.passages.map((p, idx) => (
                    <p key={idx} className="text-sm leading-relaxed text-china-ink indent-8 whitespace-pre-line">{p}</p>
                  ))}
                </div>
              )}

              {/* Reading questions list */}
              <div className="space-y-4">
                {exam.reading.questions.map((q) => (
                  <div key={q.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-china-red/5 text-china-red border border-china-red/10 rounded-lg text-sm font-bold">
                        {q.id}
                      </span>
                      <span className="text-xs text-muted">Reading Multiple Choice</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {q.options?.map((opt, idx) => {
                        const optChar = ["A", "B", "C", "D"][idx]
                        const isSelected = answers[q.id] === optChar
                        return (
                          <button
                            key={idx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectAnswer(q.id, optChar)}
                            className={`text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                              isSelected
                                ? "border-china-red bg-china-red/5 text-china-red shadow-sm"
                                : "border-border hover:border-china-red/30 hover:bg-border/10 text-china-ink"
                            }`}
                          >
                            <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${
                              isSelected ? "bg-china-red text-white" : "bg-border text-muted"
                            }`}>{optChar}</span>
                            <span>{opt}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "writing" && (
            <div className="space-y-6">
              {exam.writing.questions.map((q) => {
                if (q.type === "writing_sentence") {
                  return (
                    <div key={q.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-china-red/5 text-china-red border border-china-red/10 rounded-lg text-sm font-bold">
                          {q.id}
                        </span>
                        <span className="text-xs text-muted">Sentence Completion</span>
                      </div>

                      {/* Jumbled words */}
                      <div className="flex flex-wrap gap-2 mb-4 mt-2">
                        {q.words?.map((w, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-border/50 text-china-ink text-sm rounded-lg border border-border font-medium">
                            {w}
                          </span>
                        ))}
                      </div>

                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={writingAnswers[q.id] || ""}
                        onChange={(e) => handleWritingChange(q.id, e.target.value)}
                        placeholder="Reorder the words to make a complete sentence..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card text-china-ink outline-none focus:border-china-red/50 transition-colors"
                      />
                    </div>
                  )
                } else if (q.type === "writing_essay_words") {
                  return (
                    <div key={q.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-china-red/5 text-china-red border border-china-red/10 rounded-lg text-sm font-bold">
                          {q.id}
                        </span>
                        <span className="text-xs text-muted">Essay Writing (Words Prompt)</span>
                      </div>

                      <p className="text-sm text-china-ink mb-4 leading-relaxed font-medium">
                        Please write a short passage of around 80 characters using the following words:
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {q.prompt?.split("、").map((w, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-china-red/5 text-china-red text-sm rounded-lg border border-china-red/10 font-bold">
                            {w}
                          </span>
                        ))}
                      </div>

                      <textarea
                        disabled={isSubmitted}
                        value={writingAnswers[q.id] || ""}
                        onChange={(e) => handleWritingChange(q.id, e.target.value)}
                        rows={6}
                        placeholder="Write your essay here (80 characters)..."
                        className="w-full p-4 rounded-xl border border-border bg-card text-china-ink outline-none focus:border-china-red/50 transition-colors resize-none"
                      />
                    </div>
                  )
                } else if (q.type === "writing_essay_image") {
                  return (
                    <div key={q.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-china-red/5 text-china-red border border-china-red/10 rounded-lg text-sm font-bold">
                          {q.id}
                        </span>
                        <span className="text-xs text-muted">Essay Writing (Image Prompt)</span>
                      </div>

                      <p className="text-sm text-china-ink mb-4 leading-relaxed font-medium">
                        Please write a short passage of around 80 characters describing an activity or picture.
                      </p>

                      <textarea
                        disabled={isSubmitted}
                        value={writingAnswers[q.id] || ""}
                        onChange={(e) => handleWritingChange(q.id, e.target.value)}
                        rows={6}
                        placeholder="Write your essay here (80 characters)..."
                        className="w-full p-4 rounded-xl border border-border bg-card text-china-ink outline-none focus:border-china-red/50 transition-colors resize-none"
                      />
                    </div>
                  )
                }
                return null
              })}
            </div>
          )}
        </div>

        {/* Right Side: Answer Sheet & Status */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-8">
            <h3 className="font-serif font-bold text-lg text-china-ink border-b border-border pb-2 mb-4">Answer Sheet</h3>
            
            {isSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-china-jade">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">Exam Submitted!</span>
                </div>
                <p className="text-sm text-muted">
                  You have completed the mock test. You can review your selected answers and compare them with standard keys.
                </p>
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Completion Status</p>
                  <p className="text-sm">Multiple choice: {Object.keys(answers).length} / 90 answered</p>
                  <p className="text-sm">Writing: {Object.keys(writingAnswers).length} / 10 answered</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted">Click on the question cards to navigate or view your answers.</p>
                
                {/* Listening answers count */}
                <div>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Listening (1-45)</p>
                  <div className="grid grid-cols-9 gap-1.5">
                    {Array.from({ length: 45 }).map((_, idx) => {
                      const num = idx + 1
                      const answered = !!answers[num]
                      return (
                        <div
                          key={num}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border transition-colors ${
                            answered 
                              ? "bg-china-red/10 border-china-red/20 text-china-red" 
                              : "bg-border/30 border-border text-muted"
                          }`}
                        >
                          {num}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Reading answers count */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Reading (46-90)</p>
                  <div className="grid grid-cols-9 gap-1.5">
                    {Array.from({ length: 45 }).map((_, idx) => {
                      const num = idx + 46
                      const answered = !!answers[num]
                      return (
                        <div
                          key={num}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border transition-colors ${
                            answered 
                              ? "bg-china-red/10 border-china-red/20 text-china-red" 
                              : "bg-border/30 border-border text-muted"
                          }`}
                        >
                          {num}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
