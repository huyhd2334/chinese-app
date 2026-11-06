import { db } from "../../db/database"
import { reviewRepository } from "../../repositories/reviewRepository"
import { getStoredRoadmap } from "./roadmapStorage"
import { isProUser, FREE_REVIEW_LIMIT } from "./subscription"

export interface AutoSeedResult {
  addedCount: number
  level: number
  reason: "initial_setup" | "daily_login" | "none"
  message?: string
}

/**
 * Tự động lấy từ vựng khi người dùng đăng nhập:
 * 1. Nếu tài khoản mới / chưa có từ nào trong hàng chờ ôn tập (chưa có tiến độ / chưa có từ):
 *    -> Tự động nạp ngay 10 từ vựng nền tảng phù hợp với cấp độ lộ trình vào hàng chờ SRS để học ngay.
 * 2. Nếu người dùng đăng nhập mỗi ngày (kể cả tài khoản miễn phí / chưa nạp Pro):
 *    -> Tự động chuẩn bị 10 từ mới tiếp theo của ngày hôm đó nếu hôm nay chưa nạp từ nào.
 */
export async function autoSeedWordsForUser(userId?: string): Promise<AutoSeedResult> {
  if (typeof window === "undefined") {
    return { addedCount: 0, level: 1, reason: "none" }
  }

  try {
    const totalWordsInDb = await db.words.count()
    if (totalWordsInDb === 0) {
      return { addedCount: 0, level: 1, reason: "none" }
    }

    const allReviews = await reviewRepository.getAll()
    const currentReviewCount = allReviews.length
    const isPro = isProUser()

    // Nếu người dùng miễn phí đã chạm trần 500 từ thì không tự động thêm nữa
    if (!isPro && currentReviewCount >= FREE_REVIEW_LIMIT) {
      return { addedCount: 0, level: 1, reason: "none" }
    }

    // Đọc lộ trình học để biết nên lấy từ ở cấp độ nào (nếu đã có HSK 2 thì lấy từ HSK 3)
    const roadmap = getStoredRoadmap(userId)
    const startLevel = roadmap?.startLevel || 0
    const targetHskLevel = startLevel > 0 ? Math.min(6, startLevel + 1) : 1

    const existingWordIds = new Set(allReviews.map((r) => r.wordId))

    // TRƯỜNG HỢP 1: Tài khoản mới chưa có từ nào trong kho ôn tập (allReviews.length === 0)
    if (currentReviewCount === 0) {
      const candidateWords = await db.words
        .where("hskLevel")
        .equals(targetHskLevel)
        .limit(30)
        .toArray()

      const toAdd = candidateWords.filter((w) => !existingWordIds.has(w.id)).slice(0, 10)

      let added = 0
      for (const w of toAdd) {
        try {
          await reviewRepository.add(w.id)
          added++
        } catch {
          break
        }
      }

      if (added > 0) {
        window.dispatchEvent(new CustomEvent("roadmap-updated"))
        window.dispatchEvent(new CustomEvent("hsk-words-updated"))
        return {
          addedCount: added,
          level: targetHskLevel,
          reason: "initial_setup",
          message: `Tiểu Lu đã tự động chuẩn bị sẵn ${added} từ vựng HSK ${targetHskLevel} đầu tiên để bạn bắt đầu học ngay! ✨`,
        }
      }
    }

    // TRƯỜNG HỢP 2: Người dùng đăng nhập mỗi ngày (Hằng ngày nạp 10 từ mới vào lộ trình)
    const todayStr = new Date().toISOString().split("T")[0]
    const storageKey = `hsk_auto_seeded_date_${userId || "guest"}`
    const lastSeededDate = localStorage.getItem(storageKey)

    // Kiểm tra xem hôm nay đã thêm từ mới nào chưa
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const wordsAddedToday = allReviews.filter((r) => r.createdAt >= todayStart.getTime()).length

    if (lastSeededDate !== todayStr && wordsAddedToday === 0) {
      let candidateWords = await db.words
        .where("hskLevel")
        .equals(targetHskLevel)
        .toArray()

      let unlearnedWords = candidateWords.filter((w) => !existingWordIds.has(w.id))

      // Nếu cấp độ hiện tại đã học hết, chuyển sang cấp độ tiếp theo
      if (unlearnedWords.length === 0 && targetHskLevel < 6) {
        candidateWords = await db.words
          .where("hskLevel")
          .equals(targetHskLevel + 1)
          .toArray()
        unlearnedWords = candidateWords.filter((w) => !existingWordIds.has(w.id))
      }

      const toAdd = unlearnedWords.slice(0, 10)
      let added = 0

      for (const w of toAdd) {
        try {
          await reviewRepository.add(w.id)
          added++
        } catch {
          break
        }
      }

      localStorage.setItem(storageKey, todayStr)

      if (added > 0) {
        window.dispatchEvent(new CustomEvent("roadmap-updated"))
        window.dispatchEvent(new CustomEvent("hsk-words-updated"))
        return {
          addedCount: added,
          level: targetHskLevel,
          reason: "daily_login",
          message: `Chào ngày mới! Tiểu Lu đã nạp sẵn ${added} từ mới hôm nay vào hàng chờ ôn tập cho bạn. 🎯`,
        }
      }
    }

    return { addedCount: 0, level: targetHskLevel, reason: "none" }
  } catch (err) {
    console.warn("Lỗi khi tự động lấy từ vựng:", err)
    return { addedCount: 0, level: 1, reason: "none" }
  }
}
