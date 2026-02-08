"use client"

import { motion } from "framer-motion"
import Image from "next/image"

type GalleryItem = {
    url: string
    alt: string
    title?: string
}

export function GallerySection({ data }: { data: any }) {
    if (!data) return null
    const items: GalleryItem[] = Array.isArray(data.items) ? data.items : []

    if (items.length === 0) return null

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-4 uppercase">
                        {data.heading || "Our Gallery"}
                    </h2>
                    {data.subheading && (
                        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                            {data.subheading}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative group aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                        >
                            <Image
                                src={item.url}
                                alt={item.alt || "Gallery Image"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                <p className="text-white font-bold text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {item.title || item.alt || "View Image"}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
