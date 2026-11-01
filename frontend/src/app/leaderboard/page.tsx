"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Trophy,
  Flame,
  BookOpen,
  Award,
  Sparkles,
  Zap,
  ArrowUp,
  Crown,
  Medal,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  getLeaderboardData,
  LeaderboardUser,
  LeaderboardSortBy,
} from "@/utils/leaderboardService"

const SORT_OPTIONS: { id: LeaderboardSortBy; label: string; icon: typeof Trophy; color: string }[] = [
  { id: "xp", label: "Tổng điểm XP", icon: Zap, color: "text-amber-500" },
  { id: "words", label: "Số từ vựng", icon: BookOpen, color: "text-emerald-500" },
  { id: "streak", label: "Chuỗi Streak", icon: Flame, color: "text-orange-500" },
  { id: "lessons", label: "Số bài học", icon: Award, color: "text-blue-500" },
]

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>("xp")
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [userRank, setUserRank] = useState(0)
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getLeaderboardData(sortBy, {
        name: user?.user_metadata?.full_name,
        email: user?.email,
      })
      setLeaderboard(data.list)
      setUserRank(data.currentUserRank)
      setCurrentUser(data.currentUser)
      setLoading(false)
    }
    load()
  }, [sortBy, user])

  const top1 = leaderboard[0]
  const top2 = leaderboard[1]
  const top3 = leaderboard[2]
  const restList = leaderboard.slice(3)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-8 md:py-10 text-china-ink pb-32">
      {/* Header Banner */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3 border border-amber-500/20">
          <Trophy className="w-4 h-4" /> Bảng Vinh Danh Học Viên HSK
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-china-red tracking-tight">
          Bảng Xếp Hạng Toàn Quốc
        </h1>
        <p className="mt-2 text-sm text-muted">
          Cạnh tranh cùng các học viên HSK mỗi ngày. Tích lũy vốn từ, duy trì chuỗi streak và hoàn thành giáo trình để thăng hạng!
        </p>
      </div>

      {/* Tabs Phân Loại */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {SORT_OPTIONS.map((opt) => {
          const isActive = sortBy === opt.id
          const Icon = opt.icon
          return (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? "bg-china-red text-white shadow-china-red/20 scale-105"
                  : "bg-card border border-border text-muted hover:text-china-ink hover:border-china-red/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : opt.color}`} />
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>

      {/* Top 3 Podium (Bục vinh danh) */}
      {!loading && top1 && (
        <div className="grid grid-cols-3 gap-2 md:gap-6 items-end max-w-3xl mx-auto mb-10 pt-8">
          {/* Top 2 */}
          {top2 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border-2 border-slate-300 dark:border-slate-600 p-1.5 shadow-md flex items-center justify-center">
                  <Image src={top2.avatar} alt={top2.name} width={60} height={60} className="object-contain" />
                </div>
                <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-card flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 shadow-sm">
                  2
                </div>
              </div>
              <p className="font-bold text-xs md:text-sm truncate max-w-[100px] text-center">{top2.name}</p>
              <span className="text-[10px] md:text-xs text-muted mb-2 font-mono">
                {sortBy === "words" ? `${top2.wordsCount} từ` : sortBy === "streak" ? `${top2.streakDays} ngày` : sortBy === "lessons" ? `${top2.lessonsCompleted} bài` : `${top2.xp.toLocaleString()} XP`}
              </span>
              <div className="w-full h-24 md:h-32 bg-gradient-to-t from-slate-200/80 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-800/30 rounded-t-2xl border-t-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                <Medal className="w-8 h-8 text-slate-400" />
              </div>
            </div>
          )}

          {/* Top 1 (Cao nhất & Nổi bật nhất) */}
          <div className="flex flex-col items-center -mt-6">
            <div className="relative mb-3">
              <Crown className="w-7 h-7 text-amber-500 absolute -top-7 left-1/2 -translate-x-1/2 animate-bounce" />
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-3 border-amber-400 p-2 shadow-xl shadow-amber-500/10 flex items-center justify-center">
                <Image src={top1.avatar} alt={top1.name} width={75} height={75} className="object-contain" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-amber-950 border-2 border-white dark:border-card flex items-center justify-center font-extrabold text-sm shadow-md">
                1
              </div>
            </div>
            <p className="font-extrabold text-sm md:text-base truncate max-w-[120px] text-center text-amber-600 dark:text-amber-400">
              {top1.name}
            </p>
            <span className="text-xs font-bold text-amber-500 mb-2 font-mono">
              {sortBy === "words" ? `${top1.wordsCount} từ` : sortBy === "streak" ? `${top1.streakDays} ngày` : sortBy === "lessons" ? `${top1.lessonsCompleted} bài` : `${top1.xp.toLocaleString()} XP`}
            </span>
            <div className="w-full h-32 md:h-44 bg-gradient-to-t from-amber-200/80 to-amber-100/40 dark:from-amber-900/60 dark:to-amber-900/20 rounded-t-3xl border-t-3 border-amber-400 flex flex-col items-center justify-center gap-1">
              <Trophy className="w-10 h-10 text-amber-500" />
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Trạng Nguyên</span>
            </div>
          </div>

          {/* Top 3 */}
          {top3 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border-2 border-amber-700/40 dark:border-amber-700/60 p-1.5 shadow-md flex items-center justify-center">
                  <Image src={top3.avatar} alt={top3.name} width={60} height={60} className="object-contain" />
                </div>
                <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-amber-700 text-white border-2 border-white dark:border-card flex items-center justify-center font-bold text-xs shadow-sm">
                  3
                </div>
              </div>
              <p className="font-bold text-xs md:text-sm truncate max-w-[100px] text-center">{top3.name}</p>
              <span className="text-[10px] md:text-xs text-muted mb-2 font-mono">
                {sortBy === "words" ? `${top3.wordsCount} từ` : sortBy === "streak" ? `${top3.streakDays} ngày` : sortBy === "lessons" ? `${top3.lessonsCompleted} bài` : `${top3.xp.toLocaleString()} XP`}
              </span>
              <div className="w-full h-20 md:h-28 bg-gradient-to-t from-amber-900/20 to-amber-900/5 dark:from-amber-950/60 dark:to-amber-950/20 rounded-t-2xl border-t-2 border-amber-700/40 flex items-center justify-center">
                <Medal className="w-7 h-7 text-amber-700/80" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Danh sách xếp hạng từ Top 4 trở đi */}
      <div className="bg-card border border-border rounded-3xl p-4 md:p-6 shadow-sm space-y-3">
        <div className="grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-muted pb-3 border-b border-border px-3">
          <div className="col-span-2 md:col-span-1 text-center">Hạng</div>
          <div className="col-span-6 md:col-span-5">Học viên</div>
          <div className="hidden md:block md:col-span-2 text-center">Trình độ</div>
          <div className="hidden md:block md:col-span-2 text-center">Chuỗi ngày</div>
          <div className="col-span-4 md:col-span-2 text-right">
            {sortBy === "words" ? "Số từ" : sortBy === "streak" ? "Chuỗi streak" : sortBy === "lessons" ? "Số bài" : "Điểm XP"}
          </div>
        </div>

        {restList.map((item, idx) => {
          const rank = idx + 4
          const isMe = item.isCurrentUser

          return (
            <div
              key={item.id}
              className={`grid grid-cols-12 items-center p-3 rounded-2xl transition-all ${
                isMe
                  ? "bg-china-red/10 border-2 border-china-red/30 shadow-xs"
                  : "hover:bg-border/20 border border-transparent"
              }`}
            >
              <div className="col-span-2 md:col-span-1 text-center font-bold font-mono text-sm">
                {rank <= 10 ? (
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-xl bg-border/40 text-china-ink font-bold">
                    {rank}
                  </span>
                ) : (
                  <span className="text-muted">{rank}</span>
                )}
              </div>

              <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-card border border-border p-1 shrink-0 flex items-center justify-center">
                  <Image src={item.avatar} alt={item.name} width={32} height={32} className="object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-bold text-sm truncate ${isMe ? "text-china-red" : "text-china-ink"}`}>
                      {item.name}
                    </p>
                    {isMe && (
                      <span className="px-1.5 py-0.2 bg-china-red text-white text-[10px] font-bold rounded">
                        Tôi
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted truncate block">{item.badgeTitle || `HSK ${item.hskLevel}`}</span>
                </div>
              </div>

              <div className="hidden md:flex md:col-span-2 justify-center">
                <span className="px-2.5 py-1 bg-border/30 rounded-lg text-xs font-semibold">
                  HSK {item.hskLevel}
                </span>
              </div>

              <div className="hidden md:flex md:col-span-2 justify-center items-center gap-1 text-xs font-mono font-bold text-orange-500">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{item.streakDays} ngày</span>
              </div>

              <div className="col-span-4 md:col-span-2 text-right font-mono font-bold text-sm">
                {sortBy === "words" ? (
                  <span className="text-emerald-600 dark:text-emerald-400">{item.wordsCount} từ</span>
                ) : sortBy === "streak" ? (
                  <span className="text-orange-500">{item.streakDays} ngày</span>
                ) : sortBy === "lessons" ? (
                  <span className="text-blue-500">{item.lessonsCompleted} bài</span>
                ) : (
                  <span className="text-china-red">{item.xp.toLocaleString()} XP</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky User Position Bar (Thanh cố định vị trí của bạn ở đáy màn hình) */}
      {currentUser && (
        <div className="fixed bottom-0 md:bottom-4 left-0 right-0 md:left-auto md:right-auto md:max-w-5xl md:w-full z-40 px-4 pointer-events-none">
          <div className="bg-card/95 backdrop-blur-md border-2 border-china-red/40 rounded-t-3xl md:rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-china-red/10 border border-china-red/20 flex items-center justify-center font-extrabold text-china-red text-base font-mono">
                #{userRank}
              </div>
              <div>
                <p className="text-xs text-muted">Vị trí hiện tại của bạn</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-china-ink">{currentUser.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-china-red/10 text-china-red font-semibold">
                    HSK {currentUser.hskLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:block">
                <p className="text-[11px] text-muted">Chuỗi học tập</p>
                <p className="font-bold font-mono text-sm text-orange-500 flex items-center justify-end gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {currentUser.streakDays} ngày
                </p>
              </div>

              <div>
                <p className="text-[11px] text-muted">
                  {sortBy === "words" ? "Vốn từ đã học" : sortBy === "streak" ? "Chuỗi streak" : sortBy === "lessons" ? "Bài đã học" : "Tổng điểm"}
                </p>
                <p className="font-extrabold font-mono text-base text-china-red">
                  {sortBy === "words"
                    ? `${currentUser.wordsCount} từ`
                    : sortBy === "streak"
                    ? `${currentUser.streakDays} ngày`
                    : sortBy === "lessons"
                    ? `${currentUser.lessonsCompleted} bài`
                    : `${currentUser.xp.toLocaleString()} XP`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
