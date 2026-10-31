import { db, type Word, type Reading, type ListeningTriad } from "./database"

const HSK_IMPORTED_FLAG = "hsk_words_v2_clean_vi_imported"

export async function importHsk(): Promise<number> {
  try {
    // 1. Fast check in local storage flag first
    if (typeof window !== "undefined" && localStorage.getItem(HSK_IMPORTED_FLAG)) {
      const count = await db.words.count()
      if (count > 0) return count
    }

    // 2. Fetch updated clean Vietnamese vocabulary
    const response = await fetch(`/content/words.json`)
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
