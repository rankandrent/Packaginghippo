import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { Metadata } from "next"
import { SectionRenderer } from "@/components/public/SectionRenderer"
import { Section } from "@/components/admin/SectionBuilder"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, Star, Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Breadcrumbs } from "@/components/public/Breadcrumbs"
import { ProductHeroQuoteForm } from "@/components/forms/ProductHeroQuoteForm"
import { CollapsibleText } from "@/components/public/CollapsibleText"
import { JsonLd } from "@/components/seo/JsonLd"
import { ProductTabs } from "@/components/product/ProductTabs"

export const revalidate = 60

async function getProduct(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug, isActive: true },
        include: { category: true }
    })
    return product
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const product = await getProduct(slug)
    if (!product) return {}

    return {
        title: product.seoTitle || product.name,
        description: (product.seoDesc || product.shortDesc) || undefined,
        keywords: product.seoKeywords || undefined,
        alternates: {
            canonical: `/products/${slug}`,
        },
        openGraph: {
            title: product.seoTitle || product.name,
            description: (product.seoDesc || product.shortDesc) || undefined,
            images: product.images ? product.images.map(img => ({ url: img })) : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.seoTitle || product.name,
            description: (product.seoDesc || product.shortDesc) || undefined,
            images: product.images || [],
        }
    }
}

import TestimonialsSection from "@/components/home/TestimonialsSection"

async function getTestimonials(productId?: string) {
    try {
        const where: any = { isActive: true }
        if (productId) {
            where.productId = productId
        } else {
            // If no product ID, maybe we want general ones? 
            // But for product page we strictly want product ones?
            // Or maybe we want "General + Product"?
            // Let's stick to strict product for now as requested.
        }

        const testimonials = await prisma.testimonial.findMany({
            where: {
                isActive: true,
                OR: [
                    { productId: productId }, // Specific to this product
                    { productId: null, categoryId: null } // General site-wide (fallback/mix)
                ]
            },
            orderBy: [
                { productId: 'desc' }, // items with productId come first (if we sort by that? No, ID isn't sortable like that easily. But we can sort by creation)
                { createdAt: 'desc' }
            ],
            take: 6
        })

        // We want to prioritize specific ones.
        // Prisma sort by relevance isn't native.
        // Let's fetch specific ones separate or sort in JS.
        // JS sort:
        return testimonials.sort((a: any, b: any) => {
            if (a.productId === productId && b.productId !== productId) return -1
            if (a.productId !== productId && b.productId === productId) return 1
            return 0
        }).map((t: any) => ({
            ...t,
            rating: t.rating
        }))
    } catch (error) {
        console.error("Error fetching testimonials:", error)
        return []
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) notFound()

    const testimonials = await getTestimonials(product.id)

    const sections = (product.sections as unknown as Section[]) || []

    const breadcrumbItems = [
        { label: "Products", href: "/products" },
        ...(product.category ? [{ label: product.category.name, href: `/services/${product.category.slug}` }] : []),
        { label: product.name }
    ]

    return (
        <main className="min-h-screen bg-white">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": product.name,
                    "description": product.shortDesc || product.seoDesc,
                    "image": product.images,
                    "brand": {
                        "@type": "Brand",
                        "name": "Packaging Hippo"
                    },
                    "offers": {
                        "@type": "AggregateOffer",
                        "availability": "https://schema.org/InStock",
                        "priceCurrency": "USD",
                        "lowPrice": product.price || "1.00"
                    }
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": breadcrumbItems.map((item, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.label,
                        "item": item.href ? `https://packaginghippo.com${item.href}` : undefined
                    }))
                }}
            />
            <section className="pt-6 pb-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mb-4">
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                        {/* Left Column - Images & Trust (Order 1) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="relative aspect-[1/1] rounded-2xl overflow-hidden bg-gray-50 border shadow-sm">
                                {product.images?.[0] ? (
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-5 gap-2">
                                {product.images?.slice(0, 5).map((img, i) => (
                                    <div key={i} className={cn(
                                        "relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:border-yellow-500 transition-all",
                                        i === 0 ? "border-yellow-500 ring-2 ring-yellow-500/20" : "border-gray-100"
                                    )}>
                                        <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                                <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center gap-3">
                                    <div className="bg-white border rounded p-1">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">Google Business Review 5.0</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center gap-3">
                                    <div className="bg-[#00b67a] p-1 rounded">
                                        <Star className="w-4 h-4 text-white fill-current" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 bg-[#00b67a] rounded-sm flex items-center justify-center text-[8px] font-bold text-white">★</div>)}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">Trustpilot Excellent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Info & Form (Order 2) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    {product.category && <span className="text-yellow-600 font-bold tracking-wide text-xs uppercase mb-1 block">{product.category.name}</span>}
                                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">{product.name}</h1>
                                </div>

                                <div className="prose prose-sm text-gray-600 max-w-none">
                                    <p className="line-clamp-4">{product.shortDesc}</p>
                                </div>

                                {/* Compact Form Injection */}
                                <div className="pt-2">
                                    <ProductHeroQuoteForm productSlug={product.slug} />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-xs text-gray-500 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    Price starts from ${product.price || "3"}. Final cost depends on quantity, material and shipping.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Dynamic Sections */}
            <SectionRenderer sections={sections} />


            {/* Full Description if no text section exists */}
            {!sections.find(s => s.type === 'text') && product.description && (
                <section className="py-16 bg-white border-t">
                    <div className="container mx-auto px-4 prose max-w-4xl">
                        <h2 className="text-3xl font-bold mb-8">Product Overview</h2>
                        <CollapsibleText content={product.description} collapsedHeight={product.descriptionCollapsedHeight || 300} />
                    </div>
                </section>
            )}

            <ProductTabs tabs={product.tabs as any} />

            <TestimonialsSection testimonials={testimonials} />
        </main>
    )
}
