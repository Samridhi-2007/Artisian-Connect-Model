"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Heart, MessageCircle, Share2, Star, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface FeaturedCraft {
  id: string
  title: string
  author: {
    name: string
    avatar: string
    specialty: string
  }
  likes: number
  comments: number
  shares: number
  rating: string
  category: string
  timeAgo: string
}

interface Discussion {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  timeAgo: string
  category: string
}

interface Stats {
  activeArtisans: number
  postsToday: number
  nftsMinted: number
  successStories: number
}

export default function HomePage() {
  const [featuredCrafts, setFeaturedCrafts] = useState<FeaturedCraft[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [stats, setStats] = useState<Stats>({ activeArtisans: 0, postsToday: 0, nftsMinted: 0, successStories: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [craftsRes, discussionsRes, statsRes] = await Promise.all([
          fetch("/api/community/featured-crafts"),
          fetch("/api/community/discussions"),
          fetch("/api/community/stats"),
        ])

        const craftsData = await craftsRes.json()
        const discussionsData = await discussionsRes.json()
        const statsData = await statsRes.json()

        setFeaturedCrafts(craftsData.crafts || [])
        setDiscussions(discussionsData.discussions || [])
        setStats(statsData.stats || { activeArtisans: 0, postsToday: 0, nftsMinted: 0, successStories: 0 })
      } catch (error) {
        console.error("Failed to fetch homepage data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">ArtisanConnect</span>
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Marketplace
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search handmade crafts..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/login?redirect=dashboard">Start Creating</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Empower Your <span className="text-primary">Artisan</span> Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Connect with a vibrant community of artisans and art lovers. Create, showcase, and sell your handmade crafts
            with AI-powered tools that help you reach the perfect audience.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/login?redirect=dashboard">Start Creating</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/login?redirect=explore">Explore Crafts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">
                {loading ? "..." : `${stats.activeArtisans}+`}
              </div>
              <div className="text-muted-foreground">Active Artisans</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">{loading ? "..." : `${stats.postsToday}+`}</div>
              <div className="text-muted-foreground">Posts Today</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">{loading ? "..." : `${stats.nftsMinted}+`}</div>
              <div className="text-muted-foreground">NFTs Minted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Crafts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Handmade Crafts</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCrafts.map((craft) => (
                <Card key={craft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                    {(craft as any).mainImage ? (
                      <img 
                        src={(craft as any).mainImage} 
                        alt={craft.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient background if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-sm text-center px-4">{craft.title}</span>
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {craft.category}
                    </Badge>
                    {(craft as any).price && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        {(craft as any).price}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{craft.author.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{craft.author.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {craft.author.specialty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{craft.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{craft.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{craft.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span>{craft.shares}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{craft.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Our Creative Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow artisans, share your creations, and get inspired by the amazing handmade crafts from
              around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Community Discussions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading
                  ? [1, 2, 3].map((item) => (
                      <div key={item} className="flex gap-3 p-3 bg-muted/50 rounded-lg animate-pulse">
                        <div className="h-8 w-8 bg-muted rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    ))
                  : discussions.map((discussion) => (
                      <div key={discussion.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{discussion.author.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{discussion.author.name}</span>
                            <span className="text-xs text-muted-foreground">{discussion.timeAgo}</span>
                            <Badge variant="outline" className="text-xs">
                              {discussion.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{discussion.content}</p>
                        </div>
                      </div>
                    ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI-Powered Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-medium mb-2">Smart Recommendations</h4>
                  <p className="text-sm text-muted-foreground">
                    Get personalized craft suggestions based on your interests
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-medium mb-2">Auto-Generated Descriptions</h4>
                  <p className="text-sm text-muted-foreground">AI helps create compelling product descriptions</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-medium mb-2">NFT Integration</h4>
                  <p className="text-sm text-muted-foreground">Mint your crafts as NFTs with one click</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ArtisanConnect</span>
          </div>
          <p className="text-muted-foreground mb-4">Empowering artisans with AI-powered marketplace solutions</p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Help
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
