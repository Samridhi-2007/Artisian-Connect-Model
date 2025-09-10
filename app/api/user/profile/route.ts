import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { users } from "../../auth/login/route"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = token.split("-")[1]
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        specialty: user.specialty,
        location: user.location,
        bio: user.bio,
        joinedDate: user.joinedDate,
        status: user.status,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = token.split("-")[1]
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updates = await request.json()

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id: userId, // Prevent ID changes
      email: users[userIndex].email, // Prevent email changes
    }

    return NextResponse.json({
      success: true,
      user: users[userIndex],
      message: "Profile updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
