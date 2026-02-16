"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, ChevronDown, Package, Star, Leaf, Box, Quote, Clock, DollarSign, Truck, Palette, Pen, Sparkles, Shield, Zap, Check } from "lucide-react"
import { PopularProducts } from "@/components/category/PopularProducts"

// Types matching SectionBuilder
export type Section = {
    id: string
    type:
    | 'hero'
    | 'text'
    | 'benefits'
    | 'faq'
    | 'cta'
    | 'gallery'
    | 'product_grid'
    | 'seo_content'
    | 'customer_reviews'
    | 'features_bar'
    | 'logo_loop'
    | 'popular_products'
    | 'intro'
    | 'services_list'
    | 'how_it_works'
    | 'eco_friendly'
    | 'printing'
    | 'industries'
    | 'steps'
    | 'ordering_process'
    | 'why_choose_us'
    | 'video_section'
    | 'quote_form'
    | 'custom_quote_form'
    | 'featured_blogs'
    | 'tabs'
    title?: string
    content: any
}

export function SectionRenderer({
    sections,
    popularProducts,
    categoryName,
    breadcrumbs,
    featuredBlogs = [],
    quoteFormImage,
    homepageSections = []
}: {
    sections: Section[],
    popularProducts?: any[],
    categoryName?: string,
    breadcrumbs?: React.ReactNode,
    featuredBlogs?: any[],
    quoteFormImage?: any,
    homepageSections?: Section[]
}) {
    if (!sections || !Array.isArray(sections)) return null

    return (
        <div className="flex flex-col">
            {sections.map(section => (
                <RenderSection
                    key={section.id}
                    section={section}
                    popularProducts={popularProducts}
                    categoryName={categoryName}
                    breadcrumbs={breadcrumbs}
                    featuredBlogs={featuredBlogs}
                    quoteFormImage={quoteFormImage}
                    homepageSections={homepageSections}
                />
            ))}
        </div>
    )
}

// --- HOMEPAGE COMPONENTS ---
import { Intro } from "@/components/home/sections/Intro"
import { ServicesList } from "@/components/home/sections/ServicesList"
import { Benefits } from "@/components/home/sections/Benefits"
import { HowItWorks } from "@/components/home/sections/HowItWorks"
import { EcoFriendly } from "@/components/home/sections/EcoFriendly"
import { Printing } from "@/components/home/sections/Printing"
import { Industries } from "@/components/home/sections/Industries"
import { Steps } from "@/components/home/sections/Steps"
import { OrderingProcess } from "@/components/home/sections/OrderingProcess"
import { WhyChooseUs } from "@/components/home/sections/WhyChooseUs"
import { VideoSection } from "@/components/home/sections/VideoSection"
import { QuoteSection } from "@/components/home/sections/QuoteSection"
import { CustomQuoteFormSection } from "@/components/home/CustomQuoteFormSection"
import { FeaturedBlogs } from "@/components/home/sections/FeaturedBlogs"
import TabsSection from "@/components/home/sections/TabsSection"
import { CTA } from "@/components/home/sections/CTA"

function RenderSection({
    section,
    popularProducts,
    categoryName,
    breadcrumbs,
    featuredBlogs,
    quoteFormImage,
    homepageSections = []
}: {
    section: Section,
    popularProducts?: any[],
    categoryName?: string,
    breadcrumbs?: React.ReactNode,
    featuredBlogs?: any[],
    quoteFormImage?: any,
    homepageSections?: Section[]
}) {
    // Helper to get content from home if current section is a placeholder or has no items
    const getSharedContent = () => {
        const shared = homepageSections.find(s => s.type === section.type)
        return shared ? shared.content : section.content
    }

    switch (section.type) {
        case 'hero':
            return <HeroSection content={section.content} breadcrumbs={breadcrumbs} />
        case 'text':
            return <TextSection content={section.content} />
        case 'product_grid':
            return <ProductGridSection content={section.content} />
        case 'popular_products':
            if (!popularProducts) return null
            return <PopularProducts categoryName={categoryName || "Packaging"} products={popularProducts} />
        case 'seo_content':
            return <SeoContentSection content={section.content} />
        case 'benefits':
            return <Benefits data={getSharedContent()} />
        case 'faq':
            return <FaqSection content={getSharedContent()} />
        case 'cta':
            return <CTA data={section.content} />
        case 'gallery':
            return <GallerySection content={section.content} />
        case 'customer_reviews':
            return <CustomerReviewsSection content={getSharedContent()} />
        case 'features_bar':
            return <FeaturesBarSection content={getSharedContent()} />
        case 'logo_loop':
            return <LogoLoopSection content={getSharedContent()} />

        // NEW SECTIONS
        case 'intro': return <Intro data={section.content} />
        case 'services_list': return <ServicesList data={getSharedContent()} />
        case 'how_it_works': return <HowItWorks data={getSharedContent()} />
        case 'eco_friendly': return <EcoFriendly data={getSharedContent()} />
        case 'printing': return <Printing data={getSharedContent()} />
        case 'industries': return <Industries data={getSharedContent()} />
        case 'steps': return <Steps data={getSharedContent()} />
        case 'ordering_process': return <OrderingProcess data={getSharedContent()} />
        case 'why_choose_us': return <WhyChooseUs data={getSharedContent()} />
        case 'video_section': return <VideoSection data={getSharedContent()} />
        case 'quote_form': return <QuoteSection data={getSharedContent()} />
        case 'custom_quote_form': return <CustomQuoteFormSection image={quoteFormImage || section.content.image} />
        case 'featured_blogs':
            return <FeaturedBlogs key={section.id} posts={featuredBlogs || []} />
        case 'tabs':
            return <TabsSection key={section.id} data={section.content} />
        default:
            return null
    }
}

// --- SUB COMPONENTS ---

export function HeroSection({ content, breadcrumbs }: { content: any, breadcrumbs?: React.ReactNode }) {
    return (
        <section className="relative bg-zinc-950 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-zinc-950 to-zinc-950"></div>
            {content.bgImage && (
                <div className="absolute inset-0 opacity-20">
                    <Image src={content.bgImage} alt="Background" fill className="object-cover" />
                </div>
            )}
            <div className="container mx-auto px-4 relative z-10">
                {breadcrumbs && (
                    <div className="mb-8">
                        {breadcrumbs}
                    </div>
                )}
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
                        <div className="relative z-10 w-full max-w-lg mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transform rotate-[-3deg] border-4 border-white/10">
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
                        <Link href={`/${item.slug}`} key={i}>
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
                                        <div className="mt-4 flex items-center justify-between text-sm">
                                            <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                                                {item.isCustomizable !== false ? 'Customizable' : 'Standard'}
                                            </div>
                                        </div>
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




// ... existing sub components ...

function TextSection({ content }: { content: any }) {
    if (!content.html) return null
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 prose max-w-none text-gray-700 leading-relaxed">
                {content.heading && <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.heading}</h2>}
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: content.html }} />
            </div>
        </section>
    )
}

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
                            suppressHydrationWarning
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
                    {content.intro && <p className="text-lg text-gray-600 mb-8">{content.intro}</p>}
                    {!content.intro && content.subheading && <p className="text-lg text-gray-600">{content.subheading}</p>}
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
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-4xl font-black text-center mb-16">{content.heading || "Frequently Asked Questions"}</h2>
                <div className="grid md:grid-cols-2 gap-4">
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

function CustomerReviewsSection({ content }: { content: any }) {
    const reviews = Array.isArray(content.items) ? content.items : []
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{content.heading || "What Our Customers Say"}</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">{content.subheading || "Trusted by businesses worldwide for premium packaging solutions."}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 rounded-3xl group">
                                <CardContent className="p-8 flex flex-col h-full bg-white rounded-3xl">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, starIdx) => (
                                            <Star
                                                key={starIdx}
                                                className={`w-4 h-4 ${starIdx < (review.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <Quote className="w-8 h-8 text-yellow-500/20 mb-4 group-hover:text-yellow-500/40 transition-colors" />
                                    <p className="text-gray-600 italic leading-relaxed mb-8 flex-grow">"{review.text}"</p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                        {review.image ? (
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500/20">
                                                <Image src={review.image} alt={review.name} width={48} height={48} className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 font-bold">
                                                {review.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{review.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function FeaturesBarSection({ content }: { content: any }) {
    const features = Array.isArray(content.items) ? content.items : []
    const iconMap: Record<string, any> = {
        dollar: DollarSign,
        clock: Clock,
        truck: Truck,
        package: Package,
        palette: Palette,
        pen: Pen,
        sparkles: Sparkles,
        shield: Shield,
        zap: Zap,
        check: Check
    }

    return (
        <section className="py-12 bg-zinc-950 border-y border-white/5">
            <div className="container mx-auto px-4">
                {content.heading && (
                    <div className="text-center mb-10">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest opacity-60 italic">{content.heading}</h2>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {features.map((feature: any, i: number) => {
                        const Icon = iconMap[feature.icon] || Check
                        return (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-all duration-300 group-hover:rotate-12">
                                    <Icon className="w-6 h-6 text-yellow-500 group-hover:text-black transition-colors" />
                                </div>
                                <h3 className="text-white font-black text-sm uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{feature.subtitle}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function LogoLoopSection({ content }: { content: any }) {
    const logos = Array.isArray(content.items) ? content.items : []
    return (
        <section className="py-16 bg-white overflow-hidden border-b border-gray-50">
            <div className="container mx-auto px-4 mb-10 text-center">
                {content.heading && <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{content.heading}</h3>}
            </div>
            <div className="flex overflow-hidden relative group">
                <div className="flex gap-16 animate-marquee whitespace-nowrap py-4">
                    {[...logos, ...logos, ...logos].map((logo, i) => (
                        <div key={i} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 flex items-center justify-center h-12 w-32">
                            {logo.startsWith('http') ? (
                                <img src={logo} alt={`Client ${i}`} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <span className="text-lg font-black text-gray-300">{logo}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}
