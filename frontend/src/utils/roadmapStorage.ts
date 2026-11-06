import { db, type ReviewItem, type Word } from "../../db/database"
import { getAllProgressRecords, makeLessonKey } from "./lessonProgress"
import { PRESET_BOOKS } from "@/data/hskStandardCourses"
import type {
  UserRoadmap,
  RoadmapStats,
  RoadmapSetupInput,
  HskLevelNumber,
  RoadmapLevelBreakdown,
  RoadmapMilestone,
} from "@/types/roadmap"

const ROADMAP_STORAGE_KEY = "hsk_user_roadmap_v1"

// Chuẩn số lượng từ và bài học theo từng cấp HSK Chuẩn 3.0
export const HSK_CUMULATIVE_STANDARDS: Record<HskLevelNumber, { words: number; lessons: number; bookId: string; name: string }> = {
  1: { words: 300, lessons: 15, bookId: "new_hsk1_standard", name: "HSK 1 (3.0)" },
  2: { words: 600, lessons: 30, bookId: "new_hsk2_standard", name: "HSK 2 (3.0)" },
  3: { words: 1000, lessons: 48, bookId: "new_hsk3_standard", name: "HSK 3 (3.0)" },
  4: { words: 1600, lessons: 68, bookId: "new_hsk3_standard", name: "HSK 4" },
  5: { words: 2500, lessons: 88, bookId: "new_hsk3_standard", name: "HSK 5" },
  6: { words: 4000, lessons: 108, bookId: "new_hsk3_standard", name: "HSK 6" },
}

export const HSK_LEVEL_INCREMENTS: Record<HskLevelNumber, { words: number; lessons: number; bookId: string }> = {
  1: { words: 300, lessons: 15, bookId: "new_hsk1_standard" },
  2: { words: 300, lessons: 15, bookId: "new_hsk2_standard" },
  3: { words: 400, lessons: 18, bookId: "new_hsk3_standard" },
  4: { words: 600, lessons: 20, bookId: "new_hsk3_standard" },
  5: { words: 900, lessons: 20, bookId: "new_hsk3_standard" },
  6: { words: 1500, lessons: 20, bookId: "new_hsk3_standard" },
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Lấy lộ trình cá nhân đã lưu trong LocalStorage
 */
export function getStoredRoadmap(): UserRoadmap | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(ROADMAP_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserRoadmap
  } catch (err) {
    console.error("Failed to parse stored roadmap:", err)
    return null
  }
}

/**
 * Lưu lộ trình cá nhân và phát tín hiệu reactive
 */
export function saveRoadmap(roadmap: UserRoadmap): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap))
    window.dispatchEvent(new CustomEvent("roadmap-updated", { detail: roadmap }))
  } catch (err) {
    console.error("Failed to save roadmap:", err)
  }
}

/**
 * Xóa lộ trình để thiết lập lại
 */
export function clearRoadmap(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(ROADMAP_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent("roadmap-updated", { detail: null }))
  } catch (err) {
    console.error("Failed to clear roadmap:", err)
  }
}

/**
 * Tự động tạo ra danh sách mốc (milestones) từ dữ liệu thiết lập
 */
export function generateRoadmapMilestones(input: RoadmapSetupInput): RoadmapMilestone[] {
  const milestones: RoadmapMilestone[] = []
  const targetLevel = input.targetLevel
  const startLevel = Math.max(0, input.startLevel)

  let weekCounter = 1
  for (let lvl = (startLevel === 0 ? 1 : startLevel + 1); lvl <= targetLevel; lvl++) {
    const levelNum = lvl as HskLevelNumber
    const increment = HSK_LEVEL_INCREMENTS[levelNum]
    if (!increment) continue

    // Chia mỗi cấp độ thành 2-4 chặng nhỏ
    const chunks = levelNum <= 2 ? 2 : 4
    const wordsPerChunk = Math.round(increment.words / chunks)
    const lessonsPerChunk = Math.max(1, Math.round(increment.lessons / chunks))

    for (let c = 1; c <= chunks; c++) {
      milestones.push({
        id: `milestone_hsk${levelNum}_chunk${c}`,
        title: `HSK ${levelNum} - Chặng ${c}/${chunks}`,
        description: `Chinh phục ${lessonsPerChunk} bài học & ${wordsPerChunk} từ vựng trọng tâm`,
        targetWeek: weekCounter++,
        targetWordsCount: wordsPerChunk * c,
        targetLessonsCount: lessonsPerChunk * c,
        isCompleted: false,
      })
    }
  }

  return milestones
}

/**
 * Tính toán toàn diện tiến độ học tập thực tế và đo đạc "Còn thiếu gì"
 */
export async function computeRoadmapStats(customRoadmap?: UserRoadmap | null): Promise<RoadmapStats> {
  const roadmap = customRoadmap !== undefined ? customRoadmap : getStoredRoadmap()

  // Mặc định mục tiêu và trình độ khởi điểm (giới hạn mục tiêu trong phạm vi giáo trình có sẵn HSK 1-3)
  const rawTarget = roadmap?.targetLevel || 2
  const targetLevel: HskLevelNumber = (Math.min(3, Math.max(1, rawTarget)) as HskLevelNumber)
  const startLevel = Math.min(targetLevel - 1, Math.max(0, roadmap?.startLevel ?? 0))
  
  // 1. Tính toán ngày còn lại, giới hạn hợp lý tối đa 365 ngày (tránh tình trạng ngày bị đặt quá xa đến 2032)
  const now = new Date()
  let targetDateStr = roadmap?.targetDate
  if (targetDateStr) {
    const targetTime = new Date(targetDateStr).getTime()
    const diffDays = Math.ceil((targetTime - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0 || diffDays > 365) {
      // Hạn không hợp lý -> Đặt lại mặc định 90 ngày
      const fallback = new Date(Date.now() + 90 * 24 * 3600 * 1000)
      targetDateStr = fallback.toISOString().split("T")[0]
    }
  } else {
    const fallback = new Date(Date.now() + 60 * 24 * 3600 * 1000)
    targetDateStr = fallback.toISOString().split("T")[0]
  }

  const targetDate = new Date(targetDateStr)
  const diffTime = targetDate.getTime() - now.getTime()
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

  // 2. Chuẩn hóa mục tiêu bài học và từ vựng
  const targetStandard = HSK_CUMULATIVE_STANDARDS[targetLevel]
  const totalTargetWords = targetStandard.words
  const totalTargetLessons = targetStandard.lessons

  // Trừ bớt khối lượng nếu người học đã có trình độ nền tảng từ trước (không bắt học lại từ HSK 1)
  const alreadyKnownWords = startLevel > 0 ? (HSK_CUMULATIVE_STANDARDS[startLevel as HskLevelNumber]?.words || 0) : 0
  const alreadyKnownLessons = startLevel > 0 ? (HSK_CUMULATIVE_STANDARDS[startLevel as HskLevelNumber]?.lessons || 0) : 0

  // 3. Đọc tiến độ bài học từ LocalStorage (lessonProgress.ts)
  const lessonRecords = getAllProgressRecords()
  let completedLessonsCount = 0
  let inProgressLessonsCount = 0
  let totalTimeSpentSeconds = 0
  const completedLessonsByBook: Record<string, number> = {}

  // Lặp qua các sách trong phạm vi mục tiêu
  for (let lvl = 1; lvl <= targetLevel; lvl++) {
    const bookId = HSK_LEVEL_INCREMENTS[lvl as HskLevelNumber]?.bookId
    if (!bookId) continue

    const bookCourse = PRESET_BOOKS.find((b) => b.id === bookId)
    const maxLessons = bookCourse ? bookCourse.totalLessons : 15
    completedLessonsByBook[bookId] = 0

    for (let lessonId = 1; lessonId <= maxLessons; lessonId++) {
      const key = makeLessonKey(bookId, lessonId)
      const record = lessonRecords[key]
      if (record) {
        totalTimeSpentSeconds += record.timeSpentSeconds || 0
        if (record.percent >= 80) {
          completedLessonsCount++
          completedLessonsByBook[bookId]++
        } else if (record.percent > 0) {
          inProgressLessonsCount++
        }
      }
    }
  }

  // 4. Đọc dữ liệu từ vựng SRS từ IndexedDB
  let learnedWordsCount = 0
  let masteredWordsCount = 0
  let totalCorrect = 0
  let totalWrong = 0
  let dueReviewCount = 0
  const nowTimestamp = Date.now()

  // Phân tích chi tiết từ theo cấp HSK
  const learnedWordsByLevel: Record<HskLevelNumber, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  const masteredWordsByLevel: Record<HskLevelNumber, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

  try {
    if (db && db.reviewItems) {
      const allReviews: ReviewItem[] = await db.reviewItems.toArray()
      const wordsMap: Map<string, Word> = new Map()

      try {
        if (db.words) {
          const wordsList: Word[] = await db.words.toArray()
          wordsList.forEach((w) => wordsMap.set(w.id, w))
        }
      } catch (e) {
        // Fallback nếu words store chưa sẵn sàng
      }

      for (const item of allReviews) {
        totalCorrect += item.correctCount || 0
        totalWrong += item.wrongCount || 0

        if (item.dueAt && item.dueAt <= nowTimestamp) {
          dueReviewCount++
        }

        const isLearned = item.status && item.status !== "new"
        const isMastered = item.status === "mastered" || (item.interval && item.interval >= 21)

        if (isLearned) {
          learnedWordsCount++

          // Xác định level của từ này
          const wordInfo = wordsMap.get(item.wordId)
          let lvl: HskLevelNumber = 1
          if (wordInfo?.hskLevel && wordInfo.hskLevel.length > 0) {
            lvl = (Math.min(6, Math.max(1, wordInfo.hskLevel[0])) as HskLevelNumber)
          } else if (wordInfo?.hskLevels && wordInfo.hskLevels.length > 0) {
            lvl = (Math.min(6, Math.max(1, wordInfo.hskLevels[0])) as HskLevelNumber)
          }

          learnedWordsByLevel[lvl] = (learnedWordsByLevel[lvl] || 0) + 1

          if (isMastered) {
            masteredWordsCount++
            masteredWordsByLevel[lvl] = (masteredWordsByLevel[lvl] || 0) + 1
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not read SRS reviews from IndexedDB:", err)
  }

  // 5. Tính toán "Còn thiếu gì" (kết hợp cả phần đã có nền tảng từ startLevel)
  const effectiveLearnedWords = Math.min(totalTargetWords, learnedWordsCount + alreadyKnownWords)
  const effectiveMasteredWords = Math.min(totalTargetWords, masteredWordsCount + alreadyKnownWords)
  const effectiveCompletedLessons = Math.min(totalTargetLessons, completedLessonsCount + alreadyKnownLessons)

  const remainingLessons = Math.max(0, totalTargetLessons - effectiveCompletedLessons)
  const remainingWords = Math.max(0, totalTargetWords - effectiveLearnedWords)

  const lessonProgressPercent = totalTargetLessons > 0 
    ? Math.min(100, Math.round((effectiveCompletedLessons / totalTargetLessons) * 100)) 
    : 0
  const wordProgressPercent = totalTargetWords > 0 
    ? Math.min(100, Math.round((effectiveLearnedWords / totalTargetWords) * 100)) 
    : 0

  // 6. Nhịp độ (Pace) & Vận tốc cần thiết
  const dailyPaceRequired = Math.ceil(remainingWords / daysRemaining)
  const weeksRemaining = Math.max(1, daysRemaining / 7)
  const weeklyLessonsRequired = parseFloat((remainingLessons / weeksRemaining).toFixed(1))

  // Ước lượng tốc độ thực tế (tạm tính dựa trên số từ chia cho số ngày đã học, tối thiểu 5 từ/ngày mẫu)
  const currentPaceWordsPerDay = Math.max(1, Math.round(learnedWordsCount / Math.max(1, Math.min(30, 60 - daysRemaining))))
  
  let paceStatus: "ahead" | "on_track" | "behind" | "danger" = "on_track"
  if (remainingWords === 0 && remainingLessons === 0) {
    paceStatus = "ahead"
  } else if (dailyPaceRequired > (roadmap?.minutesPerDay || 30)) {
    paceStatus = "danger" // Cần học quá nhiều từ mỗi ngày so với thời gian có
  } else if (currentPaceWordsPerDay < dailyPaceRequired) {
    paceStatus = "behind"
  } else {
    paceStatus = "on_track"
  }

  // Tỉ lệ chính xác
  const totalAnswers = totalCorrect + totalWrong
  const overallAccuracyRate = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 100

  // 7. Bóc tách chi tiết từng cấp độ
  const breakdown: RoadmapLevelBreakdown[] = []
  for (let l = 1; l <= targetLevel; l++) {
    const lvlNum = l as HskLevelNumber
    const inc = HSK_LEVEL_INCREMENTS[lvlNum]
    const isAlreadyKnownLevel = l <= startLevel

    // Cấp độ đã có nền tảng tự động được tính đã hoàn thành
    const actualLearnedWords = isAlreadyKnownLevel
      ? inc.words
      : Math.min(inc.words, learnedWordsByLevel[lvlNum] || 0)

    const actualMasteredWords = isAlreadyKnownLevel
      ? inc.words
      : Math.min(inc.words, masteredWordsByLevel[lvlNum] || 0)

    const actualCompletedLessons = isAlreadyKnownLevel
      ? inc.lessons
      : Math.min(inc.lessons, completedLessonsByBook[inc.bookId] || 0)

    breakdown.push({
      level: lvlNum,
      targetWords: inc.words,
      learnedWords: actualLearnedWords,
      masteredWords: actualMasteredWords,
      targetLessons: inc.lessons,
      completedLessons: actualCompletedLessons,
    })
  }

  // 8. Đề xuất bài học tiếp theo cho hôm nay (bắt đầu từ cấp độ chưa hoàn thành)
  let recommendedLesson: { bookId: string; lessonId: number | string; title: string } | undefined
  const startLearningLevel = startLevel > 0 ? Math.min(targetLevel, startLevel + 1) : 1
  for (let l = startLearningLevel; l <= targetLevel; l++) {
    const lvlNum = l as HskLevelNumber
    const bookId = HSK_LEVEL_INCREMENTS[lvlNum]?.bookId
    if (!bookId) continue

    const bookCourse = PRESET_BOOKS.find((b) => b.id === bookId)
    if (!bookCourse) continue
    const maxLessons = bookCourse.totalLessons || 15

    for (let lid = 1; lid <= maxLessons; lid++) {
      const key = makeLessonKey(bookId, lid)
      const rec = lessonRecords[key]
      if (!rec || rec.percent < 80) {
        recommendedLesson = {
          bookId,
          lessonId: lid,
          title: `Bài ${lid} (${bookCourse.badge || `HSK ${lvlNum}`})`,
        }
        break
      }
    }
    if (recommendedLesson) break
  }

  const goalTitles: Record<string, string> = {
    hsk_exam: `Chinh phục kỳ thi HSK ${targetLevel}`,
    conversation: `Giao tiếp tiếng Trung thành thạo (HSK ${targetLevel})`,
    business: `Tiếng Trung thương mại & công việc (HSK ${targetLevel})`,
    foundational: `Xây gốc tiếng Trung từ số 0 (HSK ${targetLevel})`,
  }

  return {
    hasRoadmap: !!roadmap,
    goalTitle: roadmap ? (goalTitles[roadmap.goalType] || `Mục tiêu HSK ${targetLevel}`) : `Mục tiêu khởi động HSK 1`,
    targetLevel,
    startLevel,
    targetDate: targetDateStr,
    daysRemaining,

    totalTargetLessons,
    completedLessons: completedLessonsCount,
    effectiveCompletedLessons,
    alreadyKnownLessons,
    inProgressLessons: inProgressLessonsCount,
    remainingLessons,
    lessonProgressPercent,

    totalTargetWords,
    learnedWords: learnedWordsCount,
    effectiveLearnedWords,
    alreadyKnownWords,
    masteredWords: masteredWordsCount,
    remainingWords,
    wordProgressPercent,

    dailyPaceRequired,
    currentPaceWordsPerDay,
    weeklyLessonsRequired,
    paceStatus,

    totalTimeSpentMinutes: Math.round(totalTimeSpentSeconds / 60),
    overallAccuracyRate,

    breakdown,

    dailyPlan: {
      recommendedLesson,
      wordsToReviewCount: dueReviewCount,
      newWordsTargetCount: Math.min(20, Math.max(5, dailyPaceRequired)),
      targetMinutes: roadmap?.minutesPerDay || 30,
    },
  }
}
