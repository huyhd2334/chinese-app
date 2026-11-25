'use client'

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import styles from "./sideBar.module.css"
import {
  BookOpen,
  Layers,
  LayoutDashboard,
  ReceiptText,
  BookMarked,
  Headphones,
  Library,
  GraduationCap,
  BookmarkCheck,
  MoreHorizontal,
  X,
} from "lucide-react"
import UserMenu from "@/components/auth/UserMenu"
import ThemeToggle from "@/components/common/ThemeToggle"

const primaryNav = [
  { href: "/", label: "Tổng quan", shortLabel: "Tổng quan", icon: LayoutDashboard },
  { href: "/books", label: "Giáo trình HSK", shortLabel: "Giáo trình", icon: BookOpen },
  { href: "/vocabulary", label: "Từ vựng HSK", shortLabel: "Từ vựng", icon: ReceiptText },
  { href: "/grammar", label: "Ngữ pháp", shortLabel: "Ngữ pháp", icon: BookmarkCheck },
  { href: "/review", label: "Ôn tập SRS", shortLabel: "Ôn tập", icon: Layers },
]

const practiceNav = [
  { href: "/shadowing", label: "Luyện nói Shadowing", shortLabel: "Shadowing", icon: Headphones },
  { href: "/exams", label: "Thi thử HSK", shortLabel: "Thi thử", icon: GraduationCap },
  { href: "/stories", label: "Đọc truyện song ngữ", shortLabel: "Đọc truyện", icon: BookMarked },
  { href: "/bonus", label: "Từ vựng mở rộng", shortLabel: "Mở rộng", icon: Library },
]

const mobileTabBarItems = [
  primaryNav[0], // Tổng quan
  primaryNav[1], // Giáo trình
  primaryNav[2], // Từ vựng
  primaryNav[4], // Ôn tập
]

const mobileMoreItems = [
  primaryNav[3], // Ngữ pháp
  ...practiceNav,
]

const SideBar = () => {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isPathActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const isMoreActive = mobileMoreItems.some((item) => isPathActive(item.href))

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-16 lg:w-60 shrink-0 border-r border-border px-2.5 lg:px-3.5 pt-5 pb-3.5 bg-card select-none">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-1.5 py-1 mb-6 group">
          <div className="w-8 h-8 rounded-lg bg-china-red text-white flex items-center justify-center shrink-0 font-chinese font-bold text-base shadow-2xs" lang="zh">
            学
          </div>
          <div className="hidden lg:flex flex-col leading-tight min-w-0">
            <span className="font-bold text-foreground text-sm tracking-tight truncate">
              Học Cùng Tiểu Lu
            </span>
            <span className="text-[11px] text-muted truncate">
              Nền tảng tự học HSK 3.0
            </span>
          </div>
        </Link>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-5">
          <div className="space-y-1">
            <div className="hidden lg:block px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted/80">
              Học chính
            </div>
            {primaryNav.map((item) => {
              const isActive = isPathActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`${styles.option} ${isActive ? styles.activate : ""} justify-center lg:justify-start`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="space-y-1">
            <div className="hidden lg:block px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted/80">
              Thực hành &amp; Bổ trợ
            </div>
            {practiceNav.map((item) => {
              const isActive = isPathActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`${styles.option} ${isActive ? styles.activate : ""} justify-center lg:justify-start`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom controls: Theme Switch & User Account */}
        <div className="pt-3 border-t border-border mt-auto space-y-1.5">
          <div className="hidden lg:flex items-center justify-between px-2.5 py-1">
            <span className="text-xs text-muted">Giao diện</span>
            <ThemeToggle variant="pill" />
          </div>
          <div className="flex lg:hidden justify-center pb-1">
            <ThemeToggle variant="icon" />
          </div>

          <UserMenu />
        </div>
      </aside>

      {/* Mobile Top Brand Bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-card/95 backdrop-blur-md border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-china-red text-white flex items-center justify-center font-chinese font-bold text-sm" lang="zh">
            学
          </div>
          <span className="font-bold text-sm text-foreground tracking-tight">
            Học Cùng Tiểu Lu
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle variant="icon" />
          <UserMenu compact />
        </div>
      </header>

      {/* Mobile More Drawer */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs"
            onClick={() => setMoreOpen(false)}
          />
          <div className="relative z-10 bg-card border-t border-border rounded-t-2xl p-4 pb-8 space-y-3 animate-fade-in-up">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm font-bold text-foreground">Danh mục học tập</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-china-paper"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mobileMoreItems.map((item) => {
                const isActive = isPathActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-china-red/10 border-china-red/30 text-china-red font-semibold"
                        : "bg-china-paper/60 border-border text-foreground hover:bg-china-paper"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (5 spacious items) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around py-1.5 px-2 safe-area-pb">
        {mobileTabBarItems.map((item) => {
          const isActive = isPathActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
                isActive ? "text-china-red" : "text-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[11px] mt-0.5 ${isActive ? "font-semibold text-china-red" : "font-medium"}`}>
                {item.shortLabel}
              </span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => setMoreOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
            isMoreActive || moreOpen ? "text-china-red" : "text-muted hover:text-foreground"
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className={`text-[11px] mt-0.5 ${isMoreActive || moreOpen ? "font-semibold text-china-red" : "font-medium"}`}>
            Khác
          </span>
        </button>
      </nav>
    </>
  )
}

export default SideBar
