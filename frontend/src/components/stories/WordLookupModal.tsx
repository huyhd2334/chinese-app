"use client"

import React, { useState, useEffect } from "react"
import { Volume2, Plus, Check, Bookmark, X, ExternalLink, Sparkles, AlertCircle } from "lucide-react"
import { db, Word } from "../../../db/database"
import { reviewRepository } from "../../../repositories/reviewRepository"
import { getHanViet } from "@/utils/hanviet"
import { playChineseAudio } from "@/utils/audioTts"

interface WordLookupModalProps {
  hanzi: string
  isOpen: boolean
  onClose: () => void
  position?: { top: number; left: number } | null
}

export default function WordLookupModal({
  hanzi,
  isOpen,
  onClose,
  position,
}: WordLookupModalProps) {
  const [matchedWord, setMatchedWord] = useState<Word | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSavedInSrs, setIsSavedInSrs] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("")

  const cleanHanzi = hanzi ? hanzi.trim() : ""
  const hanViet = cleanHanzi ? getHanViet(cleanHanzi) : ""

  useEffect(() => {
    if (!cleanHanzi || !isOpen) {
      setMatchedWord(null)
      setIsSavedInSrs(false)
      setSaveSuccessMsg("")
      return
    }

    let isMounted = true
    setIsLoading(true)

    const lookup = async () => {
      try {
        // 1. Search exact word in 11,470 word database
        let found = await db.words.where("hanzi").equals(cleanHanzi).first()

        // 2. If not found and text is longer than 2 characters, try matching 2-character prefixes/substrings
        if (!found && cleanHanzi.length > 2) {
          const sub = cleanHanzi.substring(0, 2)
          found = await db.words.where("hanzi").equals(sub).first()
        }

        if (isMounted) {
          setMatchedWord(found || null)

          if (found) {
            const existingReview = await reviewRepository.getByWordId(found.id)
            setIsSavedInSrs(Boolean(existingReview))
          } else {
            setIsSavedInSrs(false)
          }
        }
      } catch (err) {
        console.error("Lookup error:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    lookup()

    return () => {
      isMounted = false
    }
  }, [cleanHanzi, isOpen])

  const handleAddToSrs = async () => {
    if (!matchedWord) return
    setIsSaving(true)
    try {
      await reviewRepository.add(matchedWord.id)
      setIsSavedInSrs(true)
      setSaveSuccessMsg(`Đã thêm "${matchedWord.hanzi}" vào hàng chờ SRS!`)
      setTimeout(() => {
        setSaveSuccessMsg("")
      }, 3000)
    } catch (err: any) {
      alert(err.message || "Không thể thêm vào SRS")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePlaySound = () => {
    if (cleanHanzi) {
      playChineseAudio(cleanHanzi)
    }
  }

  if (!isOpen || !cleanHanzi) return null

  // Meaning resolution
  const vietnameseMeaning =
    matchedWord?.meanings_vi && matchedWord.meanings_vi.length > 0
      ? matchedWord.meanings_vi.join("; ")
      : matchedWord?.meanings && matchedWord.meanings.length > 0
      ? matchedWord.meanings.join("; ")
      : ""

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div
        className="w-full max-w-sm bg-white dark:bg-card rounded-3xl border border-slate-200/90 dark:border-neutral-800 shadow-xl overflow-hidden p-5 space-y-4 font-sans text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Tra từ trong truyện</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Word Display */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-chinese text-3xl font-bold tracking-wide" lang="zh">
                {cleanHanzi}
              </h3>
              <button
                type="button"
                onClick={handlePlaySound}
                className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                title="Phát âm tiếng Trung"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {matchedWord?.pinyin && (
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {matchedWord.pinyin}
              </p>
            )}

            {hanViet && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hán-Việt: <span className="font-medium text-slate-700 dark:text-slate-300">{hanViet}</span>
              </p>
            )}
          </div>

          {/* HSK Level Badge if in 11k DB */}
          {matchedWord && matchedWord.hskLevel && matchedWord.hskLevel.length > 0 && (
            <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900 text-xs font-bold shrink-0">
              HSK {matchedWord.hskLevel.join(", ")}
            </span>
          )}
        </div>

        {/* Word Meaning & Database Match Status */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200/70 dark:border-neutral-800/80 space-y-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Đang đối chiếu kho 11,470 từ vựng...</span>
            </div>
          ) : matchedWord ? (
            <>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Khớp kho từ vựng HSK cốt lõi</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {vietnameseMeaning || "Từ có trong hệ thống bài giảng HSK."}
              </p>
              {matchedWord.partOfSpeech && matchedWord.partOfSpeech.length > 0 && (
                <span className="inline-block text-[10px] font-mono text-slate-500 bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-neutral-700">
                  {matchedWord.partOfSpeech.join(", ")}
                </span>
              )}
            </>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Tên riêng / Thuật ngữ ngữ cảnh</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cleanHanzi.length <= 4
                  ? `Từ "${cleanHanzi}" là tên riêng nhân vật hoặc cách gọi khẩu ngữ trong truyện ngôn tình.`
                  : "Cụm câu thoại trong văn bản."}
              </p>
            </div>
          )}
        </div>

        {/* Add to SRS Action */}
        <div>
          {matchedWord ? (
            <button
              type="button"
              onClick={handleAddToSrs}
              disabled={isSavedInSrs || isSaving}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSavedInSrs
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-slate-900 hover:bg-black text-white shadow-xs active:scale-98 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              }`}
            >
              {isSavedInSrs ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã lưu vào sổ ôn tập SRS</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{isSaving ? "Đang lưu..." : "Thêm vào học ôn SRS"}</span>
                </>
              )}
            </button>
          ) : (
            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                (Từ vựng nằm ngoài HSK 1-6 không thể thêm vào bài thi cốt lõi)
              </span>
            </div>
          )}

          {saveSuccessMsg && (
            <p className="text-xs text-center text-emerald-600 font-medium mt-1.5 animate-fade-in">
              {saveSuccessMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
