import { db, type ReviewItem } from "../db/database"

export const reviewRepository = {
  async add(wordId: string) {
    const existing = await db.reviewItems.where("wordId").equals(wordId).first()
    if (existing) return existing

    const now = Date.now()
    const item: ReviewItem = {
      id: crypto.randomUUID(),
      wordId,
      status: "new",
      dueAt: now,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      correctCount: 0,
      wrongCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    await db.reviewItems.add(item)
    return item
  },

  async getById(reviewId: string) {
    return await db.reviewItems.get(reviewId)
  },

  async getByWordId(wordId: string) {
    return await db.reviewItems.where("wordId").equals(wordId).first()
  },

  async getDueReviews() {
    return await db.reviewItems.where("dueAt").belowOrEqual(Date.now()).toArray()
  },

  async getAll() {
    return await db.reviewItems.toArray()
  },

  async update(reviewId: string, changes: Partial<ReviewItem>) {
    await db.reviewItems.update(reviewId, { ...changes, updatedAt: Date.now() })
    return await db.reviewItems.get(reviewId)
  },

  async markKnown(reviewId: string) {
    const item = await db.reviewItems.get(reviewId)
    if (!item) throw new Error("Review item not found")

    const now = Date.now()
    let newInterval = item.interval > 0
      ? Math.round(item.interval * item.easeFactor)
      : 1

    newInterval = Math.min(newInterval, 365)

    const repetitions = item.repetitions + 1
    const status = newInterval >= 30 && repetitions >= 5 ? "mastered" : repetitions <= 2 ? "learning" : "review"

    const updated: ReviewItem = {
      ...item,
      status,
      interval: newInterval,
      dueAt: now + newInterval * 24 * 60 * 60 * 1000,
      repetitions,
      correctCount: item.correctCount + 1,
      updatedAt: now,
    }

    await db.reviewItems.put(updated)
    return updated
  },

  async markUnknown(reviewId: string) {
    const item = await db.reviewItems.get(reviewId)
    if (!item) throw new Error("Review item not found")

    const now = Date.now()
    const updated: ReviewItem = {
      ...item,
      status: "learning",
      interval: 0,
      dueAt: now + 10 * 60 * 1000,
      wrongCount: item.wrongCount + 1,
      easeFactor: Math.max(1.3, item.easeFactor - 0.15),
      updatedAt: now,
    }

    await db.reviewItems.put(updated)
    return updated
  },

  async markHard(reviewId: string) {
    const item = await db.reviewItems.get(reviewId)
    if (!item) throw new Error("Review item not found")

    const now = Date.now()
    const newInterval = item.interval > 0
      ? Math.max(1, Math.round(item.interval * 1.2))
      : 1

    const updated: ReviewItem = {
      ...item,
      status: "review",
      interval: newInterval,
      dueAt: now + newInterval * 24 * 60 * 60 * 1000,
      repetitions: item.repetitions + 1,
      correctCount: item.correctCount + 1,
      easeFactor: Math.max(1.3, item.easeFactor - 0.15),
      updatedAt: now,
    }

    await db.reviewItems.put(updated)
    return updated
  },

  async markEasy(reviewId: string) {
    const item = await db.reviewItems.get(reviewId)
    if (!item) throw new Error("Review item not found")

    const now = Date.now()
    let newInterval = item.interval > 0
      ? Math.round(item.interval * item.easeFactor * 1.3)
      : 4

    newInterval = Math.min(newInterval, 365)

    const newEase = Math.min(3.0, item.easeFactor + 0.15)
    const repetitions = item.repetitions + 1

    const updated: ReviewItem = {
      ...item,
      status: newInterval >= 30 ? "mastered" : "review",
      interval: newInterval,
      dueAt: now + newInterval * 24 * 60 * 60 * 1000,
      easeFactor: newEase,
      repetitions,
      correctCount: item.correctCount + 1,
      updatedAt: now,
    }

    await db.reviewItems.put(updated)
    return updated
  },

  async remove(reviewId: string) {
    await db.reviewItems.delete(reviewId)
  },

  async removeByWordId(wordId: string) {
    const item = await db.reviewItems.where("wordId").equals(wordId).first()
    if (!item) return

    await db.reviewItems.delete(item.id)
  },

  async reset(reviewId: string) {
    const item = await db.reviewItems.get(reviewId)
    if (!item) throw new Error("Review item not found")

    const now = Date.now()
    const updated: ReviewItem = {
      ...item,
      status: "new",
      dueAt: now,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      correctCount: 0,
      wrongCount: 0,
      updatedAt: now,
    }

    await db.reviewItems.put(updated)
    return updated
  },
}