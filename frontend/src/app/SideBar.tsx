'use client'
import { usePathname } from "next/navigation";
import Link from 'next/link'
import styles from './sideBar.module.css'
import { BookText, Eye, Headset, LayoutDashboard, ReceiptText } from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();
  return (
    <aside className='w-16 md:w-50 shrink-0 border-r border-gray-200 ml-2 md:ml-6 pt-8 space-y-2 transition-all duration-500'>
      <div className="flex items-center font-semibold text-2xl px-2.5 mb-4 md:px-0 overflow-hidden">
        <span className="md:hidden text-white bg-red rounded-xl bg-red-500 pt-1 pb-1 pl-3 pr-3 ">H</span>
        <span className="hidden md:inline">HSK Learning</span>
      </div>      
      <nav>
        <Link href={"/"} title="DashBoard" className={`${styles.option} ${pathname === "/" ? styles.activate : ""} justify-center md:justify-start`} >
          <LayoutDashboard/> 
          <span className="hidden md:inline">DashBoard</span>
        </Link>

        <Link href="/vocabulary" title="Vocabulary" className={`${styles.option} ${pathname === "/vocabulary" ? styles.activate : ""} justify-center md:justify-start`}>
          <ReceiptText />
          <span className="hidden md:inline">Vocabulary</span>
        </Link>

        <Link href="/review" title="Review" className={`${styles.option} ${pathname === "/review" ? styles.activate : ""} justify-center md:justify-start`}>
          <Eye />
          <span className="hidden md:inline">Review</span>
        </Link>

        <Link href="/reading" title="Reading" className={`${styles.option} ${pathname === "/reading" ? styles.activate : ""} justify-center md:justify-start`}>
          <BookText />
          <span className="hidden md:inline">Reading</span>
        </Link>

        <Link href="/listening" title="Listening" className={`${styles.option} ${pathname === "/listening" ? styles.activate : ""} justify-center md:justify-start`}>
          <Headset />
          <span className="hidden md:inline">Listening</span>
        </Link>
      </nav>
    </aside>
  )
}

export default SideBar