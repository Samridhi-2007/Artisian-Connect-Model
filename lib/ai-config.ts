export const AI_CONFIG = {
  // Gemini API key
  API_KEY: "AIzaSyAYJzLZ-wM7mCSg-KuD4__HFV8XU0zgB4k",

  // Gemini API endpoint
  GEMINI_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",

  // API endpoints
  ENDPOINTS: {
    GENERATE_DESCRIPTION: "/api/ai/generate-description",
    GENERATE_STORY: "/api/ai/generate-story",
    ANALYZE_TRENDS: "/api/ai/analyze-trends",
    OPTIMIZE_CONTENT: "/api/ai/optimize-content",
  },

  // Model configurations
  MODELS: {
    TEXT_GENERATION: "gemini-2.0-flash",
    CONTENT_ANALYSIS: "gemini-2.0-flash",
    IMAGE_ANALYSIS: "gemini-2.0-flash",
  },

  // Request settings
  SETTINGS: {
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7,
    TOP_P: 1.0,
  },
}

// Helper function to check if AI is configured
export const isAIConfigured = (): boolean => {
  return !!AI_CONFIG.API_KEY
}

// Helper function to make Gemini AI API calls
export const callGeminiAI = async (prompt: string) => {
  if (!isAIConfigured()) {
    throw new Error("AI API key not configured")
  }

  const response = await fetch(AI_CONFIG.GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": AI_CONFIG.API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }),
  })

  if (!response.ok) {
    throw new Error("Gemini AI API call failed")
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}
