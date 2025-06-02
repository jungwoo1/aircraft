import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // 클라이언트 측 쿠키에서 인증 상태 확인
  const isAuthenticated = request.cookies.get("auth")?.value === "true"
  const { pathname } = request.nextUrl

  // 인증이 필요한 경로 목록
  const protectedRoutes = ["/dashboard"]

  // 인증 관련 경로 목록
  const authRoutes = ["/login", "/forgot-password", "/verify-code", "/reset-password", "/reset-success"]

  // 인증된 사용자가 인증 페이지에 접근하면 대시보드로 리디렉션
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 인증되지 않은 사용자가 보호된 경로에 접근하면 로그인 페이지로 리디렉션
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 미들웨어가 실행될 경로 패턴 목록
     * '/((?!api|_next/static|_next/image|favicon.ico).*)'는 API 경로, 정적 파일 등을 제외한 모든 경로를 의미
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
