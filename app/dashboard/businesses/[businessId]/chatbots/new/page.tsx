// app/dashboard/businesses/[businessId]/chatbots/new/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bot, Palette } from "lucide-react"
import Link from "next/link"
import { PLAN_LIMITS, PlanName } from "@/lib/config/plans"

interface NewChatbotPageProps {
  params: Promise<{ businessId: string }>
}

export default function NewChatbotPage({ params }: NewChatbotPageProps) {
  const [businessId, setBusinessId] = useState<string>("")
  const [businessName, setBusinessName] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcome_message: "Hello! How can I help you today?",
    fallback_message: "I'm sorry, I didn't understand that. Can you please rephrase?",
    is_active: true,
    widget_color: "#3B82F6",
    widget_position: "bottom-right" as "bottom-right" | "bottom-left",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadBusiness = async () => {
      const resolvedParams = await params
      setBusinessId(resolvedParams.businessId)
      const supabase = createClient()

      // --- ADDED LIMIT CHECK ---
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*, prices:subscription_prices(*, products:subscription_products(*))")
          .in("status", ["trialing", "active"])
          .eq("user_id", user.id)
          .single();

        const { count: chatbotCount } = await supabase.from('chatbots').select('id', { count: 'exact' }).eq('business_id', resolvedParams.businessId);

        const planName = (subscription?.prices?.products?.name as PlanName) || "Free Plan";
        const planLimits = PLAN_LIMITS[planName];

        if (chatbotCount !== null && chatbotCount >= planLimits.maxChatbots) {
          alert("You have reached the maximum number of chatbots for your plan. Please upgrade to create more.");
          router.push(`/dashboard/businesses/${resolvedParams.businessId}`);
          return;
        }
      }
      // --- END OF LIMIT CHECK ---

      const { data: business, error } = await supabase
        .from("businesses")
        .select("name")
        .eq("id", resolvedParams.businessId)
        .single()

      if (error || !business) {
        router.push("/dashboard")
        return
      }

      setBusinessName(business.name)
    }

    loadBusiness()
  }, [params, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("chatbots").insert({
        business_id: businessId,
        name: formData.name,
        description: formData.description || null,
        welcome_message: formData.welcome_message,
        fallback_message: formData.fallback_message,
        is_active: formData.is_active,
        widget_color: formData.widget_color,
        widget_position: formData.widget_position,
      })

      if (error) throw error

      router.push(`/dashboard/businesses/${businessId}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const colorOptions = [
    { value: "#3B82F6", label: "Blue", color: "bg-blue-500" },
    { value: "#10B981", label: "Green", color: "bg-green-500" },
    { value: "#8B5CF6", label: "Purple", color: "bg-purple-500" },
    { value: "#F59E0B", label: "Orange", color: "bg-orange-500" },
    { value: "#EF4444", label: "Red", color: "bg-red-500" },
    { value: "#6B7280", label: "Gray", color: "bg-gray-500" },
  ]

  if (!businessId) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/businesses/${businessId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {businessName}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Create New Chatbot</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Set up your chatbot's basic details and behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Chatbot Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Customer Support Bot"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Brief description of what this chatbot does..."
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="welcome_message">Welcome Message *</Label>
                      <Textarea
                        id="welcome_message"
                        name="welcome_message"
                        placeholder="Hello! How can I help you today?"
                        rows={2}
                        required
                        value={formData.welcome_message}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-gray-500">This message will be shown when users first open the chat</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="fallback_message">Fallback Message *</Label>
                      <Textarea
                        id="fallback_message"
                        name="fallback_message"
                        placeholder="I'm sorry, I didn't understand that. Can you please rephrase?"
                        rows={2}
                        required
                        value={formData.fallback_message}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-gray-500">
                        This message will be shown when the AI doesn't understand the user's question
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            is_active: checked,
                          }))
                        }
                      />
                      <Label htmlFor="is_active">Active</Label>
                      <p className="text-xs text-gray-500">Enable this chatbot on your website</p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize how your chatbot looks on your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label>Widget Color</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              widget_color: option.value,
                            }))
                          }
                          className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                            formData.widget_color === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${option.color}`} />
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Widget Position</Label>
                    <Select
                      value={formData.widget_position}
                      onValueChange={(value: "bottom-right" | "bottom-left") =>
                        setFormData((prev) => ({
                          ...prev,
                          widget_position: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} onClick={handleSubmit} className="flex-1">
                  {isLoading ? "Creating Chatbot..." : "Create Chatbot"}
                </Button>
                <Link href={`/dashboard/businesses/${businessId}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>See how your chatbot will look on your website</CardDescription>
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
                      className={`absolute bottom-4 ${
                        formData.widget_position === "bottom-right" ? "right-4" : "left-4"
                      }`}
                    >
                      {/* Chat Button */}
                      <button
                        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105"
                        style={{ backgroundColor: formData.widget_color }}
                      >
                        <Bot className="h-6 w-6" />
                      </button>

                      {/* Chat Window (shown as preview) */}
                      <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border">
                        <div className="p-4 rounded-t-lg text-white" style={{ backgroundColor: formData.widget_color }}>
                          <h3 className="font-medium">{formData.name || "Chatbot"}</h3>
                          <p className="text-sm opacity-90">Online now</p>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex gap-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: formData.widget_color }}
                            >
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-gray-100 rounded-lg p-2 max-w-xs">
                              <p className="text-sm">{formData.welcome_message}</p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs">
                              <p className="text-sm">Hello! I need help with my order.</p>
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
                              style={{ backgroundColor: formData.widget_color }}
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
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>What happens after you create this chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Configure AI Responses</h4>
                        <p className="text-sm text-gray-600">Train your chatbot with product knowledge and FAQs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Test Your Chatbot</h4>
                        <p className="text-sm text-gray-600">Try out conversations and refine responses</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Deploy to Website</h4>
                        <p className="text-sm text-gray-600">Add the widget code to your website</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}