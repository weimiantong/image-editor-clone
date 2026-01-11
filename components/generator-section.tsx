"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Sparkles, ImageIcon, Wand2, Download } from "lucide-react"

export function GeneratorSection() {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("nano-banana")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [activeTab, setActiveTab] = useState("image-edit")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [outputs, setOutputs] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    if (uploadedImages.length + imageFiles.length > 9) {
      alert("Maximum 9 images allowed")
      return
    }
    const MAX = 10 * 1024 * 1024 // 10MB
    imageFiles.forEach((file) => {
      if (file.size > MAX) {
        alert(`File too large: ${file.name} (>10MB)`) // simple client-side guard
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImages((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    setError(null)
    setIsGenerating(true)
    setOutputs([])
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          images: uploadedImages,
          model: selectedModel,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate")
      }
      const imgs: string[] = Array.isArray(data?.images) ? data.images : []
      if (imgs.length === 0 && data?.raw) {
        // If no images found, try to display something meaningful.
        const text = typeof data.raw?.content === "string" ? data.raw.content : JSON.stringify(data.raw)
        setError(`Model returned no images. Message: ${text?.slice(0, 300)}`)
      }
      setOutputs(imgs)
    } catch (e: any) {
      setError(e?.message || "Unexpected error")
    } finally {
      setIsGenerating(false)
    }
  }

  // Trigger a client-side download for a given image source
  const downloadImage = async (src: string, index: number) => {
    // Derive a sensible filename
    const getFileName = () => {
      if (src.startsWith("data:")) {
        const m = src.match(/^data:(image\/[^;]+);/i)
        const ext = m?.[1]?.split("/")?.[1]?.toLowerCase?.() || "png"
        return `generated-${index + 1}.${ext}`
      }
      try {
        const url = new URL(src)
        const base = url.pathname.split("/").pop() || `generated-${index + 1}.png`
        return base.includes(".") ? base : `${base}.png`
      } catch {
        return `generated-${index + 1}.png`
      }
    }

    const trigger = (href: string, filename: string) => {
      const a = document.createElement("a")
      a.href = href
      a.download = filename
      a.rel = "noopener"
      document.body.appendChild(a)
      a.click()
      a.remove()
    }

    const filename = getFileName()

    try {
      // Data URL: download directly
      if (src.startsWith("data:")) {
        trigger(src, filename)
        return
      }
      // Try fetching as blob to avoid navigating away and to ensure a proper filename
      const resp = await fetch(src)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      trigger(url, filename)
      // Revoke shortly after triggering to release memory
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e) {
      // Fallback: open in a new tab; user can save manually (handles CORS-restricted URLs)
      const a = document.createElement("a")
      a.href = src
      a.target = "_blank"
      a.rel = "noopener"
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  }

  return (
    <section id="generator" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Image Generator</h2>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger
                  value="image-edit"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Image Edit
                </TabsTrigger>
                <TabsTrigger
                  value="text-to-image"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Text to Image
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image-edit" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Reference Image</label>
                    <p className="text-xs text-muted-foreground mb-3">{uploadedImages.length}/9</p>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragOver(true)
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop images here</p>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4"
                        >
                          Add Image
                        </Button>
                        <label className="cursor-pointer text-sm text-primary hover:underline">
                          or click to browse
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileInput}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Max 10MB per image</p>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-foreground" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text-to-image" className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Generate images directly from your text description without a reference image.
                </p>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Main Prompt</label>
                <Textarea
                  placeholder="Describe the image you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-secondary border-border min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">AI Model Selection</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="nano-banana">🍌 Nano Banana</SelectItem>
                    <SelectItem value="nano-banana-pro">🍌 Nano Banana Pro</SelectItem>
                    <SelectItem value="seed-dream">✨ SeeDream 4</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Different models offer unique characteristics and styles
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive mb-2">{error}</p>
              )}
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt && uploadedImages.length === 0)}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isGenerating ? "Generating..." : "Generate Now (2 Credits)"}
              </Button>
            </div>
          </Card>

          {/* Right Panel - Output */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Output Gallery</h3>
            {outputs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {outputs.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Generated ${i + 1}`}
                      className="w-full aspect-square object-cover rounded"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      title="Download"
                      className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => downloadImage(src, i)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-square bg-secondary rounded-lg flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">Ready for instant generation</p>
                <p className="text-sm text-muted-foreground text-center px-4">Enter your prompt and upload an image, then click Generate</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Generation Tips</h4>
              <p className="text-xs text-muted-foreground">
                Use detailed descriptions for more accurate results. Include style, lighting, camera, and subject details.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
