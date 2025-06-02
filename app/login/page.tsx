"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../../components/auth-context"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.message || "Login failed")
      } else {
        // 로그인 성공 시 페이지 리로드 추가
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white relative">
      {/* 로그인 폼 - 항상 화면 중앙에 위치 */}
      <form onSubmit={handleSubmit}>
        <div className="w-[360px] inline-flex flex-col justify-start items-center gap-[52px]">
          {/* 로고 */}
          <Image
            src="/logo-airstream.png"
            alt="Airstream Logo"
            width={244}
            height={52}
            priority
            className="w-[244px] h-[52px] object-contain"
          />

          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-start items-start">
              {/* 이메일 입력 필드 */}
              <div
                data-form-text="false"
                data-required="false"
                data-state="normal"
                data-tooltip="false"
                className="self-stretch pb-4 bg-white/0 flex flex-col justify-start items-start"
              >
                <div className="self-stretch pb-2 bg-white/0 inline-flex justify-start items-end gap-1">
                  <div
                    data-fill-container="false"
                    data-hierarchy="primary"
                    data-hovered="false"
                    data-icon-left="false"
                    data-icon-right="false"
                    data-list="false"
                    className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden"
                  >
                    <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                      Email
                    </div>
                  </div>
                </div>
                <div
                  data-addon="false"
                  data-filled="false"
                  data-prefix="false"
                  data-size="medium"
                  data-state="normal"
                  data-suffix="false"
                  className="self-stretch rounded inline-flex justify-start items-center"
                >
                  <div
                    data-filled="false"
                    data-prefix="false"
                    data-size="medium"
                    data-state="normal"
                    data-suffix="false"
                    data-validation="normal"
                    className="flex-1 px-3 py-1.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#ced4da] flex justify-start items-center overflow-hidden"
                  >
                    <div className="flex-1 flex justify-start items-center gap-1 overflow-hidden">
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

              {/* 비밀번호 입력 필드 */}
              <div
                data-form-text="false"
                data-required="false"
                data-state="normal"
                data-tooltip="false"
                className="self-stretch pb-4 bg-white/0 flex flex-col justify-start items-start"
              >
                <div className="self-stretch pb-2 bg-white/0 inline-flex justify-start items-end gap-1">
                  <div
                    data-fill-container="false"
                    data-hierarchy="primary"
                    data-hovered="false"
                    data-icon-left="false"
                    data-icon-right="false"
                    data-list="false"
                    className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden"
                  >
                    <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                      Password
                    </div>
                  </div>
                </div>
                <div
                  data-addon="false"
                  data-filled="false"
                  data-prefix="false"
                  data-size="medium"
                  data-state="normal"
                  data-suffix="false"
                  className="self-stretch rounded inline-flex justify-start items-center"
                >
                  <div
                    data-filled="false"
                    data-prefix="false"
                    data-size="medium"
                    data-state="normal"
                    data-suffix="false"
                    data-validation="normal"
                    className="flex-1 px-3 py-1.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#ced4da] flex justify-start items-center overflow-hidden"
                  >
                    <div className="flex-1 flex justify-start items-center gap-1 overflow-hidden">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="flex-1 bg-transparent outline-none text-[#212529] text-base font-normal font-['Roboto'] leading-normal placeholder:text-[#6c757d]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && <p className="text-sm text-red-500 w-full -mt-2 mb-2">{error}</p>}

            {/* 체크박스와 비밀번호 찾기 링크 */}
            <div className="self-stretch pb-2 inline-flex justify-between items-center">
              <div
                data-checked={rememberMe}
                data-disabled="false"
                data-focused="false"
                data-indeterminate="false"
                data-validation="normal"
                className="bg-white/0 flex justify-start items-start gap-2"
              >
                <div className="h-6 flex justify-center items-center">
                  <div
                    data-checked={rememberMe}
                    data-disabled="false"
                    data-focused="false"
                    data-indeterminate="false"
                    data-validation="normal"
                    className="inline-flex flex-col justify-center items-center"
                  >
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 bg-white rounded border border-black/20"
                    />
                  </div>
                </div>
                <label
                  htmlFor="remember"
                  data-fill-container="false"
                  data-hierarchy="primary"
                  data-hovered="false"
                  data-icon-left="false"
                  data-icon-right="false"
                  data-list="false"
                  className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden cursor-pointer"
                >
                  <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] leading-normal">
                    Keep me signed in
                  </div>
                </label>
              </div>
              <Link
                href="/forgot-password"
                data-fill-container="false"
                data-hierarchy="link"
                data-hovered="false"
                data-icon-left="false"
                data-icon-right="false"
                data-list="false"
                className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden"
              >
                <div className="justify-start text-[#212529] text-base font-normal font-['Roboto'] underline leading-normal">
                  Forgot password
                </div>
              </Link>
            </div>

            {/* 로그인 버튼 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <button
                type="submit"
                disabled={isLoading}
                data-icon-left="false"
                data-icon-only="false"
                data-icon-right="false"
                data-outline="false"
                data-size="medium"
                data-state="normal"
                data-type="primary"
                className="self-stretch px-3 py-1.5 bg-[#4353ff] rounded outline outline-1 outline-offset-[-1px] outline-[#e5e7ec] inline-flex justify-center items-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  data-fill-container="false"
                  data-hierarchy="primary"
                  data-hovered="false"
                  data-icon-left="false"
                  data-icon-right="false"
                  data-list="false"
                  className="bg-white/0 inline-flex flex-col justify-center items-start overflow-hidden"
                >
                  <div className="justify-start text-white text-base font-normal font-['Roboto'] leading-normal">
                    {isLoading ? "Signing in..." : "Sign in"}
                  </div>
                </div>
              </button>
            </div>
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
