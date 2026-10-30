"use client"

import React from "react"

/**
 * VineBorders.tsx - Hệ thống viền dây leo lá cây thanh mảnh (Delicate Botanical Vines)
 * 
 * TRIẾT LÝ THIẾT KẾ:
 * - KHÔNG dùng cục lá to thô ở 4 góc để tránh rối mắt và che nội dung.
 * - Sử dụng đường dây leo mảnh (1.5px - 2px) uốn lượn tự nhiên men theo viền thẻ (border line).
 * - Các nhánh lá nhỏ điểm xuyết tinh tế, phối màu thiên nhiên dịu mắt (Soft Sage / Emerald / Jade).
 * - Thay thế viền neon/gradient gắt bằng viền hữu cơ tự nhiên cao cấp.
 */

// 1. Dây leo góc thanh mảnh (Chỉ là nhánh dây leo mảnh bò dọc theo góc bo tròn)
export function LeafVineCornerSvg({ 
  className = "w-10 h-10", 
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
    <div className={`pointer-events-none select-none absolute z-20 ${className}`}>
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ transform, transformOrigin: "center" }}
      >
        <defs>
          {/* Màu thân dây leo: Xanh lục mộc mạc dịu nhẹ */}
          <linearGradient id="delicateStem" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Màu lá non xanh tươi nhẹ nhàng */}
          <linearGradient id="softLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        {/* Thân dây leo mảnh bò sát theo đường bo tròn của góc (r=24px) */}
        <path
          d="M 1 36 C 1 18, 18 1, 36 1 Q 48 1, 56 6"
          stroke="url(#delicateStem)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Râu xoắn nhỏ xinh ở đầu nhánh */}
        <path
          d="M 56 6 Q 60 4, 59 1 Q 57 -1, 55 2"
          stroke="#10B981"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Lá nhỏ 1: Nằm ôm sát góc bo */}
        <path
          d="M 16 7 C 18 2, 26 5, 23 10 C 20 14, 15 11, 16 7 Z"
          fill="url(#softLeaf)"
          stroke="#059669"
          strokeWidth="0.6"
        />
        {/* Gân lá 1 */}
        <line x1="17" y1="7" x2="21" y2="9" stroke="#047857" strokeWidth="0.5" />

        {/* Lá nhỏ 2: Nằm mép thẳng trên */}
        <path
          d="M 38 1 C 41 -3, 47 0, 44 4 C 41 8, 37 5, 38 1 Z"
          fill="url(#softLeaf)"
          stroke="#059669"
          strokeWidth="0.6"
        />

        {/* Lá nhỏ 3: Nằm mép thẳng bên hông */}
        <path
          d="M 1 24 C -3 21, 0 15, 4 18 C 8 21, 5 25, 1 24 Z"
          fill="url(#softLeaf)"
          stroke="#059669"
          strokeWidth="0.6"
        />

        {/* Quả mọng nhỏ điểm xuyết (1 hạt nhỏ xíu tinh tế) */}
        <circle cx="12" cy="12" r="1.8" fill="#F43F5E" />
      </svg>
    </div>
  )
}

// 2. Viền dây leo chạy ngang (Top / Bottom Border - Mảnh mai, thanh thoát)
export function FoliageEdgeBorder({ 
  className = "w-full h-3",
  position = "top" 
}: { 
  className?: string
  position?: "top" | "bottom" 
}) {
  return (
    <div
      className={`pointer-events-none select-none absolute left-0 right-0 overflow-hidden z-10 ${
        position === "top" ? "top-0" : "bottom-0 rotate-180"
      } ${className}`}
    >
      <svg
        viewBox="0 0 600 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full opacity-80"
      >
        <defs>
          <linearGradient id="edgeStemDelicate" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="25%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Thân dây leo lượn sóng nhẹ sát mép viền */}
        <path
          d="M 0 3 Q 100 8, 200 3 T 400 3 T 600 3"
          stroke="url(#edgeStemDelicate)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Những chiếc lá nhỏ thưa thớt, không bị dày đặc */}
        {[80, 160, 260, 360, 460, 540].map((x, i) => (
          <g key={x} transform={`translate(${x}, ${i % 2 === 0 ? 3 : 5})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="5"
              ry="2.2"
              transform={`rotate(${i % 2 === 0 ? 20 : -20})`}
              fill="#34D399"
              opacity="0.85"
            />
            {/* Điểm xuyết lá non nhạt */}
            <ellipse
              cx={i % 2 === 0 ? 4 : -4}
              cy="1.5"
              rx="3.5"
              ry="1.8"
              transform={`rotate(${i % 2 === 0 ? -30 : 30})`}
              fill="#A7F3D0"
              opacity="0.9"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

// 3. Khung bọc Dây Leo Thẩm Mỹ (Thay thế viền neon/AI gắt)
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
    // Viền nhẹ nhàng tự nhiên (dành cho đa số card thường)
    subtle: "border border-emerald-900/15 dark:border-emerald-500/20 bg-card/90 hover:border-emerald-500/35",
    // Viền nổi bật cho các widget quan trọng (Lộ trình, Banner)
    featured: "border border-emerald-600/30 dark:border-emerald-400/30 bg-card/95 hover:border-emerald-500/50 shadow-sm",
    // Viền ấm áp cho Streak, Mục tiêu
    warm: "border border-amber-900/15 dark:border-amber-500/20 bg-card/90 hover:border-amber-500/35",
  }[variant]

  return (
    <div className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${borderStyles} ${className}`}>
      {/* 4 Nhánh dây leo thanh mảnh bò theo 4 góc */}
      <LeafVineCornerSvg position="top-left" className="top-0 left-0 w-9 h-9 sm:w-11 sm:h-11" />
      <LeafVineCornerSvg position="top-right" className="top-0 right-0 w-9 h-9 sm:w-11 sm:h-11" />
      <LeafVineCornerSvg position="bottom-left" className="bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10" />
      <LeafVineCornerSvg position="bottom-right" className="bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10" />

      {/* Dải dây leo mảnh lượn nhẹ ở mép trên */}
      <FoliageEdgeBorder position="top" className="h-2.5 opacity-60" />

      {/* Nội dung bên trong */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
