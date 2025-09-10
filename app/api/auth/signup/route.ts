import { type NextRequest, NextResponse } from "next/server"
import { users } from "../login/route"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, username, password } = await request.json()

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase(),
    )

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or username already exists" }, { status: 400 })
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      username,
      password, // In real app, this would be hashed
      firstName,
      lastName,
      role: "user",
      status: "active",
      profile: {
        bio: "",
        location: "",
        specialties: [],
        joinedDate: new Date().toISOString().split("T")[0],
      },
    }

    users.push(newUser)

    // Generate token
    const token = `mock-token-${newUser.id}-${Date.now()}`

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        profile: newUser.profile,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
