"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Nón phù thủy SVG mini đáng yêu cho mascot Tiểu Lu
 */
export function WitchHatSvg({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="witchHatGrad" x1="18" y1="2" x2="18" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4a154b" />
          <stop offset="50%" stopColor="#2e1065" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="hatRibbonGrad" x1="10" y1="23" x2="26" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      {/* Vành nón rộng uốn cong */}
      <ellipse cx="18" cy="27" rx="16" ry="4.5" fill="#1e1b4b" />
      <ellipse cx="18" cy="26.5" rx="14.5" ry="3.5" fill="#311042" />

      {/* Thân nón chóp nhọn hơi cong về sau */}
      <path
        d="M6 26C8 21 13 14 15 8C16 5 21 2 24 3C22 5 20 8 20 12C20 16 23 21 28 26C22 28 12 28 6 26Z"
        fill="url(#witchHatGrad)"
      />

      {/* Dải ruy băng màu cam bí ngô */}
      <path
        d="M8.5 24.5C11 25.5 23 25.5 26.5 24.5L27 26.5C24 27.5 11 27.5 8 26.5L8.5 24.5Z"
        fill="url(#hatRibbonGrad)"
      />

      {/* Khóa nón ngôi sao vàng lấp lánh */}
      <polygon
        points="18,22.5 19,24.5 21,24.5 19.5,25.8 20.2,27.8 18,26.5 15.8,27.8 16.5,25.8 15,24.5 17,24.5"
        fill="#fef08a"
        stroke="#ca8a04"
        strokeWidth="0.5"
      />
    </svg>
  )
}

/**
 * Mạng nhện góc trên bên phải + Chú nhện đung đưa (SVG)
 */
function TopRightCobweb() {
  return (
    <div className="fixed top-0 right-0 z-40 pointer-events-none select-none overflow-hidden w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full opacity-65 dark:opacity-75 transition-opacity"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="webLineGrad" x1="200" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e65100" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Các sợi tơ chính tỏa ra từ góc (200, 0) */}
        <g stroke="url(#webLineGrad)" strokeWidth="1.2" strokeLinecap="round">
          <line x1="200" y1="0" x2="20" y2="180" />
          <line x1="200" y1="0" x2="60" y2="195" />
          <line x1="200" y1="0" x2="110" y2="200" />
          <line x1="200" y1="0" x2="160" y2="198" />
          <line x1="200" y1="0" x2="0" y2="140" />
          <line x1="200" y1="0" x2="0" y2="80" />
          <line x1="200" y1="0" x2="0" y2="25" />
        </g>

        {/* Các vòng mạng nhện đồng tâm dạng cung võng */}
        <g stroke="url(#webLineGrad)" strokeWidth="0.9" fill="none" opacity="0.85">
          {/* Vòng 1 (gần góc) */}
          <path d="M190 0 C185 8 185 12 188 18 C192 14 196 8 200 6" />
          <path d="M175 0 C168 15 170 24 178 30 C186 24 195 18 200 15" />
          {/* Vòng 2 */}
          <path d="M150 0 C140 25 145 42 160 52 C175 42 190 30 200 28" />
          {/* Vòng 3 */}
          <path d="M115 0 C100 40 110 68 135 82 C160 68 185 50 200 45" />
          {/* Vòng 4 */}
          <path d="M75 0 C55 60 70 100 105 120 C140 100 175 75 200 70" />
          {/* Vòng 5 (vòng ngoài lớn) */}
          <path d="M30 0 C5 80 25 140 70 165 C120 140 165 105 200 98" />
          {/* Vòng nối viền */}
          <path d="M0 40 C0 95 30 155 75 180" />
        </g>

        {/* Dây tơ treo chú nhện con */}
        <line x1="120" y1="0" x2="120" y2="105" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />

        {/* Chú nhện con đung đưa */}
        <g className="spider-sway" style={{ transformOrigin: "120px 0px" }}>
          {/* Chân nhện (8 chân) */}
          <g stroke="#261204" className="dark:stroke-amber-400" strokeWidth="1.2" strokeLinecap="round" fill="none">
            {/* Chân trái */}
            <path d="M116 108 C110 103 106 105 103 111" />
            <path d="M116 111 C108 109 104 113 102 119" />
            <path d="M117 114 C110 115 107 120 105 126" />
            <path d="M118 116 C112 120 110 125 111 130" />
            {/* Chân phải */}
            <path d="M124 108 C130 103 134 105 137 111" />
            <path d="M124 111 C132 109 136 113 138 119" />
            <path d="M123 114 C130 115 133 120 135 126" />
            <path d="M122 116 C128 120 130 125 129 130" />
          </g>

          {/* Bụng & đầu nhện */}
          <ellipse cx="120" cy="116" rx="5.5" ry="6.5" fill="#2d1303" className="dark:fill-orange-950" />
          <circle cx="120" cy="110" r="3.8" fill="#e65100" />

          {/* Mắt nhện to tròn ngộ nghĩnh */}
          <circle cx="118.5" cy="109.5" r="1.3" fill="#ffffff" />
          <circle cx="121.5" cy="109.5" r="1.3" fill="#ffffff" />
          <circle cx="118.8" cy="109.5" r="0.6" fill="#1b002c" />
          <circle cx="121.8" cy="109.5" r="0.6" fill="#1b002c" />
        </g>
      </svg>
    </div>
  )
}

/**
 * Quả bí ngô Jack-o'-lantern và dơi bay ở góc dưới (SVG)
 */
function BottomCornerPumpkins() {
  return (
    <div className="fixed bottom-14 md:bottom-2 left-2 md:left-60 z-30 pointer-events-none select-none opacity-85 hover:opacity-100 transition-opacity">
      <svg
        viewBox="0 0 160 110"
        className="w-32 h-24 sm:w-40 sm:h-28 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient vỏ bí ngô lớn */}
          <radialGradient id="pumpkinGradBig" cx="50" cy="65" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff8a00" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </radialGradient>
          {/* Gradient vỏ bí ngô nhỏ */}
          <radialGradient id="pumpkinGradSmall" cx="115" cy="80" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>
          {/* Ánh sáng đèn lồng vàng rực bên trong quả bí */}
          <radialGradient id="jackLanternGlow" cx="50" cy="70" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>

        {/* 1. Đàn dơi con bay lượn trên quả bí ngô */}
        <g className="bat-flutter" opacity="0.85">
          {/* Chú dơi 1 */}
          <path
            d="M80 18C83 14 88 12 92 15C90 19 86 21 84 21C82 23 80 23 78 21C76 21 72 19 70 15C74 12 79 14 82 18Z"
            fill="#311042"
            className="dark:fill-amber-300"
          />
          {/* Chú dơi 2 (nhỏ hơn, bay cao hơn) */}
          <path
            d="M102 6C104 3 108 2 111 4C109 7 106 8 105 8C103 10 102 10 100 8C99 8 96 7 94 4C97 2 101 3 103 6Z"
            fill="#311042"
            className="dark:fill-amber-300"
            opacity="0.75"
          />
        </g>

        {/* 2. Quả bí ngô lớn bên trái */}
        <g>
          {/* Cuống bí ngô lớn uốn cong */}
          <path
            d="M52 45C52 38 56 34 60 32C59 36 57 40 55 45Z"
            fill="#15803d"
            stroke="#14532d"
            strokeWidth="0.8"
          />

          {/* Múi bí ngô lớn (các lớp bầu tròn) */}
          <ellipse cx="28" cy="72" rx="16" ry="24" fill="url(#pumpkinGradBig)" />
          <ellipse cx="72" cy="72" rx="16" ry="24" fill="url(#pumpkinGradBig)" />
          <ellipse cx="38" cy="72" rx="18" ry="26" fill="url(#pumpkinGradBig)" />
          <ellipse cx="62" cy="72" rx="18" ry="26" fill="url(#pumpkinGradBig)" />
          <ellipse cx="50" cy="72" rx="19" ry="27" fill="url(#pumpkinGradBig)" />

          {/* Các rãnh múi bí ngô */}
          <path d="M40 46C34 56 34 88 40 98" stroke="#7c2d12" strokeWidth="0.8" opacity="0.4" fill="none" />
          <path d="M60 46C66 56 66 88 60 98" stroke="#7c2d12" strokeWidth="0.8" opacity="0.4" fill="none" />

          {/* Mắt, mũi, miệng khắc Jack-o'-lantern phát sáng */}
          <g className="pumpkin-flicker">
            {/* Mắt trái hình tam giác */}
            <polygon points="38,62 44,56 46,65" fill="url(#jackLanternGlow)" />
            {/* Mắt phải hình tam giác */}
            <polygon points="62,62 56,56 54,65" fill="url(#jackLanternGlow)" />
            {/* Mũi nhỏ */}
            <polygon points="50,67 47,73 53,73" fill="url(#jackLanternGlow)" />
            {/* Nụ cười răng cưa tinh nghịch */}
            <path
              d="M34 78C40 86 60 86 66 78C62 82 59 79 57 82C55 80 53 82 50 79C47 82 45 80 43 82C41 79 38 82 34 78Z"
              fill="url(#jackLanternGlow)"
            />
          </g>
        </g>

        {/* 3. Quả bí ngô con bên phải */}
        <g>
          {/* Cuống bí ngô nhỏ */}
          <path d="M112 66C112 60 115 57 118 55C117 58 116 62 114 66Z" fill="#15803d" />

          {/* Múi bí ngô nhỏ */}
          <ellipse cx="98" cy="85" rx="11" ry="16" fill="url(#pumpkinGradSmall)" />
          <ellipse cx="126" cy="85" rx="11" ry="16" fill="url(#pumpkinGradSmall)" />
          <ellipse cx="106" cy="85" rx="13" ry="18" fill="url(#pumpkinGradSmall)" />
          <ellipse cx="118" cy="85" rx="13" ry="18" fill="url(#pumpkinGradSmall)" />
          <ellipse cx="112" cy="85" rx="14" ry="19" fill="url(#pumpkinGradSmall)" />

          {/* Mặt cười chúm chím quả nhỏ */}
          <g className="pumpkin-flicker">
            <circle cx="107" cy="82" r="2.2" fill="url(#jackLanternGlow)" />
            <circle cx="117" cy="82" r="2.2" fill="url(#jackLanternGlow)" />
            <path d="M106 90C110 94 114 94 118 90" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  )
}

/**
 * Hiệu ứng thả kẹo & hạt pháo hoa Halloween khi người dùng click vào linh vật
 */
export function triggerSpookyConfetti() {
  if (typeof window === "undefined") return
  const emojis = ["🍬", "🎃", "👻", "🦇", "✨", "🍭"]
  const container = document.createElement("div")
  container.className = "fixed inset-0 pointer-events-none z-50 overflow-hidden"
  document.body.appendChild(container)

  for (let i = 0; i < 24; i++) {
    const el = document.createElement("span")
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)]
    el.className = "absolute select-none text-xl sm:text-2xl"
    el.style.left = Math.random() * 95 + "vw"
    el.style.top = "-40px"
    el.style.opacity = "1"
    el.style.transition = `transform ${1.5 + Math.random() * 1.5}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${1.5 + Math.random() * 1.5}s ease`

    container.appendChild(el)

    setTimeout(() => {
      el.style.transform = `translateY(${window.innerHeight + 60}px) rotate(${Math.random() * 360 - 180}deg)`
      el.style.opacity = "0"
    }, 20)
  }

  setTimeout(() => {
    container.remove()
  }, 3200)
}

export default function HalloweenDecorations() {
  const { isHalloweenTheme } = useAuth()

  if (!isHalloweenTheme) return null

  return (
    <>
      <TopRightCobweb />
      <BottomCornerPumpkins />
    </>
  )
}
