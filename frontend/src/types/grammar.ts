export interface GrammarExample {
  chinese: string
  pinyin: string
  translation: string
}

export interface GrammarQuiz {
  question: string
  options: string[]
  answerIndex: number
  explanation?: string
}

export interface GrammarPoint {
  id: string
  level: number
  title: string
  titleVi: string
  structure: string
  usedFor: string
  explanation?: string
  tip?: string
  examples: GrammarExample[]
  quiz?: GrammarQuiz[]
}
