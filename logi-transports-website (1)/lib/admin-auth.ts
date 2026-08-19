import type { NextRequest } from "next/server"

export const ADMIN_COOKIE = "lt_admin_session"

// Change this via the ADMIN_PASSWORD environment variable in production
// (.env.local). Falls back to a default so the admin panel works out of
// the box in local development.
function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "logitransports"
}

// Uses the Web Crypto API (not Node's `crypto` module) so this also works
// in the Edge runtime that Next.js Middleware uses by default.
export async function getSessionToken() {
  const data = new TextEncoder().encode(getAdminPassword())
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function checkPassword(password: string) {
  return password === getAdminPassword()
}

export async function isAdminRequest(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value
  if (!cookie) return false
  const expected = await getSessionToken()
  return cookie === expected
}
