import { NextResponse } from "next/server"
import { users } from "../../auth/login/route"
import { userCreations } from "../../user/creations/route"

export async function GET() {
  try {
    const activeUsers = users.filter((user) => user.status === "active" && user.role === "user")
    const activeCrafts = userCreations.filter((creation) => creation.status === "Active")

    // Create featured crafts from real user creations
    const featuredCrafts = activeCrafts
      .sort((a, b) => b.likes + b.views - (a.likes + a.views)) // Sort by engagement
      .slice(0, 6)
      .map((craft) => {
        const author = activeUsers.find((user) => user.id === craft.userId) || activeUsers[0]
        return {
          id: craft.id,
          title: craft.title,
          author: {
            name: `${author.firstName} ${author.lastName}`,
            avatar: `${author.firstName} ${author.lastName}`
              .split(" ")
              .map((n: string) => n[0])
              .join(""),
            specialty: author.profile?.specialties?.[0] || "Artisan",
          },
          likes: craft.likes,
          comments: craft.comments,
          shares: Math.floor(craft.views / 10),
          rating: (4.0 + Math.random() * 1).toFixed(1),
          category: craft.category || "Handmade",
          timeAgo: getTimeAgo(craft.createdAt),
          price: craft.price,
          description: craft.description,
          tags: craft.tags,
          images: (craft as any).images || [],
          mainImage: (craft as any).mainImage || `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(craft.title.substring(0, 20))}`,
        }
      })

    return NextResponse.json({ crafts: featuredCrafts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch featured crafts" }, { status: 500 })
  }
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const craftDate = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - craftDate.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours} hours ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`
  return `${Math.floor(diffInDays / 7)} weeks ago`
}
