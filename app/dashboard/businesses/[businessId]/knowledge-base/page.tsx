"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Trash2 } from "lucide-react"

interface KnowledgeBasePageProps {
  params: { businessId: string }
}

export default function KnowledgeBasePage({ params }: KnowledgeBasePageProps) {
  const { businessId } = params
  const [files, setFiles] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await supabase
        .from("knowledge_base_documents")
        .select("*")
        .eq("business_id", businessId)
      setFiles(data || [])
    }
    fetchFiles()
  }, [businessId, supabase])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const filePath = `${businessId}/${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("knowledge-base")
      .upload(filePath, file)

    if (uploadError) {
      alert("Error uploading file.")
      setIsUploading(false)
      return
    }

    const { error: dbError } = await supabase
      .from("knowledge_base_documents")
      .insert({
        business_id: businessId,
        file_name: file.name,
        storage_path: filePath,
      })

    if (dbError) {
      alert("Error saving file to database.")
    } else {
      setFiles([...files, { file_name: file.name, storage_path: filePath }])
    }
    setIsUploading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>
            Upload documents (PDF, TXT) to provide your chatbot with more information about your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
              <Upload className="h-5 w-5" />
              <span>{isUploading ? "Uploading..." : "Upload a new document"}</span>
            </Label>
            <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </div>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>{file.file_name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}