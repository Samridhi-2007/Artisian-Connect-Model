import { type NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, callGeminiAI } from "@/lib/ai-config"

export async function POST(request: NextRequest) {
  try {
    const { craftName, category, materials, techniques, culturalBackground } = await request.json()

    if (!AI_CONFIG.API_KEY) {
      return NextResponse.json(
        {
          error: "AI service not configured. Please add your AI API key to environment variables.",
        },
        { status: 503 },
      )
    }

    const prompt = `Generate a compelling product description for a handmade craft with the following details:
    
    Craft Name: ${craftName}
    Category: ${category}
    Materials: ${materials}
    Techniques: ${techniques}
    Cultural Background: ${culturalBackground}
    
    Create a description that:
    - Highlights the cultural significance and traditional techniques
    - Appeals to modern consumers while respecting heritage
    - Emphasizes the handmade quality and uniqueness
    - Is between 100-200 words
    
    IMPORTANT: Return ONLY the description text, no JSON formatting, no quotes, no additional text. Just the pure description paragraph.`

    // Call Gemini AI API
    const aiResponse = await callGeminiAI(prompt)
    
    // Clean up the AI response to get just the description text
    let description = aiResponse || `This exquisite ${craftName} represents centuries of ${culturalBackground} artisanal tradition. Handcrafted using authentic ${techniques} techniques with premium ${materials}, each piece tells a unique story of cultural heritage.`
    
    // Remove any unwanted formatting or extra text
    description = description
      .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
      .replace(/^description:\s*/gi, '') // Remove "description:" prefix if present
      .replace(/^json:\s*/gi, '') // Remove "json:" prefix if present
      .trim()
    
    // If the response still contains JSON-like structure, extract just the text
    if (description.includes('{') || description.includes('"description"')) {
      const textMatch = description.match(/"description":\s*"([^"]+)"/);
      if (textMatch) {
        description = textMatch[1];
      } else {
        // Fallback: remove all JSON formatting
        description = description.replace(/[{}[\]"]/g, '').replace(/description:\s*/gi, '').trim();
      }
    }
    
    const structuredResponse = {
      description: description,
      keywords: [
        craftName.toLowerCase(),
        category.toLowerCase(),
        "handmade",
        "traditional",
        "artisan",
        "cultural heritage",
        materials.toLowerCase(),
      ],
      culturalStory: `The art of creating ${craftName} has been passed down through generations in ${culturalBackground} communities. These traditional ${techniques} techniques represent not just craftsmanship, but a living connection to ancestral wisdom and cultural identity.`,
    }

    return NextResponse.json({
      success: true,
      data: structuredResponse,
    })
  } catch (error) {
    console.error("AI description generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate description",
      },
      { status: 500 },
    )
  }
}
