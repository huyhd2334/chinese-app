import { getHanViet } from "./hanviet"
import { db } from "../../db/database"
import type { BonusWord } from "@/types/bonus"

// Cache for translation results to prevent duplicate network calls
const translationCache = new Map<string, string>()

/**
 * Dịch văn bản sang tiếng Việt sử dụng dịch thuật thông minh
 */
export async function translateToVietnamese(text: string, fromLang: "zh" | "en" = "zh"): Promise<string> {
  const clean = text.trim()
  if (!clean) return ""

  const cacheKey = `${fromLang}:${clean}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    const langpair = fromLang === "zh" ? "zh|vi" : "en|vi"
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${langpair}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      const translated = data?.responseData?.translatedText
      if (translated && !translated.startsWith("MYMEMORY WARNING")) {
        const result = cleanTranslationResult(translated)
        translationCache.set(cacheKey, result)
        return result
      }
    }
  } catch (err) {
    console.warn("Translation API error:", err)
  }

  return ""
}

function cleanTranslationResult(text: string): string {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .trim()
}

export interface AssistantWordResult {
  word: string
  hanzi?: string
  pinyin?: string
  phonetic?: string
  hanViet?: string
  partOfSpeech?: string
  meaning: string
  example?: string
  examplePinyin?: string
  topic?: string
}

/**
 * Trợ lý tự động phân tích từ vựng, tra từ điển cục bộ hoặc dịch thuật trực tuyến
 */
export async function assistWordCreation(
  input: string, 
  language: "zh" | "en" = "zh"
): Promise<AssistantWordResult> {
  const query = input.trim()
  if (!query) {
    return { word: "", meaning: "" }
  }

  // 1. Nếu là Tiếng Trung
  if (language === "zh") {
    const hanViet = getHanViet(query)
    let pinyin = ""
    let meaning = ""
    let pos = ""

    // Bước 1: Tra cứu trong IndexedDB local database trước
    try {
      const match = await db.words.where("hanzi").equals(query).first()
      if (match) {
        pinyin = match.pinyin || ""
        if (match.meanings_vi && match.meanings_vi.length > 0) {
          meaning = match.meanings_vi.join("; ")
        } else if (match.meanings && match.meanings.length > 0) {
          meaning = match.meanings.join("; ")
        }
        if (match.partOfSpeech && match.partOfSpeech.length > 0) {
          pos = mapPosToVietnamese(match.partOfSpeech[0])
        }
      }
    } catch (e) {
      console.warn("Local DB lookup error:", e)
    }

    // Bước 2: Nếu chưa có nghĩa, gọi dịch thuật tự động
    if (!meaning) {
      const translated = await translateToVietnamese(query, "zh")
      if (translated) {
        meaning = translated
      }
    }

    // Tạo câu ví dụ mẫu mặc định nếu chưa có
    const example = `我每天学习${query}。`
    const examplePinyin = pinyin ? `Wǒ měitiān xuéxí ${pinyin}.` : ""

    return {
      word: query,
      hanzi: query,
      pinyin,
      hanViet,
      partOfSpeech: pos || "Từ vựng",
      meaning,
      example,
      examplePinyin,
      topic: "Từ vựng tự thêm"
    }
  }

  // 2. Nếu là Tiếng Anh
  let meaning = ""
  const translated = await translateToVietnamese(query, "en")
  if (translated) {
    meaning = translated
  }

  const example = `This is a common example sentence using "${query}".`

  return {
    word: query,
    phonetic: "",
    partOfSpeech: "Từ vựng",
    meaning,
    example,
    topic: "Từ vựng tự thêm"
  }
}

function mapPosToVietnamese(pos: string): string {
  const p = pos.toLowerCase()
  if (p === "v" || p.includes("verb")) return "Động từ"
  if (p === "n" || p.includes("noun")) return "Danh từ"
  if (p === "adj" || p.includes("adjective")) return "Tính từ"
  if (p === "adv" || p.includes("adverb")) return "Phó từ"
  if (p === "prep") return "Giới từ"
  if (p === "conj") return "Liên từ"
  if (p === "num") return "Số từ"
  if (p === "pron") return "Đại từ"
  return pos.toUpperCase()
}
