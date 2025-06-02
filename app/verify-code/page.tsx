"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../../components/auth-context"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function VerifyCodePage() {
  const { resetPassword } = useAuth()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 이메일이 없으면 이메일 입력 페이지로 리디렉션
  useEffect(() => {
    if (!resetPassword.email) {
      router.push("/forgot-password")
    }
  }, [resetPassword.email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await resetPassword.verifyCode(code)
      if (!result.success) {
        setError(result.message || "Invalid verification code")
      } else {
        // 성공 시 새 비밀번호 설정 화면으로 이동
        router.push("/reset-password")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    // 실제 구현에서는 이메일 재전송 API 호출
    alert("Verification code resent to your email")
  }

  if (!resetPassword.email) {
    return null // 로딩 상태 또는 리디렉션 처리
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white relative">
      <form onSubmit={handleSubmit} className="w-[360px] inline-flex flex-col justify-start items-center gap-9">
        {/* 로고 */}
        <Image src="/logo-airstream.png" alt="Airstream Logo" width={244} height={52} priority />

        {/* 안내 텍스트 */}
        <div className="self-stretch bg-white/0 flex flex-col justify-center items-center overflow-hidden">
          <div className="text-center justify-start">
            <span className="text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
              Enter the verification code sent to your email. Didn't receive an email?{" "}
            </span>
            <button
              type="button"
              onClick={handleResend}
              className="text-[#212529] text-base font-bold font-['Roboto'] underline leading-normal"
            >
              Resend
            </button>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch flex flex-col justify-start items-start">
            {/* 이메일 필드 (읽기 전용) */}
            <div className="self-stretch pb-4 bg-white/0 flex flex-col justify-start items-start">
              <div className="self-stretch pb-2 bg-white/0 inline-flex justify-start items-end gap-1">
                <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                  <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                    Email
                  </div>
                </div>
              </div>
              <div className="self-stretch rounded inline-flex justify-start items-center">
                <div className="flex-1 px-3 py-1.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#ced4da] flex justify-start items-center overflow-hidden">
                  <div className="flex-1 flex justify-start items-center gap-1 overflow-hidden">
                    <div className="justify-center text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                      {resetPassword.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 인증 코드 입력 필드 */}
            <div className="self-stretch pb-4 bg-white/0 flex flex-col justify-start items-start">
              <div className="self-stretch pb-2 bg-white/0 inline-flex justify-start items-end gap-1">
                <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                  <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                    Verification Code
                  </div>
                </div>
              </div>
              <div className="self-stretch rounded inline-flex justify-start items-center">
                <div className="flex-1 px-3 py-1.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#ced4da] flex justify-start items-center overflow-hidden">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    className="flex-1 bg-transparent outline-none text-[#212529] text-base font-normal font-['Roboto'] leading-normal placeholder:text-[#6c757d]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-sm text-red-500 w-full -mt-2 mb-2">{error}</p>}

          {/* 확인 버튼 */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="self-stretch px-3 py-1.5 bg-[#4353ff] rounded outline outline-1 outline-offset-[-1px] outline-[#e5e7ec] inline-flex justify-center items-center gap-2 overflow-hidden"
            >
              <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                <div className="justify-start text-white text-base font-normal font-['Roboto'] leading-normal">
                  {isLoading ? "Verifying..." : "Confirm"}
                </div>
              </div>
            </button>
          </div>
        </div>
      </form>

      {/* 푸터 - 화면 하단에 고정 */}
      <div className="absolute bottom-[23px] inline-flex flex-col justify-start items-center">
        <div className="justify-center text-black/40 text-lg font-normal font-['Roboto'] leading-[29.33px]">
          Copyright ©2024 Produced by VMIC Aviation
        </div>
      </div>
    </div>
  )
}
