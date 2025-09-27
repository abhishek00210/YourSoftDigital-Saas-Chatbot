import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { Product, Chatbot } from "@/lib/types/database"

interface ChatContext {
  chatbot: Chatbot
  products: Product[]
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
  businessInfo: {
    name: string
    description?: string
    website_url?: string
  }
}

export class AIEngine {
  private static instance: AIEngine
  private readonly model = openai("gpt-4o-mini")

  static getInstance(): AIEngine {
    if (!AIEngine.instance) {
      AIEngine.instance = new AIEngine()
    }
    return AIEngine.instance
  }

  private buildSystemPrompt(context: ChatContext): string {
    const { chatbot, products, businessInfo } = context

    const productInfo = products
      .slice(0, 20) // Limit to prevent token overflow
      .map(
        (p) =>
          `- ${p.name} (${p.sku || "No SKU"}): $${p.price || "N/A"} - ${p.short_description?.replace(/<[^>]*>/g, "") || "No description"} - ${p.in_stock ? "In Stock" : "Out of Stock"}`,
      )
      .join("\n")

    return `You are an AI customer service assistant for ${businessInfo.name}${businessInfo.description ? `, ${businessInfo.description}` : ""}.

Your role:
- Help customers find products and answer questions about them
- Provide helpful, friendly, and professional customer service
- Recommend products based on customer needs
- Answer questions about orders, shipping, returns, and general inquiries

Business Information:
- Business Name: ${businessInfo.name}
- Website: ${businessInfo.website_url || "Not provided"}
- Description: ${businessInfo.description || "Not provided"}

Available Products:
${productInfo || "No products available"}

Guidelines:
- Always be helpful, friendly, and professional
- If you don't know something, admit it and suggest contacting customer service
- When recommending products, explain why they're a good fit
- Keep responses concise but informative
- If a customer asks about something not related to the business, politely redirect them
- Use the fallback message "${chatbot.fallback_message}" when you truly don't understand

Remember: You represent ${businessInfo.name} and should maintain their brand voice and values.`
  }

  async generateResponse(userMessage: string, context: ChatContext): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context)

      // Build conversation history for context
      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...context.conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: "user" as const, content: userMessage },
      ]

      const { text } = await generateText({
        model: this.model,
        messages,
        maxTokens: 500,
        temperature: 0.7,
      })

      return text || context.chatbot.fallback_message
    } catch (error) {
      console.error("AI generation error:", error)
      return context.chatbot.fallback_message
    }
  }

  async findRelevantProducts(query: string, products: Product[], limit = 5): Promise<Product[]> {
    if (products.length === 0) return []

    try {
      const productDescriptions = products
        .map((p, index) => `${index}: ${p.name} - ${p.short_description?.replace(/<[^>]*>/g, "") || ""}`)
        .join("\n")

      const { text } = await generateText({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `You are a product recommendation system. Given a customer query and a list of products, return the indices of the most relevant products (up to ${limit}) as a comma-separated list of numbers. Only return numbers, no other text.`,
          },
          {
            role: "user",
            content: `Customer query: "${query}"\n\nProducts:\n${productDescriptions}\n\nReturn the indices of the most relevant products:`,
          },
        ],
        maxTokens: 50,
        temperature: 0.1,
      })

      const indices = text
        .split(",")
        .map((i) => Number.parseInt(i.trim()))
        .filter((i) => !Number.isNaN(i) && i >= 0 && i < products.length)

      return indices.map((i) => products[i]).slice(0, limit)
    } catch (error) {
      console.error("Product recommendation error:", error)
      // Fallback: return first few in-stock products
      return products.filter((p) => p.in_stock).slice(0, limit)
    }
  }

  async analyzeIntent(message: string): Promise<{
    intent: "product_inquiry" | "support" | "general" | "greeting"
    confidence: number
    entities: string[]
  }> {
    try {
      const { text } = await generateText({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `Analyze the customer message and return a JSON object with:
- intent: one of "product_inquiry", "support", "general", "greeting"
- confidence: number between 0 and 1
- entities: array of important keywords/entities mentioned

Return only valid JSON, no other text.`,
          },
          {
            role: "user",
            content: `Analyze this message: "${message}"`,
          },
        ],
        maxTokens: 100,
        temperature: 0.1,
      })

      return JSON.parse(text)
    } catch (error) {
      console.error("Intent analysis error:", error)
      return {
        intent: "general",
        confidence: 0.5,
        entities: [],
      }
    }
  }
}
