"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  resetPassword: {
    email: string
    setEmail: (email: string) => void
    verificationCode: string
    setVerificationCode: (code: string) => void
    step: "email" | "verification" | "new-password" | "success"
    setStep: (step: "email" | "verification" | "new-password" | "success") => void
    verifyEmail: (email: string) => Promise<{ success: boolean; message?: string }>
    verifyCode: (code: string) => Promise<{ success: boolean; message?: string }>
    updatePassword: (password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"email" | "verification" | "new-password" | "success">("email")
  const router = useRouter()

  // 페이지 로드 시 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    const auth = localStorage.getItem("auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // 로그인 함수
  const login = async (email: string, password: string) => {
    // 실제 API 연동 전 하드코딩된 값으로 확인
    if (email === "steph@vminfracap.com" && password === "gkeptm12!") {
      setIsAuthenticated(true)
      localStorage.setItem("auth", "true")

      // 쿠키 설정 추가
      document.cookie = "auth=true; path=/; max-age=86400" // 24시간 유효

      router.push("/dashboard")
      return { success: true }
    } else {
      return { success: false, message: "The ID or password is incorrect." }
    }
  }

  // 로그아웃 함수
  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("auth")

    // 쿠키 삭제 추가
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

    router.push("/login")
  }

  // 이메일 확인 함수
  const verifyEmail = async (email: string) => {
    // 실제 API 연동 전 하드코딩된 값으로 확인
    if (email === "steph@vminfracap.com") {
      setEmail(email)
      setStep("verification")
      return { success: true }
    } else {
      return { success: false, message: "Email not found." }
    }
  }

  // 인증 코드 확인 함수
  const verifyCode = async (code: string) => {
    // 실제 API 연동 전 하드코딩된 값으로 확인
    if (code === "444333") {
      setVerificationCode(code)
      setStep("new-password")
      return { success: true }
    } else {
      return { success: false, message: "Invalid verification code." }
    }
  }

  // 비밀번호 업데이트 함수
  const updatePassword = async (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      return { success: false, message: "Password confirmation doesn't match." }
    }

    if (password.length < 8) {
      return { success: false, message: "Password must have 8-16 characters." }
    }

    // 비밀번호 요구사항 검증 (숫자 1개, 특수문자 1개)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasNumber || !hasSpecial) {
      return {
        success: false,
        message: "Password must have 1 number and 1 special character.",
      }
    }

    // 성공 시 다음 단계로
    setStep("success")
    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        resetPassword: {
          email,
          setEmail,
          verificationCode,
          setVerificationCode,
          step,
          setStep,
          verifyEmail,
          verifyCode,
          updatePassword,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
