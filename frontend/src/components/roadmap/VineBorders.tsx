"use client"

import React from "react"

/**
 * Bộ khung viền và góc viền SVG thiên nhiên (Dây leo, lá cây phong thủy, hoa mộc lan/đào)
 * Dùng để bọc quanh các thẻ widget tạo phong cách tươi sáng, thiên nhiên và đậm chất Á Đông sinh động.
 */

// 1. Góc dây leo lá xanh & lộc non (Dùng cho 4 góc hoặc góc trên/dưới của card)
export function LeafVineCornerSvg({ 
  className = "w-16 h-16", 
  position = "top-left" 
}: { 
  className?: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" 
}) {
  const transform = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  }[position]

  return (
    <div className={`pointer-events-none select-none absolute ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ transform, transformOrigin: "center" }}
      >
        <defs>
          <linearGradient id="vineStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="berryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
        </defs>

        {/* Thân dây leo mềm mại uốn cong quanh góc */}
        <path
          d="M2 18 Q 8 6, 20 2 Q 55 2, 75 12 Q 90 20, 95 35"
          stroke="url(#vineStemGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M18 2 Q 2 8, 2 20 Q 2 55, 12 75 Q 20 90, 35 95"
          stroke="url(#vineStemGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Các nhánh râu dây leo xoăn tít xinh xắn */}
        <path
          d="M75 12 Q 85 8, 88 15 Q 89 22, 82 22"
          stroke="#34D399"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 75 Q 8 85, 15 88 Q 22 89, 22 82"
          stroke="#34D399"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Lá cây 1: Lá to trên đỉnh */}
        <path
          d="M28 2 C 34 -6, 52 4, 46 12 C 40 20, 26 8, 28 2 Z"
          fill="url(#leafGrad1)"
          stroke="#059669"
          strokeWidth="1"
        />
        {/* Gân lá 1 */}
        <path d="M30 3 Q 38 7, 44 11" stroke="#047857" strokeWidth="0.8" />

        {/* Lá cây 2: Lá dọc mép trái */}
        <path
          d="M2 28 C -6 34, 4 52, 12 46 C 20 40, 8 26, 2 28 Z"
          fill="url(#leafGrad1)"
          stroke="#059669"
          strokeWidth="1"
        />
        {/* Gân lá 2 */}
        <path d="M3 30 Q 7 38, 11 44" stroke="#047857" strokeWidth="0.8" />

        {/* Lá non 3: Lá vươn ra ngoài góc */}
        <path
          d="M10 10 C 6 2, 2 6, 10 10 C 14 14, 18 18, 10 10 Z"
          fill="url(#leafGrad2)"
        />
        <path
          d="M14 14 C 2 2, 22 -2, 20 12 C 18 20, 16 16, 14 14 Z"
          fill="url(#leafGrad2)"
          stroke="#10B981"
          strokeWidth="0.8"
        />

        {/* Lá 4 & 5 ở giữa thân */}
        <path
          d="M58 8 C 66 2, 74 12, 68 18 C 62 24, 54 12, 58 8 Z"
          fill="url(#leafGrad2)"
          stroke="#059669"
          strokeWidth="0.8"
        />
        <path
          d="M8 58 C 2 66, 12 74, 18 68 C 24 62, 12 54, 8 58 Z"
          fill="url(#leafGrad2)"
          stroke="#059669"
          strokeWidth="0.8"
        />

        {/* Quả mọng / Nụ hoa đỏ son cát tường */}
        <circle cx="24" cy="24" r="4" fill="url(#berryGrad)" />
        <circle cx="22.5" cy="22.5" r="1.2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="32" cy="18" r="3.2" fill="url(#berryGrad)" />
        <circle cx="18" cy="32" r="3.2" fill="url(#berryGrad)" />
      </svg>
    </div>
  )
}

// 2. Viền dây leo nằm ngang trên / dưới (Top/Bottom Foliage Border)
export function FoliageEdgeBorder({ 
  className = "w-full h-5",
  position = "top" 
}: { 
  className?: string
  position?: "top" | "bottom" 
}) {
  return (
    <div
      className={`pointer-events-none select-none absolute left-0 right-0 overflow-hidden ${
        position === "top" ? "top-0" : "bottom-0 rotate-180"
      } ${className}`}
    >
      <svg
        viewBox="0 0 600 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="edgeStem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="35%" stopColor="#34D399" />
            <stop offset="70%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Dây thân lượn sóng nhẹ theo viền */}
        <path
          d="M0 6 Q 75 14, 150 6 T 300 6 T 450 6 T 600 6"
          stroke="url(#edgeStem)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Các cụm lá dọc thân */}
        {[50, 120, 200, 280, 360, 440, 520].map((x, i) => (
          <g key={x} transform={`translate(${x}, ${i % 2 === 0 ? 4 : 8})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="8"
              ry="4"
              transform={`rotate(${i % 2 === 0 ? 25 : -25})`}
              fill="#34D399"
              opacity="0.9"
            />
            <ellipse
              cx={i % 2 === 0 ? 6 : -6}
              cy="3"
              rx="6"
              ry="3"
              transform={`rotate(${i % 2 === 0 ? -35 : 35})`}
              fill="#6EE7B7"
              opacity="0.8"
            />
            {/* Chấm quả đỏ tươi */}
            {i % 3 === 0 && <circle cx={3} cy={-4} r="2.5" fill="#F43F5E" />}
          </g>
        ))}
      </svg>
    </div>
  )
}

// 3. Khung Card Dây Leo Toàn Phần (Card Wrapper with Natural Vine Border)
export function VineCardWrapper({
  children,
  className = "",
  glowColor = "emerald",
}: {
  children: React.ReactNode
  className?: string
  glowColor?: "emerald" | "amber" | "indigo" | "rose"
}) {
  const glowStyles = {
    emerald: "border-emerald-500/35 hover:border-emerald-500/60 shadow-emerald-500/10",
    amber: "border-amber-500/35 hover:border-amber-500/60 shadow-amber-500/10",
    indigo: "border-indigo-500/35 hover:border-indigo-500/60 shadow-indigo-500/10",
    rose: "border-rose-500/35 hover:border-rose-500/60 shadow-rose-500/10",
  }[glowColor]

  return (
    <div
      className={`relative rounded-3xl border-2 bg-card/90 backdrop-blur-md shadow-xl transition-all duration-300 ${glowStyles} ${className}`}
    >
      {/* 4 góc dây leo tự nhiên quấn quanh viền */}
      <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-14 h-14 sm:w-16 sm:h-16" />
      <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-14 h-14 sm:w-16 sm:h-16" />
      <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-12 h-12 sm:w-14 sm:h-14" />
      <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14" />

      {/* Viền dải lá nhẹ ở cạnh trên & cạnh dưới */}
      <FoliageEdgeBorder position="top" className="h-3 sm:h-4 opacity-70" />
      <FoliageEdgeBorder position="bottom" className="h-3 sm:h-4 opacity-70" />

      {/* Nội dung bên trong thẻ */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
