import { type NextRequest, NextResponse } from "next/server"

const users = [
  {
    id: "1",
    email: "demo@artisanconnect.com",
    username: "demo",
    password: "password123",
    firstName: "Demo",
    lastName: "User",
    role: "user",
    status: "active",
    profile: {
      bio: "Passionate artisan specializing in traditional crafts",
      location: "Mumbai, India",
      specialties: ["Pottery", "Textiles", "Jewelry"],
      joinedDate: "2024-01-15",
    },
  },
  {
    id: "2",
    email: "raghuramp456@gmail.com",
    username: "Raghuram P.",
    password: "raghuram",
    firstName: "Raghuram",
    lastName: "P.",
    role: "admin",
    status: "active",
    profile: {
      bio: "Platform Administrator",
      location: "India",
      specialties: ["Administration"],
      joinedDate: "2024-01-01",
    },
  },
  {
    id: "3",
    email: "priya.sharma@email.com",
    username: "Priya Sharma",
    password: "priya123",
    firstName: "Priya",
    lastName: "Sharma",
    role: "user",
    status: "active",
    profile: {
      bio: "Block printing artist from Rajasthan",
      location: "Rajasthan, India",
      specialties: ["Block Printing", "Textiles"],
      joinedDate: "2024-02-10",
    },
  },
  {
    id: "4",
    email: "ravi.kumar@email.com",
    username: "Ravi Kumar",
    password: "ravi123",
    firstName: "Ravi",
    lastName: "Kumar",
    role: "user",
    status: "active",
    profile: {
      bio: "Traditional terracotta pottery master",
      location: "West Bengal, India",
      specialties: ["Terracotta", "Pottery"],
      joinedDate: "2024-02-15",
    },
  },
  {
    id: "5",
    email: "lakshmi.patel@email.com",
    username: "Lakshmi Patel",
    password: "lakshmi123",
    firstName: "Lakshmi",
    lastName: "Patel",
    role: "user",
    status: "active",
    profile: {
      bio: "Bandhani textile specialist",
      location: "Gujarat, India",
      specialties: ["Bandhani", "Textiles"],
      joinedDate: "2024-01-20",
    },
  },
]

// Export users for use in other API routes
export { users }

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user by email or username
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase(),
    )

    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    if (user.status === "banned") {
      return NextResponse.json({ message: "Account has been banned" }, { status: 403 })
    }

    if (user.status === "restricted") {
      return NextResponse.json({ message: "Account is temporarily restricted" }, { status: 403 })
    }

    // In a real app, generate a proper JWT token
    const token = `mock-token-${user.id}-${Date.now()}`

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profile: user.profile,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
