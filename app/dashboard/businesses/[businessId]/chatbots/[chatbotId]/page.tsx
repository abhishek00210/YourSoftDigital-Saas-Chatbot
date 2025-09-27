import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/utils/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Settings, MessageSquare, BarChart3, Code, Eye } from "lucide-react"
import Link from "next/link"

interface ChatbotPageProps {
  params: Promise<{ businessId: string; chatbotId: string }>
}

export default async function ChatbotPage({ params }: ChatbotPageProps) {
  const { businessId, chatbotId } = await params
  const supabase = await createClient()

  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get chatbot details with business info
  const { data: chatbot, error } = await supabase
    .from("chatbots")
    .select(`
      *,
      businesses!inner(
        id,
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

  // Get conversation stats
  const { data: conversations } = await supabase.from("conversations").select("id").eq("chatbot_id", chatbotId)

  const conversationIds = conversations?.map((conv) => conv.id) || []

  // Now count messages using the conversation IDs array
  const { count: totalMessages } = await supabase
    .from("messages")
    .select("conversation_id", { count: "exact", head: true })
    .in("conversation_id", conversationIds)

  const { count: activeConversations } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("chatbot_id", chatbotId)
    .eq("status", "active")

  const { count: totalConversations } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("chatbot_id", chatbotId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/businesses/${businessId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {chatbot.businesses.name}
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: chatbot.widget_color }}
                >
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{chatbot.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant={chatbot.is_active ? "default" : "secondary"}>
                      {chatbot.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-gray-600">Position: {chatbot.widget_position}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/test`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Test Chat
                </Button>
              </Link>
              <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/settings`}>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversations || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeConversations || 0}</div>
              <p className="text-xs text-muted-foreground">Currently ongoing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground">Messages exchanged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={chatbot.is_active ? "default" : "secondary"} className="text-sm">
                  {chatbot.is_active ? "Live" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Current status</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chatbot Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Current chatbot settings and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Welcome Message</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{chatbot.welcome_message}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Fallback Message</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{chatbot.fallback_message}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{chatbot.description || "No description provided"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for managing your chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/test`}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Test Chatbot
                    </Button>
                  </Link>
                  <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/conversations`}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Conversations
                    </Button>
                  </Link>
                  <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/analytics`}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/embed`}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Code className="h-4 w-4 mr-2" />
                      Get Embed Code
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Widget Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Preview</CardTitle>
                <CardDescription>How your chatbot appears on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-100 rounded-lg p-4 min-h-[400px]">
                  {/* Mock website content */}
                  <div className="space-y-4 opacity-50">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>

                  {/* Chatbot Widget */}
                  <div
                    className={`absolute bottom-4 ${chatbot.widget_position === "bottom-right" ? "right-4" : "left-4"}`}
                  >
                    {/* Chat Button */}
                    <button
                      className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105"
                      style={{ backgroundColor: chatbot.widget_color }}
                    >
                      <Bot className="h-6 w-6" />
                    </button>

                    {/* Chat Window Preview */}
                    <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border">
                      <div className="p-4 rounded-t-lg text-white" style={{ backgroundColor: chatbot.widget_color }}>
                        <h3 className="font-medium">{chatbot.name}</h3>
                        <p className="text-sm opacity-90">Online now</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: chatbot.widget_color }}
                          >
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-2 max-w-xs">
                            <p className="text-sm">{chatbot.welcome_message}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 p-2 border rounded-lg text-sm"
                            disabled
                          />
                          <button
                            className="px-3 py-2 text-white rounded-lg text-sm"
                            style={{ backgroundColor: chatbot.widget_color }}
                            disabled
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Status</CardTitle>
                <CardDescription>Integration with your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Widget Status</h4>
                      <p className="text-sm text-gray-600">
                        {chatbot.is_active ? "Ready to deploy" : "Inactive - not visible to visitors"}
                      </p>
                    </div>
                    <Badge variant={chatbot.is_active ? "default" : "secondary"}>
                      {chatbot.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <Link href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/embed`}>
                    <Button className="w-full">
                      <Code className="h-4 w-4 mr-2" />
                      Get Embed Code
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
