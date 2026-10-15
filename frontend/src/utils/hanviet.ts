// @ts-ignore
import { hanvietData, getHanviet } from 'hanviet-pinyin-words'

/**
 * Chuyển đổi chữ Hán sang âm Hán-Việt (Sino-Vietnamese reading).
 * Ví dụ:
 * - 爱 -> Ái
 * - 你好 -> Nễ Hảo
 * - 学习 -> Học Tập
 * - 中国 -> Trung Quốc
 */
export function getHanViet(
  hanzi: string,
  traditional?: string,
  pinyinNumeric?: string
): string {
  if (!hanzi) return ''

  const trad = traditional || hanzi
  const pyWords = (pinyinNumeric || '').toLowerCase().trim().split(/\s+/).filter(Boolean)

  if (pyWords.length === trad.length) {
    try {
      const result = getHanviet(trad, pyWords, true)
      if (result && !result.includes('_')) {
        return result.trim()
      }
    } catch {
      // fallback to char-by-char
    }
  }

  // Fallback char-by-char lookup
  const chars = Array.from(hanzi)
  const tradChars = Array.from(trad)

  const readings = chars.map((ch, idx) => {
    const tCh = tradChars[idx] || ch
    const map = (hanvietData as Record<string, Record<string, string[]>>)?.[tCh] || 
                (hanvietData as Record<string, Record<string, string[]>>)?.[ch]
    if (!map) return ch
    
    // Check if tone-specific pinyin matches
    const py = pyWords[idx]
    if (py && map[py] && map[py].length > 0) {
      const v = map[py][0]
      return capitalize(v)
    }

    const firstKey = Object.keys(map)[0]
    if (firstKey && map[firstKey]?.length > 0) {
      const v = map[firstKey][0]
      return capitalize(v)
    }
    return ch
  })

  return readings.join(' ').trim()
}

function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
