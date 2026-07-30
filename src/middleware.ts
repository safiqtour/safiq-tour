import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ADMIN_PATHS = ["/admin/login"]
const ADMIN_PREFIX = "/admin"

function getSessionToken(request: NextRequest): string | null {
  return (
    request.cookies.get("authjs.session-token")?.value ??
    request.cookies.get("__Secure-authjs.session-token")?.value ??
    null
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)
  const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))
  const isLoggedIn = !!getSessionToken(request)

  if (isAdminRoute && !isPublicPath && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
