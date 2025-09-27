import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/utils/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageSquare, User, Clock } from "lucide-react"
import Link from "next/link"

interface ConversationsPageProps {
  params: Promise<{ businessId: string; chatbotId: string }>
}

export default async function ConversationsPage({ params }: ConversationsPageProps) {
  const { businessId, chatbotId } = await params
  const supabase = await createClient()

  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get chatbot with business info
  const { data: chatbot, error } = await supabase
    .from("chatbots")
    .select(`
      *,
      businesses!inner(
        name,
        user_id
      )
    `)
    .eq("id", chatbotId)
    .eq("business_id", businessId)
    .eq("businesses.user_id", user.id)
    .single()

  if (error || !chatbot) {
    redirect("/dashboard")
  }

  // Get conversations with message counts and latest message
  const { data: conversations = [] } = await supabase
    .from("conversations")
    .select(`
      *,
      messages!inner(
        id,
        content,
        sender_type,
        created_at
      )
    `)
    .eq("chatbot_id", chatbotId)
    .order("updated_at", { ascending: false })

  // Process conversations to get message counts and latest messages
  const processedConversations = conversations.reduce((acc: any[], conv) => {
    const existingConv = acc.find((c) => c.id === conv.id)
    if (existingConv) {
      existingConv.message_count++
      if (new Date(conv.messages.created_at) > new Date(existingConv.latest_message.created_at)) {
        existingConv.latest_message = conv.messages
      }
    } else {
      acc.push({
        ...conv,
        message_count: 1,
        latest_message: conv.messages,
      })
    }
    return acc
  }, [])

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chatbot
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold">Conversations</h1>
                <p className="text-sm text-gray-600">{chatbot.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processedConversations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {processedConversations.filter((c) => c.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {processedConversations.reduce((sum, c) => sum + c.message_count, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations List */}
        {processedConversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Once visitors start chatting with your bot, their conversations will appear here.
              </p>
              <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/test`}>
                <Button>Test Your Chatbot</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {processedConversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {conversation.visitor_name || `Visitor ${conversation.visitor_id.slice(-6)}`}
                          </h3>
                          <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                            {conversation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {conversation.visitor_email || "No email provided"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {conversation.message_count} messages
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(conversation.latest_message.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-2">Latest message:</p>
                      <p className="text-sm font-medium max-w-xs truncate">
                        {conversation.latest_message.sender_type === "user" ? "👤 " : "🤖 "}
                        {conversation.latest_message.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
