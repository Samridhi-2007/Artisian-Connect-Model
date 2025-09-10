import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userCreations } from "../creations/route"
import { addPost } from "@/lib/posts-storage"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Decode token to get user ID (format: mock-token-USERID-timestamp)
    const userId = token.split("-")[2]

    const formData = await request.formData()
    const title = formData.get("title") as string
    const price = formData.get("price") as string
    const description = formData.get("description") as string
    const files = formData.getAll("files") as File[]

    if (!title || !price || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process uploaded files and create image URLs
    const imageUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // In a real implementation, you would save the file and get a URL
      // For now, we'll use placeholder URLs with file information
      const imageUrl = `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(title.substring(0, 20))}`
      imageUrls.push(imageUrl)
    }

    // If no files uploaded, use a default image
    if (imageUrls.length === 0) {
      imageUrls.push(`https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(title.substring(0, 20))}`)
    }

    // Create new craft entry
    const newCraft = {
      id: `craft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      price,
      description,
      status: "Active",
      likes: Math.floor(Math.random() * 20) + 5,
      comments: Math.floor(Math.random() * 10) + 1,
      views: Math.floor(Math.random() * 100) + 20,
      tags: ["#Handmade", "#" + title.split(" ")[0], "#ArtisanMade"],
      canMintNFT: true,
      aiScore: Math.floor(Math.random() * 20) + 75, // 75-95 range
      suggestions: [
        "Consider adding more detailed photos",
        "Highlight unique crafting techniques",
        "Add seasonal collection tags",
      ],
      createdAt: new Date().toISOString(),
      category: "Handmade",
      fileCount: files.length,
      images: imageUrls,
      mainImage: imageUrls[0], // First image as main
    }

    // Add to storage
    userCreations.push(newCraft)

    // Find the user to get their name
    const users = [
      {
        id: "1",
        email: "demo@artisanconnect.com",
        username: "demo",
        password: "password123",
        firstName: "Demo",
        lastName: "User",
        role: "user",
        status: "active",
        profile: {
          bio: "Passionate artisan specializing in traditional crafts",
          location: "Mumbai, India",
          specialties: ["Pottery", "Textiles", "Jewelry"],
          joinedDate: "2024-01-15",
        },
      },
      {
        id: "2",
        email: "raghuramp456@gmail.com",
        username: "Raghuram P.",
        password: "raghuram",
        firstName: "Raghuram",
        lastName: "P.",
        role: "admin",
        status: "active",
        profile: {
          bio: "Platform Administrator",
          location: "India",
          specialties: ["Administration"],
          joinedDate: "2024-01-01",
        },
      },
      {
        id: "3",
        email: "priya.sharma@email.com",
        username: "Priya Sharma",
        password: "priya123",
        firstName: "Priya",
        lastName: "Sharma",
        role: "user",
        status: "active",
        profile: {
          bio: "Block printing artist from Rajasthan",
          location: "Rajasthan, India",
          specialties: ["Block Printing", "Textiles"],
          joinedDate: "2024-02-10",
        },
      },
      {
        id: "4",
        email: "ravi.kumar@email.com",
        username: "Ravi Kumar",
        password: "ravi123",
        firstName: "Ravi",
        lastName: "Kumar",
        role: "user",
        status: "active",
        profile: {
          bio: "Traditional terracotta pottery master",
          location: "West Bengal, India",
          specialties: ["Terracotta", "Pottery"],
          joinedDate: "2024-02-15",
        },
      },
      {
        id: "5",
        email: "lakshmi.patel@email.com",
        username: "Lakshmi Patel",
        password: "lakshmi123",
        firstName: "Lakshmi",
        lastName: "Patel",
        role: "user",
        status: "active",
        profile: {
          bio: "Bandhani textile specialist",
          location: "Gujarat, India",
          specialties: ["Bandhani", "Textiles"],
          joinedDate: "2024-01-20",
        },
      },
    ]

    const currentUser = users.find(u => u.id === userId)
    const authorName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Unknown User"

    // Create a community post for the uploaded craft
    const craftPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: {
        id: userId,
        name: authorName
      },
      content: `Just finished this beautiful ${title.toLowerCase()}! ${description}`,
      category: "Handmade",
      status: "active",
      likes: Math.floor(Math.random() * 15) + 3,
      comments: Math.floor(Math.random() * 8) + 1,
      shares: Math.floor(Math.random() * 5) + 1,
      views: Math.floor(Math.random() * 50) + 10,
      timeAgo: "Just now",
      createdAt: new Date().toISOString(),
      hashtags: [
        "#Handmade",
        "#ArtisanMade", 
        "#" + title.split(" ")[0],
        "#Craft",
        "#Traditional",
        "#Creative"
      ],
        craft: {
          id: newCraft.id,
          title: newCraft.title,
          price: newCraft.price,
          description: newCraft.description,
          tags: newCraft.tags,
          aiScore: newCraft.aiScore,
          images: newCraft.images,
          mainImage: newCraft.mainImage
        }
    }

    // Add post to community posts
    addPost(craftPost)

    return NextResponse.json({
      success: true,
      craft: newCraft,
      post: craftPost,
      message: "Craft uploaded successfully and shared to community",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload craft" }, { status: 500 })
  }
}
