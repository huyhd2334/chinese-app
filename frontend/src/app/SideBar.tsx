'use client'
import { usePathname } from "next/navigation";
import Link from 'next/link'
import styles from './sideBar.module.css'
import { BookText, Eye, GraduationCap, LayoutDashboard, Puzzle, ReceiptText } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/vocabulary", label: "Vocabulary", shortLabel: "Vocab", icon: ReceiptText },
  { href: "/review", label: "Review", shortLabel: "Review", icon: Eye },
  { href: "/reading", label: "Reading", shortLabel: "Read", icon: BookText },
  { href: "/listening", label: "Solving puzzles", shortLabel: "Puzzle", icon: Puzzle },
  { href: "/exams", label: "Mock Exams", shortLabel: "Exams", icon: GraduationCap },
]

const SideBar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className='hidden md:flex flex-col w-16 lg:w-52 shrink-0 border-r border-border ml-2 lg:ml-6 pt-6 space-y-3 transition-all duration-300 bg-china-paper/50'>
        <div className="flex items-center font-serif text-2xl px-2 lg:px-0 overflow-hidden text-china-red mb-2">
          <span className="lg:hidden text-china-paper bg-china-red rounded-lg shadow-sm shadow-china-red/20 py-1 px-3 font-serif font-bold">H</span>
          <span className="hidden lg:inline font-bold tracking-wider">HSK <span className="text-china-ink font-sans text-xl">Learning</span></span>
        </div>      
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link 
                key={item.href}
                href={item.href} 
                title={item.label} 
                className={`${styles.option} ${isActive ? styles.activate : ""} justify-center lg:justify-start rounded-xl mx-1`}
              >
                <Icon className="w-5 h-5 shrink-0" /> 
                <span className="hidden lg:inline text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Top Brand Bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-china-paper bg-china-red rounded-lg shadow-xs py-0.5 px-2 font-serif font-bold text-base">H</span>
          <span className="font-serif font-bold text-lg text-china-red tracking-wider">
            HSK <span className="text-china-ink font-sans text-sm font-medium">Learning</span>
          </span>
        </Link>
        <span className="text-xs px-2.5 py-1 bg-china-paper border border-border rounded-full text-muted font-medium">
          App
        </span>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-around py-1.5 px-1 safe-area-pb">
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
              <span className={`text-[10px] mt-0.5 truncate max-w-[50px] ${isActive ? "font-bold text-china-red" : "text-muted"}`}>
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