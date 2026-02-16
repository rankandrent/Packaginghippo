"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Box, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

import { getSeoImageUrl, getSeoAltText } from "@/lib/image-seo"

export function Hero({ data }: { data: any }) {
    if (!data) return null

    // SEO Data Preparation
    const seoValues = {
        imageUrl: getSeoImageUrl(data.hero_image),
        altText: getSeoAltText(data, 'Custom Packaging Boxes on Yellow Background')
    }

    return (
        <section className="relative bg-zinc-950 pt-12 pb-12 md:pt-20 md:pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-zinc-950 to-zinc-950"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                            <div dangerouslySetInnerHTML={{ __html: (data.heading || "Custom Packaging").replace(/\n/g, "<br/>") }} />
                        </h1>
                        <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                            {data.subheading || "Elevate your brand with premium custom boxes."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button variant="default" size="lg" className="text-base px-8 py-6 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold" asChild>
                                <Link href={data.cta_link || "/quote"}>{data.cta_text || "Get Custom Quote"} <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                            <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-full border-gray-700 text-gray-300 hover:bg-gray-800" asChild>
                                <Link href="/products">View All Products</Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-6 pt-4 text-gray-500 text-sm font-medium">
                            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> No Die & Plate Charges</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Fast Turnaround</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative flex justify-center md:justify-end"
                    >
                        <div className="relative z-10 w-full max-w-md aspect-square bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-3xl shadow-2xl shadow-yellow-500/20 transform rotate-[-5deg] flex items-center justify-center border-t border-white/20">
                            {data.hero_image ? (
                                <img
                                    src={seoValues.imageUrl}
                                    alt={seoValues.altText}
                                    title={seoValues.altText} // Good for tooltip/SEO
                                    className="w-full h-full object-cover rounded-3xl"
                                    loading="eager" // Hero image should load fast
                                />
                            ) : (
                                <Box className="w-32 h-32 md:w-48 md:h-48 text-black opacity-50" />
                            )}
                            <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-white p-4 md:p-6 rounded-2xl shadow-xl transform rotate-[5deg] max-w-[200px] md:max-w-xs z-20">
                                <div className="flex items-center gap-2 md:gap-3 mb-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 border-2 border-white" />
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 border-2 border-white" />
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-400 border-2 border-white" />
                                    </div>
                                    <div className="text-xs md:text-sm font-bold text-gray-900">{data.badge_text || "500+ Happy Clients"}</div>
                                </div>
                                <p className="text-xs text-gray-500">{data.badge_subtext || "\"Best packaging service we've used!\""}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
