"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  onImageUrl: (url: string) => void
  value?: string
}

export function ImageUpload({ onImageUrl, value }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setPreview(dataUrl)
        onImageUrl(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlInput = (url: string) => {
    if (url.startsWith("http")) {
      setPreview(url)
      onImageUrl(url)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">Upload Image</label>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Paste image URL (https://...)"
          onChange={(e) => handleUrlInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted border border-border">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <button
            type="button"
            onClick={() => {
              setPreview("")
              onImageUrl("")
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
