"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { saveLocalSubscription, PlanType } from "@/utils/subscription"
import { clearLocalSrsData } from "@/utils/srsCloudSync"

export interface SignUpResult {
  error: string | null
  needsConfirmation?: boolean
  isDuplicate?: boolean
}

export interface SignInResult {
  error: string | null
  isNotConfirmed?: boolean
  isInvalidCredentials?: boolean
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  signInWithEmail: (email: string, password: string) => Promise<SignInResult>
  signUpWithEmail: (email: string, password: string) => Promise<SignUpResult>
  resendConfirmationEmail: (email: string) => Promise<{ error: string | null; success?: boolean }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    const saved = localStorage.getItem("hsk_color_theme")
    return saved === "dark"
  })

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("hsk_color_theme", next ? "dark" : "light")
      }
      return next
    })
  }

  useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.classList.remove("halloween-event-theme")
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const syncUserSubscriptionFromMeta = (usr: User | null) => {
    if (!usr) return
    const meta = usr.app_metadata
    if (meta?.plan === "pro_yearly" || meta?.plan === "pro_monthly") {
      const exp = meta.expires_at ? Number(meta.expires_at) : null
      if (!exp || exp > Date.now()) {
        saveLocalSubscription(meta.plan as PlanType, exp, usr.id)
      }
    }
  }

  useEffect(() => {
    // 1. Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
      if (session?.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("hsk_current_user_id", session.user.id)
        }
        syncUserSubscriptionFromMeta(session.user)
      } else if (typeof window !== "undefined") {
        localStorage.setItem("hsk_current_user_id", "guest")
      }
    })

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      if (event === "SIGNED_OUT" || !session?.user) {
        saveLocalSubscription("free", null, "guest")
        if (typeof window !== "undefined") {
          localStorage.setItem("hsk_current_user_id", "guest")
          window.dispatchEvent(new CustomEvent("roadmap-updated", { detail: null }))
          window.dispatchEvent(new CustomEvent("hsk-auth-changed", { detail: { user: null } }))
        }
        clearLocalSrsData().catch(() => {})
      } else if (session?.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("hsk_current_user_id", session.user.id)
          window.dispatchEvent(new CustomEvent("hsk-auth-changed", { detail: { user: session.user } }))
        }
        syncUserSubscriptionFromMeta(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const signInWithEmail = async (email: string, password: string): Promise<SignInResult> => {
    try {
      const cleanEmail = email.trim()
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        const msg = error.message.toLowerCase()
        const isNotConfirmed =
          msg.includes("not confirmed") ||
          msg.includes("unconfirmed") ||
          msg.includes("email_not_confirmed")
        const isInvalidCredentials =
          msg.includes("invalid login credentials") ||
          msg.includes("invalid credentials")

        let friendlyError = error.message
        if (isNotConfirmed) {
          friendlyError =
            "Tài khoản chưa được kích hoạt qua email. Vui lòng kiểm tra hộp thư đến (hoặc mục Thư rác/Spam) của bạn để bấm liên kết xác nhận."
        } else if (isInvalidCredentials) {
          friendlyError =
            "Sai email hoặc mật khẩu. Nếu bạn từng đăng nhập bằng tài khoản Google, hãy chọn 'Tiếp tục với Google' bên dưới."
        }

        return {
          error: friendlyError,
          isNotConfirmed,
          isInvalidCredentials,
        }
      }

      closeAuthModal()
      return { error: null }
    } catch (err: unknown) {
      return { error: (err as Error).message || "Đã xảy ra lỗi đăng nhập" }
    }
  }

  const signUpWithEmail = async (email: string, password: string): Promise<SignUpResult> => {
    try {
      const cleanEmail = email.trim()
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      })

      if (error) {
        const msg = error.message.toLowerCase()
        const isDuplicate =
          msg.includes("already registered") ||
          msg.includes("already exists") ||
          msg.includes("already in use") ||
          (error as { code?: string }).code === "user_already_exists"

        return {
          error: isDuplicate
            ? "Email này đã được sử dụng (có thể bạn đã đăng nhập qua Google từ trước). Vui lòng chuyển sang 'Đăng nhập' hoặc chọn 'Tiếp tục với Google'."
            : error.message,
          isDuplicate,
          needsConfirmation: false,
        }
      }

      // In Supabase, if user already exists and email confirmations are ON,
      // data.user exists but identities array is empty []!
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          error:
            "Email này đã được sử dụng (có thể bạn đã đăng nhập qua Google từ trước). Vui lòng chuyển sang 'Đăng nhập' hoặc chọn 'Tiếp tục với Google'.",
          isDuplicate: true,
          needsConfirmation: false,
        }
      }

      // If user was created and awaiting confirmation (no active session yet)
      if (data?.user && !data.session) {
        return {
          error: null,
          needsConfirmation: true,
        }
      }

      // User registered and already logged in (session present)
      closeAuthModal()
      return { error: null, needsConfirmation: false }
    } catch (err: unknown) {
      return { error: (err as Error).message || "Đã xảy ra lỗi đăng ký" }
    }
  }

  const resendConfirmationEmail = async (email: string): Promise<{ error: string | null; success?: boolean }> => {
    try {
      const cleanEmail = email.trim()
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
      })
      if (error) return { error: error.message }
      return { error: null, success: true }
    } catch (err: unknown) {
      return { error: (err as Error).message || "Không thể gửi lại email xác nhận" }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      })
      if (error) return { error: error.message }
      return { error: null }
    } catch (err: unknown) {
      return { error: (err as Error).message || "Lỗi đăng nhập Google" }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    saveLocalSubscription("free", null, "guest")
    if (typeof window !== "undefined") {
      localStorage.setItem("hsk_current_user_id", "guest")
      window.dispatchEvent(new CustomEvent("roadmap-updated", { detail: null }))
      window.dispatchEvent(new CustomEvent("hsk-auth-changed", { detail: { user: null } }))
    }
    await clearLocalSrsData()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isDarkMode,
        toggleDarkMode,
        signInWithEmail,
        signUpWithEmail,
        resendConfirmationEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
