"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { type Word } from "../../../db/database"
import { Volume2, X, RotateCw, CheckCircle2, XCircle, Trophy, Sparkles, Headphones, Eye } from "lucide-react"

interface VocabQuizModalProps {
  isOpen: boolean
  onClose: () => void
  words: Word[]
  onWordMastered?: (wordId: string) => void
}

interface Question {
  word: Word
  options: string[]
  correctIndex: number
}

export default function VocabQuizModal({ isOpen, onClose, words, onWordMastered }: VocabQuizModalProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isListeningMode, setIsListeningMode] = useState(false)

  // Web Speech API
  const playAudio = useCallback((text?: string) => {
    if (!text) return
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  // Generate 10 randomized quiz questions
  const generateQuiz = useCallback(() => {
    if (words.length < 4) return

    // Shuffle words
    const shuffledWords = [...words].sort(() => Math.random() - 0.5)
    const selectedPool = shuffledWords.slice(0, Math.min(10, words.length))

    const newQuestions: Question[] = selectedPool.map((currentWord) => {
      const correctMeaning = currentWord.meanings_vi?.[0] || currentWord.meanings?.[0] || "Nghĩa"

      // Pick 3 random distractors from remaining words
      const distractors: string[] = []
      const otherWords = words.filter(w => w.id !== currentWord.id).sort(() => Math.random() - 0.5)

      for (const other of otherWords) {
        const meaning = other.meanings_vi?.[0] || other.meanings?.[0]
        if (meaning && meaning !== correctMeaning && !distractors.includes(meaning)) {
          distractors.push(meaning)
          if (distractors.length >= 3) break
        }
      }

      // If not enough distractors, fill fallback
      while (distractors.length < 3) {
        distractors.push(`Lựa chọn ${distractors.length + 1}`)
      }

      // Random position for correct answer
      const correctIndex = Math.floor(Math.random() * 4)
      const options = [...distractors]
      options.splice(correctIndex, 0, correctMeaning)

      return {
        word: currentWord,
        options,
        correctIndex
      }
    })

    setQuestions(newQuestions)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setIsFinished(false)

    // Play first audio if in listening mode
    if (isListeningMode && newQuestions.length > 0) {
      playAudio(newQuestions[0].word.hanzi)
    }
  }, [words, isListeningMode, playAudio])

  useEffect(() => {
    if (isOpen) {
      generateQuiz()
    }
  }, [isOpen, generateQuiz])

  const currentQ = questions[currentIndex]

  // Handle option select
  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return

    setSelectedOption(idx)
    setIsAnswered(true)

    const isCorrect = idx === currentQ.correctIndex
    if (isCorrect) {
      setScore(prev => prev + 1)
      if (onWordMastered) {
        onWordMastered(currentQ.word.id)
      }
    }

    // Auto advance after 1.2s
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1)
        setSelectedOption(null)
        setIsAnswered(false)
        if (isListeningMode && questions[currentIndex + 1]) {
          playAudio(questions[currentIndex + 1].word.hanzi)
        }
      } else {
        setIsFinished(true)
      }
    }, 1200)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-china-paper/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-china-red/10 text-china-red rounded-xl">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-china-ink text-sm sm:text-base">Mini Quiz Trắc Nghiệm</h3>
              <p className="text-[11px] text-muted">
                {isFinished ? "Hoàn thành" : `Câu ${currentIndex + 1} / ${questions.length} • Điểm: ${score}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Listening Mode */}
            <button
              onClick={() => {
                const nextMode = !isListeningMode
                setIsListeningMode(nextMode)
                if (nextMode && currentQ) {
                  playAudio(currentQ.word.hanzi)
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                isListeningMode 
                  ? "bg-china-jade text-white" 
                  : "bg-white border border-border text-muted hover:text-china-ink"
              }`}
              title="Bật chế độ luyện nghe: Ẩn mặt chữ Hán, chỉ nghe phát âm để chọn nghĩa!"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isListeningMode ? "Chế độ nghe" : "Luyện nghe"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-china-ink hover:bg-border/40 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isFinished && currentQ ? (
          <div className="p-5 sm:p-7 flex flex-col items-center">
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-border/50 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-china-gold transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="w-full bg-white rounded-2xl border border-border p-6 shadow-xs flex flex-col items-center justify-center text-center relative mb-6 min-h-[140px]">
              {/* Level Badge */}
              {currentQ.word.hskLevel && currentQ.word.hskLevel.length > 0 && (
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-china-red/10 text-china-red text-[10px] font-bold rounded-md">
                  HSK {currentQ.word.hskLevel[0]}
                </span>
              )}

              {/* Speaker */}
              <button
                onClick={() => playAudio(currentQ.word.hanzi)}
                className="absolute top-3 right-3 p-1.5 text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Hanzi Presentation (or hidden in listening mode) */}
              {isListeningMode ? (
                <div className="flex flex-col items-center py-2">
                  <div className="w-14 h-14 rounded-full bg-china-jade/10 text-china-jade flex items-center justify-center mb-2 animate-pulse">
                    <Headphones className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-muted font-medium">Nghe phát âm và chọn nghĩa đúng</p>
                  <button
                    onClick={() => playAudio(currentQ.word.hanzi)}
                    className="mt-2 text-xs text-china-red font-semibold hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" /> Nghe lại
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-5xl sm:text-6xl font-serif font-bold text-china-ink mb-1 select-none">
                    {currentQ.word.hanzi}
                  </h2>
                  <p className="text-base text-china-red font-medium">
                    {currentQ.word.pinyin}
                  </p>
                </>
              )}
            </div>

            {/* 4 Choices Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx
                const isCorrect = idx === currentQ.correctIndex

                let btnStyle = "bg-white border-border text-china-ink hover:border-china-red/40 hover:bg-china-paper"
                let icon = null

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold shadow-xs scale-[1.01]"
                    icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-red-50 border-red-300 text-red-700 font-semibold"
                    icon = <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  } else {
                    btnStyle = "bg-gray-50 border-gray-200 text-muted opacity-60"
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all shadow-2xs active:scale-98 ${btnStyle}`}
                  >
                    <span className="line-clamp-2 pr-2">{option}</span>
                    {icon}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* Finished State */
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-china-gold/15 text-china-gold flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-china-ink mb-1">Hoàn thành bài Quiz!</h3>
            <p className="text-xs sm:text-sm text-muted mb-6">Bạn đã hoàn thành 10 câu trắc nghiệm tốc độ</p>

            <div className="p-5 rounded-2xl bg-china-paper border border-border w-full max-w-xs mb-6 text-center">
              <p className="text-xs uppercase tracking-wider text-muted font-bold mb-1">Kết quả của bạn</p>
              <div className="text-4xl font-serif font-bold text-china-red">
                {score} / {questions.length}
              </div>
              <p className="text-xs text-muted mt-2">
                {score >= 8 ? "🌟 Xuất sắc! Phản xạ rất tuyệt vời!" : score >= 5 ? "👍 Khá tốt! Hãy tiếp tục rèn luyện!" : "💪 Hãy ôn tập lại và thử lại nhé!"}
              </p>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={generateQuiz}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-border bg-card text-china-ink font-medium text-xs sm:text-sm hover:bg-china-paper transition-colors shadow-xs"
              >
                <RotateCw className="w-3.5 h-3.5" /> Chơi lại
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-china-red text-white font-medium text-xs sm:text-sm hover:bg-china-red-hover transition-colors shadow-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
