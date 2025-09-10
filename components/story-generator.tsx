"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, BookOpen, Heart, Users, Palette, Copy, RefreshCw, CheckCircle, Wand2 } from "lucide-react"
import { useState } from "react"

interface StoryForm {
  craftType: string
  craftName: string
  culturalOrigin: string
  personalStory: string
  techniques: string
  materials: string
  timeToCreate: string
  inspiration: string
  storyType: string
}

export default function StoryGenerator() {
  const [formData, setFormData] = useState<StoryForm>({
    craftType: "",
    craftName: "",
    culturalOrigin: "",
    personalStory: "",
    techniques: "",
    materials: "",
    timeToCreate: "",
    inspiration: "",
    storyType: "heritage",
  })

  const [generatedStories, setGeneratedStories] = useState<{
    heritage: string
    process: string
    personal: string
    marketing: string
  }>({
    heritage: "",
    process: "",
    personal: "",
    marketing: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedStory, setCopiedStory] = useState<string | null>(null)

  const handleInputChange = (field: keyof StoryForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateStories = async () => {
    setIsGenerating(true)

    // Simulate AI story generation
    setTimeout(() => {
      const stories = {
        heritage: `The art of ${formData.craftName} traces its roots back centuries to ${formData.culturalOrigin}, where skilled artisans passed down their knowledge through generations. This ${formData.craftType} represents more than just a craft—it embodies the cultural heritage and traditional wisdom of our ancestors.

Each piece tells a story of dedication, using time-honored techniques that have remained unchanged for generations. The intricate patterns and designs are not merely decorative; they carry deep cultural significance and represent the spiritual beliefs and daily life of the community.

When you hold this ${formData.craftName}, you're not just owning a beautiful object—you're preserving a piece of living history and supporting the continuation of an ancient art form that connects us to our cultural roots.`,

        process: `Creating this ${formData.craftName} is a meditative journey that requires patience, skill, and deep respect for traditional methods. The process begins with carefully selecting ${formData.materials}, each chosen for its quality and significance in our craft.

Using techniques passed down through generations, I spend approximately ${formData.timeToCreate} meticulously working on each piece. Every stroke, every pattern, every detail is crafted by hand using traditional tools and methods that have remained unchanged for centuries.

The inspiration for this piece comes from ${formData.inspiration}, reflecting the natural beauty and cultural richness that surrounds us. Each element is thoughtfully placed, creating a harmonious composition that speaks to both the eye and the soul.

This is not mass production—this is artisanal craftsmanship where every piece is unique, carrying the maker's personal touch and the wisdom of generations.`,

        personal: `My journey with ${formData.craftType} began ${formData.personalStory}. What started as curiosity has evolved into a deep passion for preserving and sharing this beautiful art form with the world.

Every day, I wake up inspired to create something meaningful. Working with ${formData.materials} and traditional techniques, I find peace and purpose in continuing the legacy of my ancestors. Each piece I create is infused with love, dedication, and respect for the craft.

This ${formData.craftName} represents not just my skill, but my commitment to keeping traditional arts alive in our modern world. When you choose handmade, you're supporting not just an artisan, but an entire cultural heritage that deserves to thrive.

I believe that in our fast-paced digital world, there's something profoundly meaningful about owning something created slowly, mindfully, and with human hands. This piece carries that intention and energy.`,

        marketing: `Discover the timeless beauty of authentic ${formData.craftType} from ${formData.culturalOrigin}! This stunning ${formData.craftName} is more than just decor—it's a conversation starter, a cultural bridge, and a testament to human creativity.

✨ Handcrafted using traditional techniques passed down through generations
🎨 Made with premium ${formData.materials} for lasting beauty
⏰ ${formData.timeToCreate} of dedicated craftsmanship in every piece
🌍 Supporting cultural preservation and artisan communities
💝 Perfect for those who appreciate authentic, meaningful art

In a world of mass production, choose something truly special. This piece brings the warmth of human touch and cultural richness into your space, making it not just a purchase, but an investment in preserving traditional arts.

Limited quantities available - each piece is unique and cannot be replicated exactly. Own a piece of cultural heritage today! #HandmadeWithLove #CulturalHeritage #AuthenticCrafts`,
      }

      setGeneratedStories(stories)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = async (story: string, type: string) => {
    try {
      await navigator.clipboard.writeText(story)
      setCopiedStory(type)
      setTimeout(() => setCopiedStory(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const storyTemplates = [
    {
      id: "heritage",
      title: "Cultural Heritage Story",
      description: "Emphasizes cultural significance and traditional roots",
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      id: "process",
      title: "Crafting Process Story",
      description: "Details the making process and techniques",
      icon: <Palette className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      id: "personal",
      title: "Personal Journey Story",
      description: "Shares your personal connection to the craft",
      icon: <Heart className="h-5 w-5" />,
      color: "text-red-600",
    },
    {
      id: "marketing",
      title: "Marketing Story",
      description: "Optimized for sales and social media",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Craft Story Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Transform your craft details into compelling stories that connect with your audience and preserve cultural
            heritage.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="craftType">Craft Type</Label>
                  <Select value={formData.craftType} onValueChange={(value) => handleInputChange("craftType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select craft type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="pottery">Pottery</SelectItem>
                      <SelectItem value="textile">Textile</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="woodwork">Woodwork</SelectItem>
                      <SelectItem value="metalwork">Metalwork</SelectItem>
                      <SelectItem value="sculpture">Sculpture</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="craftName">Craft Name</Label>
                  <Input
                    id="craftName"
                    placeholder="e.g., Madhubani Painting, Ceramic Vase"
                    value={formData.craftName}
                    onChange={(e) => handleInputChange("craftName", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="culturalOrigin">Cultural Origin</Label>
                  <Input
                    id="culturalOrigin"
                    placeholder="e.g., Bihar, India or Rajasthan tradition"
                    value={formData.culturalOrigin}
                    onChange={(e) => handleInputChange("culturalOrigin", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="materials">Materials Used</Label>
                  <Input
                    id="materials"
                    placeholder="e.g., Natural pigments, handmade paper, clay"
                    value={formData.materials}
                    onChange={(e) => handleInputChange("materials", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="timeToCreate">Time to Create</Label>
                  <Input
                    id="timeToCreate"
                    placeholder="e.g., 3 days, 2 weeks, 1 month"
                    value={formData.timeToCreate}
                    onChange={(e) => handleInputChange("timeToCreate", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="techniques">Techniques Used</Label>
                  <Textarea
                    id="techniques"
                    placeholder="Describe the traditional techniques and methods used..."
                    value={formData.techniques}
                    onChange={(e) => handleInputChange("techniques", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="inspiration">Inspiration</Label>
                  <Textarea
                    id="inspiration"
                    placeholder="What inspired this piece? Nature, tradition, personal experience..."
                    value={formData.inspiration}
                    onChange={(e) => handleInputChange("inspiration", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="personalStory">Your Personal Story (Optional)</Label>
                  <Textarea
                    id="personalStory"
                    placeholder="Share how you learned this craft, family traditions, etc..."
                    value={formData.personalStory}
                    onChange={(e) => handleInputChange("personalStory", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={generateStories}
                disabled={isGenerating || !formData.craftName || !formData.craftType}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Stories...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Stories
                  </>
                )}
              </Button>
            </div>

            {/* Generated Stories */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {storyTemplates.map((template) => (
                  <Card key={template.id} className="p-3 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={template.color}>{template.icon}</div>
                      <h4 className="font-medium text-sm">{template.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </Card>
                ))}
              </div>

              {Object.keys(generatedStories).some((key) => generatedStories[key as keyof typeof generatedStories]) && (
                <Tabs defaultValue="heritage" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="heritage" className="text-xs">
                      Heritage
                    </TabsTrigger>
                    <TabsTrigger value="process" className="text-xs">
                      Process
                    </TabsTrigger>
                    <TabsTrigger value="personal" className="text-xs">
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="marketing" className="text-xs">
                      Marketing
                    </TabsTrigger>
                  </TabsList>

                  {Object.entries(generatedStories).map(([type, story]) => (
                    <TabsContent key={type} value={type}>
                      {story && (
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {storyTemplates.find((t) => t.id === type)?.title}
                              </CardTitle>
                              <Button variant="outline" size="sm" onClick={() => copyToClipboard(story, type)}>
                                {copiedStory === type ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="prose prose-sm max-w-none">
                              <p className="text-sm leading-relaxed whitespace-pre-line">{story}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}

              {!Object.keys(generatedStories).some((key) => generatedStories[key as keyof typeof generatedStories]) && (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Ready to Generate Stories</h3>
                      <p className="text-sm text-muted-foreground">
                        Fill in the craft details and click "Generate AI Stories" to create compelling narratives for
                        your craft.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
