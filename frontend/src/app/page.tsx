"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db, type ReviewItem, type Word } from "../../db/database"
import { importHsk } from "../../db/importContent"
import { reviewRepository } from "../../repositories/reviewRepository"
import { CircleCheckBig, BookOpen, Brain, Trophy, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function Dashboard() {
  const [wordCount, setWordCount] = useState(0)
  const [wordReview, setWordReview] = useState(0)
  const [words, setWords] = useState<Word[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])

  const getData = async () => {
    const count = await importHsk()
    setWordCount(count)
    await loadData()
  }

  const loadData = async () => {
    const allWords = await db.words.toArray()
    const allReviews = await reviewRepository.getAll()

    setWords(allWords)
    setReviews(allReviews)
    setWordCount(allWords.length)
    
    const due = allReviews.filter(r => r.dueAt <= Date.now())
    setWordReview(due.length)
  }

  useEffect(() => {
    loadData()
  }, [])

  const learning = reviews.filter(r => r.status === "learning").length
  const review = reviews.filter(r => r.status === "review").length
  const mastered = reviews.filter(r => r.status === "mastered").length
  const newWords = reviews.filter(r => r.status === "new").length

  const correct = reviews.reduce((sum, r) => sum + r.correctCount, 0)
  const wrong = reviews.reduce((sum, r) => sum + r.wrongCount, 0)
  const attempts = correct + wrong
  const accuracy = attempts ? Math.round(correct / attempts * 100) : 0

  const progress = wordCount ? Math.round(mastered / wordCount * 100) : 0

  // Phân bố từ theo HSK
  const hskData = [1, 2, 3, 4, 5, 6].map(level => {
    const levelWords = words.filter(w => w.hskLevels?.includes(level))
    const ids = new Set(levelWords.map(w => w.id))

    return {
      name: `HSK ${level}`,
      total: levelWords.length,
      learning: reviews.filter(r => ids.has(r.wordId)).length
    }
  })

  const statusData = [
    { name: "Learning", value: learning },
    { name: "Review", value: review },
    { name: "Mastered", value: mastered },
    { name: "New", value: newWords }
  ].filter(x => x.value > 0)

  const difficultWords = reviews
    .filter(r => r.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 5)
    .map(r => ({
      review: r,
      word: words.find(w => w.id === r.wordId)
    }))
    .filter(x => x.word)

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <h1 className="text-3xl font-bold">Good morning 👋</h1>

      <div className="mt-2 flex items-center gap-3">
        <p className="text-slate-500">Let's continue learning Chinese.</p>
        <button
          onClick={getData}
          className="text-sm underline hover:text-blue-600"
        >
          Get Data
        </button>
      </div>

      {/* Stats */}
      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Vocabulary" value={wordCount} icon={<BookOpen />} text="words available" />
        <Stat title="Learning" value={learning + review} icon={<Brain />} text="words in progress" />
        <Stat title="Review today" value={wordReview} icon={<Target />} text="words to review" />
        <Stat title="Mastered" value={mastered} icon={<Trophy />} text={`${progress}% completed`} />
      </section>

      {/* Charts */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">HSK Progress</h2>
          <p className="mt-1 text-sm text-slate-500">Vocabulary by HSK level</p>

          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" name="Total" fill="#cbd5e1" radius={[5, 5, 0, 0]} />
                <Bar dataKey="learning" name="Learning" fill="#3b82f6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Vocabulary Status</h2>
          <p className="mt-1 text-sm text-slate-500">Your current learning status</p>

          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={["#3b82f6", "#f59e0b", "#22c55e", "#cbd5e1"][i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="flex flex-row gap-2 items-center"> <Brain/> Learning: <b>{learning}</b></p>
            <p className="flex flex-row gap-2 items-center"> <Target/> Review: <b>{review}</b></p>
            <p className="flex flex-row gap-2 items-center"> <Trophy/> Mastered: <b>{mastered}</b></p>
            <p className="flex flex-row gap-2 items-center"> <BookOpen/> New: <b>{newWords}</b></p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Overall Progress</h2>
          <p className="mt-2 text-3xl font-bold">{progress}%</p>

          <div className="mt-3 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-blue-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {mastered} / {wordCount} words mastered
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Accuracy</h2>
          <p className="mt-2 text-3xl font-bold">{accuracy}%</p>
          <p className="mt-2 text-sm text-slate-500">
            {correct} correct · {wrong} wrong
          </p>
        </div>
      </section>

      {/* Review */}
      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Review</h2>

        {wordReview > 0 ? (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-slate-500">
              You have {wordReview} words to review.
            </p>
            <Link
              href="/review"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Review →
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <CircleCheckBig className="text-green-500" />
            <p className="text-slate-700">
              Good Job! Let's learn something new!
            </p>
          </div>
        )}
      </section>

      {/* Difficult words */}
      {difficultWords.length > 0 && (
        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Words you struggle with</h2>

          <div className="mt-4 divide-y">
            {difficultWords.map(({ word, review }) => (
              <div
                key={review.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-lg font-semibold">{word?.hanzi}</p>
                  <p className="text-sm text-slate-500">{word?.pinyin}</p>
                </div>

                <p className="text-sm text-red-500">
                  {review.wrongCount} mistakes
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function Stat({
  title,
  value,
  icon,
  text
}: {
  title: string
  value: number
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
          {icon}
        </div>
      </div>

      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  )
}