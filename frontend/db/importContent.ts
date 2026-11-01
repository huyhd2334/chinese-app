import { db, type Word, type Reading, type ListeningTriad } from "./database"

const HSK_IMPORTED_FLAG = "hsk_words_v4_clean_vietnamese_short_meanings"

export async function importHsk(force = false): Promise<number> {
  try {
    // 1. Kiểm tra nhanh: nếu đã có cờ và từ vựng trong IndexedDB thực tế đã có meanings_vi thì trả về ngay
    if (!force && typeof window !== "undefined" && localStorage.getItem(HSK_IMPORTED_FLAG)) {
      const sample = await db.words.where("hanzi").equals("面包").first()
      if (sample && sample.meanings_vi && sample.meanings_vi.length > 0) {
        const count = await db.words.count()
        if (count > 0) return count
      }
    }

    // 2. Tải toàn bộ từ vựng kèm nghĩa tiếng Việt chuẩn
    const response = await fetch(`/content/words.json?v=20261101_v4`, {
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error(`Failed to load HSK words`)
    }

    const words: Word[] = await response.json()
    await db.words.bulkPut(words)
    if (typeof window !== "undefined") {
      localStorage.setItem(HSK_IMPORTED_FLAG, "true")
    }
    return words.length
  } catch (err) {
    console.error("Error importing HSK words:", err)
    return await db.words.count().catch(() => 0)
  }
}

export async function importReading(): Promise<void> {
  try {
    const count = await db.readings.count()
    if (count > 0) return

    const response = await fetch(`/content/reading.json`)
    if (!response.ok) return

    const readings: Reading[] = await response.json()
    const data = readings.map(r => ({
      ...r,
      completed: false
    }))

    await db.readings.bulkPut(data)
  } catch (err) {
    console.error("Error importing reading:", err)
  }
}

export async function importListening(): Promise<void> {
  try {
    const count = await db.listeningTriads.count()
    if (count > 0) return

    const response = await fetch(`/content/triad_zh_listening_full.json`)
    if (!response.ok) return

    const listenings: ListeningTriad[] = await response.json()
    const data = listenings.map(r => ({
      ...r,
      completed: false
    }))

    await db.listeningTriads.bulkPut(data)
  } catch (err) {
    console.error("Error importing listening:", err)
  }
}
