"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProductSyncButtonProps {
  businessId: string
}

export function ProductSyncButton({ businessId }: ProductSyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSync = async () => {
    setIsLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      const response = await fetch(`/api/businesses/${businessId}/sync-products`, {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Products synced successfully")
        router.refresh()
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to sync products")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error occurred")
    } finally {
      setIsLoading(false)

      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 3000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleSync} disabled={isLoading}>
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Syncing..." : "Sync Products"}
      </Button>

      {status === "success" && (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{message}</span>
        </div>
      )}
    </div>
  )
}
