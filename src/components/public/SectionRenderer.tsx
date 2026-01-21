"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, ChevronDown, Package, Star, Leaf, Box } from "lucide-react"

// Types matching SectionBuilder
export type Section = {
    id: string
    type: 'hero' | 'text' | 'benefits' | 'faq' | 'cta' | 'gallery' | 'product_grid' | 'seo_content'
    title?: string
    content: any
}

export function SectionRenderer({ sections }: { sections: Section[] }) {
    if (!sections || !Array.isArray(sections)) return null

    return (
        <div className="flex flex-col">
            {sections.map(section => (
                <RenderSection key={section.id} section={section} />
            ))}
        </div>
    )
}

function RenderSection({ section }: { section: Section }) {
    switch (section.type) {
        case 'hero':
            return <HeroSection content={section.content} />
        case 'text':
            return <TextSection content={section.content} />
        case 'product_grid':
            return <ProductGridSection content={section.content} />
        case 'seo_content':
            return <SeoContentSection content={section.content} />
        case 'benefits':
            return <BenefitsSection content={section.content} />
        case 'faq':
            return <FaqSection content={section.content} />
        case 'cta':
            return <CtaSection content={section.content} />
        case 'gallery':
            return <GallerySection content={section.content} />
        default:
            return null
    }
}

// --- SUB COMPONENTS ---

export function HeroSection({ content }: { content: any }) {
    return (
        <section className="relative bg-zinc-950 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-zinc-950 to-zinc-950"></div>
            {content.bgImage && (
                <div className="absolute inset-0 opacity-20">
                    <Image src={content.bgImage} alt="Background" fill className="object-cover" />
                </div>
            )}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                            {content.heading}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                            {content.subheading}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            {content.ctaText && (
                                <Button variant="default" size="lg" className="text-lg px-8 py-6 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold" asChild>
                                    <Link href={content.ctaLink || "/quote"}>{content.ctaText} <ArrowRight className="ml-2 w-5 h-5" /></Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    {content.image && (
                        <div className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden shadow-2xl transform rotate-[-3deg] border-4 border-white/10">
                            <Image src={content.image} alt={content.heading} fill className="object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

// ... existing sub components ...

function ProductGridSection({ content }: { content: any }) {
    // In a real app, you might fetch products here based on category ID passed via context or props
    // For now, we will just render a placeholder that says "Products will appear here"
    // or if we have products passed in via a prop, use those.
    // However, since this component is rendered deep in the specific page, 
    // we should ideally fetch products client-side or pass them down.

    // TEMPORARY SOLUTION:
    // We will render a client-side component (PopularProducts-like) that fetches its own data
    // OR we rely on the page to pass data. 
    // BUT SectionRenderer usually just takes `content` which is static JSON.

    // Better approach for now:
    // Just re-use the PopularProducts component logic but adapted.
    // Since we don't have the category ID here easily without drilling,
    // we will fetch *all* popular products or random ones for now as a demo,
    // OR we can make this component accept a `categoryId` prop if we change the signature.

    // Let's keep it simple: Render a "Coming Soon" grid or static items if manually added.
    // Wait -> The user wants "product grid for THAT category".
    // I need the category slug or ID.
    // I will use `useParams` hook to get the slug!

    const { slug } = useParams()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return

        async function fetchProducts() {
            try {
                // Determine if slug is array or string (Next.js types)
                const categorySlug = Array.isArray(slug) ? slug[0] : slug

                // Fetch products for this category
                // NOTE: We need an API endpoint for this. 
                // For now, I'll assume we have one or mock it.
                // Creating a mock fetch for now to demonstrate UI.
                const res = await fetch(`/api/products?category=${categorySlug}`)
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data.products || [])
                }
            } catch (e) {
                console.error("Failed to fetch products", e)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [slug])

    if (loading) return <div className="py-24 text-center">Loading products...</div>

    if (products.length === 0) return (
        <section className="py-24 bg-gray-50 text-center text-muted-foreground">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.heading || "Our Products"}</h2>
            <p>No products found in this category.</p>
        </section>
    )

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{content.heading || "Our Products"}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((item: any, i: number) => (
                        <Link href={`/products/${item.slug}`} key={i}>
                            <Card className="group cursor-pointer hover:shadow-lg transition-all border-none shadow-sm h-full rounded-xl overflow-hidden">
                                <div className="aspect-[4/3] relative bg-white flex items-center justify-center p-4">
                                    {item.images?.[0] ? (
                                        <Image src={item.images[0]} alt={item.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <Package className="w-12 h-12 text-gray-200" />
                                    )}
                                </div>
                                <CardContent className="p-5 bg-white">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">{item.name}</h3>
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-500">MOQ: 100</span>
                                        <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">Customizable</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ... rest of components ...




function SeoContentSection({ content }: { content: any }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const collapsedHeight = content.collapsedHeight || 300

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                {content.heading && (
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">{content.heading}</h2>
                )}

                <div className="relative">
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? '' : 'relative'}`}
                        style={{ maxHeight: isExpanded ? 'none' : `${collapsedHeight}px` }}
                    >
                        <div
                            className="prose max-w-none text-gray-600 leading-relaxed rich-text"
                            dangerouslySetInnerHTML={{ __html: content.content }}
                        />

                        {/* Gradient Fade Overlay when collapsed */}
                        {!isExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <Button
                            variant="outline"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-sm transition-all"
                        >
                            {isExpanded ? (
                                <>Read Less <ChevronDown className="ml-2 w-4 h-4 rotate-180" /></>
                            ) : (
                                <>Read More <ChevronDown className="ml-2 w-4 h-4" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

function BenefitsSection({ content }: { content: any }) {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-black mb-4">{content.heading || "Key Benefits"}</h2>
                    <p className="text-lg text-gray-600">{content.subheading}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {content.items?.map((item: any, i: number) => (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="mb-4 bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-yellow-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

function FaqSection({ content }: { content: any }) {
    const items = content.items || []
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-4xl font-black text-center mb-16">{content.heading || "Frequently Asked Questions"}</h2>
                <div className="space-y-4">
                    {items.map((item: any, i: number) => (
                        <FaqItem key={i} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50 hover:bg-white transition-colors duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left"
            >
                <span className="font-bold text-lg text-gray-900">{question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function CtaSection({ content }: { content: any }) {
    return (
        <section className="py-24 bg-yellow-500 text-black text-center">
            <div className="container mx-auto px-4 max-w-3xl space-y-8">
                <h2 className="text-5xl font-black tracking-tight">{content.heading}</h2>
                <p className="text-xl font-medium opacity-80">{content.subheading}</p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-10 h-14 rounded-full" asChild>
                        <Link href={content.link || "/quote"}>{content.buttonText || "Get Started"}</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

function GallerySection({ content }: { content: any }) {
    const images = content.images || []
    if (images.length === 0) return null
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                {content.heading && <h2 className="text-4xl font-black text-center mb-12">{content.heading}</h2>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img: string, i: number) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                            <Image src={img} alt={`Gallery ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
