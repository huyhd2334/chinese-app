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

// Chuẩn số lượng từ và bài học theo từng cấp HSK
export const HSK_CUMULATIVE_STANDARDS: Record<HskLevelNumber, { words: number; lessons: number; bookId: string; name: string }> = {
  1: { words: 150, lessons: 15, bookId: "new_hsk1_standard", name: "HSK 1" },
  2: { words: 300, lessons: 30, bookId: "new_hsk2_standard", name: "HSK 2" },
  3: { words: 600, lessons: 48, bookId: "new_hsk3_standard", name: "HSK 3" },
  4: { words: 1200, lessons: 68, bookId: "hsk4_standard", name: "HSK 4" },
  5: { words: 2500, lessons: 104, bookId: "hsk5_standard", name: "HSK 5" },
  6: { words: 5000, lessons: 144, bookId: "hsk6_standard", name: "HSK 6" },
}

export const HSK_LEVEL_INCREMENTS: Record<HskLevelNumber, { words: number; lessons: number; bookId: string }> = {
  1: { words: 150, lessons: 15, bookId: "new_hsk1_standard" },
  2: { words: 150, lessons: 15, bookId: "new_hsk2_standard" },
  3: { words: 300, lessons: 18, bookId: "new_hsk3_standard" },
  4: { words: 600, lessons: 20, bookId: "hsk4_standard" },
  5: { words: 1300, lessons: 36, bookId: "hsk5_standard" },
  6: { words: 2500, lessons: 40, bookId: "hsk6_standard" },
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

  // Mặc định mục tiêu HSK 1 nếu người dùng chưa thiết lập lộ trình
  const targetLevel: HskLevelNumber = roadmap?.targetLevel || 1
  const targetDateStr = roadmap?.targetDate || new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split("T")[0]
  
  // 1. Tính toán ngày còn lại
  const now = new Date()
  const targetDate = new Date(targetDateStr)
  const diffTime = targetDate.getTime() - now.getTime()
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

  // 2. Chuẩn hóa mục tiêu bài học và từ vựng
  const targetStandard = HSK_CUMULATIVE_STANDARDS[targetLevel]
  const totalTargetWords = targetStandard.words
  const totalTargetLessons = targetStandard.lessons

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
      let wordsMap: Map<string, Word> = new Map()

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

  // 5. Tính toán "Còn thiếu gì"
  const remainingLessons = Math.max(0, totalTargetLessons - completedLessonsCount)
  const remainingWords = Math.max(0, totalTargetWords - learnedWordsCount)

  const lessonProgressPercent = totalTargetLessons > 0 
    ? Math.min(100, Math.round((completedLessonsCount / totalTargetLessons) * 100)) 
    : 0
  const wordProgressPercent = totalTargetWords > 0 
    ? Math.min(100, Math.round((learnedWordsCount / totalTargetWords) * 100)) 
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
    breakdown.push({
      level: lvlNum,
      targetWords: inc.words,
      learnedWords: Math.min(inc.words, learnedWordsByLevel[lvlNum] || 0),
      masteredWords: Math.min(inc.words, masteredWordsByLevel[lvlNum] || 0),
      targetLessons: inc.lessons,
      completedLessons: Math.min(inc.lessons, completedLessonsByBook[inc.bookId] || 0),
    })
  }

  // 8. Đề xuất bài học tiếp theo cho hôm nay
  let recommendedLesson: { bookId: string; lessonId: number | string; title: string } | undefined
  for (let l = 1; l <= targetLevel; l++) {
    const lvlNum = l as HskLevelNumber
    const bookId = HSK_LEVEL_INCREMENTS[lvlNum]?.bookId
    if (!bookId) continue

    const bookCourse = PRESET_BOOKS.find((b) => b.id === bookId)
    const maxLessons = bookCourse ? bookCourse.totalLessons : 15

    for (let lid = 1; lid <= maxLessons; lid++) {
      const key = makeLessonKey(bookId, lid)
      const rec = lessonRecords[key]
      if (!rec || rec.percent < 80) {
        recommendedLesson = {
          bookId,
          lessonId: lid,
          title: `Bài ${lid}: ${bookCourse?.title || "HSK"}`,
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
    targetDate: targetDateStr,
    daysRemaining,

    totalTargetLessons,
    completedLessons: completedLessonsCount,
    inProgressLessons: inProgressLessonsCount,
    remainingLessons,
    lessonProgressPercent,

    totalTargetWords,
    learnedWords: learnedWordsCount,
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
