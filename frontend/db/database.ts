import Dexie, { type EntityTable } from "dexie"

export interface Word {
  id: string
  hanzi: string
  traditional?: string
  pinyin?: string
  pinyinNumeric?: string
  meanings: string[]
  hskLevel: number[]
  hskLevels: number[]
  sourceLevels: string[]
  partOfSpeech: string[]
  radical?: string
  frequency?: number
  classifiers?: string[]
}

export interface ReviewItem{
  id: string
  wordId: string
  status: "new" | "learning" | "review" | "mastered"

  // spaced repetition
  dueAt: number
  interval: number
  easeFactor: number

  repetitions: number
  correctCount: number
  wrongCount: number

  createdAt: number
  updatedAt: number
}

export interface Note {
  id?: number
  wordId?: string
  content: string
  createdAt: number
  updatedAt: number
}

export const db = new Dexie("ChineseLearningDB") as Dexie & {
  words: EntityTable<Word, "id">
  reviewItems: EntityTable<ReviewItem, "id">
  notes: EntityTable<Note, "id">
}

db.version(1).stores({
  words: "id, hanzi, *hskLevel",
  reviewItems: "id, wordId, status, dueAt, createdAt",
  notes: "++id, wordId, updatedAt"
})