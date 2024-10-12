import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { EKeyToken } from '@/constants/enum'
import ROUTES from '@/constants/route'

const PROTECTED_PATHS = ['/news', '/settings']
const AUTH_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER]

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const accessToken = request.cookies.get(EKeyToken.ACCESS_TOKEN)?.value
  const refreshToken = request.cookies.get(EKeyToken.REFRESH_TOKEN)?.value

  const isProtectedRoute = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isAuthRoute = AUTH_PATHS.includes(pathname)

  if (refreshToken && !accessToken) {
    if (searchParams.has(EKeyToken.ACCESS_TOKEN)) {
      return NextResponse.next()
    }
    const logoutUrl = new URL(ROUTES.LOGIN, request.url)
    logoutUrl.searchParams.set(EKeyToken.ACCESS_TOKEN, refreshToken)
    return NextResponse.redirect(logoutUrl)
  }

  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
  }

  if (isProtectedRoute && !refreshToken) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
