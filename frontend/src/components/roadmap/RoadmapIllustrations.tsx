"use client"

import React from "react"

/**
 * Tập hợp các Artwork SVG Vector màu sắc tươi sáng, phong cách tươi vui,
 * gamified (như Duolingo / LingoDeer) dành riêng cho Lộ trình học tiếng Trung.
 */

// 1. Ngọn núi đỉnh cao HSK rực rỡ với mặt trời mọc và cờ chiến thắng
export function MountainSummitSvg({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="peakGrad" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="mountainLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="mountainRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Mặt trời rực rỡ phía sau */}
      <circle cx="100" cy="55" r="32" fill="url(#sunGrad)" opacity="0.95" filter="url(#glowGold)" />
      {/* Tia nắng */}
      <circle cx="100" cy="55" r="42" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />

      {/* Núi phụ bên trái */}
      <path d="M10 160 L60 80 L110 160 Z" fill="url(#mountainLeft)" opacity="0.85" />
      {/* Núi phụ bên phải */}
      <path d="M90 160 L145 90 L195 160 Z" fill="url(#mountainRight)" opacity="0.85" />

      {/* Núi chủ tọa đỉnh cao HSK ở giữa */}
      <path d="M45 160 L100 42 L155 160 Z" fill="url(#peakGrad)" />

      {/* Tuyết đỉnh núi / Mũ vinh quang */}
      <path d="M100 42 L82 72 L92 68 L100 76 L108 68 L118 72 Z" fill="#FFFFFF" opacity="0.95" />

      {/* Bậc thang đá vàng uốn lượn */}
      <path d="M95 160 Q98 135 104 115 T100 85" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 6" />

      {/* Cờ chiến thắng trên đỉnh */}
      <line x1="100" y1="42" x2="100" y2="16" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M100 18 L126 27 L100 36 Z" fill="#EF4444" />
      <polygon points="107,24 109,29 114,29 110,32 111,37 107,34 103,37 104,32 100,29 105,29" fill="#FDE047" transform="scale(0.55) translate(80, 20)" />

      {/* Mây ngũ sắc cát tường */}
      <path d="M20 145 C20 138 27 132 35 132 C38 132 41 133 43 135 C46 128 53 124 61 124 C71 124 79 131 80 140 C84 140 88 144 88 148 C88 153 84 156 79 156 L26 156 C22 156 20 152 20 145 Z" fill="#FFFFFF" opacity="0.85" />
      <path d="M120 150 C120 144 126 139 133 139 C135 139 137 140 139 141 C142 135 148 131 155 131 C164 131 171 137 172 145 C175 145 178 148 178 152 C178 156 175 159 171 159 L125 159 C122 159 120 155 120 150 Z" fill="#FFFFFF" opacity="0.75" />
    </svg>
  )
}

// 2. Rương báu tri thức vàng kim mở nắp phát sáng
export function TreasureChestSvg({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="chestBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Hào quang lấp lánh */}
      <circle cx="60" cy="45" r="38" fill="url(#sparkleGlow)" />
      
      {/* Thân rương */}
      <rect x="22" y="48" width="76" height="42" rx="8" fill="url(#chestBody)" stroke="#F59E0B" strokeWidth="2.5" />
      {/* Nẹp kim loại vàng */}
      <rect x="20" y="58" width="80" height="6" fill="url(#goldShine)" />
      <rect x="36" y="48" width="6" height="42" fill="url(#goldShine)" />
      <rect x="78" y="48" width="6" height="42" fill="url(#goldShine)" />

      {/* Vàng ngọc lấp lánh tràn ra bên trong */}
      <ellipse cx="60" cy="48" rx="30" ry="12" fill="#FEF08A" />
      <circle cx="48" cy="44" r="6" fill="#F59E0B" />
      <circle cx="60" cy="41" r="7" fill="#FDE047" />
      <circle cx="72" cy="44" r="6" fill="#10B981" />
      <circle cx="55" cy="36" r="4" fill="#3B82F6" />
      <circle cx="67" cy="37" r="4.5" fill="#EC4899" />

      {/* Nắp rương mở vểnh lên */}
      <path d="M18 42 C18 28 36 20 60 20 C84 20 102 28 102 42 L94 48 C80 34 40 34 26 48 Z" fill="url(#goldShine)" stroke="#B45309" strokeWidth="2" />

      {/* Khóa rương hoàng gia */}
      <rect x="54" y="54" width="12" height="14" rx="3" fill="url(#goldShine)" stroke="#78350F" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="2" fill="#78350F" />

      {/* Các tia sáng lấp lánh hình sao bốn cánh */}
      <path d="M30 25 Q30 31 36 31 Q30 31 30 37 Q30 31 24 31 Q30 31 30 25 Z" fill="#FDE047" />
      <path d="M92 18 Q92 24 98 24 Q92 24 92 30 Q92 24 86 24 Q92 24 92 18 Z" fill="#FDE047" />
      <path d="M60 12 Q60 16 64 16 Q60 16 60 20 Q60 16 56 16 Q60 16 60 12 Z" fill="#FFFFFF" />
    </svg>
  )
}

// 3. Tên lửa bứt phá tốc độ phong cách Pastel rực rỡ
export function RocketPaceSvg({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* Lửa phụt phía sau */}
      <path d="M30 68 Q24 88 12 92 Q28 84 38 72 Z" fill="url(#flameGrad)" />
      <path d="M26 66 Q18 82 8 84 Q22 78 30 68 Z" fill="#FDE047" />

      {/* Cánh tên lửa trái phải */}
      <path d="M38 46 L20 60 L32 68 Z" fill="#6366F1" />
      <path d="M54 30 L68 12 L60 24 Z" fill="#6366F1" />
      
      {/* Thân tên lửa hình thoi tròn */}
      <path d="M28 64 C28 64 50 56 68 38 C80 26 84 14 84 14 C84 14 72 18 60 30 C42 48 34 70 34 70 Z" fill="url(#rocketBody)" stroke="#4F46E5" strokeWidth="2" />
      
      {/* Mũ tên lửa màu đỏ anh đào */}
      <path d="M68 30 C76 22 84 14 84 14 C84 14 76 22 68 30 Z" fill="#EF4444" />

      {/* Cửa sổ phi thuyền */}
      <circle cx="56" cy="38" r="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
      <circle cx="54" cy="36" r="3" fill="#FFFFFF" />

      {/* Khói cuộn tròn dễ thương */}
      <circle cx="20" cy="80" r="5" fill="#E2E8F0" opacity="0.8" />
      <circle cx="12" cy="74" r="3.5" fill="#CBD5E1" opacity="0.7" />
      <circle cx="16" cy="88" r="4" fill="#94A3B8" opacity="0.6" />
    </svg>
  )
}

// 4. Cuộn thư pháp bí kíp HSK mở ra
export function WisdomScrollSvg({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>

      {/* Trục cuốn 2 bên */}
      <rect x="10" y="24" width="8" height="52" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      <rect x="82" y="24" width="8" height="52" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      
      {/* Giấy hoàng kim mở rộng */}
      <rect x="16" y="28" width="68" height="44" rx="2" fill="url(#paperGrad)" stroke="#D97706" strokeWidth="1.5" />

      {/* Viền lụa đỏ trên dưới */}
      <rect x="16" y="28" width="68" height="4" fill="#DC2626" />
      <rect x="16" y="68" width="68" height="4" fill="#DC2626" />

      {/* Chữ Hán "Học" (学) hoặc ký hiệu may mắn ở giữa */}
      <text x="50" y="56" textAnchor="middle" fill="#991B1B" fontSize="22" fontWeight="bold" fontFamily="serif">
        学
      </text>

      {/* Nơ dây đỏ */}
      <path d="M50 72 Q50 82 44 86 M50 72 Q50 82 56 86" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 5. Đám mây cát tường ngũ sắc tươi vui
export function AuspiciousCloudSvg({ className = "w-16 h-10", color = "#FDE047" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M20 40 C14 40 8 36 8 28 C8 22 13 18 19 18 C20 18 22 18 23 19 C26 12 33 8 42 8 C52 8 61 15 62 25 C66 25 72 29 72 35 C72 40 68 44 62 44 L24 44 C22 44 20 42 20 40 Z"
        fill={color}
        opacity="0.9"
      />
      <circle cx="28" cy="28" r="6" fill="#FFFFFF" opacity="0.4" />
      <circle cx="48" cy="22" r="8" fill="#FFFFFF" opacity="0.3" />
    </svg>
  )
}
