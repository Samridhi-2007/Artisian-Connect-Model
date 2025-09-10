import { type NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, callGeminiAI } from "@/lib/ai-config"

export async function POST(request: NextRequest) {
  try {
    const { storyType, craftDetails, artisanBackground, targetAudience } = await request.json()

    if (!AI_CONFIG.API_KEY) {
      return NextResponse.json(
        {
          error: "AI service not configured. Please add your AI API key to environment variables.",
        },
        { status: 503 },
      )
    }

    const prompts = {
      heritage: `Create a compelling cultural heritage story about ${craftDetails.name} that connects traditional ${craftDetails.techniques} with modern appreciation. Focus on the historical significance and cultural preservation.`,
      process: `Write an engaging behind-the-scenes story about creating ${craftDetails.name}, detailing the ${craftDetails.techniques} process, materials used, and the artisan's expertise.`,
      journey: `Craft a personal journey story about the artisan who creates ${craftDetails.name}, including their background: ${artisanBackground}, and their passion for preserving traditional crafts.`,
      marketing: `Generate marketing-focused content for ${craftDetails.name} that appeals to ${targetAudience}, emphasizing uniqueness, quality, and cultural value while driving purchase intent.`,
    }

    // Call Gemini AI API
    const aiStory = await callGeminiAI(prompts[storyType] || prompts.heritage)
    
    // Fallback stories in case AI fails
    const fallbackStories = {
      heritage: `The ancient art of ${craftDetails.name} creation traces back over ${Math.floor(Math.random() * 500) + 200} years in ${artisanBackground}. This traditional craft represents more than mere decoration—it embodies the spiritual and cultural essence of generations past. Each piece carries forward the wisdom of master artisans who perfected these ${craftDetails.techniques} techniques through decades of dedicated practice. Today, this heritage craft serves as a bridge between our ancestral roots and contemporary appreciation for authentic, handmade artistry.`,

      process: `Creating a ${craftDetails.name} is a meditative journey that begins before dawn. The artisan carefully selects premium materials, each chosen for its unique properties and cultural significance. Using time-honored ${craftDetails.techniques} techniques, every step requires patience and precision. From the initial preparation to the final finishing touches, the process can take anywhere from several days to weeks. The result is not just a craft item, but a testament to human creativity and the beauty that emerges when tradition meets individual artistic expression.`,

      journey: `Growing up in ${artisanBackground}, the artisan discovered their calling through family traditions passed down through generations. What began as childhood fascination with ${craftDetails.techniques} evolved into a lifelong dedication to preserving cultural heritage. Despite modern challenges, they continue to create each ${craftDetails.name} by hand, believing that authentic craftsmanship cannot be replicated by machines. Their workshop has become a sanctuary where ancient wisdom meets contemporary innovation, ensuring these precious traditions survive for future generations.`,

      marketing: `Discover the extraordinary ${craftDetails.name}—where centuries-old ${craftDetails.techniques} meet contemporary elegance. Perfect for discerning ${targetAudience} who appreciate authentic craftsmanship and cultural heritage. Each piece is individually handcrafted, ensuring you own something truly unique that cannot be found in mass-produced items. This isn't just a purchase; it's an investment in preserving traditional arts while adding meaningful beauty to your space. Experience the difference that genuine artisanal quality makes.`,
    }

    const finalStory = aiStory || fallbackStories[storyType] || fallbackStories.heritage

    return NextResponse.json({
      success: true,
      story: finalStory,
      metadata: {
        wordCount: finalStory.split(" ").length,
        tone: storyType === "marketing" ? "persuasive" : "narrative",
        targetAudience: targetAudience,
        generatedBy: aiStory ? "Gemini AI" : "Fallback",
      },
    })
  } catch (error) {
    console.error("AI story generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate story",
      },
      { status: 500 },
    )
  }
}
