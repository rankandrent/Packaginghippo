"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

function getYoutubeId(url: string) {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
}

export function VideoSection({ data }: { data: any }) {
    const [isPlaying, setIsPlaying] = useState(false)

    if (!data) return null

    const videoId = getYoutubeId(data.videoUrl || "C7s5rc3fEMk")
    const thumbnailUrl = useMemo(
        () => (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null),
        [videoId]
    )

    return (
        <section className="py-16 bg-zinc-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">
                            {data.heading || "See How We Work"}
                        </h2>
                        <p className="text-lg text-zinc-600">
                            {data.subheading || "Watch our process and see the quality we deliver."}
                        </p>
                    </div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                        {videoId ? (
                            isPlaying ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                    title="Packaging Hippo Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsPlaying(true)}
                                    className="absolute inset-0 block w-full h-full"
                                    aria-label="Play video"
                                >
                                    {thumbnailUrl ? (
                                        <Image
                                            src={thumbnailUrl}
                                            alt={data.heading || "Packaging Hippo video"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 1024px"
                                            className="object-cover"
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 bg-black/35" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-xl transition-transform hover:scale-105">
                                            <Play className="ml-1 h-8 w-8 fill-current" />
                                        </span>
                                    </div>
                                </button>
                            )
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-white">
                                <p>Video URL not configured</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
