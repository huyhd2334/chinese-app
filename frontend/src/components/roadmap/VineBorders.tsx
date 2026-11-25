"use client"

import React, { useId } from "react"

/**
 * VineBorders.tsx — Hệ thống viền Mầm Trúc & Dây Leo Chibi Năng Động
 *
 * Thiết kế đồng bộ với linh vật gấu trúc Tiểu Lu:
 * - Đường dây leo & cành trúc non bo tròn mềm mại, màu xanh ngọc tươi tắn.
 * - Mầm lá đôi bầu bĩnh kiểu chibi (kèm gân lá mảnh, chồi non & nụ hoa nhỏ điểm xuyết).
 * - Dùng useId() riêng cho từng SVG để không bao giờ trùng gradient ID khi render nhiều thẻ.
 * - Ôm gọn sát góc bo (rounded-2xl / rounded-3xl), không che khuất chữ bên trong.
 */

export function LeafVineCornerSvg({
  className = "w-11 h-11",
  position = "top-left",
  variant = "jade",
}: {
  className?: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  variant?: "jade" | "amber" | "blossom"
}) {
  const uid = useId().replace(/:/g, "")

  const transform = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  }[position]

  const palette = {
    jade: {
      stemStart: "#059669",
      stemEnd: "#10b981",
      leafLight: "#6ee7b7",
      leafMid: "#34d399",
      leafStroke: "#047857",
      budFill: "#fb7185",
      budCenter: "#fef08a",
    },
    amber: {
      stemStart: "#059669",
      stemEnd: "#34d399",
      leafLight: "#a7f3d0",
      leafMid: "#34d399",
      leafStroke: "#047857",
      budFill: "#f59e0b",
      budCenter: "#fef3c7",
    },
    blossom: {
      stemStart: "#0d9488",
      stemEnd: "#10b981",
      leafLight: "#99f6e4",
      leafMid: "#2dd4bf",
      leafStroke: "#0f766e",
      budFill: "#f43f5e",
      budCenter: "#fde047",
    },
  }[variant]

  return (
    <div className={`pointer-events-none select-none absolute z-20 ${className}`}>
      <svg
        viewBox="0 0 68 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        style={{ transform, transformOrigin: "center" }}
      >
        <defs>
          <linearGradient id={`stem-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.stemStart} />
            <stop offset="100%" stopColor={palette.stemEnd} />
          </linearGradient>
          <linearGradient id={`leaf-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.leafLight} />
            <stop offset="100%" stopColor={palette.leafMid} />
          </linearGradient>
        </defs>

        {/* Nhánh dây leo chính ôm theo đường cong góc thẻ */}
        <path
          d="M 3 48 C 3 22, 20 4, 48 3 C 54 3, 59 5, 62 8"
          stroke={`url(#stem-${uid})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Râu xoắn lò xo chibi năng động ở ngọn */}
        <path
          d="M 61 7 C 65 5, 66 1, 63 1 C 60 1, 60 5, 64 6"
          stroke={palette.stemEnd}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Nhánh phụ nhỏ bên hông trái */}
        <path
          d="M 5 34 Q 10 38, 9 45"
          stroke={palette.stemEnd}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Cặp lá mầm bầu bĩnh chính ở góc 45 độ */}
        <g className="vine-leaf-sway" style={{ transformOrigin: "18px 16px" }}>
          {/* Lá lớn hướng lên */}
          <path
            d="M 17 15 C 14 5, 25 2, 28 9 C 30 15, 21 18, 17 15 Z"
            fill={`url(#leaf-${uid})`}
            stroke={palette.leafStroke}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M 18 14 Q 22 10, 25 8"
            stroke={palette.leafStroke}
            strokeWidth="0.9"
            strokeLinecap="round"
          />

          {/* Lá non nhỏ hướng sang trái */}
          <path
            d="M 16 16 C 7 14, 5 23, 11 26 C 16 28, 19 20, 16 16 Z"
            fill={palette.leafLight}
            stroke={palette.leafStroke}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M 15 17 Q 12 20, 10 23"
            stroke={palette.leafStroke}
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>

        {/* Lá trúc thon xinh ở mép ngang trên */}
        <g>
          <path
            d="M 39 4 C 42 -2, 52 -1, 50 5 C 48 10, 40 8, 39 4 Z"
            fill={`url(#leaf-${uid})`}
            stroke={palette.leafStroke}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M 40 4 L 47 4"
            stroke={palette.leafStroke}
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>

        {/* Lá mầm nhỏ ở mép dọc trái */}
        <path
          d="M 4 33 C -2 30, -1 22, 5 24 C 9 26, 7 32, 4 33 Z"
          fill={`url(#leaf-${uid})`}
          stroke={palette.leafStroke}
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Bông hoa / quả mọng nhỏ chibi 4 cánh điểm xuyết ở giao điểm góc */}
        <g transform="translate(16, 15)">
          <circle cx="0" cy="-2.2" r="1.8" fill={palette.budFill} />
          <circle cx="2.2" cy="0" r="1.8" fill={palette.budFill} />
          <circle cx="0" cy="2.2" r="1.8" fill={palette.budFill} />
          <circle cx="-2.2" cy="0" r="1.8" fill={palette.budFill} />
          <circle cx="0" cy="0" r="1.5" fill={palette.budCenter} />
        </g>
      </svg>
    </div>
  )
}

/**
 * Dải dây leo mầm lá lượn sóng nhẹ dọc mép trên hoặc dưới thẻ
 */
export function FoliageEdgeBorder({
  className = "w-full h-3",
  position = "top",
}: {
  className?: string
  position?: "top" | "bottom"
}) {
  const uid = useId().replace(/:/g, "")

  return (
    <div
      className={`pointer-events-none select-none absolute left-8 right-8 overflow-hidden z-10 ${
        position === "top" ? "top-0" : "bottom-0 rotate-180"
      } ${className}`}
    >
      <svg
        viewBox="0 0 600 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`edge-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="15%" stopColor="#10b981" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#10b981" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dây mảnh lượn sóng mềm */}
        <path
          d="M 0 4 Q 75 10, 150 4 T 300 4 T 450 4 T 600 4"
          stroke={`url(#edge-${uid})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Chồi lá non điểm xuyết nhịp nhàng */}
        {[110, 230, 350, 470].map((x, i) => (
          <g key={x} transform={`translate(${x}, ${i % 2 === 0 ? 4 : 6})`}>
            <ellipse
              cx="-3"
              cy="1"
              rx="4.8"
              ry="2.3"
              transform="rotate(-22)"
              fill="#34d399"
              stroke="#059669"
              strokeWidth="0.6"
            />
            <ellipse
              cx="3.5"
              cy="1.5"
              rx="3.8"
              ry="1.9"
              transform="rotate(24)"
              fill="#a7f3d0"
              stroke="#059669"
              strokeWidth="0.5"
            />
            {i % 2 === 1 && <circle cx="0" cy="0.5" r="1.4" fill="#fbbf24" />}
          </g>
        ))}
      </svg>
    </div>
  )
}

/**
 * Khung thẻ Chibi Vườn Trúc dùng sẵn cho các khối nổi bật
 */
export function BotanicalCardWrapper({
  children,
  className = "",
  variant = "subtle",
}: {
  children: React.ReactNode
  className?: string
  variant?: "subtle" | "featured" | "warm"
}) {
  const borderStyles = {
    subtle:
      "border-2 border-emerald-600/20 dark:border-emerald-500/25 bg-card shadow-[0_3px_0_0_rgba(16,185,129,0.08)]",
    featured:
      "border-2 border-emerald-600/30 dark:border-emerald-400/30 bg-card shadow-[0_4px_0_0_rgba(16,185,129,0.12)]",
    warm:
      "border-2 border-amber-500/25 dark:border-amber-500/25 bg-card shadow-[0_3px_0_0_rgba(245,158,11,0.1)]",
  }[variant]

  return (
    <div className={`relative rounded-3xl overflow-hidden transition-all duration-200 ${borderStyles} ${className}`}>
      <LeafVineCornerSvg
        position="top-left"
        variant={variant === "warm" ? "amber" : "jade"}
        className="top-0 left-0 w-10 h-10 sm:w-12 sm:h-12"
      />
      <LeafVineCornerSvg
        position="top-right"
        variant={variant === "warm" ? "amber" : "jade"}
        className="top-0 right-0 w-10 h-10 sm:w-12 sm:h-12"
      />
      <LeafVineCornerSvg
        position="bottom-left"
        variant={variant === "warm" ? "amber" : "jade"}
        className="bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 opacity-85"
      />
      <LeafVineCornerSvg
        position="bottom-right"
        variant={variant === "warm" ? "amber" : "jade"}
        className="bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 opacity-85"
      />
      <FoliageEdgeBorder position="top" className="h-3 opacity-80" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
