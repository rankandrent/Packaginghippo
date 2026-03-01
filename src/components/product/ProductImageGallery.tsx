"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function ProductImageGallery({ images, name }: { images: string[], name: string }) {
    const [selected, setSelected] = useState(0)

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-[1/1] rounded-2xl overflow-hidden bg-gray-50 border shadow-sm">
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            </div>
        )
    }

    return (
        <>
            {/* Main Image */}
            <div className="relative aspect-[1/1] rounded-2xl overflow-hidden bg-gray-50 border shadow-sm">
                <Image
                    src={images[selected]}
                    alt={`${name} - Image ${selected + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority={selected === 0}
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.slice(0, 5).map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setSelected(i)}
                            className={cn(
                                "relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:border-yellow-500 transition-all",
                                i === selected ? "border-yellow-500 ring-2 ring-yellow-500/20" : "border-gray-100"
                            )}
                        >
                            <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
