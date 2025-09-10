import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In-memory storage for user creations (in production, this would be a database)
export const userCreations: Array<{
  id: string
  userId: string
  title: string
  price: string
  description: string
  status: string
  likes: number
  comments: number
  views: number
  tags: string[]
  canMintNFT: boolean
  aiScore: number
  suggestions: string[]
  createdAt: string
  category: string
}> = []

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Decode token to get user ID (format: mock-token-USERID-timestamp)
    const userId = token.split("-")[2]

    // Get user's creations
    const creations = userCreations.filter((creation) => creation.userId === userId)

    return NextResponse.json({
      creations: creations.map((creation) => ({
        ...creation,
        suggestions: [
          "Consider adding more detailed photos",
          "Highlight unique crafting techniques",
          "Add seasonal collection tags",
        ],
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch creations" }, { status: 500 })
  }
}
