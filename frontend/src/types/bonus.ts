export interface BonusWord {
  id: string
  stt: number
  word: string
  hanzi?: string
  pinyin?: string
  phonetic?: string
  hanViet?: string
  partOfSpeech?: string
  meaning: string
  example?: string
  examplePinyin?: string
  category?: string
  topic?: string
  level?: string | number
  language: "zh" | "en"
  synonyms?: string[]
  isCustom?: boolean
  createdAt?: number
}

export interface BonusCollection {
  id: string
  slug: string
  title: string
  subtitle: string
  language: "zh" | "en"
  itemCount: number
  coverColor?: string
  accentColor?: string
  badge: string
  level?: string
  description: string
  features?: string[]
  dataFile?: string
  isCustom?: boolean
  createdAt?: number
}
