'use client'
import { usePathname } from "next/navigation";
import Link from 'next/link'
import Image from 'next/image'
import styles from './sideBar.module.css'
import { BookOpen, Eye, LayoutDashboard, ReceiptText, BookMarked } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";

const navItems = [
  { href: "/", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/books", label: "Giáo trình HSK 3.0", shortLabel: "HSK 3.0", icon: BookOpen },
  { href: "/vocabulary", label: "Từ vựng HSK", shortLabel: "Từ vựng", icon: ReceiptText },
  { href: "/review", label: "Ôn tập SRS", shortLabel: "Ôn tập", icon: Eye },
  { href: "/bonus", label: "Từ mở rộng", shortLabel: "Mở rộng", icon: BookMarked },
]

const SideBar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className='hidden md:flex flex-col w-16 lg:w-56 shrink-0 border-r border-border/80 px-2 lg:px-3 pt-5 pb-3 transition-all duration-300 bg-china-paper/60 select-none'>
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1 lg:px-2 py-1 mb-5 lg:mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white border border-border shadow-xs p-1 shrink-0 flex items-center justify-center transition-transform hover:scale-105">
            <Image
              src="/chibi-loading.svg"
              alt="Tiểu Lu"
              width={34}
              height={34}
              priority
              className="object-contain"
            />
          </div>
          <div className="hidden lg:flex flex-col leading-tight min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-extrabold tracking-wide text-china-red text-base">HSK</span>
              <span className="font-bold text-china-ink text-base">Learning</span>
            </div>
            <span className="text-[11px] text-muted font-semibold truncate">
              Bàn học Tiểu Lu
            </span>
          </div>
        </div>      

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link 
                key={item.href}
                href={item.href} 
                title={item.label} 
                className={`${styles.option} ${isActive ? styles.activate : ""} justify-center lg:justify-between`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-5 h-5 shrink-0" /> 
                  <span className="hidden lg:inline truncate font-semibold">{item.label}</span>
                </div>
                {isActive && (
                  <span className="hidden lg:block w-1.5 h-1.5 rounded-full bg-china-red shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Account Menu Desktop */}
        <div className="pt-2 border-t border-border/70 mt-auto">
          <UserMenu />
        </div>
      </aside>

      {/* Mobile Top Brand Bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-border shadow-2xs p-1 flex items-center justify-center">
            <Image
              src="/chibi-loading.svg"
              alt="Tiểu Lu"
              width={26}
              height={26}
              priority
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 font-bold text-base leading-none">
            <span className="text-china-red">HSK</span>
            <span className="text-china-ink">Learning</span>
          </div>
        </Link>
        <UserMenu compact />
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-around py-1.5 px-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive 
                  ? "text-china-red font-bold" 
                  : "text-muted hover:text-china-ink"
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? "bg-china-red/10 scale-105" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-china-red" : "stroke-muted"}`} />
              </div>
              <span className={`text-[10px] mt-0.5 truncate max-w-[60px] font-semibold ${isActive ? "text-china-red" : "text-muted"}`}>
                {item.shortLabel}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

export default SideBar
