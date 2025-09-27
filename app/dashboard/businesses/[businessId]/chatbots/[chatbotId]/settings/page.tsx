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
import { ArrowLeft, Bot, Palette, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ChatbotSettingsPageProps {
  params: Promise<{ businessId: string; chatbotId: string }>
}

export default function ChatbotSettingsPage({ params }: ChatbotSettingsPageProps) {
  const [businessId, setBusinessId] = useState<string>("")
  const [chatbotId, setChatbotId] = useState<string>("")
  const [businessName, setBusinessName] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcome_message: "",
    fallback_message: "",
    is_active: true,
    widget_color: "#3B82F6",
    widget_position: "bottom-right" as "bottom-right" | "bottom-left",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadChatbot = async () => {
      const resolvedParams = await params
      setBusinessId(resolvedParams.businessId)
      setChatbotId(resolvedParams.chatbotId)

      const supabase = createClient()

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
        .eq("id", resolvedParams.chatbotId)
        .eq("business_id", resolvedParams.businessId)
        .single()

      if (error || !chatbot) {
        router.push("/dashboard")
        return
      }

      setBusinessName(chatbot.businesses.name)
      setFormData({
        name: chatbot.name || "",
        description: chatbot.description || "",
        welcome_message: chatbot.welcome_message || "",
        fallback_message: chatbot.fallback_message || "",
        is_active: chatbot.is_active,
        widget_color: chatbot.widget_color || "#3B82F6",
        widget_position: chatbot.widget_position || "bottom-right",
      })
    }

    loadChatbot()
  }, [params, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("chatbots")
        .update({
          name: formData.name,
          description: formData.description || null,
          welcome_message: formData.welcome_message,
          fallback_message: formData.fallback_message,
          is_active: formData.is_active,
          widget_color: formData.widget_color,
          widget_position: formData.widget_position,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chatbotId)

      if (error) throw error

      setSuccess("Chatbot settings updated successfully!")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("chatbots").delete().eq("id", chatbotId)

      if (error) throw error

      router.push(`/dashboard/businesses/${businessId}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsDeleting(false)
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

  if (!businessId || !chatbotId) {
    return <div>Loading...</div>
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
              <Bot className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Chatbot Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your chatbot's basic details and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Chatbot Name *</Label>
                  <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
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
                    rows={2}
                    required
                    value={formData.welcome_message}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fallback_message">Fallback Message *</Label>
                  <Textarea
                    id="fallback_message"
                    name="fallback_message"
                    rows={2}
                    required
                    value={formData.fallback_message}
                    onChange={handleChange}
                  />
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
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
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

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete this chatbot and all associated data. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Chatbot"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your chatbot and all associated
                      conversations and analytics data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete Chatbot
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
