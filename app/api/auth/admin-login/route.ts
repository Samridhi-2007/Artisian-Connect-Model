import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, adminCode } = await request.json()

    // Predefined admin user as requested
    const adminUser = {
      email: "raghuramp456@gmail.com",
      username: "Raghuram P.",
      password: "raghuram",
      adminCode: "5422",
      role: "admin",
    }

    // Validate admin credentials
    if (email === adminUser.email && password === adminUser.password && adminCode === adminUser.adminCode) {
      // Generate admin token (in production, use proper JWT)
      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: "admin_1",
          email: adminUser.email,
          username: adminUser.username,
          role: "admin",
        },
      })
    }

    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Admin login failed" }, { status: 500 })
  }
}
