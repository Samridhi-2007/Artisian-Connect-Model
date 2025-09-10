import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"
import { posts } from "../../admin/posts/route"

export async function GET() {
  try {
    const activeUsers = users.filter((user) => user.status === "active" && user.role === "user")
    const activePosts = posts.filter((post) => post.status === "active")

    // Create recent discussions from real posts
    const discussions = activePosts.slice(0, 3).map((post) => {
      const author = activeUsers.find((user) => user.id === post.authorId) || activeUsers[0]
      return {
        id: post.id,
        author: {
          name: author.name,
          avatar: author.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
        },
        content: post.content,
        timeAgo: post.timeAgo,
        category: post.category || "General",
      }
    })

    return NextResponse.json({ discussions })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 })
  }
}
