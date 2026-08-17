import { db, type Word } from "./database"

export async function importHsk() {
  const response = await fetch(`/content/words.json`)

  if (!response.ok) {
    throw new Error(`Failed to load HSK words`)
  }

  const words: Word[] = await response.json()
  await db.words.bulkPut(words)
  return words.length
}