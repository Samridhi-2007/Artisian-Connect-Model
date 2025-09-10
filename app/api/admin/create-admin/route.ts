import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function POST(request: Request) {
  try {
    const { email, username, password, adminCode } = await request.json()

    if (adminCode !== "5422") {
      return NextResponse.json({ error: "Invalid admin code" }, { status: 400 })
    }

    const existingUser = users.find((u) => u.email === email || u.username === username)
    if (existingUser) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 })
    }

    const newAdmin = {
      id: `admin_${Date.now()}`,
      email,
      username,
      password,
      firstName: username.split(" ")[0] || username,
      lastName: username.split(" ")[1] || "",
      role: "admin",
      status: "active",
      profile: {
        bio: "Platform Administrator",
        location: "India",
        specialties: ["Administration"],
        joinedDate: new Date().toISOString().split("T")[0],
      },
    }

    users.push(newAdmin)

    return NextResponse.json({ success: true, message: "Admin created successfully", user: newAdmin })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
