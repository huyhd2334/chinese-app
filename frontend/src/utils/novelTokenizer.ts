import { db, Word } from "../../db/database"

export interface HskWordInfo {
  level: number
  wordId: string
}

export interface NovelToken {
  id: string
  text: string
  isChinese: boolean
  isWord: boolean
  hskLevel?: number // 1..6
  wordId?: string
}

export interface HskLevelStyle {
  label: string
  shortLabel: string
  dotColor: string
  underlineColor: string
  hoverBg: string
}

export const HSK_LEVEL_STYLES: Record<number, HskLevelStyle> = {
  1: {
    label: "HSK 1",
    shortLabel: "H1",
    dotColor: "#16a34a", // Lục bảo dịu mắt
    underlineColor: "rgba(22, 163, 74, 0.65)",
    hoverBg: "rgba(22, 163, 74, 0.12)",
  },
  2: {
    label: "HSK 2",
    shortLabel: "H2",
    dotColor: "#0284c7", // Xanh lam ngọc dịu
    underlineColor: "rgba(2, 132, 199, 0.65)",
    hoverBg: "rgba(2, 132, 199, 0.12)",
  },
  3: {
    label: "HSK 3",
    shortLabel: "H3",
    dotColor: "#4f46e5", // Xanh chàm thanh nhã
    underlineColor: "rgba(79, 70, 229, 0.65)",
    hoverBg: "rgba(79, 70, 229, 0.12)",
  },
  4: {
    label: "HSK 4",
    shortLabel: "H4",
    dotColor: "#9333ea", // Tím hoa cà
    underlineColor: "rgba(147, 51, 234, 0.65)",
    hoverBg: "rgba(147, 51, 234, 0.12)",
  },
  5: {
    label: "HSK 5",
    shortLabel: "H5",
    dotColor: "#d97706", // Hổ phách / Cam đất
    underlineColor: "rgba(217, 119, 6, 0.65)",
    hoverBg: "rgba(217, 119, 6, 0.12)",
  },
  6: {
    label: "HSK 6",
    shortLabel: "H6",
    dotColor: "#dc2626", // Đỏ son chu sa
    underlineColor: "rgba(220, 38, 38, 0.65)",
    hoverBg: "rgba(220, 38, 38, 0.12)",
  },
}

let cachedDict: Map<string, HskWordInfo> | null = null

/**
 * Tải từ điển HSK từ cơ sở dữ liệu IndexedDB Dexie (kho 11,470 từ) vào RAM Map
 * Chỉ đọc 1 lần duy nhất trong suốt phiên học.
 */
export async function getHskWordMap(): Promise<Map<string, HskWordInfo>> {
  if (cachedDict && cachedDict.size > 0) {
    return cachedDict
  }

  const map = new Map<string, HskWordInfo>()

  try {
    if (typeof window !== "undefined" && db && db.words) {
      const list: Word[] = await db.words.toArray()
      for (let i = 0; i < list.length; i++) {
        const w = list[i]
        if (!w.hanzi) continue

        let lvl = 6
        if (Array.isArray(w.hskLevel) && w.hskLevel.length > 0) {
          lvl = Math.min(...w.hskLevel)
        } else if (Array.isArray(w.hskLevels) && w.hskLevels.length > 0) {
          lvl = Math.min(...w.hskLevels)
        }

        if (lvl < 1) lvl = 1
        if (lvl > 6) lvl = 6

        // Nếu từ trùng lặp, ưu tiên gán cấp độ HSK cơ bản hơn (thấp hơn)
        const existing = map.get(w.hanzi)
        if (!existing || lvl < existing.level) {
          map.set(w.hanzi, { level: lvl, wordId: w.id })
        }
      }
    }
  } catch (err) {
    console.warn("Không thể tải từ điển HSK từ Dexie:", err)
  }

  cachedDict = map
  return map
}

const CHINESE_CHAR_REGEX = /[\u4e00-\u9fa5]/

/**
 * Tách một đoạn văn thành danh sách các token (từ vựng HSK, từ đơn lẻ, dấu câu)
 * Dùng thuật toán Forward Maximum Matching (tách từ cực đại từ độ dài 4 xuống 2)
 */
export function tokenizeParagraph(
  text: string,
  pIdx: number,
  dict: Map<string, HskWordInfo>
): NovelToken[] {
  if (!text) return []

  const tokens: NovelToken[] = []
  const len = text.length
  let i = 0
  let tokenCounter = 0

  while (i < len) {
    const char = text[i]

    // 1. Ký tự không phải chữ Hán (Dấu câu, khoảng trắng, chữ số, chữ cái Latin)
    if (!CHINESE_CHAR_REGEX.test(char)) {
      let j = i + 1
      while (j < len && !CHINESE_CHAR_REGEX.test(text[j])) {
        j++
      }
      tokens.push({
        id: `p${pIdx}-t${tokenCounter++}`,
        text: text.slice(i, j),
        isChinese: false,
        isWord: false,
      })
      i = j
      continue
    }

    // 2. Chữ Hán: Thử khớp cụm từ từ độ dài 4 xuống 2 trong từ điển
    let matched = false
    const maxLookahead = Math.min(4, len - i)

    if (dict.size > 0) {
      for (let l = maxLookahead; l >= 2; l--) {
        const candidate = text.slice(i, i + l)
        const hit = dict.get(candidate)
        if (hit) {
          tokens.push({
            id: `p${pIdx}-t${tokenCounter++}`,
            text: candidate,
            isChinese: true,
            isWord: true,
            hskLevel: hit.level,
            wordId: hit.wordId,
          })
          i += l
          matched = true
          break
        }
      }
    }

    if (matched) continue

    // 3. Nếu không khớp cụm 4, 3, 2 -> Xét 1 chữ Hán đơn
    const singleChar = text[i]
    const singleHit = dict.get(singleChar)

    tokens.push({
      id: `p${pIdx}-t${tokenCounter++}`,
      text: singleChar,
      isChinese: true,
      isWord: true,
      hskLevel: singleHit ? singleHit.level : undefined,
      wordId: singleHit ? singleHit.wordId : undefined,
    })
    i++
  }

  return tokens
}

export interface ChapterDifficultyStats {
  totalWords: number
  hskCounts: Record<number, number>
  unclassifiedCount: number
  percentages: Record<number, number>
  estimatedLevel: string
  estimatedBadgeColor: string
}

/**
 * Thống kê tỷ lệ các cấp độ HSK trong toàn bộ chương truyện
 * Giúp người học ước lượng độ khó tổng thể
 */
export function calculateChapterStats(allParagraphTokens: NovelToken[][]): ChapterDifficultyStats {
  const hskCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  let unclassifiedCount = 0
  let totalWords = 0

  for (const para of allParagraphTokens) {
    for (const token of para) {
      if (token.isWord) {
        totalWords++
        if (token.hskLevel && token.hskLevel >= 1 && token.hskLevel <= 6) {
          hskCounts[token.hskLevel]++
        } else {
          unclassifiedCount++
        }
      }
    }
  }

  const percentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  if (totalWords > 0) {
    for (let lvl = 1; lvl <= 6; lvl++) {
      percentages[lvl] = Math.round((hskCounts[lvl] / totalWords) * 100)
    }
  }

  // Ước lượng độ khó dựa trên tỷ trọng
  const hsk12Ratio = ((hskCounts[1] + hskCounts[2]) / (totalWords || 1)) * 100
  const hsk34Ratio = ((hskCounts[3] + hskCounts[4]) / (totalWords || 1)) * 100
  const hsk56Ratio = ((hskCounts[5] + hskCounts[6]) / (totalWords || 1)) * 100

  let estimatedLevel = "HSK 3 – 4 (Trung cấp)"
  let estimatedBadgeColor = "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800"

  if (hsk12Ratio >= 60) {
    estimatedLevel = "HSK 1 – 2 (Cơ bản)"
    estimatedBadgeColor = "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
  } else if (hsk56Ratio >= 22) {
    estimatedLevel = "HSK 5 – 6 (Nâng cao)"
    estimatedBadgeColor = "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
  }

  return {
    totalWords,
    hskCounts,
    unclassifiedCount,
    percentages,
    estimatedLevel,
    estimatedBadgeColor,
  }
}
