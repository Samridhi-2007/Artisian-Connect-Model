import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"
import { posts } from "../../admin/posts/route"
import { userCreations } from "../../user/creations/route"

export async function GET() {
  try {
    const activeUsers = users.filter((user) => user.status === "active" && user.role === "user")
    const activePosts = posts.filter((post) => post.status === "active")
    const activeCreations = userCreations.filter((creation) => creation.status === "Active")

    // Calculate posts from today
    const today = new Date()
    const todayPosts = [...activePosts, ...activeCreations].filter((item) => {
      const itemDate = new Date(item.createdAt || Date.now())
      return itemDate.toDateString() === today.toDateString()
    })

    // Calculate NFTs minted (simulate based on creations with canMintNFT)
    const nftsMinted = userCreations.filter((creation) => creation.canMintNFT && Math.random() > 0.4).length

    const stats = {
      activeArtisans: activeUsers.length,
      postsToday: todayPosts.length,
      nftsMinted: nftsMinted,
      successStories: Math.floor(activeUsers.length * 0.3), // 30% success rate simulation
      totalCreations: activeCreations.length,
      totalViews: userCreations.reduce((sum, creation) => sum + creation.views, 0),
      totalLikes: userCreations.reduce((sum, creation) => sum + creation.likes, 0),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
