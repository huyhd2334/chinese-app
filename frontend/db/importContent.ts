import { db, type Word, type Reading } from "./database"

export async function importHsk() {
  const response = await fetch(`/content/words.json`)

  if (!response.ok) {
    throw new Error(`Failed to load HSK words`)
  }

  const words: Word[] = await response.json()
  await db.words.bulkPut(words)
  return words.length
}

export async function importReading() {
  const response = await fetch(`/content/reading.json`)

  if (!response.ok) {
    throw new Error(`Failed to load passages`)
  }

  const readings: Reading[] = await response.json()

  const data = readings.map(r => ({
    ...r,
    completed: false
  }))

  await db.readings.bulkPut(data)
  return
}