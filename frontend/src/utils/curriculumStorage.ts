import { BookCourse, CurriculumLesson } from "@/types/curriculum"
import { PRESET_BOOKS, PRESET_LESSONS } from "@/data/hskStandardCourses"

const STORAGE_CUSTOM_BOOKS_KEY = "hsk_custom_books_v1"
const STORAGE_CUSTOM_LESSONS_KEY = "hsk_custom_lessons_v1"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

export function getAllBooks(): BookCourse[] {
  if (!isBrowser()) return PRESET_BOOKS

  try {
    const rawCustom = localStorage.getItem(STORAGE_CUSTOM_BOOKS_KEY)
    const customBooks: BookCourse[] = rawCustom ? JSON.parse(rawCustom) : []
    return [...PRESET_BOOKS, ...customBooks]
  } catch (e) {
    console.error("Failed to load custom books:", e)
    return PRESET_BOOKS
  }
}

export function getBook(bookId: string): BookCourse | undefined {
  return getAllBooks().find((b) => b.id === bookId)
}

export function getLessons(bookId: string): CurriculumLesson[] {
  const presets = PRESET_LESSONS[bookId] || []
  if (!isBrowser()) return presets

  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_LESSONS_KEY)
    const customLessonsMap: Record<string, CurriculumLesson[]> = raw ? JSON.parse(raw) : {}
    const customList = customLessonsMap[bookId] || []

    // Merge custom into presets by lessonNumber / id
    const mergedMap = new Map<string, CurriculumLesson>()
    for (const l of presets) {
      mergedMap.set(l.id, l)
    }
    for (const l of customList) {
      mergedMap.set(l.id, l)
    }

    return Array.from(mergedMap.values()).sort((a, b) => a.lessonNumber - b.lessonNumber)
  } catch (e) {
    console.error("Failed to load lessons for", bookId, e)
    return presets
  }
}

export function getLesson(bookId: string, lessonId: string): CurriculumLesson | undefined {
  const lessons = getLessons(bookId)
  return lessons.find((l) => l.id === lessonId || l.lessonNumber === Number(lessonId))
}

export function saveLesson(lesson: CurriculumLesson): void {
  if (!isBrowser()) return

  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_LESSONS_KEY)
    const customLessonsMap: Record<string, CurriculumLesson[]> = raw ? JSON.parse(raw) : {}

    const bookLessons = customLessonsMap[lesson.bookId] || []
    const existingIndex = bookLessons.findIndex((l) => l.id === lesson.id)

    if (existingIndex >= 0) {
      bookLessons[existingIndex] = { ...lesson, updatedAt: Date.now() }
    } else {
      bookLessons.push({ ...lesson, updatedAt: Date.now() })
    }

    customLessonsMap[lesson.bookId] = bookLessons
    localStorage.setItem(STORAGE_CUSTOM_LESSONS_KEY, JSON.stringify(customLessonsMap))

    // Update book total lessons if larger
    const book = getBook(lesson.bookId)
    if (book && lesson.lessonNumber > book.totalLessons) {
      book.totalLessons = lesson.lessonNumber
      saveCustomBook(book)
    }
  } catch (e) {
    console.error("Failed to save lesson:", e)
    throw e
  }
}

export function saveCustomBook(book: BookCourse): void {
  if (!isBrowser()) return

  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_BOOKS_KEY)
    const customBooks: BookCourse[] = raw ? JSON.parse(raw) : []

    const idx = customBooks.findIndex((b) => b.id === book.id)
    if (idx >= 0) {
      customBooks[idx] = book
    } else {
      customBooks.push({ ...book, isCustom: true })
    }

    localStorage.setItem(STORAGE_CUSTOM_BOOKS_KEY, JSON.stringify(customBooks))
  } catch (e) {
    console.error("Failed to save custom book:", e)
  }
}

export function exportCurriculumJson(): string {
  if (!isBrowser()) return "{}"
  const customBooks = localStorage.getItem(STORAGE_CUSTOM_BOOKS_KEY) || "[]"
  const customLessons = localStorage.getItem(STORAGE_CUSTOM_LESSONS_KEY) || "{}"
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      customBooks: JSON.parse(customBooks),
      customLessons: JSON.parse(customLessons),
    },
    null,
    2
  )
}

export function importCurriculumJson(jsonStr: string): boolean {
  if (!isBrowser()) return false
  try {
    const data = JSON.parse(jsonStr)
    if (data.customBooks && Array.isArray(data.customBooks)) {
      localStorage.setItem(STORAGE_CUSTOM_BOOKS_KEY, JSON.stringify(data.customBooks))
    }
    if (data.customLessons && typeof data.customLessons === "object") {
      localStorage.setItem(STORAGE_CUSTOM_LESSONS_KEY, JSON.stringify(data.customLessons))
    }
    return true
  } catch (e) {
    console.error("Import failed:", e)
    return false
  }
}
