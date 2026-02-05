"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Upload, Copy, Check, Image as ImageIcon, ExternalLink, RefreshCw, Pencil } from "lucide-react"

type CloudinaryResource = {
    public_id: string
    secure_url: string
    format: string
    width: number
    height: number
    created_at: string
    context?: {
        custom?: {
            alt?: string
        }
    }
}

export default function MediaLibraryPage() {
    const [images, setImages] = useState<CloudinaryResource[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

    // Alt Text Editing State
    const [editingImage, setEditingImage] = useState<CloudinaryResource | null>(null)
    const [newAltText, setNewAltText] = useState("")
    const [updatingAlt, setUpdatingAlt] = useState(false)

    useEffect(() => {
        fetchImages()
    }, [])

    async function fetchImages(cursor?: string) {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (cursor) params.append('cursor', cursor)

            const res = await fetch(`/api/media?${params.toString()}`)
            const data = await res.json()

            if (data.resources) {
                if (cursor) {
                    setImages(prev => [...prev, ...data.resources])
                } else {
                    setImages(data.resources)
                }
                setNextCursor(data.next_cursor || null)
            }
        } catch (error) {
            console.error("Failed to fetch images", error)
        } finally {
            setLoading(false)
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()

            if (data.url) {
                // Refresh list to show new image
                await fetchImages()
            } else {
                alert("Upload failed: " + (data.error || "Unknown error"))
            }
        } catch (error) {
            console.error("Upload error", error)
            alert("Upload error")
        } finally {
            setUploading(false)
            // Reset input
            e.target.value = ""
        }
    }

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        setCopiedUrl(url)
        setTimeout(() => setCopiedUrl(null), 2000)
    }

    const startEditing = (image: CloudinaryResource) => {
        setEditingImage(image)
        setNewAltText(image.context?.custom?.alt || "")
    }

    const saveAltText = async () => {
        if (!editingImage) return

        setUpdatingAlt(true)
        try {
            const res = await fetch("/api/media", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    public_id: editingImage.public_id,
                    alt: newAltText
                })
            })

            if (res.ok) {
                // Update local state
                setImages(prev => prev.map(img =>
                    img.public_id === editingImage.public_id
                        ? { ...img, context: { custom: { alt: newAltText } } }
                        : img
                ))
                setEditingImage(null)
            } else {
                alert("Failed to update alt text")
            }
        } catch (error) {
            console.error("Failed to update alt text", error)
            alert("Error updating alt text")
        } finally {
            setUpdatingAlt(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Upload and manage images for your website.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchImages()}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploading}
                        />
                        <Button disabled={uploading}>
                            {uploading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="mr-2 h-4 w-4" />
                            )}
                            Upload Image
                        </Button>
                    </div>
                </div>
            </div>

            {loading && images.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-gray-50/50">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No images found</p>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Button variant="outline">Upload your first image</Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image) => (
                        <Card key={image.public_id} className="group overflow-hidden relative border-0 shadow-none ring-1 ring-gray-200">
                            <div className="aspect-square relative bg-gray-50">
                                <img
                                    src={image.secure_url}
                                    alt={image.context?.custom?.alt || image.public_id}
                                    loading="lazy"
                                    className="object-contain w-full h-full p-2"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-8 text-xs flex-1"
                                            onClick={() => copyToClipboard(image.secure_url)}
                                        >
                                            {copiedUrl === image.secure_url ? (
                                                <Check className="h-3 w-3" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-8 w-8 p-0"
                                            onClick={() => startEditing(image)}
                                            title="Edit Alt Text"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-full text-xs"
                                        onClick={() => window.open(image.secure_url, '_blank')}
                                    >
                                        <ExternalLink className="h-3 w-3 mr-1" /> View
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-2 text-xs border-t bg-white">
                                <div className="font-medium truncate mb-1">{image.public_id.split('/').pop()}</div>
                                {image.context?.custom?.alt && (
                                    <div className="text-gray-500 truncate italic" title={image.context.custom.alt}>
                                        Alt: {image.context.custom.alt}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {nextCursor && (
                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={() => fetchImages(nextCursor)} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Load More
                    </Button>
                </div>
            )}

            {/* Edit Alt Text Dialog */}
            <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Image Alt Text</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Alt Text</Label>
                            <Input
                                value={newAltText}
                                onChange={(e) => setNewAltText(e.target.value)}
                                placeholder="Describe this image for SEO..."
                            />
                            <p className="text-xs text-muted-foreground">
                                Detailed alt text helps search engines understand your image content.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingImage(null)}>Cancel</Button>
                        <Button onClick={saveAltText} disabled={updatingAlt}>
                            {updatingAlt && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
