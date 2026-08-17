"use client"
import { useEffect, useState } from "react"
import { db } from "../../db/database"
import Link from "next/link"
import { importHsk } from "../../db/importContent"
import {reviewRepository} from "../../repositories/reviewRepository"
import { CircleCheckBig } from "lucide-react"
export default function Dashboard() {
  const [wordCount, setWordCount] = useState(0)
  const [wordReview, setWordReview] = useState(0)
  
  const getData = async() => {
    await importHsk().then(setWordCount)
  }

  useEffect(() => {
    const loadCount = async () => {
      const wordCount = await db.words.count()
      setWordCount(wordCount)

      const reviews = await reviewRepository.getDueReviews()
      setWordReview(reviews.length)
    }

    loadCount()
  }, [])
  
  return (
    <main className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-3xl font-bold">
        Good morning
      </h1>
      
      <div className="mt-2 flex flex-row gap-3 items-center">
        <p className="text-gray-500">
          Let's continue learning Chinese.
        </p>
        <button onClick={() => {getData()}} className="text-black underline text-sm hover:text-blue-600 hover:scale-105 cursor-pointer"> Get Data</button>
      </div>


      {/* Stats */}
      <section className="mt-8 grid grid-cols-3 gap-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Vocabulary
          </p>

          <p className="mt-2 text-3xl font-bold">
            {wordCount}
          </p>

          <p className="text-sm text-gray-400">
            words available
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Review today
          </p>

          <div className="mt-2 text-xl">
            {wordReview > 0 ?`${wordReview} Words`:(
              <div className="flex items-center gap-2">
                <CircleCheckBig className="shrink-0 text-green-500" />
                <p className="text-gray-700">Good Job! Let's learn new now!</p>
            </div>)}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Study streak
          </p>

          <p className="mt-2 text-3xl font-bold">
            0 days
          </p>
        </div>

      </section>

      {/* Continue */}
      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold">
          Continue learning
        </h2>

        <p className="mt-2 text-gray-500">
          HSK 1 Vocabulary
        </p>

        <button className="mt-4 rounded-lg bg-black px-5 py-2 text-white">
          Continue →
        </button>

      </section>

      {/* Quick actions */}
      <section className="mt-8">

        <h2 className="text-xl font-semibold">
          Quick actions
        </h2>

        <div className="mt-4 flex gap-4">

          <Link href="/vocabulary" className="rounded-xl bg-white p-5 shadow-sm">
            📚 Vocabulary
          </Link>

          <button className="rounded-xl bg-white p-5 shadow-sm">
            🔄 Review
          </button>

          <button className="rounded-xl bg-white p-5 shadow-sm">
            📝 Notes
          </button>

        </div>

      </section>

    </main>
  )
}