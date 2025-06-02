"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../components/auth-context"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return null // 리디렉션 처리 중에는 아무것도 표시하지 않음
}
