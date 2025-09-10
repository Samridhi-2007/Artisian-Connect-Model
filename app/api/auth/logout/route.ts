import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Clear the auth cookie and redirect to login
  const response = NextResponse.redirect(new URL("/login", request.url))

  response.cookies.set("auth-token", "", {
    path: "/",
    expires: new Date(0),
  })

  return response
}

export async function POST(request: NextRequest) {
  try {
    // In a real app, you might invalidate the token in the database
    const response = NextResponse.json({ message: "Logged out successfully" })

    // Clear the auth cookie
    response.cookies.set("auth-token", "", {
      path: "/",
      expires: new Date(0),
    })

    return response
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
