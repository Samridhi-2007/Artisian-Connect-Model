import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function GET() {
  try {
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
