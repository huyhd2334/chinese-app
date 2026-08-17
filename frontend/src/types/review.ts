export type ReviewRating = 1 | 2 | 3 | 4

export type ReviewStatus = | "new" | "learning" | "review" | "mastered"

export interface Review {
  id: string
  wordId: string

  status: ReviewStatus
  rating: ReviewRating
  
  // SRS
  easeFactor: number
  interval: number
  repetitions: number

  // Review timing
  dueAt: Date
  lastReviewedAt?: Date

  // Statistics
  correctCount: number
  incorrectCount: number

  createdAt: Date
  updatedAt: Date
}

