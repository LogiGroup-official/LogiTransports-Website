import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE, getSessionToken } from "@/lib/admin-auth"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get(ADMIN_COOKIE)?.value
    const expected = await getSessionToken()
    if (!cookie || cookie !== expected) {
      const loginUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
