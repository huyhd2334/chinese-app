"use client"

import React from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { LogIn } from "lucide-react"

export interface ChibiLoadingProps {
  /**
   * Chế độ hiển thị:
   * - "loading": Dùng cho Lazy loading, Suspense, Skeleton fallback khi đang tải trang/dữ liệu.
   * - "auth-required": Dùng khi người dùng đã đăng xuất hoặc cần đăng nhập để xem nội dung.
   * - "compact": Thu nhỏ tối đa để nhúng vào card, modal hoặc khu vực hẹp.
   */
  variant?: "loading" | "auth-required" | "compact"
  /**
   * Biểu cảm nhân vật Rồng nhỏ Tiểu Long:
   * - "loading": Ngồi đọc sách uống trà, chờ đợi
   * - "cheer": Giơ cờ "加油!", nhảy nhót cổ vũ
   * - "brush": Cầm bút lông đại tự, nháy mắt tinh nghịch
   */
  character?: "loading" | "cheer" | "brush"
  title?: string
  description?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
  className?: string
  showLoginButton?: boolean
}

const SIZE_MAP = {
  sm: { width: 140, height: 140, box: "w-36 h-36" },
  md: { width: 220, height: 220, box: "w-56 h-56" },
  lg: { width: 300, height: 300, box: "w-72 h-72" },
}

const CHARACTER_SVG = {
  loading: "/chibi-loading.svg",
  cheer: "/chibi-cheer.svg",
  brush: "/chibi-brush.svg",
}

export default function ChibiLoading({
  variant = "loading",
  character = "loading",
  title,
  description,
  size = "md",
  fullScreen = false,
  className = "",
  showLoginButton = true,
}: ChibiLoadingProps) {
  const { openAuthModal } = useAuth()
  const dim = SIZE_MAP[size]
  const svgSrc = CHARACTER_SVG[character] || CHARACTER_SVG.loading

  // Default copy text based on variant
  const defaultTitle =
    variant === "auth-required"
      ? "Tiểu Long đang đợi bạn đăng nhập..."
      : variant === "compact"
      ? "Đang tải..."
      : "Đang tải bài học..."

  const defaultDesc =
    variant === "auth-required"
      ? "Đăng nhập để lưu tiến độ học tập, điểm streak và đồng bộ từ vựng cá nhân nhé!"
      : "Học tập như chèo thuyền ngược dòng, không tiến ắt sẽ lùi (学如逆水行舟)."

  const displayTitle = title ?? defaultTitle
  const displayDesc = description ?? defaultDesc

  return (
    <div
      className={`flex flex-col items-center justify-center text-center transition-all duration-300 ${
        fullScreen ? "fixed inset-0 z-50 bg-[#faf8f5]/90 backdrop-blur-xs p-6" : "py-8 px-4"
      } ${className}`}
    >
      {/* Chibi SVG Container */}
      <div className={`relative ${dim.box} flex items-center justify-center select-none`}>
        <Image
          src={svgSrc}
          alt={`Chibi Tiểu Long - ${character}`}
          width={dim.width}
          height={dim.height}
          priority
          className="object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Text Info */}
      {variant !== "compact" ? (
        <div className="mt-3 max-w-sm space-y-1.5 animate-[fadeIn_0.4s_ease-out]">
          <h3 className="text-base font-bold text-china-ink font-sans tracking-tight flex items-center justify-center gap-1.5">
            <span>{displayTitle}</span>
            {variant === "loading" && (
              <span className="inline-flex gap-1 ml-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-china-red animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-china-gold animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-china-jade animate-bounce [animation-delay:0.3s]" />
              </span>
            )}
          </h3>

          <p className="text-xs text-muted leading-relaxed px-2 font-sans">{displayDesc}</p>

          {/* Action button when user is logged out or auth is required */}
          {variant === "auth-required" && showLoginButton && (
            <div className="pt-3">
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-china-red text-white text-xs font-semibold shadow-md shadow-china-red/20 hover:bg-china-red-hover active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập ngay</span>
                
              </button>
            </div>
          )}
        </div>
      ) : (
        <span className="mt-2 text-xs font-semibold text-muted">{displayTitle}</span>
      )}
    </div>
  )
}
