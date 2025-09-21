"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoryGenerator from "@/components/story-generator"
import {
  Upload,
  Sparkles,
  ArrowLeft,
  Heart,
  MessageCircle,
  Edit,
  TrendingUp,
  Target,
  Lightbulb,
  BarChart3,
  Users,
  Eye,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UserCreation {
  id: string
  title: string
  price: string
  status: string
  likes: number
  comments: number
  views: number
  description: string
  tags: string[]
  canMintNFT: boolean
  aiScore: number
  suggestions: string[]
}

interface DashboardStats {
  performanceScore: number
  totalViews: number
  revenue: string
  engagement: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userCreations, setUserCreations] = useState<UserCreation[]>([])
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    performanceScore: 0,
    totalViews: 0,
    revenue: "₹0",
    engagement: 0,
  })
  const [loading, setLoading] = useState(true)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    price: "",
    description: "",
    files: [] as File[],
  })
  const [uploadLoading, setUploadLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [mintingNFT, setMintingNFT] = useState<string | null>(null)
  const [mintingUploadNFT, setMintingUploadNFT] = useState(false); // New state for upload NFT minting
  const [mintResult, setMintResult] = useState<string | null>(null); // New state for minting result

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if user is authenticated
        const userRes = await fetch("/api/auth/me")
        if (!userRes.ok) {
          router.push("/login")
          return
        }
        const userData = await userRes.json()
        setUser(userData.user)

        // Fetch user's creations
        const creationsRes = await fetch("/api/user/creations")
        const creationsData = await creationsRes.json()
        setUserCreations(creationsData.creations || [])

        // Fetch user's posts
        const postsRes = await fetch("/api/community/posts")
        const postsData = await postsRes.json()
        const userPosts = postsData.posts?.filter((post: any) => 
          post.author?.name === userData.user.name || 
          post.author?.name === `${userData.user.firstName} ${userData.user.lastName}`
        ) || []
        setUserPosts(userPosts)

        // Calculate dashboard stats from real data
        const totalViews =
          creationsData.creations?.reduce((sum: number, creation: any) => sum + (creation.views || 0), 0) || 0
        const totalLikes =
          creationsData.creations?.reduce((sum: number, creation: any) => sum + (creation.likes || 0), 0) || 0
        const avgEngagement = creationsData.creations?.length > 0 ? totalLikes / creationsData.creations.length : 0

        setDashboardStats({
          performanceScore: Math.min(95, Math.max(60, avgEngagement * 10 + Math.random() * 20)),
          totalViews,
          revenue: `₹${(totalViews * 8.5).toLocaleString()}`, // Simulate revenue based on views
          engagement: Math.min(5.0, Math.max(3.0, avgEngagement / 10 + 4.0)),
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadForm((prev) => ({ ...prev, files }))
  }

  const handleUploadCraft = async () => {
    if (!uploadForm.title || !uploadForm.price || !uploadForm.description) {
      alert("Please fill in all required fields")
      return
    }

    setUploadLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", uploadForm.title)
      formData.append("price", uploadForm.price)
      formData.append("description", uploadForm.description)
      uploadForm.files.forEach((file) => formData.append("files", file))

      const response = await fetch("/api/user/upload-craft", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setUserCreations((prev) => [result.craft, ...prev])
        setUploadForm({ title: "", price: "", description: "", files: [] })
        alert("Craft uploaded successfully and shared to community!")
        
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) {
          fileInput.value = ""
        }

        // Refresh posts to show the new post
        try {
          const postsRes = await fetch("/api/community/posts")
          const postsData = await postsRes.json()
          const userPosts = postsData.posts?.filter((post: any) => 
            post.author?.name === user?.name || 
            post.author?.name === `${user?.firstName} ${user?.lastName}`
          ) || []
          setUserPosts(userPosts)
          
          // Switch to My Posts tab to show the new post
          setActiveTab("myposts")
        } catch (error) {
          console.error("Failed to refresh posts:", error)
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert(`Failed to upload craft: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!uploadForm.title) {
      alert("Please enter a craft title first")
      return
    }

    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          craftName: uploadForm.title,
          category: "handmade",
          materials: "traditional materials",
          techniques: "handcrafted techniques",
          culturalBackground: user?.profile?.location || "India",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setUploadForm((prev) => ({ ...prev, description: result.data.description }))
          alert("AI description generated successfully!")
        } else {
          throw new Error("Invalid response format")
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate description")
      }
    } catch (error) {
      console.error("AI description generation failed:", error)
      alert(`Failed to generate AI description: ${error instanceof Error ? error.message : "Please try again."}`)
    }
  }

  const handleMintNFT = async (craftId: string, craftTitle: string, craftDescription: string, craftPrice: string) => {
    setMintingNFT(craftId)
    
    try {
      const response = await fetch("/api/nft/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          craftId: craftId,
          craftTitle: craftTitle,
          craftDescription: craftDescription,
          craftImage: "https://via.placeholder.com/400x400?text=Craft+Image", // Placeholder image
          price: craftPrice,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`NFT minted successfully! Token ID: ${result.nft.tokenId}\nView on Etherscan: ${result.explorerUrl}`)
        
        // Update the craft to show it's been minted
        setUserCreations((prev) => 
          prev.map((creation) => 
            creation.id === craftId 
              ? { ...creation, canMintNFT: false, nftTokenId: result.nft.tokenId }
              : creation
          )
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to mint NFT")
      }
    } catch (error) {
      console.error("NFT minting failed:", error)
      alert(`Failed to mint NFT: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setMintingNFT(null)
    }
  }

  const handleMintNFTFromUpload = async () => {
    setMintingUploadNFT(true);
    setMintResult(null);
    const hashtags = extractHashtags(uploadForm.description);
    if (hashtags.length === 0) {
      setMintResult('No hashtags found to mint.');
      setMintingUploadNFT(false);
      return;
    }
    try {
      const response = await fetch("/api/nft/mint-hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashtags }),
      });

      if (response.ok) {
        const result = await response.json();
        setMintResult(`Minted NFTs for hashtags: ${hashtags.join(', ')}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to mint NFTs");
      }
    } catch (error) {
      console.error("NFT minting failed:", error);
      setMintResult(`Failed to mint NFTs: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setMintingUploadNFT(false);
    }
  };

  const extractHashtags = (text: string) => {
    return (text.match(/#\w+/g) || []).map(tag => tag.replace('#', ''));
  };

  const marketTrends = [
    { category: "Traditional Art", trend: "+23%", demand: "High", color: "text-green-600" },
    { category: "Sustainable Crafts", trend: "+18%", demand: "Growing", color: "text-blue-600" },
    { category: "Home Decor", trend: "+12%", demand: "Stable", color: "text-yellow-600" },
    { category: "Jewelry", trend: "+8%", demand: "Moderate", color: "text-orange-600" },
  ]

  const aiRecommendations = [
    {
      type: "pricing",
      title: "Optimize Your Pricing",
      description: "Based on market analysis, consider adjusting prices for better competitiveness",
      action: "Adjust Price",
      priority: "high",
    },
    {
      type: "marketing",
      title: "Seasonal Marketing Opportunity",
      description: "Festival season approaching - promote traditional crafts with special collections",
      action: "Create Campaign",
      priority: "medium",
    },
    {
      type: "content",
      title: "Enhance Product Stories",
      description: "Add cultural heritage stories to increase engagement by 40%",
      action: "Add Stories",
      priority: "high",
    },
    {
      type: "audience",
      title: "New Audience Segment",
      description: "International buyers showing increased interest in handmade crafts",
      action: "Target Globally",
      priority: "medium",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">ArtisanConnect</span>
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Dashboard
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <Button variant="outline" asChild>
                <Link href="/explore">Explore Crafts</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/explore">Community Posts</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI-Powered Dashboard - ArtisanConnect - AI-Powered Marketplace for Handmade Crafts
          </h1>
          <p className="text-muted-foreground text-lg">
            Get AI-driven insights to grow your craft business, optimize pricing, and reach the right audience.
          </p>
        </div>

        {/* AI Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Performance Score</p>
                  <p className="text-2xl font-bold text-primary">{Math.round(dashboardStats.performanceScore)}%</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Progress value={dashboardStats.performanceScore} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalViews.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">Real-time data</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Revenue</p>
                  <p className="text-2xl font-bold">{dashboardStats.revenue}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Based on views</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="text-2xl font-bold">{dashboardStats.engagement.toFixed(1)}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">Above average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="stories">Story Generator</TabsTrigger>
            <TabsTrigger value="myposts">My Posts</TabsTrigger>
            <TabsTrigger value="upload">Upload Craft</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRecommendations.slice(0, 4).map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant={rec.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <Button size="sm" variant="outline">
                        {rec.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Creations with Real Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Creations ({userCreations.length})</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Real-time data</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userCreations.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No creations yet. Upload your first craft to get started!
                    </p>
                    <Button onClick={() => setActiveTab("upload")}>
                      Upload Your First Craft
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCreations.map((creation) => (
                      <Card key={creation.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Image Placeholder */}
                            <div className="w-24 h-24 bg-gradient-to-br from-secondary to-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-muted-foreground text-center px-2">{creation.title}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{creation.title}</h3>
                                  <p className="text-2xl font-bold text-primary">{creation.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    AI Score: {creation.aiScore}%
                                  </Badge>
                                  <Badge
                                    variant={creation.status === "Active" ? "default" : "secondary"}
                                    className={
                                      creation.status === "Active" ? "bg-primary" : "bg-accent text-accent-foreground"
                                    }
                                  >
                                    {creation.status}
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                <Sparkles className="h-3 w-3 inline mr-1" />
                                {creation.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {creation.tags?.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{creation.views}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{creation.likes}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{creation.comments}</span>
                                  </div>
                                </div>
                                {creation.canMintNFT ? (
                                  <Button 
                                    size="sm" 
                                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                    onClick={() => handleMintNFT(creation.id, creation.title, creation.description, creation.price)}
                                    disabled={mintingNFT === creation.id}
                                  >
                                    {mintingNFT === creation.id ? (
                                      <>
                                        <Sparkles className="h-4 w-4 mr-1 animate-spin" />
                                        Minting...
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="h-4 w-4 mr-1" />
                                        Mint NFT
                                      </>
                                    )}
                                  </Button>
                                ) : creation.nftTokenId ? (
                                  <Button size="sm" variant="outline" disabled>
                                    <Sparkles className="h-4 w-4 mr-1" />
                                    NFT Minted
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detailed AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {rec.priority === "high" ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <Button size="sm" variant="outline">
                          {rec.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Listing Quality</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Alignment</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Audience Engagement</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pricing Optimization</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{trend.category}</h4>
                          <p className="text-sm text-muted-foreground">Demand: {trend.demand}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${trend.color}`}>{trend.trend}</p>
                          <p className="text-xs text-muted-foreground">vs last month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audience Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Audience Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h4 className="font-medium mb-2">Top Buyer Demographics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Age 25-35</span>
                        <span className="font-medium">42%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Urban Areas</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>International</span>
                        <span className="font-medium">23%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-medium mb-2">Seasonal Opportunities</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Festival Season: +45% demand</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Wedding Season: +30% for jewelry</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <StoryGenerator />
          </TabsContent>

          <TabsContent value="myposts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Posts ({userPosts.length})</span>
                  <Button asChild>
                    <Link href="/explore">View All Posts</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No posts yet. Upload a craft to create your first post!
                    </p>
                    <Button onClick={() => setActiveTab("upload")}>
                      Upload Your First Craft
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{post.craft?.title || "Craft Post"}</h3>
                                  <p className="text-2xl font-bold text-primary">{post.craft?.price || "₹0"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {post.category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {post.timeAgo}
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {post.content}
                              </p>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.hashtags?.map((hashtag: string) => (
                                  <Badge key={hashtag} variant="secondary" className="text-xs">
                                    {hashtag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.views || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{post.likes || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{post.comments || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Share2 className="h-4 w-4" />
                                    <span>{post.shares || 0}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href="/explore">View Post</Link>
                                  </Button>
                                  {post.craft && (
                                    <Button 
                                      size="sm" 
                                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                      onClick={() => handleMintNFT(post.craft.id, post.craft.title, post.content, post.craft.price)}
                                      disabled={mintingNFT === post.craft.id}
                                    >
                                      {mintingNFT === post.craft.id ? (
                                        <>
                                          <Sparkles className="h-4 w-4 mr-1 animate-spin" />
                                          Minting...
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="h-4 w-4 mr-1" />
                                          Mint NFT
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload New Craft
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Drop your photos here or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        ref={(input) => {
                          if (input) {
                            // Store reference for programmatic access
                            (window as any).fileInputRef = input;
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer"
                        onClick={() => {
                          const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.click();
                          }
                        }}
                      >
                        Choose Files
                      </Button>
                      {uploadForm.files.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">{uploadForm.files.length} file(s) selected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Craft Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Craft Title *</label>
                    <Input
                      placeholder="Enter your craft title..."
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price *</label>
                    <Input
                      placeholder="₹0.00"
                      value={uploadForm.price}
                      onChange={(e) => setUploadForm((prev) => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description *</label>
                    <Textarea
                      placeholder="Describe your craft..."
                      rows={3}
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                {/* AI Actions */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleGenerateDescription}
                    disabled={!uploadForm.title}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Description
                  </Button>
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleUploadCraft}
                    disabled={uploadLoading || !uploadForm.title || !uploadForm.price || !uploadForm.description}
                  >
                    {uploadLoading ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Craft
                      </>
                    )}
                  </Button>
                  <Button
                    className="w-full bg-green-500 hover:bg-green-700 text-white"
                    onClick={handleMintNFTFromUpload}
                    disabled={mintingUploadNFT || !uploadForm.description}
                  >
                    {mintingUploadNFT ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Minting NFTs...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Mint NFT from Hashtags
                      </>
                    )}
                  </Button>
                  {mintResult && (
                    <div style={{ marginTop: 8, color: mintResult.includes('fail') ? 'red' : 'green' }}>
                      {mintResult}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
