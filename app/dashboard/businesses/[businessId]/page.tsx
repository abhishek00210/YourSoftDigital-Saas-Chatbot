import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, getBusinessChatbots } from "@/lib/utils/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Plus, Settings, ExternalLink, Zap } from "lucide-react"
import Link from "next/link"

interface BusinessPageProps {
  params: Promise<{ businessId: string }>
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { businessId } = await params
  const supabase = await createClient()

  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get business details
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .eq("user_id", user.id)
    .single()

  if (error || !business) {
    redirect("/dashboard")
  }

  const chatbots = await getBusinessChatbots(business.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{business.name}</h1>
                <p className="text-sm text-gray-600">{business.description || "No description"}</p>
              </div>
            </div>
            <Link href={`/dashboard/businesses/${business.id}/settings`}>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Business Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chatbots</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chatbots.filter((bot) => bot.is_active).length}</div>
              <p className="text-xs text-muted-foreground">{chatbots.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WooCommerce</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {business.woocommerce_url ? (
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-gray-700 bg-gray-100">
                    Not Connected
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Product sync status</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Website</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {business.website_url ? (
                  <a
                    href={business.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit Site
                  </a>
                ) : (
                  <span className="text-gray-500 text-sm">Not set</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">External link</p>
            </CardContent>
          </Card>
        </div>

        {/* Chatbots Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Chatbots</h2>
            <Link href={`/dashboard/businesses/${business.id}/chatbots/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Chatbot
              </Button>
            </Link>
          </div>

          {chatbots.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No chatbots yet</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Create your first AI chatbot to start helping customers and boosting sales.
                </p>
                <Link href={`/dashboard/businesses/${business.id}/chatbots/new`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Chatbot
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatbots.map((chatbot) => (
                <Card key={chatbot.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-blue-600" />
                        {chatbot.name}
                      </CardTitle>
                      <Badge variant={chatbot.is_active ? "default" : "secondary"}>
                        {chatbot.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{chatbot.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Position: {chatbot.widget_position}</div>
                      <Link href={`/dashboard/businesses/${business.id}/chatbots/${chatbot.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href={`/dashboard/businesses/${business.id}/chatbots/new`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Bot className="h-4 w-4 mr-2" />
                  Create New Chatbot
                </Button>
              </Link>
              <Link href={`/dashboard/businesses/${business.id}/settings`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Business Settings
                </Button>
              </Link>
              {!business.woocommerce_url && (
                <Link href={`/dashboard/businesses/${business.id}/settings`}>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Zap className="h-4 w-4 mr-2" />
                    Connect WooCommerce
                  </Button>
                </Link>
              )}
              {business.website_url && (
                <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
