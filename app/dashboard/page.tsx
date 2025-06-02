"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../components/auth-context"
import { Dashboard } from "../../components/dashboard"
import { AppProvider } from "../../components/providers"

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const auth = localStorage.getItem("auth")

    if (!isAuthenticated && auth !== "true") {
      window.location.href = "/login"
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null // 로딩 상태 또는 리디렉션 처리
  }

  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
