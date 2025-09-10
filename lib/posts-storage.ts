// Shared posts storage for the application
export interface Post {
  id: string
  author: {
    id: string
    name: string
  }
  content: string
  category: string
  status: string
  likes: number
  comments: number
  shares: number
  views: number
  timeAgo: string
  createdAt: string
  hashtags: string[]
  craft?: {
    id: string
    title: string
    price: string
    description: string
    tags: string[]
    aiScore: number
  }
}

// In-memory storage for posts (in production, this would be a database)
export const posts: Post[] = [
  {
    id: "1",
    author: {
      id: "3",
      name: "Priya Sharma"
    },
    content: "Just finished this beautiful block-printed saree! The indigo dye process took 3 weeks but the results are magical ✨",
    category: "Textiles",
    status: "active",
    likes: 234,
    comments: 45,
    shares: 12,
    views: 1200,
    timeAgo: "2 hours ago",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    hashtags: ["#BlockPrinting", "#Textiles", "#Handmade", "#Traditional", "#Indigo"]
  },
  {
    id: "2",
    author: {
      id: "4",
      name: "Ravi Kumar"
    },
    content: "Teaching my daughter the ancient art of terracotta pottery. Keeping traditions alive for the next generation 🏺",
    category: "Pottery",
    status: "active",
    likes: 189,
    comments: 32,
    shares: 8,
    views: 950,
    timeAgo: "5 hours ago",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    hashtags: ["#Terracotta", "#Pottery", "#Traditional", "#Family", "#Heritage"]
  },
  {
    id: "3",
    author: {
      id: "5",
      name: "Lakshmi Patel"
    },
    content: "Completed a stunning Bandhani dupatta with intricate tie-dye patterns. Each dot tells a story of tradition and patience.",
    category: "Textiles",
    status: "active",
    likes: 156,
    comments: 28,
    shares: 15,
    views: 800,
    timeAgo: "1 day ago",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ["#Bandhani", "#Textiles", "#TieDye", "#Traditional", "#Patience"]
  }
]

// Helper function to add a new post
export const addPost = (post: Post) => {
  posts.push(post)
  return post
}

// Helper function to get posts by user ID
export const getPostsByUserId = (userId: string) => {
  return posts.filter(post => post.author.id === userId)
}

// Helper function to get all active posts
export const getAllActivePosts = () => {
  return posts.filter(post => post.status === "active")
}

