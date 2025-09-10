import { type NextRequest, NextResponse } from "next/server"

// Mock user database - in a real app, this would be a proper database
const users = [
  {
    id: "1",
    email: "demo@artisanconnect.com",
    username: "demo",
    password: "password123",
    firstName: "Demo",
    lastName: "User",
    profile: {
      bio: "Passionate artisan specializing in traditional crafts",
      location: "Mumbai, India",
      specialties: ["Pottery", "Textiles", "Jewelry"],
      joinedDate: "2024-01-15",
    },
  },
]

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    // Extract user ID from mock token
    const userId = token.split("-")[2]
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { firstName, lastName, bio, location, specialties } = await request.json()

    // Update user profile
    users[userIndex] = {
      ...users[userIndex],
      firstName,
      lastName,
      profile: {
        ...users[userIndex].profile,
        bio,
        location,
        specialties,
      },
    }

    return NextResponse.json({
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        username: users[userIndex].username,
        firstName: users[userIndex].firstName,
        lastName: users[userIndex].lastName,
        profile: users[userIndex].profile,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
