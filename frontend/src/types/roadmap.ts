export type HskLevelNumber = 1 | 2 | 3 | 4 | 5 | 6

export type RoadmapGoalType = 
  | "hsk_exam"       // Luyện thi HSK chuẩn
  | "conversation"   // Giao tiếp đời sống / du lịch
  | "business"       // Công việc / thương mại
  | "foundational"   // Xây nền từ con số 0

export type FocusSkill = "vocabulary" | "grammar" | "listening" | "speaking" | "writing"

export interface RoadmapSetupInput {
  goalType: RoadmapGoalType
  targetLevel: HskLevelNumber
  startLevel: number // 0: chưa biết gì, 1: HSK1, 2: HSK2...
  targetDate: string // YYYY-MM-DD
  minutesPerDay: number // e.g. 15, 30, 45, 60
  daysPerWeek: number // e.g. 5, 6, 7
  focusSkills: FocusSkill[]
}

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  targetWeek: number
  targetWordsCount: number
  targetLessonsCount: number
  isCompleted: boolean
}

export interface UserRoadmap extends RoadmapSetupInput {
  id: string
  createdAt: number
  updatedAt: number
  milestones: RoadmapMilestone[]
}

export interface RoadmapLevelBreakdown {
  level: HskLevelNumber
  targetWords: number
  learnedWords: number
  masteredWords: number
  targetLessons: number
  completedLessons: number
}

export interface RoadmapStats {
  hasRoadmap: boolean
  goalTitle: string
  targetLevel: HskLevelNumber
  targetDate: string
  daysRemaining: number

  // Tổng quan Bài học
  totalTargetLessons: number
  completedLessons: number
  inProgressLessons: number
  remainingLessons: number
  lessonProgressPercent: number

  // Tổng quan Từ vựng
  totalTargetWords: number
  learnedWords: number   // status != "new"
  masteredWords: number  // status == "mastered" or interval >= 21
  remainingWords: number
  wordProgressPercent: number

  // Nhịp độ học tập (Pace)
  dailyPaceRequired: number // từ/ngày cần đạt để kịp hạn
  currentPaceWordsPerDay: number // tốc độ học thực tế 7 ngày gần nhất
  weeklyLessonsRequired: number // bài/tuần cần hoàn thành
  paceStatus: "ahead" | "on_track" | "behind" | "danger"

  // Thời gian & chính xác
  totalTimeSpentMinutes: number
  overallAccuracyRate: number // % đúng SRS

  // Chi tiết từng cấp độ
  breakdown: RoadmapLevelBreakdown[]

  // Nhiệm vụ gợi ý hôm nay
  dailyPlan: {
    recommendedLesson?: {
      bookId: string
      lessonId: number | string
      title: string
    }
    wordsToReviewCount: number
    newWordsTargetCount: number
    targetMinutes: number
  }
}
