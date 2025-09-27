import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/utils/database"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowLeft,
  BarChart3,
  MessageSquare,
  Users,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface AnalyticsPageProps {
  params: Promise<{ businessId: string; chatbotId: string }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { businessId, chatbotId } = await params
  const supabase = await createClient()

  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get chatbot with business info
  const { data: chatbot, error } = await supabase
    .from("chatbots")
    .select(
      `
      *,
      businesses!inner(
        name,
        user_id
      )
    `
    )
    .eq("id", chatbotId)
    .eq("business_id", businessId)
    .eq("businesses.user_id", user.id)
    .single()

  if (error || !chatbot) {
    redirect("/dashboard")
  }

  // Get analytics data
  const [conversationsResult, messagesResult, analyticsResult] =
    await Promise.all([
      supabase.from("conversations").select("*").eq("chatbot_id", chatbotId),
      supabase
        .from("messages")
        .select("*, conversations!inner(chatbot_id)")
        .eq("conversations.chatbot_id", chatbotId),
      supabase.from("analytics").select("*").eq("chatbot_id", chatbotId),
    ])

  const conversations = conversationsResult.data || []
  const messages = messagesResult.data || []
  const analytics = analyticsResult.data || []

  // Calculate metrics
  const totalConversations = conversations.length
  const activeConversations = conversations.filter(
    (c) => c.status === "active"
  ).length
  const totalMessages = messages.length
  const userMessages = messages.filter(
    (m) => m.sender_type === "user"
  ).length
  const botMessages = messages.filter((m) => m.sender_type === "bot").length

  const conversationStarts = analytics.filter(
    (a) => a.event_type === "conversation_started"
  ).length
  const messagesSent = analytics.filter(
    (a) => a.event_type === "message_sent"
  ).length

  // Calculate average messages per conversation
  const avgMessagesPerConv =
    totalConversations > 0
      ? (totalMessages / totalConversations).toFixed(1)
      : "0"

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentConversations = conversations.filter(
    (c) => new Date(c.created_at) >= sevenDaysAgo
  ).length

  const recentMessages = messages.filter(
    (m) => new Date(m.created_at) >= sevenDaysAgo
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}`}
            >
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chatbot
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-red-600" />
              <div>
                <h1 className="text-xl font-semibold">Analytics</h1>
                <p className="text-sm text-gray-600">{chatbot.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                {recentConversations} in the last 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeConversations}</div>
              <p className="text-xs text-muted-foreground">
                Currently ongoing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {recentMessages} in the last 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Messages/Chat
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgMessagesPerConv}</div>
              <p className="text-xs text-muted-foreground">
                Per conversation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Message Breakdown</CardTitle>
              <CardDescription>
                Distribution of messages by sender
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Messages</span>
                  <span className="text-sm text-gray-600">{userMessages}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width:
                        totalMessages > 0
                          ? `${(userMessages / totalMessages) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bot Messages</span>
                  <span className="text-sm text-gray-600">{botMessages}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width:
                        totalMessages > 0
                          ? `${(botMessages / totalMessages) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation Status</CardTitle>
              <CardDescription>
                Current status of all conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active</span>
                  <span className="text-sm text-gray-600">
                    {activeConversations}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width:
                        totalConversations > 0
                          ? `${
                              (activeConversations / totalConversations) * 100
                            }%`
                          : "0%",
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm text-gray-600">
                    {totalConversations - activeConversations}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-600 h-2 rounded-full"
                    style={{
                      width:
                        totalConversations > 0
                          ? `${
                              ((totalConversations - activeConversations) /
                                totalConversations) *
                              100
                            }%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Data State */}
        {totalConversations === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Analytics Data Yet
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Once visitors start using your chatbot, you'll see detailed
                analytics and insights here.
              </p>
              <div className="flex gap-4">
                <Link
                  href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/test`}
                >
                  <Button variant="outline">Test Chatbot</Button>
                </Link>
                <Link
                  href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/embed`}
                >
                  <Button>Get Embed Code</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}