"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Star, Sparkles, ArrowLeft, Share2, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ExplorePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [artisans, setArtisans] = useState<any[]>([])
  const [stats, setStats] = useState({
    activeArtisans: 0,
    postsToday: 0,
    nftsMinted: 0,
    successStories: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [mintingNFT, setMintingNFT] = useState<string | null>(null)

  useEffect(() => {
    fetchCommunityData()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchQuery, selectedCategory])

  const filterPosts = () => {
    let filtered = posts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((post: any) => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.craft?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hashtags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post: any) => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setFilteredPosts(filtered)
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
          craftImage: "https://via.placeholder.com/400x400?text=Craft+Image",
          price: craftPrice,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`NFT minted successfully! Token ID: ${result.nft.tokenId}\nView on Etherscan: ${result.explorerUrl}`)
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

  const fetchCommunityData = async () => {
    try {
      const [postsRes, artisansRes, statsRes] = await Promise.all([
        fetch("/api/community/posts"),
        fetch("/api/community/artisans"),
        fetch("/api/community/stats"),
      ])

      const postsData = await postsRes.json()
      const artisansData = await artisansRes.json()
      const statsData = await statsRes.json()

      setPosts(postsData.posts || [])
      setFilteredPosts(postsData.posts || [])
      setArtisans(artisansData.artisans || [])
      setStats(
        statsData.stats || {
          activeArtisans: 0,
          postsToday: 0,
          nftsMinted: 0,
          successStories: 0,
        },
      )
    } catch (error) {
      console.error("Failed to fetch community data:", error)
    }
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
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/login?redirect=/dashboard">Start Creating</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Connect with <span className="text-primary">Fellow Artisans</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your journey, learn from masters, and build lasting relationships in our supportive artisan community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Community Feed</h2>
              <Button variant="outline" className="gap-2 bg-transparent">
                <MessageCircle className="h-4 w-4" />
                Join Discussion
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts, artisans, crafts, or hashtags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === "handmade" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("handmade")}
                >
                  Handmade
                </Button>
                <Button
                  variant={selectedCategory === "pottery" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("pottery")}
                >
                  Pottery
                </Button>
                <Button
                  variant={selectedCategory === "textiles" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("textiles")}
                >
                  Textiles
                </Button>
                <Button
                  variant={selectedCategory === "jewelry" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("jewelry")}
                >
                  Jewelry
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {post.author?.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{post.author?.name}</h3>
                            {post.author?.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.author?.location}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                        {post.category && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {post.category}
                          </Badge>
                        )}
                      </div>

                      {/* Post Content */}
                      <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                      {/* Hashtags */}
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.hashtags.map((hashtag: string) => (
                            <Badge key={hashtag} variant="secondary" className="text-xs">
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Craft Image */}
                      <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {post.craft?.mainImage ? (
                          <img 
                            src={post.craft.mainImage} 
                            alt={post.craft.title || "Craft"}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <span className="text-muted-foreground">Craft Image</span>
                        )}
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-6">
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes || 0}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments || 0}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                            <Share2 className="h-4 w-4" />
                            <span>{post.shares || 0}</span>
                          </Button>
                        </div>
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {searchQuery || selectedCategory !== "all" 
                        ? "No posts match your search criteria. Try different keywords or categories."
                        : "No posts available. Be the first to share your craft journey!"
                      }
                    </p>
                    {(searchQuery || selectedCategory !== "all") && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Artisans */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Featured Artisans</h3>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    View All Artisans
                  </Button>
                </div>

                <div className="space-y-4">
                  {artisans.length > 0 ? (
                    artisans.slice(0, 3).map((artisan) => (
                      <div key={artisan.id} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {artisan.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{artisan.name}</h4>
                          <p className="text-sm text-muted-foreground">{artisan.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              <span className="text-xs font-medium">{artisan.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{artisan.orders} orders</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No featured artisans yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Artisans</span>
                    <span className="font-semibold text-foreground">{stats.activeArtisans.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Posts Today</span>
                    <span className="font-semibold text-foreground">{stats.postsToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">NFTs Minted</span>
                    <span className="font-semibold text-foreground">{stats.nftsMinted.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Success Stories</span>
                    <span className="font-semibold text-foreground">{stats.successStories.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
