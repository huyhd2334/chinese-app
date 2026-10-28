'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Trophy,
  HelpCircle,
  Layers,
  Puzzle,
  Mic
} from 'lucide-react'
import { CurriculumWord, CurriculumDialogue } from '@/types/curriculum'

interface LessonExercisesProps {
  words: CurriculumWord[]
  dialogues?: CurriculumDialogue[]
  lessonTitle?: string
}

type ExerciseType = 'match' | 'reorder' | 'quiz' | 'listening'

export default function LessonExercises({ words, dialogues, lessonTitle }: LessonExercisesProps) {
  const [activeType, setActiveType] = useState<ExerciseType>('match')

  // --- MATCH PAIRS STATE ---
  const matchWords = useMemo(() => {
    return words.slice(0, 5)
  }, [words])

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set())
  const [matchError, setMatchError] = useState(false)

  // Shuffle right items once
  const shuffledRightItems = useMemo(() => {
    return [...matchWords].sort(() => Math.random() - 0.5)
  }, [matchWords])

  // --- SENTENCE REORDER STATE ---
  const sentenceQuestions = useMemo(() => {
    const list: { fullText: string; words: string[]; pinyin?: string; vi?: string }[] = []

    if (dialogues && dialogues.length > 0) {
      dialogues.forEach((d) => {
        const clean = d.chinese.replace(/[，。？！\s]/g, '')
        if (clean.length >= 3 && clean.length <= 12) {
          // split into 2-char or 1-char tokens
          const tokens: string[] = []
          for (let i = 0; i < clean.length; ) {
            // Check if 2-char token matches any word
            const twoChar = clean.substring(i, i + 2)
            const match = words.find((w) => w.hanzi === twoChar)
            if (match && twoChar.length === 2) {
              tokens.push(twoChar)
              i += 2
            } else {
              tokens.push(clean[i])
              i++
            }
          }
          if (tokens.length >= 2) {
            list.push({
              fullText: clean,
              words: tokens,
              pinyin: d.pinyin,
              vi: d.vietnamese,
            })
          }
        }
      })
    }

    // Fallback if no dialogue fits
    if (list.length === 0 && words.length >= 3) {
      list.push({
        fullText: `${words[0].hanzi}${words[1]?.hanzi || '好'}`,
        words: [words[0].hanzi, words[1]?.hanzi || '好'],
        vi: `${words[0].meaning} ${words[1]?.meaning || ''}`,
      })
    }

    return list
  }, [dialogues, words])

  const [reorderIndex, setReorderIndex] = useState(0)
  const [userSentenceTokens, setUserSentenceTokens] = useState<string[]>([])
  const [availableTokens, setAvailableTokens] = useState<string[]>([])
  const [reorderResult, setReorderResult] = useState<'correct' | 'wrong' | null>(null)

  // Init reorder tokens when question changes
  useEffect(() => {
    if (sentenceQuestions.length > 0 && sentenceQuestions[reorderIndex]) {
      const q = sentenceQuestions[reorderIndex]
      const shuffled = [...q.words].sort(() => Math.random() - 0.5)
      setAvailableTokens(shuffled)
      setUserSentenceTokens([])
      setReorderResult(null)
    }
  }, [sentenceQuestions, reorderIndex])

  // --- MULTIPLE CHOICE QUIZ STATE ---
  const quizQuestions = useMemo(() => {
    return words.slice(0, 6).map((targetWord, idx) => {
      // Pick 3 distractors
      const distractors = words
        .filter((w) => w.id !== targetWord.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      const options = [targetWord, ...distractors].sort(() => Math.random() - 0.5)
      return {
        word: targetWord,
        options,
      }
    })
  }, [words])

  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  // Audio speech
  const playAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  // --- MATCH PAIR LOGIC ---
  const handleSelectLeftWord = (hanzi: string) => {
    if (matchedPairs.has(hanzi)) return
    setSelectedLeft(hanzi)

    if (selectedRight) {
      checkMatch(hanzi, selectedRight)
    }
  }

  const handleSelectRightMeaning = (hanziKey: string) => {
    if (matchedPairs.has(hanziKey)) return
    setSelectedRight(hanziKey)

    if (selectedLeft) {
      checkMatch(selectedLeft, hanziKey)
    }
  }

  const checkMatch = (left: string, right: string) => {
    if (left === right) {
      // Correct match!
      playAudio(left)
      const newMatched = new Set(matchedPairs)
      newMatched.add(left)
      setMatchedPairs(newMatched)
      setSelectedLeft(null)
      setSelectedRight(null)
    } else {
      // Mismatch
      setMatchError(true)
      setTimeout(() => {
        setMatchError(false)
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 700)
    }
  }

  const handleResetMatch = () => {
    setMatchedPairs(new Set())
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  // --- REORDER LOGIC ---
  const handlePickToken = (token: string, indexInAvailable: number) => {
    setUserSentenceTokens((prev) => [...prev, token])
    setAvailableTokens((prev) => prev.filter((_, i) => i !== indexInAvailable))
    setReorderResult(null)
  }

  const handleReturnToken = (token: string, indexInUser: number) => {
    setUserSentenceTokens((prev) => prev.filter((_, i) => i !== indexInUser))
    setAvailableTokens((prev) => [...prev, token])
    setReorderResult(null)
  }

  const handleCheckSentence = () => {
    const q = sentenceQuestions[reorderIndex]
    const assembled = userSentenceTokens.join('')
    if (assembled === q.fullText) {
      setReorderResult('correct')
      playAudio(q.fullText)
    } else {
      setReorderResult('wrong')
    }
  }

  // --- QUIZ LOGIC ---
  const handleSelectQuiz = (optionWordId: string) => {
    if (selectedQuizAnswer !== null) return
    setSelectedQuizAnswer(optionWordId)

    const currentQ = quizQuestions[quizIndex]
    if (optionWordId === currentQ.word.id) {
      setQuizScore((prev) => prev + 1)
      playAudio(currentQ.word.hanzi)
    }
  }

  const handleNextQuiz = () => {
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex((prev) => prev + 1)
      setSelectedQuizAnswer(null)
    } else {
      setQuizFinished(true)
    }
  }

  const handleResetQuiz = () => {
    setQuizIndex(0)
    setSelectedQuizAnswer(null)
    setQuizScore(0)
    setQuizFinished(false)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Exercise Mode Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-china-paper border border-border rounded-2xl">
        <button
          onClick={() => setActiveType('match')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeType === 'match'
              ? 'bg-china-red text-white shadow-xs'
              : 'text-muted hover:text-china-ink hover:bg-white'
          }`}
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span>1. Nối từ với nghĩa (Match)</span>
        </button>

        {sentenceQuestions.length > 0 && (
          <button
            onClick={() => setActiveType('reorder')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeType === 'reorder'
                ? 'bg-china-red text-white shadow-xs'
                : 'text-muted hover:text-china-ink hover:bg-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Ghép câu hoàn chỉnh (Sentence)</span>
          </button>
        )}

        {quizQuestions.length > 0 && (
          <button
            onClick={() => setActiveType('quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeType === 'quiz'
                ? 'bg-china-red text-white shadow-xs'
                : 'text-muted hover:text-china-ink hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Trắc nghiệm từ mới (Quiz)</span>
          </button>
        )}

        {words.length > 0 && (
          <button
            onClick={() => setActiveType('listening')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeType === 'listening'
                ? 'bg-china-red text-white shadow-xs'
                : 'text-muted hover:text-china-ink hover:bg-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>4. Luyện nghe chọn chữ (Listening)</span>
          </button>
        )}
      </div>

      {/* EXERCISE 1: MATCHING PAIRS */}
      {activeType === 'match' && (
        <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-china-ink">
                Bài tập 1: Nối chữ Hán với nghĩa tiếng Việt
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Bấm vào 1 ô chữ Hán ở cột trái, rồi bấm ô nghĩa tương ứng ở cột phải để nối cặp.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Đã nối: {matchedPairs.size} / {matchWords.length}
              </span>
              <button
                onClick={handleResetMatch}
                className="p-1.5 text-muted hover:text-china-ink hover:bg-china-paper rounded-lg transition"
                title="Làm lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {matchedPairs.size === matchWords.length ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-china-ink">Tuyệt vời! Bạn đã nối đúng tất cả các từ!</h4>
              <p className="text-xs text-muted">Vốn từ vựng bài học này của bạn rất vững chắc.</p>
              <button
                onClick={handleResetMatch}
                className="px-4 py-2 bg-china-red text-white text-xs font-bold rounded-xl shadow-xs hover:bg-china-red/90 transition"
              >
                Chơi lại một lần nữa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column: Hanzi */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider text-center">
                  Chữ Hán
                </h4>
                {matchWords.map((w) => {
                  const isDone = matchedPairs.has(w.hanzi)
                  const isSelected = selectedLeft === w.hanzi

                  return (
                    <button
                      key={w.id}
                      disabled={isDone}
                      onClick={() => handleSelectLeftWord(w.hanzi)}
                      className={`w-full p-4 rounded-2xl border text-center font-serif text-2xl font-bold transition-all shadow-xs ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-50 cursor-default'
                          : isSelected
                          ? 'bg-china-red text-white border-china-red scale-[1.02] shadow-md'
                          : matchError && isSelected
                          ? 'bg-red-100 border-red-400 text-red-700 animate-shake'
                          : 'bg-china-paper/60 border-border hover:bg-white hover:border-china-red/50 text-china-ink'
                      }`}
                    >
                      {w.hanzi}
                    </button>
                  )
                })}
              </div>

              {/* Right Column: Vietnamese Meaning + Pinyin */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider text-center">
                  Phiên âm &amp; Nghĩa
                </h4>
                {shuffledRightItems.map((w) => {
                  const isDone = matchedPairs.has(w.hanzi)
                  const isSelected = selectedRight === w.hanzi

                  return (
                    <button
                      key={w.id}
                      disabled={isDone}
                      onClick={() => handleSelectRightMeaning(w.hanzi)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all shadow-xs ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-50 cursor-default'
                          : isSelected
                          ? 'bg-china-red text-white border-china-red scale-[1.02] shadow-md'
                          : matchError && isSelected
                          ? 'bg-red-100 border-red-400 text-red-700 animate-shake'
                          : 'bg-china-paper/60 border-border hover:bg-white hover:border-china-red/50 text-china-ink'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold font-sans ${isSelected ? 'text-white' : 'text-china-red'}`}>
                          {w.pinyin}
                        </span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <p className={`text-xs mt-1 font-medium truncate ${isSelected ? 'text-white/95' : 'text-china-ink'}`}>
                        {w.meaning}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXERCISE 2: SENTENCE REORDER */}
      {activeType === 'reorder' && sentenceQuestions.length > 0 && (
        <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-china-ink">
                Bài tập 2: Sắp xếp các từ thành câu hoàn chỉnh
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Câu {reorderIndex + 1} / {sentenceQuestions.length}
              </p>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-china-paper text-china-ink border border-border">
              HSK Standard Course
            </span>
          </div>

          {/* Meaning Prompt */}
          <div className="p-4 bg-china-paper/70 border border-border rounded-2xl space-y-1">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              Nghĩa tiếng Việt của câu:
            </span>
            <p className="text-base font-bold text-china-ink">
              &quot;{sentenceQuestions[reorderIndex].vi}&quot;
            </p>
          </div>

          {/* User Assembled Sentence Area */}
          <div className="min-h-[70px] p-4 bg-neutral-50 border-2 border-dashed border-border rounded-2xl flex flex-wrap items-center gap-2">
            {userSentenceTokens.length > 0 ? (
              userSentenceTokens.map((token, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReturnToken(token, idx)}
                  className="px-3.5 py-2 bg-china-red text-white font-serif text-lg font-bold rounded-xl shadow-xs hover:bg-china-red/90 transition transform active:scale-95"
                  title="Bấm để bỏ từ này về hàng dưới"
                >
                  {token}
                </button>
              ))
            ) : (
              <span className="text-xs text-muted mx-auto">
                Chạm vào các từ bên dưới theo đúng thứ tự để xếp câu
              </span>
            )}
          </div>

          {/* Result Alert */}
          {reorderResult === 'correct' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">Chính xác! Cấu trúc câu chuẩn ngữ pháp.</span>
              </div>
              <button
                onClick={() => playAudio(sentenceQuestions[reorderIndex].fullText)}
                className="p-1 hover:text-emerald-900"
                title="Nghe lại câu"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {reorderResult === 'wrong' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="font-bold">Chưa đúng thứ tự, hãy bấm vào từ để sắp xếp lại nhé!</span>
            </div>
          )}

          {/* Available Word Tokens */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted">Từ vựng khả dụng:</span>
            <div className="flex flex-wrap items-center gap-2.5">
              {availableTokens.map((token, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickToken(token, idx)}
                  className="px-4 py-2.5 bg-white border border-border hover:border-china-red font-serif text-lg font-bold text-china-ink rounded-xl shadow-xs hover:bg-china-paper transition transform active:scale-95"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => {
                const q = sentenceQuestions[reorderIndex]
                setAvailableTokens([...q.words].sort(() => Math.random() - 0.5))
                setUserSentenceTokens([])
                setReorderResult(null)
              }}
              className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-china-ink rounded-lg transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xếp lại</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={userSentenceTokens.length === 0}
                onClick={handleCheckSentence}
                className="px-4 py-2 bg-china-red text-white text-xs font-bold rounded-xl shadow-xs hover:bg-china-red/90 disabled:opacity-50 transition"
              >
                Kiểm tra câu
              </button>

              {reorderIndex + 1 < sentenceQuestions.length && (
                <button
                  onClick={() => setReorderIndex((prev) => prev + 1)}
                  className="px-3.5 py-2 bg-china-paper hover:bg-neutral-100 text-china-ink text-xs font-bold rounded-xl border border-border transition flex items-center gap-1"
                >
                  <span>Câu kế</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE 3: MULTIPLE CHOICE QUIZ */}
      {activeType === 'quiz' && quizQuestions.length > 0 && (
        <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-china-ink">
                Bài tập 3: Trắc nghiệm nhận biết nghĩa &amp; Chữ Hán
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Câu {quizIndex + 1} / {quizQuestions.length}
              </p>
            </div>

            <span className="text-xs font-semibold text-china-red bg-china-red/10 px-2.5 py-1 rounded-lg">
              Điểm: {quizScore} / {quizQuestions.length}
            </span>
          </div>

          {!quizFinished ? (
            <div className="space-y-6">
              {/* Question Box */}
              <div className="p-6 bg-china-paper/60 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Chọn chữ Hán có nghĩa là:
                </span>
                <p className="text-xl sm:text-2xl font-bold text-china-ink">
                  &quot;{quizQuestions[quizIndex].word.meaning}&quot;
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-sm font-sans font-semibold text-china-red">
                    {quizQuestions[quizIndex].word.pinyin}
                  </span>
                  <button
                    onClick={() => playAudio(quizQuestions[quizIndex].word.hanzi)}
                    className="p-1 text-muted hover:text-china-red rounded-full"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-3.5">
                {quizQuestions[quizIndex].options.map((opt) => {
                  const isSelected = selectedQuizAnswer === opt.id
                  const isCorrect = opt.id === quizQuestions[quizIndex].word.id

                  let btnStyle = 'bg-white border-border hover:border-china-red/50 text-china-ink'
                  if (selectedQuizAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                    } else if (isSelected) {
                      btnStyle = 'bg-red-50 border-red-400 text-red-800'
                    } else {
                      btnStyle = 'bg-neutral-50 border-border text-muted opacity-50'
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={selectedQuizAnswer !== null}
                      onClick={() => handleSelectQuiz(opt.id)}
                      className={`p-5 rounded-2xl border text-center font-serif text-3xl font-bold transition shadow-xs ${btnStyle}`}
                    >
                      {opt.hanzi}
                    </button>
                  )
                })}
              </div>

              {/* Next Question Bar */}
              {selectedQuizAnswer !== null && (
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-semibold text-muted">
                    {selectedQuizAnswer === quizQuestions[quizIndex].word.id ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đúng rồi!
                      </span>
                    ) : (
                      <span className="text-red-700 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Đáp án đúng là:{' '}
                        <b className="font-serif text-base ml-1">
                          {quizQuestions[quizIndex].word.hanzi}
                        </b>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    className="px-4 py-2 bg-china-red text-white text-xs font-bold rounded-xl shadow-xs hover:bg-china-red/90 transition flex items-center gap-1"
                  >
                    <span>
                      {quizIndex + 1 < quizQuestions.length ? 'Câu tiếp theo' : 'Xem kết quả'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Screen */
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-china-ink">
                Hoàn thành phần trắc nghiệm!
              </h4>
              <p className="text-sm text-muted">
                Bạn đạt được{' '}
                <span className="text-china-red font-bold text-lg">
                  {quizScore} / {quizQuestions.length}
                </span>{' '}
                câu đúng ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </p>
              <button
                onClick={handleResetQuiz}
                className="px-5 py-2.5 bg-china-red text-white text-xs font-bold rounded-xl shadow-xs hover:bg-china-red/90 transition"
              >
                Luyện tập lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* EXERCISE 4: LISTENING QUIZ */}
      {activeType === 'listening' && words.length > 0 && (
        <div className="bg-white border border-border rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-china-ink">
                Bài tập 4: Luyện nghe và nhận diện chữ Hán
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Bấm vào loa để nghe giọng đọc bản xứ, sau đó chọn chữ Hán bạn vừa nghe được.
              </p>
            </div>
          </div>

          <div className="text-center py-6 space-y-4">
            <button
              onClick={() => playAudio(quizQuestions[quizIndex]?.word?.hanzi || words[0].hanzi)}
              className="w-20 h-20 rounded-full bg-china-red/10 hover:bg-china-red hover:text-white text-china-red flex items-center justify-center mx-auto transition transform hover:scale-105 shadow-sm"
              title="Nghe phát âm"
            >
              <Volume2 className="w-10 h-10" />
            </button>
            <p className="text-xs font-medium text-muted">Chạm vào biểu tượng loa để nghe lại</p>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-3.5">
            {quizQuestions[quizIndex]?.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  playAudio(opt.hanzi)
                  handleSelectQuiz(opt.id)
                }}
                className="p-5 bg-china-paper/60 border border-border hover:border-china-red hover:bg-white rounded-2xl text-center font-serif text-3xl font-bold text-china-ink transition shadow-xs"
              >
                {opt.hanzi}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
