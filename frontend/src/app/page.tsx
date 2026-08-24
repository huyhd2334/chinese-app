"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db, type ReviewItem, type Word } from "../../db/database"
import { importHsk, importListening, importReading } from "../../db/importContent"
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
    await importReading()
    setWordCount(count)
    await loadData()
    await importListening()
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
    <main className="min-h-screen bg-transparent p-8 text-china-ink">
      <h1 className="text-4xl font-serif font-bold text-china-red tracking-wide">Good morning 👋</h1>

      <div className="mt-2 flex items-center gap-3">
        <p className="text-muted font-medium">Let's continue learning Chinese.</p>
        <button
          onClick={getData}
          className="text-sm underline hover:text-china-red transition-colors"
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
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <h2 className="text-xl font-semibold font-serif">HSK Progress</h2>
          <p className="mt-1 text-sm text-muted">Vocabulary by HSK level</p>

          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hskData}>
                <XAxis dataKey="name" stroke="#8c857d" />
                <YAxis stroke="#8c857d" />
                <Tooltip cursor={{fill: '#f5f0ea'}} contentStyle={{borderRadius: '8px', border: '1px solid #eae0d5'}} />
                <Bar dataKey="total" name="Total" fill="#eae0d5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="learning" name="Learning" fill="#c8102e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <h2 className="text-xl font-semibold font-serif">Vocabulary Status</h2>
          <p className="mt-1 text-sm text-muted">Your current learning status</p>

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
                    <Cell key={i} fill={["#c8102e", "#d4af37", "#366c5d", "#8c857d"][i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #eae0d5'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mt-2">
            <p className="flex flex-row gap-2 items-center text-china-ink"> <Brain className="text-china-red w-4 h-4"/> Learning: <b className="font-serif text-base">{learning}</b></p>
            <p className="flex flex-row gap-2 items-center text-china-ink"> <Target className="text-china-gold w-4 h-4"/> Review: <b className="font-serif text-base">{review}</b></p>
            <p className="flex flex-row gap-2 items-center text-china-ink"> <Trophy className="text-china-jade w-4 h-4"/> Mastered: <b className="font-serif text-base">{mastered}</b></p>
            <p className="flex flex-row gap-2 items-center text-china-ink"> <BookOpen className="text-muted w-4 h-4"/> New: <b className="font-serif text-base">{newWords}</b></p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <h2 className="text-xl font-semibold font-serif">Overall Progress</h2>
          <p className="mt-2 text-3xl font-bold font-serif text-china-jade">{progress}%</p>

          <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-china-jade"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-muted">
            {mastered} / {wordCount} words mastered
          </p>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <h2 className="text-xl font-semibold font-serif">Accuracy</h2>
          <p className="mt-2 text-3xl font-bold font-serif text-china-gold">{accuracy}%</p>
          <p className="mt-2 text-sm text-muted">
            {correct} correct · {wrong} wrong
          </p>
        </div>
      </section>

      {/* Review */}
      <section className="mt-8 rounded-xl bg-card p-6 shadow-sm border border-border">
        <h2 className="text-xl font-semibold font-serif">Review</h2>

        {wordReview > 0 ? (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-muted">
              You have {wordReview} words to review.
            </p>
            <Link
              href="/review"
              className="rounded-lg bg-china-red px-5 py-2 text-white hover:bg-china-red-hover transition-colors shadow-md shadow-china-red/20 font-medium"
            >
              Review →
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <CircleCheckBig className="text-china-jade" />
            <p className="text-china-ink font-medium">
              Good Job! Let's learn something new!
            </p>
          </div>
        )}
      </section>

      {/* Difficult words */}
      {difficultWords.length > 0 && (
        <section className="mt-8 rounded-xl bg-card p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold font-serif">Words you struggle with</h2>

          <div className="mt-4 divide-y divide-border">
            {difficultWords.map(({ word, review }) => (
              <div
                key={review.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-2xl font-semibold font-serif text-china-ink">{word?.hanzi}</p>
                  <p className="text-sm text-muted tracking-wide">{word?.pinyin}</p>
                </div>

                <p className="text-sm font-medium text-china-red">
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
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>
        <div className="rounded-lg bg-china-paper p-2 text-china-red border border-border/50">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold font-serif text-china-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </div>
  )
}