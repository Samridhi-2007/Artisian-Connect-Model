import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function POST(request: Request) {
  try {
    const { userId, action, days } = await request.json()

    const userIndex = users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[userIndex]

    switch (action) {
      case "ban":
        user.status = "banned"
        break
      case "restrict":
        user.status = "restricted"
        // In a real app, you'd set an expiration date based on days
        user.restrictedUntil = new Date(Date.now() + (days || 7) * 24 * 60 * 60 * 1000).toISOString()
        break
      case "delete":
        users.splice(userIndex, 1)
        break
      case "activate":
        user.status = "active"
        delete user.restrictedUntil
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: `User ${action}ed successfully` })
  } catch (error) {
    return NextResponse.json({ error: "Failed to perform user action" }, { status: 500 })
  }
}
