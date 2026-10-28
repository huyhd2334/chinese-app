"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { isValidEmail, checkRateLimit } from "@/utils/security"

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const [tab, setTab] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!isValidEmail(email)) {
      setErrorMessage("Địa chỉ email không hợp lệ.")
      return
    }
    if (password.length < 6 || password.length > 128) {
      setErrorMessage("Mật khẩu phải từ 6 đến 128 ký tự.")
      return
    }

    const rl = checkRateLimit("auth_submit", 6, 60000)
    if (!rl.allowed) {
      setErrorMessage(`Bạn thao tác quá nhanh. Vui lòng thử lại sau ${rl.retryAfterSec} giây.`)
      return
    }

    setIsSubmitting(true)

    try {
      if (tab === "login") {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          setErrorMessage(error)
        }
      } else {
        const { error } = await signUpWithEmail(email, password)
        if (error) {
          setErrorMessage(error)
        } else {
          setSuccessMessage("Đăng ký thành công! Bạn có thể đăng nhập ngay hoặc kiểm tra email xác nhận.")
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage(null)
    setIsSubmitting(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setErrorMessage(error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm bg-card rounded-3xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/60">
          <div>
            <h3 className="font-serif font-bold text-china-ink text-base">
              {tab === "login" ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
            </h3>
            <p className="text-xs text-muted">
              Đồng bộ bộ thẻ và từ vựng tự tạo lên đám mây
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-muted hover:text-china-ink rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-border bg-white px-6 pt-2">
          <button
            type="button"
            onClick={() => {
              setTab("login")
              setErrorMessage(null)
            }}
            className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              tab === "login"
                ? "border-china-red text-china-red"
                : "border-transparent text-muted hover:text-china-ink"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register")
              setErrorMessage(null)
            }}
            className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              tab === "register"
                ? "border-china-red text-china-red"
                : "border-transparent text-muted hover:text-china-ink"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs leading-relaxed">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs leading-relaxed">
              {successMessage}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@email.com"
              className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-40 active:scale-95 shadow-xs"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : tab === "login"
              ? "Đăng nhập"
              : "Tạo tài khoản"}
          </button>

          <div className="relative my-3 flex items-center justify-center">
            <div className="border-t border-border w-full absolute" />
            <span className="bg-card px-2 text-[11px] text-muted relative">hoặc</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-3 rounded-xl border border-border bg-white hover:bg-china-paper text-china-ink text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>
        </form>
      </div>
    </div>
  )
}
