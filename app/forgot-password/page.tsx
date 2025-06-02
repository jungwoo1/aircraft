"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../../components/auth-context"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // steph@vminfracap.com 이메일 입력 시 인증번호 입력 화면으로 이동
      if (email === "steph@vminfracap.com") {
        await resetPassword.verifyEmail(email)
        router.push("/verify-code")
      } else {
        setError("Email not found")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white relative">
      <form onSubmit={handleSubmit} className="w-[360px] inline-flex flex-col justify-start items-center gap-9">
        {/* 로고 */}
        <Image src="/logo-airstream.png" alt="Airstream Logo" width={244} height={52} priority />

        {/* 안내 텍스트 */}
        <div className="self-stretch bg-white/0 flex flex-col justify-center items-center overflow-hidden">
          <div className="text-center justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
            Enter your email address and we will send you
            <br />
            verification code to reset your password.
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch flex flex-col justify-start items-start">
            {/* 이메일 입력 필드 */}
            <div className="self-stretch pb-4 bg-white/0 flex flex-col justify-start items-start">
              <div className="self-stretch pb-2 bg-white/0 inline-flex justify-start items-end gap-1">
                <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                  <div className="text-center justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                    Email
                  </div>
                </div>
              </div>
              <div className="self-stretch rounded inline-flex justify-start items-center">
                <div className="flex-1 px-3 py-1.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#ced4da] flex justify-start items-center overflow-hidden">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-transparent outline-none text-[#212529] text-base font-normal font-['Roboto'] leading-normal placeholder:text-[#6c757d]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-sm text-red-500 w-full -mt-2 mb-2">{error}</p>}

          {/* 계속 버튼 */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="self-stretch px-3 py-1.5 bg-[#4353ff] rounded outline outline-1 outline-offset-[-1px] outline-[#e5e7ec] inline-flex justify-center items-center gap-2 overflow-hidden"
            >
              <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
                <div className="justify-start text-white text-base font-normal font-['Roboto'] leading-normal">
                  {isLoading ? "Processing..." : "Continue"}
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
