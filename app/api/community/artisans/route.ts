import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"

export async function GET() {
  try {
    const activeArtisans = users
      .filter((user) => user.status === "active" && user.role === "user")
      .map((user) => ({
        id: user.id,
        name: user.username,
        specialty: getSpecialtyForUser(user.username),
        rating: generateRating(),
        orders: generateOrderCount(),
      }))

    return NextResponse.json({ artisans: activeArtisans })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artisans" }, { status: 500 })
  }
}

function getSpecialtyForUser(username: string): string {
  const specialties: { [key: string]: string } = {
    "Priya Sharma": "Block Printing",
    "Ravi Kumar": "Terracotta Pottery",
    "Lakshmi Patel": "Bandhani Textiles",
  }
  return specialties[username] || "Handmade Crafts"
}

function generateRating(): number {
  // Generate ratings between 4.5 and 5.0
  return Math.round((4.5 + Math.random() * 0.5) * 10) / 10
}

function generateOrderCount(): number {
  // Generate order counts between 50 and 250
  return Math.floor(50 + Math.random() * 200)
}
