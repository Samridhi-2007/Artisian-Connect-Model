import { NextResponse } from "next/server"

export const posts = [
  {
    id: "1",
    author: {
      name: "Priya Sharma",
      id: "3",
    },
    content:
      "Just finished this beautiful block-printed saree! The indigo dye process took 3 weeks but the results are magical ✨",
    timeAgo: "2 hours ago",
    likes: 234,
    comments: 45,
    shares: 12,
    status: "active",
  },
  {
    id: "2",
    author: {
      name: "Ravi Kumar",
      id: "4",
    },
    content:
      "Teaching my daughter the ancient art of terracotta pottery. Keeping traditions alive for the next generation 🏺",
    timeAgo: "5 hours ago",
    likes: 189,
    comments: 32,
    shares: 8,
    status: "active",
  },
  {
    id: "3",
    author: {
      name: "Lakshmi Patel",
      id: "5",
    },
    content:
      "Completed a stunning Bandhani dupatta with intricate tie-dye patterns. Each dot tells a story of tradition and patience.",
    timeAgo: "1 day ago",
    likes: 156,
    comments: 28,
    shares: 15,
    status: "active",
  },
]

export async function GET() {
  try {
    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
