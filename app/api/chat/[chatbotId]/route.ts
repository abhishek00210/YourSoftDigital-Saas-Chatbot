import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AIEngine } from "@/lib/utils/ai-engine"

export async function POST(request: NextRequest, { params }: { params: Promise<{ chatbotId: string }> }) {
  try {
    const { chatbotId } = await params
    const { message, conversationId, visitorId } = await request.json()

    if (!message || !visitorId) {
      return NextResponse.json({ error: "Message and visitor ID are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get chatbot with business info
    const { data: chatbot, error: chatbotError } = await supabase
      .from("chatbots")
      .select(`
        *,
        businesses!inner(
          name,
          description,
          website_url,
          user_id
        )
      `)
      .eq("id", chatbotId)
      .eq("is_active", true)
      .single()

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: "Chatbot not found or inactive" }, { status: 404 })
    }

    // Get products for this business
    const { data: products = [] } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", chatbot.business_id)
      .eq("in_stock", true)
      .limit(50)

    // Get or create conversation
    let conversation
    if (conversationId) {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("chatbot_id", chatbotId)
        .single()
      conversation = existingConv
    }

    if (!conversation) {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          chatbot_id: chatbotId,
          visitor_id: visitorId,
          status: "active",
        })
        .select()
        .single()

      if (convError) {
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
      }
      conversation = newConv

      // Log conversation started event
      await supabase.from("analytics").insert({
        chatbot_id: chatbotId,
        event_type: "conversation_started",
        visitor_id: visitorId,
        event_data: { conversation_id: conversation.id },
      })
    }

    // Save user message
    const { error: userMessageError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      content: message,
      sender_type: "user",
    })

    if (userMessageError) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Get conversation history
    const { data: messageHistory = [] } = await supabase
      .from("messages")
      .select("content, sender_type")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true })
      .limit(20)

    const conversationHistory = messageHistory.map((msg) => ({
      role: msg.sender_type === "user" ? ("user" as const) : ("assistant" as const),
      content: msg.content,
    }))

    // Generate AI response
    const aiEngine = AIEngine.getInstance()
    const context = {
      chatbot,
      products,
      conversationHistory: conversationHistory.slice(0, -1), // Exclude current message
      businessInfo: {
        name: chatbot.businesses.name,
        description: chatbot.businesses.description,
        website_url: chatbot.businesses.website_url,
      },
    }

    const aiResponse = await aiEngine.generateResponse(message, context)

    // Analyze intent and find relevant products
    const [intent, relevantProducts] = await Promise.all([
      aiEngine.analyzeIntent(message),
      aiEngine.findRelevantProducts(message, products, 3),
    ])

    // Save AI response
    const { error: aiMessageError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      content: aiResponse,
      sender_type: "bot",
      metadata: {
        intent: intent.intent,
        confidence: intent.confidence,
        relevant_products: relevantProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
        })),
      },
    })

    if (aiMessageError) {
      console.error("Failed to save AI message:", aiMessageError)
    }

    // Log analytics
    await supabase.from("analytics").insert({
      chatbot_id: chatbotId,
      event_type: "message_sent",
      visitor_id: visitorId,
      event_data: {
        conversation_id: conversation.id,
        intent: intent.intent,
        confidence: intent.confidence,
        products_recommended: relevantProducts.length,
      },
    })

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id,
      intent: intent.intent,
      relevantProducts: relevantProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0],
        permalink: p.permalink,
      })),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
