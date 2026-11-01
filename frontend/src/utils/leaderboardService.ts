/**
 * Leaderboard Service
 * Quản lý tính toán điểm số (XP), thứ hạng (Rank) và bảng xếp hạng cộng đồng
 */

import { db } from "../../db/database"
import { getAllProgressRecords } from "./lessonProgress"

export interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  hskLevel: number
  wordsCount: number
  streakDays: number
  lessonsCompleted: number
  xp: number
  isCurrentUser?: boolean
  badgeTitle?: string
}

const SEED_USERS: Omit<LeaderboardUser, "xp">[] = [
  { id: "seed_1", name: "Trần Minh Quân", avatar: "/chibi-scholar-gold.svg", hskLevel: 6, wordsCount: 3840, streakDays: 142, lessonsCompleted: 78, badgeTitle: "Trạng Nguyên HSK" },
  { id: "seed_2", name: "Nguyễn Thảo Linh", avatar: "/chibi-wuxia.svg", hskLevel: 5, wordsCount: 2210, streakDays: 98, lessonsCompleted: 62, badgeTitle: "Bảng Nhãn HSK" },
  { id: "seed_3", name: "Hoàng Gia Bảo", avatar: "/chibi-taoist.svg", hskLevel: 5, wordsCount: 1980, streakDays: 85, lessonsCompleted: 54, badgeTitle: "Thám Hoa HSK" },
  { id: "seed_4", name: "Lê Diệu Anh", avatar: "/chibi-cheer.svg", hskLevel: 4, wordsCount: 1420, streakDays: 64, lessonsCompleted: 45, badgeTitle: "Tiến Sĩ HSK" },
  { id: "seed_5", name: "Phạm Hải Đăng", avatar: "/chibi-brush.svg", hskLevel: 4, wordsCount: 1250, streakDays: 45, lessonsCompleted: 38, badgeTitle: "Cử Nhân HSK" },
  { id: "seed_6", name: "Vũ Phương Mai", avatar: "/chibi-scholar-gold.svg", hskLevel: 3, wordsCount: 890, streakDays: 52, lessonsCompleted: 32, badgeTitle: "Tú Tài HSK" },
  { id: "seed_7", name: "Đỗ Quốc Cường", avatar: "/chibi-wuxia.svg", hskLevel: 3, wordsCount: 760, streakDays: 31, lessonsCompleted: 26, badgeTitle: "Học Giả HSK" },
  { id: "seed_8", name: "Bùi Thị Yến", avatar: "/chibi-cheer.svg", hskLevel: 2, wordsCount: 480, streakDays: 28, lessonsCompleted: 20, badgeTitle: "Chăm Chỉ" },
  { id: "seed_9", name: "Trịnh Văn Nam", avatar: "/chibi-brush.svg", hskLevel: 2, wordsCount: 360, streakDays: 19, lessonsCompleted: 16, badgeTitle: "Tân Khoa" },
  { id: "seed_10", name: "Lý Gia Hân", avatar: "/chibi-taoist.svg", hskLevel: 1, wordsCount: 210, streakDays: 14, lessonsCompleted: 11, badgeTitle: "Khởi Hành" },
]

export function calculateXP(wordsCount: number, lessonsCompleted: number, streakDays: number): number {
  return wordsCount * 10 + lessonsCompleted * 50 + streakDays * 25
}

export async function getCurrentUserStats(): Promise<{
  wordsCount: number
  lessonsCompleted: number
  streakDays: number
  xp: number
}> {
  let wordsCount = 0
  let lessonsCompleted = 0
  let streakDays = 0

  if (typeof window !== "undefined") {
    // 1. Số từ đã ôn tập trong IndexedDB
    try {
      wordsCount = await db.reviewItems.count()
    } catch {
      wordsCount = 0
    }

    // 2. Số bài học đã hoàn thành 100%
    try {
      const records = getAllProgressRecords()
      lessonsCompleted = Object.values(records).filter(r => r.percent >= 90).length
    } catch {
      lessonsCompleted = 0
    }

    // 3. Số chuỗi streak
    try {
      const rawStreak = localStorage.getItem("chinese_app_streak_config")
      if (rawStreak) {
        const parsed = JSON.parse(rawStreak)
        streakDays = parsed.streak || 0
      }
    } catch {
      streakDays = 0
    }
  }

  const xp = calculateXP(wordsCount, lessonsCompleted, streakDays)

  return { wordsCount, lessonsCompleted, streakDays, xp }
}

export type LeaderboardSortBy = "xp" | "words" | "streak" | "lessons"

export async function getLeaderboardData(
  sortBy: LeaderboardSortBy = "xp",
  currentUserMeta?: { name?: string; email?: string }
): Promise<{
  list: LeaderboardUser[]
  currentUserRank: number
  currentUser: LeaderboardUser
}> {
  const stats = await getCurrentUserStats()

  // Tạo đối tượng của user hiện tại
  const displayName = currentUserMeta?.name || currentUserMeta?.email?.split("@")[0] || "Bạn (Tôi)"
  const currentUser: LeaderboardUser = {
    id: "current_user",
    name: displayName,
    avatar: "/chibi-scholar-gold.svg",
    hskLevel: stats.wordsCount >= 2500 ? 5 : stats.wordsCount >= 1200 ? 4 : stats.wordsCount >= 600 ? 3 : stats.wordsCount >= 300 ? 2 : 1,
    wordsCount: stats.wordsCount,
    streakDays: stats.streakDays,
    lessonsCompleted: stats.lessonsCompleted,
    xp: stats.xp,
    isCurrentUser: true,
    badgeTitle: stats.streakDays >= 30 ? "Chiến Binh Bền Bỉ" : "Đang Rèn Luyện",
  }

  // Gộp danh sách seed + user hiện tại
  const allUsers: LeaderboardUser[] = [
    ...SEED_USERS.map(u => ({
      ...u,
      xp: calculateXP(u.wordsCount, u.lessonsCompleted, u.streakDays),
    })),
    currentUser,
  ]

  // Sắp xếp theo tiêu chí được chọn
  allUsers.sort((a, b) => {
    if (sortBy === "words") return b.wordsCount - a.wordsCount
    if (sortBy === "streak") return b.streakDays - a.streakDays
    if (sortBy === "lessons") return b.lessonsCompleted - a.lessonsCompleted
    return b.xp - a.xp // Mặc định là tổng điểm XP
  })

  // Tìm thứ hạng của user hiện tại
  const currentUserRank = allUsers.findIndex(u => u.id === "current_user") + 1

  return {
    list: allUsers,
    currentUserRank,
    currentUser,
  }
}
