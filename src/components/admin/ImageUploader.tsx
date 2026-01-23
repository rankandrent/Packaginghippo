"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
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
            const fileExt = file.name.split(".").pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // Get Public URL
            const {
                data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(filePath)

            // If maxFiles is 1, replace existing image. Otherwise append.
            if (maxFiles === 1) {
                onChange([publicUrl])
            } else {
                onChange([...value, publicUrl])
            }

        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Error uploading image. Make sure the 'products' bucket exists or use Add by URL.")
        } finally {
            setUploading(false)
        }
    }

    const addByUrl = () => {
        if (!urlInput) return
        if (maxFiles && value.length >= maxFiles) {
            alert(`You can only have ${maxFiles} image(s).`)
            return
        }

        // Basic validation for URL
        if (!urlInput.startsWith('http')) {
            alert("Please enter a valid URL starting with http:// or https://")
            return
        }

        const newImages = maxFiles === 1 ? [urlInput] : [...value, urlInput]
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
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Paste image URL here..."
                        className="pl-9 h-9"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                addByUrl()
                            }
                        }}
                    />
                </div>
                <Button variant="secondary" size="sm" type="button" onClick={addByUrl} className="h-9">
                    Add URL
                </Button>
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
                                <span className="block font-normal opacity-60 text-[9px] mt-0.5">(Supabase)</span>
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
