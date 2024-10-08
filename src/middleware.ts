import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { EKeyToken } from '@/constants/enum'
import ROUTES from '@/constants/route'

const PROTECTED_PATHS = ['/dashboard', '/profile']
const AUTH_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER]

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const accessToken = request.cookies.get(EKeyToken.ACCESS_TOKEN)?.value
  const refreshToken = request.cookies.get(EKeyToken.REFRESH_TOKEN)?.value

  // Kiểm tra xem trang hiện tại có phải trang private không
  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  )

  // Kiểm tra xem trang hiện tại có phải trang đăng nhập hoặc đăng ký không
  const isAuthRoute = AUTH_PATHS.some((path) => pathname === path)

  // Nếu người dùng đã đăng nhập (có refresh token) nhưng không có access token => logout
  if (refreshToken && !accessToken) {
    const logoutUrl = new URL(ROUTES.LOGOUT, request.url)
    logoutUrl.searchParams.set('accessToken', refreshToken)
    return NextResponse.redirect(logoutUrl)
  }

  // Nếu có refresh token và truy cập trang đăng nhập hoặc đăng ký
  if (refreshToken && isAuthRoute) {
    if (searchParams.get(EKeyToken.ACCESS_TOKEN)) {
      // Nếu có access token trong query params, cho phép truy cập
      return NextResponse.next()
    }
    // Push về trang chính
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
  }

  // Trang private, kiểm tra xem người dùng đã đăng nhập chưa
  if (isProtectedRoute) {
    if (!refreshToken) {
      // Chưa đăng nhập, chuyển hướng đến trang đăng nhập
      const loginUrl = new URL(ROUTES.LOGIN, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Trường hợp còn lại, cho phép truy cập (bao gồm cả trang public)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
