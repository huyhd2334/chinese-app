"use client"

import React from "react"

/**
 * VineBorders.tsx - Giữ tương thích giao diện tối giản, thanh lịch
 * Loại bỏ các hoa văn góc rườm rà theo yêu cầu thiết kế tối giản, hiện đại.
 */

export function LeafVineCornerSvg(_props: { 
  className?: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" 
}) {
  return null
}

export function FoliageEdgeBorder(_props: { 
  className?: string
  position?: "top" | "bottom" 
}) {
  return null
}

export function BotanicalCardWrapper({
  children,
  className = "",
  variant = "subtle"
}: {
  children: React.ReactNode
  className?: string
  variant?: "subtle" | "featured" | "warm"
}) {
  const borderStyles = {
    subtle: "border border-border/80 bg-card",
    featured: "border border-border bg-card",
    warm: "border border-border bg-card",
  }[variant]

  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${borderStyles} ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
