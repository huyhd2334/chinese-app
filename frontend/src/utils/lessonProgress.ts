export interface LessonProgressData {
  percent: number // 0 to 100
  timeSpentSeconds: number // in seconds
  completedSections: string[] // e.g. ['reader', 'vocab', 'grammar', 'flashcards', 'exercises']
  lastStudiedAt: number
}

const STORAGE_KEY = 'hsk_lesson_progress_v2'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function getAllProgressRecords(): Record<string, LessonProgressData> {
  if (!isBrowser()) return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    console.error('Failed to parse lesson progress:', e)
    return {}
  }
}

function saveAllProgressRecords(data: Record<string, LessonProgressData>): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // Dispatch a custom event so tabs or same-page components can react
    window.dispatchEvent(new CustomEvent('lesson-progress-updated'))
  } catch (e) {
    console.error('Failed to save lesson progress:', e)
  }
}

export function makeLessonKey(bookId: string, lessonId: string | number): string {
  return `${bookId}__${lessonId}`
}

export function getLessonProgress(bookId: string, lessonId: string | number): LessonProgressData {
  const records = getAllProgressRecords()
  const key = makeLessonKey(bookId, lessonId)
  return records[key] || {
    percent: 0,
    timeSpentSeconds: 0,
    completedSections: [],
    lastStudiedAt: 0,
  }
}

export function saveLessonProgress(
  bookId: string,
  lessonId: string | number,
  updates: Partial<LessonProgressData>
): LessonProgressData {
  const records = getAllProgressRecords()
  const key = makeLessonKey(bookId, lessonId)
  const current = records[key] || {
    percent: 0,
    timeSpentSeconds: 0,
    completedSections: [],
    lastStudiedAt: Date.now(),
  }

  const updated: LessonProgressData = {
    ...current,
    ...updates,
    lastStudiedAt: Date.now(),
  }

  // Ensure percent is clamped between 0 and 100
  updated.percent = Math.min(100, Math.max(0, Math.round(updated.percent)))

  records[key] = updated
  saveAllProgressRecords(records)
  return updated
}

/**
 * Increment study time for a lesson by seconds
 */
export function addLessonStudyTime(
  bookId: string,
  lessonId: string | number,
  secondsToAdd: number
): number {
  if (secondsToAdd <= 0) return 0
  const records = getAllProgressRecords()
  const key = makeLessonKey(bookId, lessonId)
  const current = records[key] || {
    percent: 0,
    timeSpentSeconds: 0,
    completedSections: [],
    lastStudiedAt: Date.now(),
  }

  current.timeSpentSeconds = (current.timeSpentSeconds || 0) + secondsToAdd
  current.lastStudiedAt = Date.now()

  // If user spent >= 30 seconds and percent is 0, give initial 10% kickoff
  if (current.timeSpentSeconds >= 30 && current.percent === 0) {
    current.percent = 10
  }

  records[key] = current
  saveAllProgressRecords(records)
  return current.timeSpentSeconds
}

/**
 * Toggle a completed section ('reader' | 'vocab' | 'grammar' | 'flashcards' | 'exercises')
 * Each section accounts for 20% of the total 100%
 */
export const LESSON_SECTIONS = [
  { id: 'reader', label: 'Bài khóa', weight: 20 },
  { id: 'vocab', label: 'Từ mới', weight: 20 },
  { id: 'grammar', label: 'Ngữ pháp', weight: 20 },
  { id: 'flashcards', label: 'Flashcard', weight: 20 },
  { id: 'exercises', label: 'Bài tập', weight: 20 },
]

export function toggleLessonSection(
  bookId: string,
  lessonId: string | number,
  sectionId: string
): LessonProgressData {
  const progress = getLessonProgress(bookId, lessonId)
  const set = new Set(progress.completedSections || [])

  if (set.has(sectionId)) {
    set.delete(sectionId)
  } else {
    set.add(sectionId)
  }

  const newCompleted = Array.from(set)
  const newPercent = Math.min(100, newCompleted.length * 20)

  return saveLessonProgress(bookId, lessonId, {
    completedSections: newCompleted,
    percent: newPercent,
  })
}

/**
 * Mark lesson as 100% complete
 */
export function markLessonComplete(
  bookId: string,
  lessonId: string | number
): LessonProgressData {
  return saveLessonProgress(bookId, lessonId, {
    percent: 100,
    completedSections: LESSON_SECTIONS.map((s) => s.id),
  })
}

/**
 * Format seconds into a friendly hours/minutes string:
 * - "0 phút" (or "< 1 phút")
 * - "25 phút (0.4 giờ)"
 * - "1.5 giờ (90 phút)"
 */
export function formatStudyHours(seconds: number): string {
  if (!seconds || seconds <= 0) return '0 giờ'
  const hours = seconds / 3600
  if (hours < 0.1) {
    const mins = Math.max(1, Math.round(seconds / 60))
    return `${mins} phút (${hours.toFixed(2)}h)`
  }
  return `${hours.toFixed(1)} giờ (${Math.round(seconds / 60)} phút)`
}

export function formatStudyHoursShort(seconds: number): string {
  if (!seconds || seconds <= 0) return '0h'
  const hours = seconds / 3600
  if (hours < 0.1) {
    const mins = Math.max(1, Math.round(seconds / 60))
    return `${mins}m`
  }
  return `${hours.toFixed(1)}h`
}

/**
 * Calculate overall stats for an entire book
 */
export function getBookOverallProgress(
  bookId: string,
  lessonIds: (string | number)[]
): {
  totalLessons: number
  completedLessons: number
  avgPercent: number
  totalStudyTimeSeconds: number
} {
  if (!lessonIds || lessonIds.length === 0) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      avgPercent: 0,
      totalStudyTimeSeconds: 0,
    }
  }

  let totalPercent = 0
  let completedCount = 0
  let totalSeconds = 0

  for (const lid of lessonIds) {
    const p = getLessonProgress(bookId, lid)
    totalPercent += p.percent || 0
    totalSeconds += p.timeSpentSeconds || 0
    if ((p.percent || 0) >= 100) {
      completedCount++
    }
  }

  return {
    totalLessons: lessonIds.length,
    completedLessons: completedCount,
    avgPercent: Math.round(totalPercent / lessonIds.length),
    totalStudyTimeSeconds: totalSeconds,
  }
}
