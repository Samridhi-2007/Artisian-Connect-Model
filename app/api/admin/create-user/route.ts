import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function POST(request: Request) {
  try {
    const { email, username, password, role } = await request.json()

    const existingUser = users.find((u) => u.email === email || u.username === username)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      username,
      password,
      firstName: username.split(" ")[0] || username,
      lastName: username.split(" ")[1] || "",
      role: role || "user",
      status: "active",
      profile: {
        bio: "New artisan member",
        location: "India",
        specialties: [],
        joinedDate: new Date().toISOString().split("T")[0],
      },
    }

    users.push(newUser)

    return NextResponse.json({ success: true, message: "User created successfully", user: newUser })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
