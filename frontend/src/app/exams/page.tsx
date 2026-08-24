"use client"

import Link from "next/link"
import { GraduationCap, Award, BookOpen, Clock, Play } from "lucide-react"

export default function ExamsDashboard() {
  const exams = [
    {
      id: "H51001",
      name: "HSK 5 Mock Exam 1",
      code: "H51001",
      questions: 100,
      time: 125,
      sections: { listening: 45, reading: 45, writing: 10 }
    },
    {
      id: "H51002",
      name: "HSK 5 Mock Exam 2",
      code: "H51002",
      questions: 100,
      time: 125,
      sections: { listening: 45, reading: 45, writing: 10 }
    },
    {
      id: "H51003",
      name: "HSK 5 Mock Exam 3",
      code: "H51003",
      questions: 100,
      time: 125,
      sections: { listening: 45, reading: 45, writing: 10 }
    }
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 text-china-ink">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-china-red tracking-wide flex items-center gap-3">
            <GraduationCap className="w-10 h-10" /> HSK Mock Exams
          </h1>
          <p className="mt-2 text-sm text-muted">
            Practice actual HSK 5 exams to test your proficiency, manage your pacing, and track your scores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div 
            key={exam.id} 
            className="group relative rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Background design */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-china-red/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-china-red/10 text-china-red text-xs font-bold rounded-lg border border-china-red/20">
                  HSK 5
                </span>
                <span className="text-xs text-muted font-medium">Code: {exam.code}</span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-china-ink mb-3 group-hover:text-china-red transition-colors">
                {exam.name}
              </h2>

              <div className="space-y-2 mb-6 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-china-jade" />
                  <span>{exam.questions} questions total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-china-gold" />
                  <span>{exam.time} minutes limit</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Sections</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-border/30 rounded-xl p-2">
                    <p className="font-semibold text-china-ink">{exam.sections.listening}</p>
                    <p className="text-muted scale-90">Listening</p>
                  </div>
                  <div className="bg-border/30 rounded-xl p-2">
                    <p className="font-semibold text-china-ink">{exam.sections.reading}</p>
                    <p className="text-muted scale-90">Reading</p>
                  </div>
                  <div className="bg-border/30 rounded-xl p-2">
                    <p className="font-semibold text-china-ink">{exam.sections.writing}</p>
                    <p className="text-muted scale-90">Writing</p>
                  </div>
                </div>
              </div>
            </div>

            <Link 
              href={`/exams/${exam.id}`}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-china-red px-5 py-3 text-white hover:bg-china-red-hover transition-colors shadow-md shadow-china-red/10 font-semibold group/btn"
            >
              <Play className="w-4 h-4 fill-white group-hover/btn:scale-110 transition-transform" />
              Start Exam
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
