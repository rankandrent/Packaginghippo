"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus, X, Loader2, Link as LinkIcon, UploadCloud } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
    value: string[]
    onChange: (urls: string[]) => void
    bucket?: string
    maxFiles?: number
}

export function ImageUploader({
    value = [],
    onChange,
    bucket = "products",
    maxFiles
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState("")

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (maxFiles && value.length >= maxFiles) {
                alert(`You can only upload ${maxFiles} image(s).`)
                return
            }

            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error("You must select an image to upload.")
            }

            const file = e.target.files[0]
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Upload failed")

            // If maxFiles is 1, replace existing image. Otherwise append.
            if (maxFiles === 1) {
                onChange([data.url])
            } else {
                onChange([...value, data.url])
            }

        } catch (error: any) {
            console.error("Error uploading image:", error)
            alert(error.message || "Error uploading image")
        } finally {
            setUploading(false)
        }
    }

    const addByUrl = () => {
        if (!urlInput) return

        // Split by newlines or commas and filter out empty strings
        const urls = urlInput
            .split(/[\n,]/)
            .map(url => url.trim())
            .filter(url => url.length > 0)

        if (urls.length === 0) return

        if (maxFiles && (value.length + urls.length) > maxFiles) {
            alert(`You can only have up to ${maxFiles} images. Adding ${urls.length} would exceed this limit.`)
            return
        }

        // Basic validation for URLs
        const invalidUrls = urls.filter(url => !url.startsWith('http'))
        if (invalidUrls.length > 0) {
            alert(`Please enter valid URLs starting with http:// or https://\nInvalid: ${invalidUrls[0]}${invalidUrls.length > 1 ? '...' : ''}`)
            return
        }

        const newImages = maxFiles === 1 ? [urls[0]] : [...value, ...urls]
        onChange(newImages)
        setUrlInput("")
    }

    const removeImage = (index: number) => {
        const newImages = [...value]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            {/* URL Input Section */}
            <div className="flex flex-col gap-2">
                <div className="relative">
                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                    <textarea
                        placeholder="Paste image URL(s) here... Separate by new lines or commas for bulk add."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault()
                                addByUrl()
                            }
                        }}
                    />
                </div>
                <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md border border-dashed">
                    <span className="text-[11px] text-muted-foreground">
                        {urlInput.split(/[\n,]/).filter(u => u.trim()).length} URL(s) detected
                    </span>
                    <Button variant="secondary" size="sm" type="button" onClick={addByUrl} className="h-8">
                        Add URL(s)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {value.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md border overflow-hidden group bg-muted">
                        <Image
                            src={url}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                {(!maxFiles || value.length < maxFiles) && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center gap-1.5 text-center p-2">
                            {uploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <UploadCloud className="h-6 w-6 text-muted-foreground" />
                            )}
                            <div className="text-[10px] font-medium text-muted-foreground leading-tight">
                                Upload File
                                <span className="block font-normal opacity-60 text-[9px] mt-0.5">(Cloudinary)</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={uploadImage}
                            disabled={uploading}
                        />
                    </label>
                )}
            </div>

            <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <span>Free hosting recommended:</span>
                <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">ImgBB</a>
                <span>or</span>
                <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">PostImages</a>
            </p>
        </div>
    )
}
