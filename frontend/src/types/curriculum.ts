export interface BookCourse {
  id: string
  title: string
  chineseTitle: string
  level: number
  description: string
  totalLessons: number
  badge?: string
  colorTheme: string
  coverImage?: string
  isCustom?: boolean
}

export interface CurriculumWord {
  id: string
  hanzi: string
  pinyin: string
  hanViet: string
  meaning: string
  partOfSpeech?: string
  example?: string
  examplePinyin?: string
  exampleVi?: string
  verified?: boolean
}

export interface CurriculumDialogue {
  id: string
  role?: string
  chinese: string
  pinyin?: string
  vietnamese?: string
}

export interface CurriculumReadingPassage {
  title?: string
  content: string
  pinyin?: string
  vietnamese?: string
}

export interface CurriculumListeningExercise {
  id: string
  audioText: string
  question: string
  questionPinyin?: string
  options: string[]
  answerIndex: number
  explanation?: string
}

export interface CurriculumLesson {
  id: string
  bookId: string
  lessonNumber: number
  title: string
  titleVi: string
  titlePinyin?: string
  vocabulary: CurriculumWord[]
  dialogues?: CurriculumDialogue[]
  readingPassage?: CurriculumReadingPassage
  listeningExercises?: CurriculumListeningExercise[]
  grammarNotes?: string[]
  updatedAt?: number
  isCustom?: boolean
}
