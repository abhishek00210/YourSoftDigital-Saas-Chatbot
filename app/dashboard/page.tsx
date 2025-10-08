import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, getUserBusinesses } from "@/lib/utils/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Bot, Building2, BarChart3 } from "lucide-react"
import Link from "next/link"


export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect("/auth/login")
  }

  const user = await getCurrentUser()
  const businesses = user ? await getUserBusinesses(user.id) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your businesses and chatbots</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chatbots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Businesses</h2>
          <Link href="/dashboard/businesses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Button>
          </Link>
        </div>

        {businesses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses yet</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Get started by adding your first business. Connect your WooCommerce store and create your first AI
                chatbot.
              </p>
              <Link href="/dashboard/businesses/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {business.name}
                  </CardTitle>
                  <CardDescription>{business.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {business.website_url ? (
                        <a
                          href={business.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      ) : (
                        "No website"
                      )}
                    </div>
                    <Link href={`/dashboard/businesses/${business.id}`}>
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

      {/* Getting Started Guide */}
      {businesses.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to create your first AI chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Add your business</h4>
                  <p className="text-sm text-gray-600">
                    Start by adding your business information and connecting your WooCommerce store
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Create your chatbot</h4>
                  <p className="text-sm text-gray-500">Configure your AI chatbot's personality and responses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Deploy to your website</h4>
                  <p className="text-sm text-gray-500">
                    Add the chatbot widget to your website and start helping customers
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-gray-500">
                <a
                  href="https://yoursoftdigital.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Powered by YourSoftDigital
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}