"use client"

import React from "react"
import { usePathname } from "next/navigation"
import SideBar from "@/app/SideBar"
import AuthGate from "@/components/auth/AuthGate"
import HalloweenBanner from "@/components/common/HalloweenBanner"
import HalloweenDecorations from "@/components/common/HalloweenDecorations"

/** Các trang pháp lý phải xem được kể cả khi CHƯA đăng nhập (yêu cầu của cổng thanh toán & người mua) */
const PUBLIC_PATHS = ["/terms", "/privacy", "/refund"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (PUBLIC_PATHS.includes(pathname)) {
    return <div className="h-dvh w-full overflow-y-auto">{children}</div>
  }

  return (
    <AuthGate>
      <div className="flex flex-col md:flex-row h-dvh w-full overflow-hidden relative">
        <SideBar />

        <main className="min-w-0 min-h-0 flex-1 overflow-y-auto pb-24 md:pb-6 flex flex-col relative">
          <HalloweenBanner />
          <div className="flex-1 relative z-10">{children}</div>
        </main>

        {/* Các chi tiết trang trí SVG nghệ thuật (Góc mạng nhện, bí ngô, dơi) */}
        <HalloweenDecorations />
      </div>
    </AuthGate>
  )
}
