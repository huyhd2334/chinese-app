"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { saveLocalSubscription, PlanType } from "@/utils/subscription"

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
  isHalloweenModalOpen: boolean
  openHalloweenModal: () => void
  closeHalloweenModal: () => void
  isHalloweenTheme: boolean
  toggleHalloweenTheme: () => void
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
  const [isHalloweenModalOpen, setIsHalloweenModalOpen] = useState(false)
  const [isHalloweenTheme, setIsHalloweenTheme] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("hsk_halloween_event_theme") === "on"
  })
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    const saved = localStorage.getItem("hsk_color_theme")
    return saved === "dark"
  })

  const openHalloweenModal = () => {
    if (isHalloweenTheme) setIsHalloweenModalOpen(true)
  }
  const closeHalloweenModal = () => setIsHalloweenModalOpen(false)

  const toggleHalloweenTheme = () => {
    setIsHalloweenTheme((prev) => {
      const next = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("hsk_halloween_event_theme", next ? "on" : "off")
      }
      if (!next) {
        setIsHalloweenModalOpen(false)
      }
      return next
    })
  }

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
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    if (typeof document === "undefined") return
    if (isHalloweenTheme) {
      document.documentElement.classList.add("halloween-event-theme")
    } else {
      document.documentElement.classList.remove("halloween-event-theme")
    }
  }, [isHalloweenTheme])

  const triggerWelcomeIfFresh = (userId: string) => {
    if (typeof sessionStorage === "undefined") return
    if (!isHalloweenTheme) return
    const key = `halloween_welcome_shown_${userId}`
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1")
      // Short delay so transitions feel natural
      setTimeout(() => {
        setIsHalloweenModalOpen(true)
      }, 350)
    }
  }

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
        syncUserSubscriptionFromMeta(session.user)
        triggerWelcomeIfFresh(session.user.id)
      }
    })

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      if (event === "SIGNED_OUT") {
        saveLocalSubscription("free", null, "guest")
      } else if (session?.user) {
        syncUserSubscriptionFromMeta(session.user)
        if (event === "SIGNED_IN") {
          triggerWelcomeIfFresh(session.user.id)
        }
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
      setTimeout(() => {
        setIsHalloweenModalOpen(true)
      }, 350)
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
        isHalloweenModalOpen,
        openHalloweenModal,
        closeHalloweenModal,
        isHalloweenTheme,
        toggleHalloweenTheme,
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
