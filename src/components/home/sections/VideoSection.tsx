"use client"

import { motion } from "framer-motion"

export function VideoSection({ data }: { data: any }) {
    if (!data) return null;

    // Helper to extract YouTube ID
    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(data.videoUrl || "C7s5rc3fEMk"); // Default fallback if needed, or remove fallback

    return (
        <section className="py-16 bg-zinc-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">
                            {data.heading || "See How We Work"}
                        </h2>
                        <p className="text-lg text-zinc-600">
                            {data.subheading || "Watch our process and see the quality we deliver."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
                    >
                        {videoId ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                                title="Packaging Hippo Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-white">
                                <p>Video URL not configured</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
