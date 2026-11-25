"use client"

import React from "react"
import { usePathname } from "next/navigation"
import SideBar from "@/app/SideBar"
import AuthGate from "@/components/auth/AuthGate"

/** Các trang pháp lý phải xem được kể cả khi CHƯA đăng nhập (yêu cầu của cổng thanh toán & người mua) */
const PUBLIC_PATHS = ["/terms", "/privacy", "/refund"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (PUBLIC_PATHS.includes(pathname)) {
    return <div className="h-dvh w-full overflow-y-auto">{children}</div>
  }

  return (
    <AuthGate>
      <div className="flex flex-col md:flex-row h-dvh w-full overflow-hidden relative bg-background">
        <SideBar />

        <main className="min-w-0 min-h-0 flex-1 overflow-y-auto pb-20 md:pb-8 flex flex-col relative">
          <div className="flex-1 relative">{children}</div>
        </main>
      </div>
    </AuthGate>
  )
}
