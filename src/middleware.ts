import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, decodeSessionCookie, verifySession } from "@/services/auth.middleware"
import { can } from "@/services/authorization.middleware"

const PUBLIC_ADMIN_PATHS = ["/admin/login"]
const ADMIN_PREFIX = "/admin"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)
  const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))

  const rawPayload = request.cookies.get(SESSION_COOKIE)?.value
  const payload = rawPayload ? await decodeSessionCookie(rawPayload) : null
  const session = payload?.session ?? null
  const isLoggedIn = session ? await verifySession(session) : false
  const appRole = payload?.appRole ?? null

  if (isAdminRoute && !isPublicPath && (!isLoggedIn || !can(appRole, "dashboard:read"))) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === "/admin/login" && isLoggedIn && can(appRole, "dashboard:read")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
