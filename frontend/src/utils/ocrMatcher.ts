import { db, Word } from "../../db/database"
import { getHanViet } from "./hanviet"
import { CurriculumWord } from "@/types/curriculum"

/**
 * Intelligent parser that turns raw OCR text or pasted lines into
 * structured CurriculumWord items, auto-filling Pinyin, Hán-Việt and Vietnamese definitions
 * from the local 11,470-word database.
 */
export async function matchAndStructureOcrText(rawText: string): Promise<CurriculumWord[]> {
  if (!rawText || !rawText.trim()) return []

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const wordsResult: CurriculumWord[] = []
  const seenHanzi = new Set<string>()

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]

    // 1. Check if line contains Chinese characters
    const hanziMatches = line.match(/[\u4e00-\u9fa5]+/g)
    if (!hanziMatches) continue

    for (const chunk of hanziMatches) {
      // Avoid duplicates in the same scan session
      if (seenHanzi.has(chunk)) continue
      seenHanzi.add(chunk)

      // Query database for exact word match
      let matchedDbWord: Word | undefined = undefined
      try {
        matchedDbWord = await db.words.where("hanzi").equals(chunk).first()
      } catch (err) {
        console.warn("DB lookup error for:", chunk, err)
      }

      // Compute Hán-Việt
      const hanViet = getHanViet(chunk) || ""

      // Attempt to extract adjacent pinyin/meaning if present on the same line
      let inlinePinyin = ""
      let inlineMeaning = ""

      // Remove the hanzi chunk from line to see what remains
      const remainder = line.replace(chunk, " ").replace(/[0-9\.\,\:\;\(\)\[\]\/\-\_]/g, " ").trim()
      if (remainder) {
        // If remainder contains tone-marked pinyin letters (āáǎà, etc.)
        const pinyinCandidate = remainder.match(/[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+/g)
        if (pinyinCandidate && pinyinCandidate.length > 0) {
          inlinePinyin = pinyinCandidate.join(" ")
        }
      }

      if (matchedDbWord) {
        // Found in our verified 11,470 word database!
        const vietnameseMeaning =
          matchedDbWord.meanings_vi && matchedDbWord.meanings_vi.length > 0
            ? matchedDbWord.meanings_vi.join("; ")
            : matchedDbWord.meanings && matchedDbWord.meanings.length > 0
            ? matchedDbWord.meanings.join("; ")
            : ""

        const pos =
          matchedDbWord.partOfSpeech && matchedDbWord.partOfSpeech.length > 0
            ? matchedDbWord.partOfSpeech.join(", ")
            : undefined

        wordsResult.push({
          id: `ocr_${Date.now()}_${wordsResult.length + 1}`,
          hanzi: chunk,
          pinyin: matchedDbWord.pinyin || inlinePinyin,
          hanViet: hanViet,
          meaning: vietnameseMeaning || inlineMeaning,
          partOfSpeech: pos,
          verified: true,
        })
      } else {
        // Character/phrase not found directly in HSK DB (could be a custom compound, name, or new word)
        wordsResult.push({
          id: `ocr_${Date.now()}_${wordsResult.length + 1}`,
          hanzi: chunk,
          pinyin: inlinePinyin,
          hanViet: hanViet,
          meaning: inlineMeaning,
          partOfSpeech: undefined,
          verified: false,
        })
      }
    }
  }

  return wordsResult
}
