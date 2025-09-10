import { NextResponse } from "next/server"
import { getAllActivePosts } from "@/lib/posts-storage"
import { users } from "../../auth/login/route"
import { userCreations } from "../../user/creations/route"

export async function GET() {
  try {
    // Get all active posts from shared storage
    const allPosts = getAllActivePosts()
    
    const formattedPosts = allPosts.map((post) => {
      const author = users.find((u) => u.id === post.author.id) || users[0]
      return {
        id: post.id,
        author: {
          name: post.author.name,
          location: author.profile?.location || "India",
          verified: true,
          avatar: post.author.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
          specialty: author.profile?.specialties?.[0] || "Artisan",
        },
        content: post.content,
        category: post.category,
        timeAgo: post.timeAgo,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        hashtags: post.hashtags || [],
        type: post.craft ? "creation" : "discussion",
        craft: post.craft,
      }
    })

    // Sort posts by engagement (likes + comments)
    const sortedPosts = formattedPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))

    return NextResponse.json({ posts: sortedPosts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const postDate = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours} hours ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`
  return `${Math.floor(diffInDays / 7)} weeks ago`
}
