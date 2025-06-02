"use client"

import { useEffect } from "react"
import { useAuth } from "../../components/auth-context"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export default function ResetSuccessPage() {
  const { resetPassword } = useAuth()
  const router = useRouter()

  // 인증 단계가 success가 아니면 이메일 입력 페이지로 리디렉션
  useEffect(() => {
    if (resetPassword.step !== "success") {
      router.push("/forgot-password")
    }
  }, [resetPassword.step, router])

  const handleBackToLogin = () => {
    router.push("/login")
  }

  if (resetPassword.step !== "success") {
    return null // 로딩 상태 또는 리디렉션 처리
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white relative">
      <div className="w-[360px] inline-flex flex-col justify-start items-center gap-9">
        {/* 로고 */}
        <Image src="/logo-airstream.png" alt="Airstream Logo" width={244} height={52} priority />

        {/* 성공 아이콘 및 메시지 */}
        <div className="self-stretch flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#E0F7F4] flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#00D492]" />
          </div>
          <h2 className="text-2xl font-bold text-[#212529] mb-2 font-['Roboto']">Password reset completed</h2>
          <p className="text-center text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
            Your password has been reset successfully.
            <br />
            Click below to sign in.
          </p>
        </div>

        {/* 로그인 버튼 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <button
            onClick={handleBackToLogin}
            className="self-stretch px-3 py-1.5 bg-[#4353ff] rounded outline outline-1 outline-offset-[-1px] outline-[#e5e7ec] inline-flex justify-center items-center gap-2 overflow-hidden"
          >
            <div className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden">
              <div className="justify-start text-white text-base font-normal font-['Roboto'] leading-normal">
                Back to sign in
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 푸터 - 화면 하단에 고정 */}
      <div className="absolute bottom-[23px] inline-flex flex-col justify-start items-center">
        <div className="justify-center text-black/40 text-lg font-normal font-['Roboto'] leading-[29.33px]">
          Copyright ©2024 Produced by VMIC Aviation
        </div>
      </div>
    </div>
  )
}
