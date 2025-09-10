import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userCreations } from "../creations/route"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = token.split("-")[1]
    const creations = userCreations.filter((creation) => creation.userId === userId)

    const stats = {
      totalCreations: creations.length,
      totalViews: creations.reduce((sum, creation) => sum + creation.views, 0),
      totalLikes: creations.reduce((sum, creation) => sum + creation.likes, 0),
      totalComments: creations.reduce((sum, creation) => sum + creation.comments, 0),
      averageAiScore:
        creations.length > 0
          ? Math.round(creations.reduce((sum, creation) => sum + creation.aiScore, 0) / creations.length)
          : 0,
      activeListings: creations.filter((creation) => creation.status === "Active").length,
      estimatedRevenue: creations.reduce((sum, creation) => {
        const price = Number.parseFloat(creation.price.replace(/[₹,]/g, "")) || 0
        return sum + price * 0.1 // Simulate 10% conversion rate
      }, 0),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
