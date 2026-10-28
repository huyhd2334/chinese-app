"use client"

import React, { useState } from "react"
import {
  X,
  Mail,
  AlertTriangle,
  ExternalLink,
  RotateCw,
  ShieldAlert,
  LogIn
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { isValidEmail, checkRateLimit } from "@/utils/security"

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    resendConfirmationEmail,
    signInWithGoogle
  } = useAuth()

  const [tab, setTab] = useState<"login" | "register" | "verify_email">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [registeredEmail, setRegisteredEmail] = useState("")

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Duplicate email detection state
  const [isDuplicate, setIsDuplicate] = useState(false)

  // Unconfirmed email state
  const [isNotConfirmed, setIsNotConfirmed] = useState(false)

  // Resend confirmation email state
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  if (!isAuthModalOpen) return null

  const resetErrors = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsDuplicate(false)
    setIsNotConfirmed(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    resetErrors()

    const cleanEmail = email.trim()

    if (!isValidEmail(cleanEmail)) {
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
        const res = await signInWithEmail(cleanEmail, password)
        if (res.error) {
          setErrorMessage(res.error)
          if (res.isNotConfirmed) {
            setIsNotConfirmed(true)
          }
        }
      } else {
        const res = await signUpWithEmail(cleanEmail, password)
        if (res.error) {
          setErrorMessage(res.error)
          if (res.isDuplicate) {
            setIsDuplicate(true)
          }
        } else if (res.needsConfirmation) {
          // Switch to "verify_email" screen and instruct user to check their inbox
          setRegisteredEmail(cleanEmail)
          setTab("verify_email")
        } else {
          setSuccessMessage("Đăng ký thành công! Bạn có thể sử dụng tài khoản ngay.")
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    resetErrors()
    setIsSubmitting(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setErrorMessage(error)
      setIsSubmitting(false)
    }
  }

  const handleResendConfirmation = async (targetEmail: string) => {
    if (!targetEmail || resendCooldown > 0 || isResending) return

    setIsResending(true)
    setResendSuccess(false)
    try {
      const { error } = await resendConfirmationEmail(targetEmail)
      if (error) {
        setErrorMessage(error)
      } else {
        setResendSuccess(true)
        setResendCooldown(60)
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } finally {
      setIsResending(false)
    }
  }

  const isGmail = (registeredEmail || email).toLowerCase().includes("@gmail.com")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-china-red/10 text-china-red flex items-center justify-center shrink-0">
              {tab === "verify_email" ? (
                <Mail className="w-4 h-4 text-china-red" />
              ) : (
                <LogIn className="w-4 h-4 text-china-red" />
              )}
            </div>
            <div>
              <h3 className="font-serif font-bold text-china-ink text-base">
                {tab === "login"
                  ? "Đăng nhập tài khoản"
                  : tab === "register"
                  ? "Tạo tài khoản mới"
                  : "Xác nhận hòm thư email"}
              </h3>
              <p className="text-xs text-muted">
                {tab === "verify_email"
                  ? "Kích hoạt tài khoản để bắt đầu học"
                  : "Đồng bộ thẻ học và tiến độ lên đám mây"}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-muted hover:text-china-ink rounded-lg transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch (only in login/register modes) */}
        {tab !== "verify_email" && (
          <div className="flex border-b border-border bg-white px-6 pt-2">
            <button
              type="button"
              onClick={() => {
                setTab("login")
                resetErrors()
              }}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
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
                resetErrors()
              }}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                tab === "register"
                  ? "border-china-red text-china-red"
                  : "border-transparent text-muted hover:text-china-ink"
              }`}
            >
              Đăng ký
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: MÀN HÌNH NHẮC NHỞ VÀO HÒM THƯ XÁC NHẬN EMAIL */}
        {/* ======================================================== */}
        {tab === "verify_email" ? (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2 pt-1">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-china-red shadow-xs">
                <Mail className="w-8 h-8 text-china-red animate-bounce" />
              </div>

              <h4 className="text-base font-bold text-china-ink">
                Kiểm tra hộp thư để kích hoạt tài khoản
              </h4>

              <p className="text-xs text-muted leading-relaxed">
                Chúng tôi đã gửi một thư xác nhận kèm liên kết kích hoạt tới địa chỉ:
              </p>

              <div className="inline-block px-3 py-1.5 bg-china-paper border border-border rounded-xl text-xs font-mono font-bold text-china-ink max-w-full truncate select-all">
                {registeredEmail || email}
              </div>
            </div>

            {/* Hướng dẫn kiểm tra hộp thư */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-2 text-slate-800">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Các bước kích hoạt nhanh:</span>
              </div>
              <ul className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed text-amber-950">
                <li>Mở Hộp thư đến (Inbox) của email trên.</li>
                <li>
                  Bấm vào liên kết <b>&ldquo;Confirm your signup&rdquo;</b> trong email.
                </li>
                <li>
                  <b>Lưu ý quan trọng:</b> Nếu không thấy thư, hãy kiểm tra mục{" "}
                  <b className="text-china-red">Thư rác (Spam / Junk / Quảng cáo)</b>!
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              {isGmail && (
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Gmail ngay (mail.google.com)</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => handleResendConfirmation(registeredEmail || email)}
                disabled={isResending || resendCooldown > 0}
                className="w-full py-2 px-3 rounded-xl border border-border bg-china-paper hover:bg-white text-china-ink text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                <span>
                  {resendSuccess
                    ? "✓ Đã gửi lại email xác nhận!"
                    : resendCooldown > 0
                    ? `Gửi lại sau ${resendCooldown}s`
                    : "Gửi lại email xác nhận"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab("login")
                  resetErrors()
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-china-red hover:bg-china-red/5 transition cursor-pointer text-center"
              >
                Tôi đã bấm xác nhận xong → Chuyển sang Đăng nhập
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: FORM ĐĂNG NHẬP / ĐĂNG KÝ VỚI BẮT LỖI TRÙNG LẶP */
          /* ======================================================== */
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
            {/* Nhắc nhở khi lỗi TRÙNG LẶP TÀI KHOẢN (Đã dùng Google / Đã đăng ký cùng email) */}
            {isDuplicate && (
              <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-950 text-xs">
                      Email này đã được đăng ký tài khoản!
                    </p>
                    <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                      Nhiều khả năng bạn đã từng đăng nhập bằng <b>Google (Gmail)</b> hoặc đã tạo tài khoản từ trước. Vui lòng chọn cách tiếp tục bên dưới:
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex-1 py-2 px-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold text-center transition shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Tiếp tục với Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTab("login")
                      resetErrors()
                    }}
                    className="flex-1 py-2 px-2.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-950 rounded-xl text-xs font-bold text-center transition cursor-pointer"
                  >
                    Chuyển sang Đăng nhập
                  </button>
                </div>
              </div>
            )}

            {/* Nhắc nhở khi ĐĂNG NHẬP nhưng CHƯA XÁC NHẬN EMAIL */}
            {isNotConfirmed && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900">
                      Tài khoản chưa kích hoạt email!
                    </p>
                    <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">
                      Hệ thống đã gửi liên kết xác nhận đến hộp thư của bạn. Vui lòng mở hộp thư (kiểm tra cả mục <b>Thư rác/Spam</b>) để bấm xác nhận trước khi đăng nhập.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRegisteredEmail(email)
                      setTab("verify_email")
                    }}
                    className="flex-1 py-1.5 px-2 bg-china-red hover:bg-china-red/90 text-white rounded-xl text-[11px] font-bold text-center transition cursor-pointer"
                  >
                    Xem hướng dẫn xác nhận
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResendConfirmation(email)}
                    disabled={isResending || resendCooldown > 0}
                    className="flex-1 py-1.5 px-2 bg-white border border-red-300 hover:bg-red-50 text-red-900 rounded-xl text-[11px] font-bold text-center transition cursor-pointer"
                  >
                    {resendSuccess ? "✓ Đã gửi lại!" : "Gửi lại email"}
                  </button>
                </div>
              </div>
            )}

            {/* Thông báo lỗi thông thường (nếu không phải dạng đặc biệt đã xử lý ở trên) */}
            {errorMessage && !isDuplicate && !isNotConfirmed && (
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
                onChange={(e) => {
                  setEmail(e.target.value)
                  resetErrors()
                }}
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
                onChange={(e) => {
                  setPassword(e.target.value)
                  resetErrors()
                }}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-3.5 py-2 bg-china-paper border border-border rounded-xl text-xs sm:text-sm text-china-ink focus:outline-hidden focus:border-china-red"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-china-red hover:bg-china-red/90 text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-40 active:scale-95 shadow-xs cursor-pointer"
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
              className="w-full py-2.5 px-3 rounded-xl border border-border bg-white hover:bg-china-paper text-china-ink text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
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
        )}
      </div>
    </div>
  )
}
