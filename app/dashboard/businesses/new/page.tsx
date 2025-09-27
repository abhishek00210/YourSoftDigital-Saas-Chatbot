"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"

export default function NewBusinessPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    woocommerce_url: "",
    woocommerce_consumer_key: "",
    woocommerce_consumer_secret: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const { data, error } = await supabase.from("businesses").insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        website_url: formData.website_url || null,
        woocommerce_url: formData.woocommerce_url || null,
        woocommerce_consumer_key: formData.woocommerce_consumer_key || null,
        woocommerce_consumer_secret: formData.woocommerce_consumer_secret || null,
      })

      if (error) throw error

      router.push("/dashboard")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Add New Business</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Add your business details to get started with AI chatbots. You can always update this information later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="My Awesome Store"
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
                      placeholder="Brief description of your business..."
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      type="url"
                      placeholder="https://mystore.com"
                      value={formData.website_url}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* WooCommerce Integration */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">WooCommerce Integration</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Connect your WooCommerce store to sync products automatically. You can skip this for now and add
                      it later.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="woocommerce_url">WooCommerce Store URL</Label>
                    <Input
                      id="woocommerce_url"
                      name="woocommerce_url"
                      type="url"
                      placeholder="https://mystore.com"
                      value={formData.woocommerce_url}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="woocommerce_consumer_key">Consumer Key</Label>
                    <Input
                      id="woocommerce_consumer_key"
                      name="woocommerce_consumer_key"
                      type="text"
                      placeholder="ck_..."
                      value={formData.woocommerce_consumer_key}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="woocommerce_consumer_secret">Consumer Secret</Label>
                    <Input
                      id="woocommerce_consumer_secret"
                      name="woocommerce_consumer_secret"
                      type="password"
                      placeholder="cs_..."
                      value={formData.woocommerce_consumer_secret}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">How to get WooCommerce API credentials:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Go to your WordPress admin dashboard</li>
                      <li>Navigate to WooCommerce → Settings → Advanced → REST API</li>
                      <li>Click "Add key" and create a new API key</li>
                      <li>Set permissions to "Read" and copy the Consumer Key and Secret</li>
                    </ol>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Creating Business..." : "Create Business"}
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
