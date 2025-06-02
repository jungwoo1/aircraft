"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../../components/auth-context"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 인증 코드가 없으면 이메일 입력 페이지로 리디렉션
  useEffect(() => {
    if (!resetPassword.verificationCode) {
      router.push("/forgot-password")
    }
  }, [resetPassword.verificationCode, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await resetPassword.updatePassword(password, confirmPassword)
      if (!result.success) {
        setError(result.message || "Password update failed")
      } else {
        // 성공 시 완료 화면으로 이동
        router.push("/reset-success")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!resetPassword.verificationCode) {
    return null // 로딩 상태 또는 리디렉션 처리
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white relative">
      <form onSubmit={handleSubmit} className="w-[360px] inline-flex flex-col justify-start items-center gap-9">
        {/* 로고 */}
        <Image src="/logo-airstream.png" alt="Airstream Logo" width={244} height={52} priority />

        {/* 안내 텍스트 */}
        <div className="self-stretch bg-white/0 flex flex-col justify-center items-center overflow-hidden">
          <div className="text-center justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
            Enter your new password
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch flex flex-col justify-start items-start">
            {/* 새 비밀번호 입력 필드 */}
            <div className="self-stretch pb-4 bg-white/0 flex flex-col justify-start items-start">
              <div className="self-stretch pb-2 bg-white/0 inline-flex justify-start items-end gap-1">
                <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                  <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                    New Password
                  </div>
                </div>
              </div>
              <div className="self-stretch rounded inline-flex justify-start items-center">
                <div className="flex-1 px-3 py-1.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#ced4da] flex justify-start items-center overflow-hidden">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="flex-1 bg-transparent outline-none text-[#212529] text-base font-normal font-['Roboto'] leading-normal placeholder:text-[#6c757d]"
                  />
                </div>
              </div>
              <p className="text-xs text-red-500 mt-1">
                Passwords must have 8-16 characters, 1 number, and 1 special character.
              </p>
            </div>

            {/* 비밀번호 확인 입력 필드 */}
            <div className="self-stretch pb-4 bg-white/0 flex flex-col justify-start items-start">
              <div className="self-stretch pb-2 bg-white/0 inline-flex justify-start items-end gap-1">
                <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                  <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                    Confirm Password
                  </div>
                </div>
              </div>
              <div className="self-stretch rounded inline-flex justify-start items-center">
                <div className="flex-1 px-3 py-1.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#ced4da] flex justify-start items-center overflow-hidden">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="flex-1 bg-transparent outline-none text-[#212529] text-base font-normal font-['Roboto'] leading-normal placeholder:text-[#6c757d]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-sm text-red-500 w-full -mt-2 mb-2">{error}</p>}

          {/* 업데이트 버튼 */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="self-stretch px-3 py-1.5 bg-[#4353ff] rounded outline outline-1 outline-offset-[-1px] outline-[#e5e7ec] inline-flex justify-center items-center gap-2 overflow-hidden"
            >
              <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                <div className="justify-start text-white text-base font-normal font-['Roboto'] leading-normal">
                  {isLoading ? "Updating..." : "Update Password"}
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
