import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import {
  SESSION_COOKIE,
  decodeSessionCookie,
} from "@/lib/auth/session-token"

import { can } from "@/services/authorization.middleware"

const PUBLIC_ADMIN_PATHS = ["/admin/login"]
const ADMIN_PREFIX = "/admin"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)
  const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) =>
    pathname.startsWith(p)
  )

  const rawCookie = request.cookies.get(SESSION_COOKIE)?.value

  if (!rawCookie) {
    if (isAdminRoute && !isPublicPath) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  const payload = await decodeSessionCookie(rawCookie)

  if (!payload?.session) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url))
    response.cookies.delete(SESSION_COOKIE)
    return response
  }

  const appRole = payload.appRole

  if (
    isAdminRoute &&
    !isPublicPath &&
    !can(appRole, "dashboard:read")
  ) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (
    pathname === "/admin/login" &&
    can(appRole, "dashboard:read")
  ) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}