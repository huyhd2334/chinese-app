"use client"

import { useEffect, useState } from "react"
import { wordRepository } from "../../../../repositories/wordRepository"
import { reviewRepository } from "../../../../repositories/reviewRepository"
import { db, type Word, type ReviewItem } from "../../../../db/database"
import WritingPractice from "@/components/vocabulary/WritingPractice"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, PenTool, MessageCircle, BarChart3, Plus, Trash2, Volume2 } from "lucide-react"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function WordDetailPage({ params }: PageProps) {
  const [word, setWord] = useState<Word | undefined>()
  const [review, setReview] = useState<ReviewItem | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'writing' | 'examples'>('overview')
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params
      const wordData = await wordRepository.getById(id)
      setWord(wordData)
      
      const reviewData = await db.reviewItems.where('wordId').equals(id).first()
      setReview(reviewData || null)
    }
    loadData()
  }, [params])

  const handleBack = () => router.back()

  const toggleReview = async () => {
    if (!word) return
    setIsAdding(true)
    try {
      if (review) {
        await db.reviewItems.delete(review.id)
        setReview(null)
      } else {
        const newReview = await reviewRepository.add(word.id)
        setReview(newReview)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsAdding(false)
    }
  }

  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!word) {
    return (
      <div className="flex h-full items-center justify-center bg-china-paper/30">
        <div className="flex flex-col items-center gap-4 text-china-ink">
          <div className="w-10 h-10 border-4 border-china-red/30 border-t-china-red rounded-full animate-spin"></div>
          <p className="font-medium">Loading word details...</p>
        </div>
      </div>
    )
  }

  const examples = [
    { zh: `我学习${word.hanzi}。`, py: `Wǒ xuéxí ${word.pinyin}.`, en: `I study ${word.hanzi}.` },
    { zh: `这个${word.hanzi}怎么写？`, py: `Zhège ${word.pinyin} zěnme xiě?`, en: `How do you write this ${word.hanzi}?` }
  ]

  return (
    <div className="h-full min-h-0 flex flex-col bg-china-paper/30 overflow-y-auto">
      <div className="sticky top-0 z-20 bg-china-paper/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8 md:py-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-china-ink hover:text-china-red bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-all group w-full md:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        
        <div className="flex bg-white border border-border p-1 rounded-xl shadow-sm w-full md:w-auto">
          {[
            { id: 'overview', icon: BookOpen, label: 'Overview' },
            { id: 'writing', icon: PenTool, label: 'Writing' },
            { id: 'examples', icon: MessageCircle, label: 'Examples' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === t.id 
                  ? 'bg-china-red text-white shadow-sm' 
                  : 'text-muted hover:text-china-ink hover:bg-gray-50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={toggleReview}
          disabled={isAdding}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-xl shadow-sm transition-all w-full md:w-auto
            ${review 
              ? 'bg-white border border-china-red/30 text-china-red hover:bg-china-red/5' 
              : 'bg-china-ink text-white hover:bg-china-ink/80'}`}
        >
          {isAdding ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : review ? (
            <><Trash2 className="w-4 h-4" /> Remove</>
          ) : (
            <><Plus className="w-4 h-4" /> Add to Review</>
          )}
        </button>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex-1">
        <div className="bg-white border border-border rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-china-red/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="text-center md:text-left flex-1 z-10">
            <div className="flex gap-2 justify-center md:justify-start mb-6">
              {word.hskLevel && word.hskLevel.length > 0 && (
                <span className="px-3 py-1 bg-china-red/10 text-china-red text-sm font-bold rounded-lg border border-china-red/20">
                  HSK {word.hskLevel[0]}
                </span>
              )}
              {review && (
                <span className="px-3 py-1 bg-china-jade/10 text-china-jade text-sm font-bold rounded-lg border border-china-jade/20 capitalize">
                  {review.status}
                </span>
              )}
            </div>

            <h1 className={`font-serif font-bold text-china-ink leading-none mb-4 ${
              word.hanzi.length <= 1
                ? 'text-7xl sm:text-8xl md:text-[8rem]'
                : word.hanzi.length === 2
                ? 'text-6xl sm:text-7xl md:text-[6.5rem]'
                : word.hanzi.length === 3
                ? 'text-5xl sm:text-6xl md:text-7xl'
                : 'text-4xl sm:text-5xl md:text-6xl'
            }`}>
              {word.hanzi}
            </h1>
            
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-3xl md:text-4xl font-medium text-china-red">
                {word.pinyin}
              </span>
              <button 
                title="Phát âm tiếng Trung"
                onClick={() => playAudio(word.hanzi)}
                className="p-2 text-china-red/70 hover:text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {word.traditional && word.traditional !== word.hanzi && (
              <p className="text-xl font-serif text-muted">
                {word.traditional} <span className="text-sm font-sans">(Traditional)</span>
              </p>
            )}
          </div>

          <div className="flex-1 w-full z-10 flex flex-col gap-4">
             <div className="bg-china-paper/50 p-6 rounded-2xl border border-border">
                <p className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold flex items-center gap-2">
                   <BookOpen className="w-4 h-4" /> Meaning
                </p>
                <p className="text-xl text-china-ink font-medium mb-4">
                  {word.meanings_vi ? word.meanings_vi.join("; ") : word.meanings?.join("; ")}
                </p>
                {word.meanings && word.meanings_vi && (
                  <p className="text-md text-china-ink/70">
                    {word.meanings.join("; ")}
                  </p>
                )}
             </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-serif font-semibold text-china-ink mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-china-red" />
                    Linguistic Details
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {word.radical && (
                      <div>
                        <p className="text-sm text-muted mb-1 uppercase tracking-wider font-semibold">Radical</p>
                        <p className="text-2xl font-serif text-china-ink font-bold">{word.radical}</p>
                      </div>
                    )}
                    {word.classifiers && word.classifiers.length > 0 && (
                      <div>
                        <p className="text-sm text-muted mb-1 uppercase tracking-wider font-semibold">Classifiers</p>
                        <p className="text-2xl font-serif text-china-ink font-bold">{word.classifiers.join(", ")}</p>
                      </div>
                    )}
                    {word.partOfSpeech && word.partOfSpeech.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">Part of Speech</p>
                        <div className="flex flex-wrap gap-2">
                          {word.partOfSpeech.map((pos, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-gray-100 text-china-ink text-sm rounded-lg font-medium">
                              {pos}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-serif font-semibold text-china-ink mb-4 flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5 text-china-red rotate-180" />
                    Related Words
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 border border-border rounded-xl text-china-ink hover:border-china-red hover:text-china-red cursor-pointer transition-colors">
                      Learn {word.hanzi} (Study)
                    </span>
                    <span className="px-4 py-2 border border-border rounded-xl text-china-ink hover:border-china-red hover:text-china-red cursor-pointer transition-colors">
                      {word.hanzi}校 (School)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm h-full">
                  <h3 className="text-lg font-serif font-semibold text-china-ink mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-china-jade" />
                    Review Statistics
                  </h3>
                  
                  {review ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                          <p className="text-sm text-green-700 font-medium mb-1">Correct</p>
                          <p className="text-3xl font-bold text-green-600">{review.correctCount}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                          <p className="text-sm text-red-700 font-medium mb-1">Incorrect</p>
                          <p className="text-3xl font-bold text-red-600">{review.wrongCount}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted text-sm">Ease Factor</span>
                          <span className="font-medium text-china-ink">{review.easeFactor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted text-sm">Interval</span>
                          <span className="font-medium text-china-ink">{review.interval} days</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted text-sm">Repetitions</span>
                          <span className="font-medium text-china-ink">{review.repetitions}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted text-sm">Next Review</span>
                          <span className="font-medium text-china-ink">
                            {new Date(review.dueAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
                      <BookOpen className="w-12 h-12 text-border mb-4" />
                      <p className="text-china-ink font-medium mb-2">Not tracking yet</p>
                      <p className="text-sm text-muted mb-6">Add this word to your review list to start tracking your progress.</p>
                      <button 
                        onClick={toggleReview}
                        className="px-6 py-2 bg-china-ink text-white rounded-xl text-sm font-medium hover:bg-china-ink/80 transition-colors"
                      >
                        Add to Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'writing' && (
            <div className="bg-white border border-border rounded-3xl p-6 shadow-sm min-h-[500px] flex flex-col">
              <h3 className="text-xl font-serif font-semibold text-china-ink flex items-center gap-2 mb-6">
                <PenTool className="w-5 h-5 text-china-red" />
                Interactive Canvas
              </h3>
              <div className="flex-1 bg-china-paper/30 rounded-2xl border border-border/50">
                <WritingPractice hanzi={word.hanzi} />
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
               <h3 className="text-xl font-serif font-semibold text-china-ink flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-china-red" />
                Example Sentences
              </h3>
              
              <div className="space-y-4">
                {examples.map((ex, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-border hover:border-china-red/30 transition-colors group">
                    <p className="text-2xl font-serif text-china-ink mb-2">
                      {ex.zh.split(word.hanzi).map((part, j, arr) => (
                        <span key={j}>
                          {part}
                          {j < arr.length - 1 && <span className="text-china-red font-bold">{word.hanzi}</span>}
                        </span>
                      ))}
                    </p>
                    <p className="text-lg text-china-ink/70 mb-1">{ex.py}</p>
                    <p className="text-muted">{ex.en}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}