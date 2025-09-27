import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/utils/database"
import { getUserSubscription } from "@/lib/utils/subscriptions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code, CheckCircle, Key } from "lucide-react"
import Link from "next/link"
import { CopyButton } from "@/components/ui/copy-button"

interface EmbedPageProps {
  params: Promise<{ businessId: string; chatbotId: string }>
}

export default async function EmbedPage({ params }: EmbedPageProps) {
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
        website_url,
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

  const embedCode = `<script src="${
    process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"
  }/api/widget/${chatbotId}" async></script>`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header is handled by layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
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
              <Code className="h-6 w-6 text-red-600" />
              <div>
                <h1 className="text-xl font-semibold">Embed & Install</h1>
                <p className="text-sm text-gray-600">{chatbot.name}</p>
              </div>
            </div>
          </div>
          
          {/* Status Check card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Deployment Status
              </CardTitle>
              <CardDescription>
                Make sure your chatbot is ready for deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Chatbot Status</span>
                  <Badge
                    variant={chatbot.is_active ? "default" : "secondary"}
                  >
                    {chatbot.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Configuration</span>
                  <Badge variant="default">Complete</Badge>
                </div>
              </div>
              {!chatbot.is_active && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your chatbot is currently inactive. Activate it in the
                    settings to make it visible to website visitors.
                  </p>
                  <Link
                    href={`/dashboard/businesses/${businessId}/chatbots/${chatbotId}/settings`}
                    className="mt-2"
                  >
                    <Button size="sm" variant="outline">
                      Go to Settings
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card for Chatbot ID */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-red-600" />
                Your Unique Chatbot ID
              </CardTitle>
              <CardDescription>
                Use this ID for the WordPress plugin or other integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <code className="text-lg font-mono text-gray-800 flex-1">
                  {chatbot.id}
                </code>
                <CopyButton text={chatbot.id} />
              </div>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle>Embed Script</CardTitle>
              <CardDescription>
                For custom websites, copy this code and paste it into your
                HTML before the closing `&lt;/body&gt;` tag.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{embedCode}</code>
                </pre>
                <CopyButton
                  text={embedCode}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}