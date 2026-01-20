
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"
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
            alert("Error uploading image. Make sure the 'products' bucket exists.")
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...value]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {value.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-md border overflow-hidden group">
                        <Image
                            src={url}
                            alt="Product image"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex flex-col items-center justify-center gap-2 pb-4 pt-5">
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">Upload Image</span>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={uploadImage}
                        disabled={uploading}
                    />
                </label>
            </div>
        </div>
    )
}
