"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getAltFromUrl } from "@/lib/image-seo"

export function ProductImageGallery({ images, name }: { images: string[], name: string }) {
    const [selected, setSelected] = useState(0)

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-[6/5] rounded-2xl overflow-hidden bg-gray-50 border shadow-sm">
                <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase tracking-widest text-xs">No Image Available</div>
            </div>
        )
    }

    return (
        <>
            {/* Main Image */}
            <div className="relative aspect-[6/5] rounded-2xl overflow-hidden bg-white border shadow-sm group">
                <Image
                    src={images[selected]}
                    alt={name || getAltFromUrl(images[selected])}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1210px) 50vw, 600px"
                    className="object-contain transition-opacity duration-300"
                    priority={selected === 0}
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                    {images.slice(0, 5).map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setSelected(i)}
                            className={cn(
                                "relative aspect-[6/5] rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300",
                                i === selected 
                                    ? "border-blue-600 ring-4 ring-blue-600/10 scale-95" 
                                    : "border-gray-100 hover:border-blue-200 grayscale-[0.5] hover:grayscale-0"
                            )}
                        >
                            <Image src={img} alt={name || getAltFromUrl(img)} fill sizes="120px" className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
