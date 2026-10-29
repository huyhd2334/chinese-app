"use client"

import { useEffect } from "react"

/** Đăng ký Service Worker (chỉ ở production để không làm phiền hot-reload khi dev). */
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {})
    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
  }, [])
  return null
}
