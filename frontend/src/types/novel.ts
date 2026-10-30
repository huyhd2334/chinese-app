export interface NovelChapter {
  id: number
  chapterNumber: number
  title: string
  paragraphs: string[]
  charCount: number
}

export interface Novel {
  id: string
  title: string
  chineseTitle: string
  pinyinTitle: string
  author: string
  category: string
  tags: string[]
  level: string
  coverUrl: string
  description: string
  totalChapters: number
  totalWords: number
  chapters: NovelChapter[]
}
