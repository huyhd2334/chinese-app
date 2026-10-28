"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

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

  useEffect(() => {
    // 1. Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
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
