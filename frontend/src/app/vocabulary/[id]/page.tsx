"use client"

import { useEffect, useState } from "react"
import { wordRepository } from "../../../../repositories/wordRepository"
import { reviewRepository } from "../../../../repositories/reviewRepository"
import { db, type Word, type ReviewItem, type Note } from "../../../../db/database"
import WritingPractice from "@/components/vocabulary/WritingPractice"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, BookOpen, PenTool, MessageCircle, BarChart3, 
  Plus, Trash2, Volume2, FileEdit, Save, Check 
} from "lucide-react"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function WordDetailPage({ params }: PageProps) {
  const [word, setWord] = useState<Word | undefined>()
  const [review, setReview] = useState<ReviewItem | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'writing' | 'examples' | 'notes'>('overview')
  const [isAdding, setIsAdding] = useState(false)
  const [note, setNote] = useState<Note | null>(null)
  const [noteText, setNoteText] = useState("")
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params
      const wordData = await wordRepository.getById(id)
      setWord(wordData)
      
      const reviewData = await db.reviewItems.where('wordId').equals(id).first()
      setReview(reviewData || null)

      const existingNote = await db.notes.where('wordId').equals(id).first()
      if (existingNote) {
        setNote(existingNote)
        setNoteText(existingNote.content)
      }
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

  const handleSaveNote = async () => {
    if (!word) return
    setIsSavingNote(true)
    try {
      if (note && note.id) {
        await db.notes.update(note.id, { content: noteText, updatedAt: Date.now() })
        setNote({ ...note, content: noteText, updatedAt: Date.now() })
      } else {
        const newId = await db.notes.add({
          wordId: word.id,
          content: noteText,
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
        setNote({ id: Number(newId), wordId: word.id, content: noteText, createdAt: Date.now(), updatedAt: Date.now() })
      }
      setNoteSavedFeedback(true)
      setTimeout(() => setNoteSavedFeedback(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!note?.id) return
    try {
      await db.notes.delete(note.id)
      setNote(null)
      setNoteText("")
    } catch (e) {
      console.error(e)
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
          <p className="font-medium">Đang tải thông tin từ vựng...</p>
        </div>
      </div>
    )
  }

  const examples = [
    { zh: `我学习${word.hanzi}。`, py: `Wǒ xuéxí ${word.pinyin}.`, en: `Tôi học từ ${word.hanzi}.` },
    { zh: `这个${word.hanzi}怎么写？`, py: `Zhège ${word.pinyin} zěnme xiě?`, en: `Chữ ${word.hanzi} này viết thế nào?` }
  ]

  return (
    <div className="h-full min-h-0 flex flex-col bg-china-paper/30 overflow-y-auto">
      {/* Sticky Header Nav */}
      <div className="sticky top-0 z-20 bg-china-paper/80 backdrop-blur-md border-b border-border px-3 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-china-ink hover:text-china-red bg-white border border-border rounded-xl shadow-xs transition-all group w-full md:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Quay lại
        </button>
        
        {/* Navigation Tabs */}
        <div className="flex bg-white border border-border p-0.5 rounded-xl shadow-xs w-full md:w-auto overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', icon: BookOpen, label: 'Tổng quan' },
            { id: 'writing', icon: PenTool, label: 'Luyện viết' },
            { id: 'examples', icon: MessageCircle, label: 'Ví dụ' },
            { id: 'notes', icon: FileEdit, label: 'Mẹo & Ghi chú' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === t.id 
                  ? 'bg-china-red text-white shadow-xs font-semibold' 
                  : 'text-muted hover:text-china-ink hover:bg-gray-50'
              }`}
            >
              <t.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Add / Remove from Review */}
        <button
          onClick={toggleReview}
          disabled={isAdding}
          className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all w-full md:w-auto
            ${review 
              ? 'bg-white border border-china-red/30 text-china-red hover:bg-china-red/5' 
              : 'bg-china-ink text-white hover:bg-china-ink/80'}`}
        >
          {isAdding ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : review ? (
            <><Trash2 className="w-4 h-4" /> Hủy theo dõi</>
          ) : (
            <><Plus className="w-4 h-4" /> + Thêm vào ôn tập</>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-6 md:p-8 max-w-5xl mx-auto w-full flex-1 space-y-6">
        
        {/* Hero Card */}
        <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center gap-6 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-china-red/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
          
          <div className="text-center md:text-left flex-1 z-10">
            <div className="flex gap-2 justify-center md:justify-start mb-4">
              {word.hskLevel && word.hskLevel.length > 0 && (
                <span className="px-3 py-1 bg-china-red/10 text-china-red text-xs sm:text-sm font-bold rounded-lg border border-china-red/20">
                  HSK {word.hskLevel[0]}
                </span>
              )}
              {review && (
                <span className="px-3 py-1 bg-china-jade/10 text-china-jade text-xs sm:text-sm font-bold rounded-lg border border-china-jade/20 capitalize">
                  {review.status}
                </span>
              )}
            </div>

            <h1 className={`font-serif font-bold text-china-ink leading-none mb-3 ${
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
              <span className="text-2xl sm:text-3xl md:text-4xl font-medium text-china-red">
                {word.pinyin}
              </span>
              <button 
                title="Phát âm tiếng Trung"
                onClick={() => playAudio(word.hanzi)}
                className="p-1.5 text-china-red/80 hover:text-china-red hover:bg-china-red/10 rounded-full transition-colors active:scale-95"
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {word.traditional && word.traditional !== word.hanzi && (
              <p className="text-base sm:text-xl font-serif text-muted">
                {word.traditional} <span className="text-xs font-sans">(Phồn thể)</span>
              </p>
            )}
          </div>

          <div className="flex-1 w-full z-10 flex flex-col gap-3">
             <div className="bg-china-paper/60 p-5 rounded-2xl border border-border">
                <p className="text-xs text-muted mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                   <BookOpen className="w-3.5 h-3.5 text-china-red" /> Nghĩa tiếng Việt
                </p>
                <p className="text-lg sm:text-xl text-china-ink font-semibold mb-2">
                  {word.meanings_vi ? word.meanings_vi.join("; ") : word.meanings?.join("; ")}
                </p>
                {word.meanings && word.meanings_vi && (
                  <p className="text-xs sm:text-sm text-china-ink/70">
                    EN: {word.meanings.join("; ")}
                  </p>
                )}
             </div>

             {/* Personal note preview if exists */}
             {note && (
               <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl">
                 <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                   <FileEdit className="w-3 h-3" /> Mẹo nhớ của bạn
                 </p>
                 <p className="text-xs sm:text-sm text-china-ink">{note.content}</p>
               </div>
             )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-xs">
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-china-ink mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-china-red" />
                    Đặc điểm ngôn ngữ
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {word.radical && (
                      <div>
                        <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Bộ thủ</p>
                        <p className="text-xl sm:text-2xl font-serif text-china-ink font-bold">{word.radical}</p>
                      </div>
                    )}
                    {word.classifiers && word.classifiers.length > 0 && (
                      <div>
                        <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Lượng từ</p>
                        <p className="text-xl sm:text-2xl font-serif text-china-ink font-bold">{word.classifiers.join(", ")}</p>
                      </div>
                    )}
                    {word.partOfSpeech && word.partOfSpeech.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted mb-1.5 uppercase tracking-wider font-semibold">Từ loại</p>
                        <div className="flex flex-wrap gap-1.5">
                          {word.partOfSpeech.map((pos, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gray-100 text-china-ink text-xs rounded-lg font-medium">
                              {pos}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Statistics */}
              <div>
                <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-xs h-full">
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-china-ink mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-china-jade" />
                    Thống kê ôn tập (Spaced Repetition)
                  </h3>
                  
                  {review ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 bg-green-50 rounded-2xl border border-green-100">
                          <p className="text-xs text-green-700 font-medium mb-0.5">Số lần đúng</p>
                          <p className="text-2xl sm:text-3xl font-bold text-green-600">{review.correctCount}</p>
                        </div>
                        <div className="p-3.5 bg-red-50 rounded-2xl border border-red-100">
                          <p className="text-xs text-red-700 font-medium mb-0.5">Số lần sai</p>
                          <p className="text-2xl sm:text-3xl font-bold text-red-600">{review.wrongCount}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                          <span className="text-muted">Độ dễ (Ease Factor)</span>
                          <span className="font-semibold text-china-ink">{review.easeFactor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                          <span className="text-muted">Khoảng cách ôn tập</span>
                          <span className="font-semibold text-china-ink">{review.interval} ngày</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                          <span className="text-muted">Số lần lặp lại</span>
                          <span className="font-semibold text-china-ink">{review.repetitions}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-muted">Lần ôn tiếp theo</span>
                          <span className="font-semibold text-china-ink">
                            {new Date(review.dueAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                      <BookOpen className="w-10 h-10 text-border mb-3" />
                      <p className="text-china-ink font-semibold text-sm mb-1">Chưa theo dõi</p>
                      <p className="text-xs text-muted mb-4">Thêm từ này vào danh sách ôn tập để hệ thống tự động lên lịch nhắc nhở.</p>
                      <button 
                        onClick={toggleReview}
                        className="px-4 py-2 bg-china-ink text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-china-ink/80 transition-colors"
                      >
                        + Thêm vào ôn tập
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'writing' && (
            <div className="bg-white border border-border rounded-3xl p-4 sm:p-6 shadow-xs min-h-[450px] flex flex-col">
              <h3 className="text-lg sm:text-xl font-serif font-semibold text-china-ink flex items-center gap-2 mb-4">
                <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-china-red" />
                Bảng vẽ tương tác luyện viết từng nét
              </h3>
              <div className="flex-1 bg-china-paper/30 rounded-2xl border border-border/50 overflow-hidden flex items-center justify-center p-2">
                <WritingPractice hanzi={word.hanzi} />
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-xs">
               <h3 className="text-lg sm:text-xl font-serif font-semibold text-china-ink flex items-center gap-2 mb-4">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-china-red" />
                Câu ví dụ mẫu
              </h3>
              
              <div className="space-y-3">
                {examples.map((ex, i) => (
                  <div key={i} className="p-4 sm:p-5 rounded-2xl border border-border hover:border-china-red/30 transition-colors group">
                    <p className="text-xl sm:text-2xl font-serif text-china-ink mb-1.5">
                      {ex.zh.split(word.hanzi).map((part, j, arr) => (
                        <span key={j}>
                          {part}
                          {j < arr.length - 1 && <span className="text-china-red font-bold">{word.hanzi}</span>}
                        </span>
                      ))}
                    </p>
                    <p className="text-sm sm:text-base text-china-ink/80 mb-1">{ex.py}</p>
                    <p className="text-xs sm:text-sm text-muted">{ex.en}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Mnemonics Tab */}
          {activeTab === 'notes' && (
            <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-china-ink flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-china-gold" />
                    Mẹo ghi nhớ & Ghi chú cá nhân
                  </h3>
                  <p className="text-xs text-muted">
                    Lưu lại chiết tự, câu chuyện liên tưởng hoặc ví dụ riêng của bạn để nhớ lâu hơn.
                  </p>
                </div>
                {note?.updatedAt && (
                  <span className="text-[11px] text-muted">
                    Cập nhật: {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ví dụ: Chữ này gồm bộ Nhân (người) đứng cạnh chữ Mộc (cây) nghĩa là người nghỉ ngơi dưới gốc cây..."
                rows={6}
                className="w-full p-4 text-sm bg-china-paper/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-china-red/20 focus:border-china-red transition-all"
              />

              <div className="flex items-center justify-between pt-2">
                {note ? (
                  <button
                    onClick={handleDeleteNote}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa ghi chú
                  </button>
                ) : <div />}

                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote || !noteText.trim()}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-china-red hover:bg-china-red-hover disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95"
                >
                  {noteSavedFeedback ? (
                    <><Check className="w-4 h-4" /> Đã lưu thành công!</>
                  ) : isSavingNote ? (
                    "Đang lưu..."
                  ) : (
                    <><Save className="w-4 h-4" /> Lưu ghi chú</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}