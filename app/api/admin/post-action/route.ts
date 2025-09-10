import { NextResponse } from "next/server"
import { posts } from "../posts/route"

export async function POST(request: Request) {
  try {
    const { postId, action } = await request.json()

    const postIndex = posts.findIndex((post) => post.id === postId)

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = posts[postIndex]

    switch (action) {
      case "ban":
        post.status = "banned"
        break
      case "delete":
        posts.splice(postIndex, 1)
        break
      case "activate":
        post.status = "active"
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: `Post ${action}ed successfully` })
  } catch (error) {
    return NextResponse.json({ error: "Failed to perform post action" }, { status: 500 })
  }
}
