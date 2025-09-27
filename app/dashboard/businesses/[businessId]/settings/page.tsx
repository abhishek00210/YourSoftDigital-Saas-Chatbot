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
import { ArrowLeft, Building2, Trash2 } from "lucide-react"
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

interface BusinessSettingsPageProps {
  params: Promise<{ businessId: string }>
}

export default function BusinessSettingsPage({ params }: BusinessSettingsPageProps) {
  const [businessId, setBusinessId] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    woocommerce_url: "",
    woocommerce_consumer_key: "",
    woocommerce_consumer_secret: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadBusiness = async () => {
      const resolvedParams = await params
      setBusinessId(resolvedParams.businessId)

      const supabase = createClient()
      const { data: business, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", resolvedParams.businessId)
        .single()

      if (error || !business) {
        router.push("/dashboard")
        return
      }

      setFormData({
        name: business.name || "",
        description: business.description || "",
        website_url: business.website_url || "",
        woocommerce_url: business.woocommerce_url || "",
        woocommerce_consumer_key: business.woocommerce_consumer_key || "",
        woocommerce_consumer_secret: business.woocommerce_consumer_secret || "",
      })
    }

    loadBusiness()
  }, [params, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("businesses")
        .update({
          name: formData.name,
          description: formData.description || null,
          website_url: formData.website_url || null,
          woocommerce_url: formData.woocommerce_url || null,
          woocommerce_consumer_key: formData.woocommerce_consumer_key || null,
          woocommerce_consumer_secret: formData.woocommerce_consumer_secret || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId)

      if (error) throw error

      setSuccess("Business settings updated successfully!")
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
      const { error } = await supabase.from("businesses").delete().eq("id", businessId)

      if (error) throw error

      router.push("/dashboard")
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
                Back to Business
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Business Settings</h1>
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
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Business Name *</Label>
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
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      type="url"
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
                      Connect your WooCommerce store to sync products automatically
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="woocommerce_url">WooCommerce Store URL</Label>
                    <Input
                      id="woocommerce_url"
                      name="woocommerce_url"
                      type="url"
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
                      value={formData.woocommerce_consumer_secret}
                      onChange={handleChange}
                    />
                  </div>
                </div>

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

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete this business and all associated data. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Business"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your business and all associated
                      chatbots, conversations, and analytics data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete Business
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
