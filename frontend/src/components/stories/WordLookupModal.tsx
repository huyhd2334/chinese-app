"use client"

import React, { useState, useEffect } from "react"
import { Volume2, Plus, Check, Bookmark, X, AlertCircle } from "lucide-react"
import { db, Word } from "../../../db/database"
import { reviewRepository } from "../../../repositories/reviewRepository"
import { getHanViet } from "@/utils/hanviet"
import { playChineseAudio } from "@/utils/audioTts"
import { LeafVineCornerSvg } from "@/components/roadmap/VineBorders"

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
        let found = await db.words.where("hanzi").equals(cleanHanzi).first()

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

  const vietnameseMeaning =
    matchedWord?.meanings_vi && matchedWord.meanings_vi.length > 0
      ? matchedWord.meanings_vi.join("; ")
      : matchedWord?.meanings && matchedWord.meanings.length > 0
      ? matchedWord.meanings.join("; ")
      : ""

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div
        className="relative w-full max-w-sm bg-white dark:bg-[#1a1a24] rounded-3xl border border-stone-200/90 dark:border-[#2c2d3d] shadow-xl overflow-hidden p-6 space-y-4 font-sans text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nhánh dây leo lá cây SVG nhỏ góc trên */}
        <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-8 h-8 opacity-70" />
        <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-8 h-8 opacity-70" />

        {/* Header & Close */}
        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-stone-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tra từ trong truyện</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Word Display */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-chinese text-3xl font-bold tracking-wide" lang="zh">
                {cleanHanzi}
              </h3>
              <button
                type="button"
                onClick={handlePlaySound}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
                title="Phát âm tiếng Trung"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {matchedWord?.pinyin && (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                {matchedWord.pinyin}
              </p>
            )}

            {hanViet && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Hán-Việt: <span className="font-medium text-stone-700 dark:text-stone-200">{hanViet}</span>
              </p>
            )}
          </div>

          {/* HSK Badge */}
          {matchedWord && matchedWord.hskLevel && matchedWord.hskLevel.length > 0 && (
            <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700 text-xs font-bold shrink-0">
              HSK {matchedWord.hskLevel.join(", ")}
            </span>
          )}
        </div>

        {/* Word Meaning & Database Match Status */}
        <div className="relative z-10 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 space-y-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-stone-500 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Đang đối chiếu kho 11,470 từ vựng...</span>
            </div>
          ) : matchedWord ? (
            <>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Khớp kho từ vựng HSK cốt lõi</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed">
                {vietnameseMeaning || "Từ có trong hệ thống bài giảng HSK."}
              </p>
              {matchedWord.partOfSpeech && matchedWord.partOfSpeech.length > 0 && (
                <span className="inline-block text-[10px] font-mono text-stone-500 bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                  {matchedWord.partOfSpeech.join(", ")}
                </span>
              )}
            </>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Tên riêng / Thuật ngữ ngữ cảnh</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {cleanHanzi.length <= 4
                  ? `Từ "${cleanHanzi}" là tên riêng nhân vật hoặc cách gọi khẩu ngữ trong truyện ngôn tình.`
                  : "Cụm câu thoại trong văn bản."}
              </p>
            </div>
          )}
        </div>

        {/* Add to SRS Action */}
        <div className="relative z-10">
          {matchedWord ? (
            <button
              type="button"
              onClick={handleAddToSrs}
              disabled={isSavedInSrs || isSaving}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSavedInSrs
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-stone-900 hover:bg-black text-white shadow-xs active:scale-98 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
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
              <span className="text-[11px] text-stone-400">
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
