import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string; chatbotId: string }> },
) {
  try {
    const { businessId, chatbotId } = await params
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify chatbot ownership
    const { data: chatbot, error: chatbotError } = await supabase
      .from("chatbots")
      .select(`
        id,
        businesses!inner(
          user_id
        )
      `)
      .eq("id", chatbotId)
      .eq("business_id", businessId)
      .eq("businesses.user_id", user.id)
      .single()

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    // Get conversations with message counts
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        messages(count)
      `)
      .eq("chatbot_id", chatbotId)
      .order("updated_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
