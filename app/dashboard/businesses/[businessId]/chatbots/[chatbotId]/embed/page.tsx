import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/utils/database"
import { getUserSubscription } from "@/lib/utils/subscriptions" // Import the subscription utility
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code, ExternalLink, CheckCircle, Key } from "lucide-react"
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

  // --- START: ADDED SUBSCRIPTION CHECK ---
  const { data: subscription } = await getUserSubscription(user.id)

  if (!subscription) {
    redirect("/dashboard/pricing")
  }
  // --- END: ADDED SUBSCRIPTION CHECK ---

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

  const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Store</h1>
    <p>Browse our products and get help from our AI assistant!</p>
    
    ${embedCode}
</body>
</html>`

  const wordpressInstructions = `1. Log in to your WordPress admin dashboard
2. Go to Appearance → Theme Editor
3. Select your active theme
4. Open the footer.php file
5. Add the embed code before the closing </body> tag
6. Click "Update File"

Alternatively, you can use a plugin like "Insert Headers and Footers" to add the code without editing theme files.`

  const shopifyInstructions = `1. From your Shopify admin, go to Online Store → Themes
2. Click "Actions" → "Edit code" for your active theme
3. Open the theme.liquid file in the Layout folder
4. Add the embed code before the closing </body> tag
5. Click "Save"

The chatbot will now appear on all pages of your store.`

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
              <Code className="h-6 w-6 text-red-600" />
              <div>
                <h1 className="text-xl font-semibold">Embed & Install</h1>
                <p className="text-sm text-gray-600">{chatbot.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
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

          {/* New Card for Chatbot ID */}
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