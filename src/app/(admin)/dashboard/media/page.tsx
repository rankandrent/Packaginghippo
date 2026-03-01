"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Upload, Copy, Check, Image as ImageIcon, ExternalLink, RefreshCw, Pencil, Trash2 } from "lucide-react"

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
            caption?: string
        }
    }
}

export default function MediaLibraryPage() {
    const [images, setImages] = useState<CloudinaryResource[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

    // Edit State
    const [editingImage, setEditingImage] = useState<CloudinaryResource | null>(null)
    const [editSlug, setEditSlug] = useState("")
    const [editName, setEditName] = useState("")
    const [editAlt, setEditAlt] = useState("")
    const [saving, setSaving] = useState(false)

    // Delete State
    const [deletingImage, setDeletingImage] = useState<CloudinaryResource | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

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

        const files = Array.from(e.target.files)
        setUploading(true)

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData()
                formData.append("file", file)

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error || `Upload failed for ${file.name}`)
                return data.url
            })

            const results = await Promise.allSettled(uploadPromises)

            const failures = results.filter(r => r.status === 'rejected')
            if (failures.length > 0) {
                alert(`Successfully uploaded ${results.length - failures.length} images. Failed to upload ${failures.length} images.`)
            }

            // Refresh list to show new image(s)
            await fetchImages()

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

    // Extract just the filename (slug) from a public_id like "products/my-image"
    const getSlugFromPublicId = (pid: string) => {
        const parts = pid.split('/')
        return parts[parts.length - 1] || pid
    }

    const startEditing = (image: CloudinaryResource) => {
        setEditingImage(image)
        setEditSlug(getSlugFromPublicId(image.public_id))
        setEditName(image.context?.custom?.caption || '')
        setEditAlt(image.context?.custom?.alt || '')
    }

    const handleSave = async () => {
        if (!editingImage) return

        setSaving(true)
        try {
            const currentSlug = getSlugFromPublicId(editingImage.public_id)
            const slugChanged = editSlug.trim() && editSlug.trim() !== currentSlug

            const res = await fetch("/api/media", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    public_id: editingImage.public_id,
                    alt: editAlt,
                    caption: editName,
                    new_slug: slugChanged ? editSlug.trim() : undefined,
                })
            })

            const data = await res.json()

            if (res.ok) {
                if (slugChanged && data.new_public_id) {
                    // Slug changed — refresh to get updated URLs
                    await fetchImages()
                } else {
                    // Only metadata changed — update locally
                    setImages(prev => prev.map(img =>
                        img.public_id === editingImage.public_id
                            ? {
                                ...img,
                                context: {
                                    custom: {
                                        alt: editAlt,
                                        caption: editName
                                    }
                                }
                            }
                            : img
                    ))
                }
                setEditingImage(null)
            } else {
                alert("Failed to save: " + (data.error || "Unknown error"))
            }
        } catch (error) {
            console.error("Failed to save", error)
            alert("Error saving changes")
        } finally {
            setSaving(false)
        }
    }

    const deleteImage = async () => {
        if (!deletingImage) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/media?public_id=${deletingImage.public_id}`, {
                method: "DELETE",
            })
            const data = await res.json()

            if (res.ok) {
                // Remove from local state
                setImages(prev => prev.filter(img => img.public_id !== deletingImage.public_id))
                setDeletingImage(null)
            } else {
                alert("Failed to delete image: " + (data.error || "Unknown error"))
            }
        } catch (error) {
            console.error("Delete error", error)
            alert("Error deleting image")
        } finally {
            setIsDeleting(false)
        }
    }

    // Build the SEO-friendly URL for display
    const getSeoUrl = (image: CloudinaryResource) => {
        const slug = getSlugFromPublicId(image.public_id)
        return `/images/products/${slug}.${image.format}`
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Upload and manage images. Edit slug, name, and alt text for SEO.
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
                            multiple
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
                            multiple
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
                                            title="Edit Image Details"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="h-8 w-8 p-0"
                                            onClick={() => setDeletingImage(image)}
                                            title="Delete Image"
                                        >
                                            <Trash2 className="h-3 w-3" />
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
                            <CardContent className="p-2 text-xs border-t bg-white space-y-0.5">
                                <div className="font-medium truncate">{getSlugFromPublicId(image.public_id)}.{image.format}</div>
                                {image.context?.custom?.caption && (
                                    <div className="text-blue-600 truncate text-[10px]" title={image.context.custom.caption}>
                                        {image.context.custom.caption}
                                    </div>
                                )}
                                {image.context?.custom?.alt && (
                                    <div className="text-gray-500 truncate italic text-[10px]" title={image.context.custom.alt}>
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

            {/* Edit Image Dialog — Slug, Name, Alt Text */}
            <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Image Details</DialogTitle>
                    </DialogHeader>
                    {editingImage && (
                        <div className="space-y-5 py-2">
                            {/* Preview */}
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                                <div className="relative w-20 h-20 bg-white rounded shrink-0 border">
                                    <img src={editingImage.secure_url} alt="Preview" className="object-contain w-full h-full p-1" />
                                </div>
                                <div className="text-xs space-y-1 min-w-0">
                                    <p className="font-medium truncate">{editingImage.public_id}</p>
                                    <p className="text-muted-foreground">{editingImage.width}×{editingImage.height} • {editingImage.format.toUpperCase()}</p>
                                    <p className="text-blue-600 truncate text-[10px]">{getSeoUrl(editingImage)}</p>
                                </div>
                            </div>

                            {/* Image Slug */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Image Slug (URL filename)</Label>
                                <Input
                                    value={editSlug}
                                    onChange={(e) => setEditSlug(e.target.value)}
                                    placeholder="what-are-bagged-packaged-goods"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    This changes the actual image URL. Use lowercase, hyphens, no spaces.
                                    <br />
                                    <span className="text-blue-600 font-medium">URL: packaginghippo.com/images/products/{editSlug || 'slug'}.{editingImage.format}</span>
                                </p>
                            </div>

                            {/* Image Name */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Image Name / Title</Label>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="What Are Bagged Packaged Goods"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Display name for organizing in the media library. Also used for SEO captions.
                                </p>
                            </div>

                            {/* Alt Text */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Alt Text</Label>
                                <Input
                                    value={editAlt}
                                    onChange={(e) => setEditAlt(e.target.value)}
                                    placeholder="Bagged packaged goods on store shelf"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Describes the image for screen readers and search engines. Be specific and descriptive.
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingImage(null)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingImage} onOpenChange={(open) => !open && setDeletingImage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Image</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete this image? This action cannot be undone.</p>
                        {deletingImage && (
                            <div className="mt-4 p-2 border rounded bg-muted flex items-center gap-4">
                                <div className="relative w-16 h-16 bg-white shrink-0">
                                    <img src={deletingImage.secure_url} alt="To delete" className="object-contain w-full h-full" />
                                </div>
                                <div className="text-sm truncate">
                                    <p className="font-medium">{deletingImage.public_id.split('/').pop()}</p>
                                    <p className="text-muted-foreground text-xs">{deletingImage.public_id}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingImage(null)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={deleteImage} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
