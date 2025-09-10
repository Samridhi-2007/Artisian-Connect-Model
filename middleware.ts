import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /profile)
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const protectedPaths = ["/dashboard", "/profile", "/explore"]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))

  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If it's a protected path and no token exists, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", path.slice(1)) // Remove leading slash
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and tries to access login/signup, redirect to dashboard
  if (token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
