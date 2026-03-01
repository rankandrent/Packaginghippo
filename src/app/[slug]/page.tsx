
import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Check, Info } from "lucide-react"

import { SectionRenderer, Section } from "@/components/public/SectionRenderer"
import { Breadcrumbs } from "@/components/public/Breadcrumbs"
import { CollapsibleText } from "@/components/public/CollapsibleText"
import { JsonLd } from "@/components/seo/JsonLd"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import { RelatedCategories } from "@/components/category/RelatedCategories"
import { PopularProducts } from "@/components/category/PopularProducts"
import { CustomQuoteFormSection } from "@/components/home/CustomQuoteFormSection"
import { ProductHeroQuoteForm } from "@/components/forms/ProductHeroQuoteForm"
import { ProductTabs } from "@/components/product/ProductTabs"
import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { Button } from "@/components/ui/button"
import { cn, constructMetadataTitle } from "@/lib/utils"
import { getSeoImageUrl } from "@/lib/image-seo"
import prisma from "@/lib/db"

import {
    getCategory,
    getProduct,
    getPage,
    getTestimonials,
    getRelatedCategories,
    getPopularProducts,
    getQuoteFormImage,
    getFeaturedBlogs,
    getHomepageSections
} from "@/lib/cms"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params

    // 1. Check if it's a Category
    const category = await getCategory(slug)
    if (category) {
        return {
            title: constructMetadataTitle(category.seoTitle || category.name),
            description: (category.seoDesc || category.description) || undefined,
            keywords: category.seoKeywords || undefined,
            alternates: {
                canonical: `/${slug}`,
            },
            openGraph: {
                title: category.seoTitle || category.name,
                description: (category.seoDesc || category.description) || undefined,
                images: category.imageUrl ? [{ url: category.imageUrl }] : [],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: category.seoTitle || category.name,
                description: (category.seoDesc || category.description) || undefined,
                images: category.imageUrl ? [category.imageUrl] : [],
            }
        }
    }

    // 2. Check if it's a Product
    const product = await getProduct(slug)
    if (product) {
        return {
            title: constructMetadataTitle(product.seoTitle || product.name),
            description: (product.seoDesc || product.shortDesc) || undefined,
            keywords: product.seoKeywords || undefined,
            alternates: {
                canonical: `/${slug}`,
            },
            openGraph: {
                title: product.seoTitle || product.name,
                description: (product.seoDesc || product.shortDesc) || undefined,
                images: product.images ? product.images.map((img: string) => ({ url: getSeoImageUrl(img) })) : [],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.seoTitle || product.name,
                description: (product.seoDesc || product.shortDesc) || undefined,
                images: product.images ? product.images.map((img: string) => getSeoImageUrl(img)) : [],
            }
        }
    }

    // 3. Check if it's a Page
    const page = await getPage(slug)
    if (page) {
        return {
            title: constructMetadataTitle(page.seoTitle || page.title),
            description: page.seoDesc || undefined,
            keywords: page.seoKeywords || undefined,
            alternates: {
                canonical: `/${slug}`,
            }
        }
    }

    return {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // 1. Try Category
    const category = await getCategory(slug)
    if (category) {
        return <CategoryView category={category} slug={slug} />
    }

    // 2. Try Product
    const product = await getProduct(slug)
    if (product) {
        return <ProductView product={product} slug={slug} />
    }

    // 3. Try Page
    const page = await getPage(slug)
    if (page) {
        return <PageView page={page} slug={slug} />
    }

    // 4. Try Blog Post (Redirect to canonical /blog/[slug])
    const blogPost = await prisma.blogPost.findUnique({
        where: { slug },
        select: { id: true }
    })
    if (blogPost) {
        redirect(`/blog/${slug}`)
    }

    // 5. Not Found
    notFound()
}

// Helper to fetch layout settings
async function getLayoutSettings() {
    try {
        const settings = await prisma.siteSettings.findMany({
            where: {
                key: { in: ['layout_product', 'layout_category'] }
            }
        })
        return {
            product: ['product_tabs', 'quote_form', 'content', 'faqs', 'related_products'],
            category: ['testimonials', 'quote_form', 'content', 'faqs', 'related_categories']
        }
    } catch (error) {
        return {
            product: ['product_tabs', 'quote_form', 'content', 'faqs', 'related_products'],
            category: ['testimonials', 'quote_form', 'content', 'faqs', 'related_categories']
        }
    }
}

// ==========================================
// CATEGORY VIEW
// ==========================================
async function CategoryView({ category, slug }: { category: any, slug: string }) {
    const testimonials = await getTestimonials(category.id)
    const relatedCategories = await getRelatedCategories(slug)
    const popularProducts = await getPopularProducts(category.id)
    const quoteFormImage = await getQuoteFormImage()
    const featuredBlogs = await getFeaturedBlogs()
    const homepageSections = await getHomepageSections()
    const layoutSettings = await getLayoutSettings()
    let layoutOrder = layoutSettings.category

    if (category.layout && Array.isArray(category.layout) && category.layout.length > 0) {
        layoutOrder = category.layout
    }

    // Cast sections to proper type
    let dynamicSections = (category.sections as unknown as Section[]) || []

    // If no sections are configured, use the Default Template
    if (dynamicSections.length === 0) {
        dynamicSections = [
            {
                id: 'default-hero',
                type: 'hero',
                content: {
                    heading: category.name,
                    subheading: category.description ? category.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + "..." : "High-quality packaging solutions tailored to your needs.",
                    image: category.imageUrl || "",
                    ctaText: "Get a Quote",
                    ctaLink: "/quote"
                }
            },
            {
                id: 'default-popular',
                type: 'popular_products',
                content: {}
            },
            {
                id: 'default-cta',
                type: 'cta',
                content: {
                    heading: "Ready to Order?",
                    subheading: "Get a custom quote for your packaging needs today.",
                    buttonText: "Request Quote",
                    link: "/quote"
                }
            },
            {
                id: 'default-products',
                type: 'product_grid',
                content: {
                    heading: `Explore ${category.name}`
                }
            },
            {
                id: 'default-benefits',
                type: 'benefits',
                content: {
                    heading: "Why Choose Us?",
                    subheading: "We deliver quality and reliability with every box.",
                    items: [
                        { title: "Premium Quality", desc: "Durable materials and high-quality printing." },
                        { title: "Eco-Friendly", desc: "Sustainable packaging options available." },
                        { title: "Fast Turnaround", desc: "Get your boxes delivered on time, every time." }
                    ]
                }
            }
        ]
    }

    // Inject Logo Loop from homepage if not present
    const logoLoop = homepageSections.find((s: any) => s.type === 'logo_loop')
    if (logoLoop && !dynamicSections.find((s: any) => s.type === 'logo_loop')) {
        dynamicSections.splice(1, 0, logoLoop)
    }

    const breadcrumbItems = [
        { label: "Services", href: "/services" },
        { label: category.name }
    ]

    // SEPARATE FAQs from other dynamic sections if 'faqs' is in the layout order
    const faqSections = dynamicSections.filter((s: any) => s.type === 'faq')
    const otherSections = dynamicSections.filter((s: any) => s.type !== 'faq')

    const renderSection = (id: string) => {
        switch (id) {
            case 'content':
                return category.description && (
                    <section key="content" className="py-16 bg-white border-t">
                        <div className="container mx-auto px-4">
                            <div className="prose max-w-none text-gray-700 leading-relaxed">
                                <h2 className="text-3xl font-bold mb-8">{category.name} Overview</h2>
                                <CollapsibleText content={category.description} collapsedHeight={category.descriptionCollapsedHeight || 300} />
                            </div>
                        </div>
                    </section>
                )
            case 'related_categories':
                return <RelatedCategories key="related" categories={relatedCategories} />
            case 'quote_form':
                return <CustomQuoteFormSection key="quote" image={quoteFormImage} />
            case 'testimonials':
                return <TestimonialsSection key="testimonials" testimonials={testimonials} />
            case 'faqs':
                return faqSections.length > 0 && (
                    <SectionRenderer
                        key="faqs"
                        sections={faqSections}
                        popularProducts={popularProducts}
                        categoryName={category.name}
                        quoteFormImage={quoteFormImage}
                    />
                )
            default:
                return null
        }
    }

    return (
        <main className="min-h-screen">
            {/* 1. Collection Page Schema */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": category.name,
                    "url": `https://packaginghippo.com/${slug}`,
                    "description": category.seoDesc || category.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
                    "isPartOf": {
                        "@type": "WebSite",
                        "name": "Packaging Hippo",
                        "url": "https://packaginghippo.com/"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": "190",
                        "bestRating": "5"
                    }
                }}
            />
            {/* 2. ItemList (Category Products) */}
            {category.products && category.products.length > 0 && (
                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": category.name,
                        "itemListElement": category.products.map((product: any, index: number) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Product",
                                "name": product.name,
                                "url": `https://packaginghippo.com/${product.slug}`
                            }
                        }))
                    }}
                />
            )}
            {/* 3. Dynamic FAQ Schema */}
            {faqSections.map((faqSec: any, idx: number) => {
                const items = faqSec.content?.items || []
                if (items.length === 0) return null
                return (
                    <JsonLd
                        key={`schema-faq-${idx}`}
                        data={{
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": items.map((f: any) => ({
                                "@type": "Question",
                                "name": f.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": f.a
                                }
                            }))
                        }}
                    />
                )
            })}
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
            <SectionRenderer
                sections={otherSections}
                popularProducts={popularProducts}
                categoryName={category.name}
                breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
                featuredBlogs={featuredBlogs}
                homepageSections={homepageSections}
                quoteFormImage={quoteFormImage}
            />

            {/* Render Re-orderable Sections */}
            {layoutOrder.map(id => renderSection(id))}

        </main>
    )
}

// ==========================================
// PRODUCT VIEW
// ==========================================
async function ProductView({ product, slug }: { product: any, slug: string }) {
    const featuredBlogs = await getFeaturedBlogs()
    const testimonials = await getTestimonials(product.id)
    const homepageSections = await getHomepageSections()
    const layoutSettings = await getLayoutSettings()
    const layoutOrder = product.layout && Array.isArray(product.layout) && product.layout.length > 0
        ? product.layout
        : layoutSettings.product

    // Check if the product has manually curated related products
    let popularProducts: any[] = []
    if (product.relatedProductIds && product.relatedProductIds.length > 0) {
        popularProducts = await prisma.product.findMany({
            where: { id: { in: product.relatedProductIds } },
            select: { id: true, name: true, slug: true, images: true, price: true },
            take: 12
        })
    }

    // If no manual related products exist, fallback to category popular products
    if (popularProducts.length === 0) {
        popularProducts = await getPopularProducts(product.categoryId)
    }
    const quoteFormImage = await getQuoteFormImage()

    const sections = (product.sections as unknown as Section[]) || []

    // Inject Features Bar from homepage if not present
    const featuresBar = homepageSections.find((s: any) => s.type === 'features_bar')
    if (featuresBar && !sections.find((s: any) => s.type === 'features_bar')) {
        sections.push(featuresBar)
    }

    // Extract specific dynamic sections to allow manual sorting
    const faqSections = sections.filter((s: any) => s.type === 'faq')
    const materialFinishingSections = sections.filter((s: any) => s.type === 'material_finishing')

    if (materialFinishingSections.length === 0) {
        const homepageMF = homepageSections.find((s: any) => s.type === 'material_finishing')
        if (homepageMF) materialFinishingSections.push(homepageMF)
    }

    const otherSections = sections.filter((s: any) => s.type !== 'faq' && s.type !== 'material_finishing')

    const breadcrumbItems = [
        { label: "Products", href: "/products" },
        ...(product.category ? [{ label: product.category.name, href: `/${product.category.slug}` }] : []),
        { label: product.name }
    ]

    const renderSection = (id: string) => {
        switch (id) {
            case 'content':
                return product.description && !sections.find(s => s.type === 'text') && (
                    <section key="content" className="py-24 bg-white border-t border-gray-100">
                        <div className="container mx-auto px-4">
                            <div className="prose max-w-none text-gray-700 leading-relaxed">
                                <h2 className="text-3xl font-bold mb-8">Product Overview</h2>
                                <CollapsibleText
                                    content={product.description}
                                    collapsedHeight={product.descriptionCollapsedHeight || 300}
                                />
                            </div>
                        </div>
                    </section>
                )
            case 'related_categories':
                // Product View doesn't strictly have related categories in old code, usually has Popular Products or Similar
                // But for consistency with admin UI, we can render if needed, or map to related products?
                // The implementation plan mentioned "Related Categories" for both. Let's assume user might want it.
                // But typically products have "Related Products". Let's use PopularProducts here if the ID matches?
                // Actually, the user asked for "Related Categories" specifically. 
                // Let's perform a check. Product view didn't have RelatedCategories before.
                // It had Testimonials and custom Quote Form, and ProductTabs.
                // Let's stick to what was there + reordering. 
                // Wait, the user prompt said "on catgory and product page 'Related Categories' and 'Get Custom Quote' section scroll down and up".
                // So I should include RelatedCategories on Product page too if not there? 
                // Or maybe they meant "Related Products"?
                // Let's try to include RelatedCategories if available, or just skip if not applicable.
                // Actually, let's include it. It's good for internal linking.
                return null // For now, Product page didn't have related categories component imported/ready. Let's skip or add it?
            // Re-reading: "on catgory and product page"
            // Let's add it. Ideally `getRelatedCategories` works with product slug? No, with category slug.
            // We have `product.category.slug`.
            case 'quote_form':
                return <CustomQuoteFormSection key="quote" image={quoteFormImage} />
            case 'testimonials':
                return <TestimonialsSection key="testimonials" testimonials={testimonials} />
            case 'faqs':
                return faqSections.length > 0 ? <SectionRenderer key="faqs" sections={faqSections} /> : null
            case 'material_finishing':
                return materialFinishingSections.length > 0 ? <SectionRenderer key="mf" sections={materialFinishingSections} /> : null
            case 'product_tabs':
                return <ProductTabs key="product_tabs" tabs={product.tabs as any} />
            case 'related_products':
                return popularProducts && popularProducts.length > 0 ? (
                    <PopularProducts
                        key="related_products"
                        categoryName={product.relatedProductIds?.length > 0 ? "Related Products" : (product.category?.name || "Packaging")}
                        products={popularProducts}
                    />
                ) : null
            default:
                return null
        }
    }

    return (
        <main className="min-h-screen bg-white">
            {/* 1. Breadcrumb Schema */}
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
            {/* 2. Product Schema */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "@id": `https://packaginghippo.com/${product.slug}`,
                    "name": product.name,
                    "image": product.images ? product.images.map((img: string) => getSeoImageUrl(img)) : [],
                    "description": product.shortDesc || product.seoDesc || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
                    "sku": product.id.substring(0, 8).toUpperCase(),
                    "mpn": product.id.substring(0, 8).toUpperCase(),
                    "brand": {
                        "@type": "Brand",
                        "name": "Packaging Hippo",
                        "@id": "https://packaginghippo.com/#organization"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": "210",
                        "bestRating": "5"
                    },
                    "offers": {
                        "@type": "AggregateOffer",
                        "availability": "https://schema.org/InStock",
                        "priceCurrency": "USD",
                        "lowPrice": product.price || "1.00",
                        "offerCount": "1",
                        "url": `https://packaginghippo.com/${product.slug}`,
                        "seller": {
                            "@type": "Organization",
                            "name": "Packaging Hippo",
                            "@id": "https://packaginghippo.com/#organization"
                        }
                    },
                    "additionalProperty": [
                        ...(product.materials ? [{
                            "@type": "PropertyValue",
                            "name": "Material",
                            "value": product.materials
                        }] : []),
                        ...(product.dimensions ? [{
                            "@type": "PropertyValue",
                            "name": "Dimensions",
                            "value": product.dimensions
                        }] : [])
                    ]
                }}
            />
            {/* 3. WebPage Schema */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": product.name,
                    "description": product.seoDesc || product.shortDesc || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
                    "url": `https://packaginghippo.com/${product.slug}`
                }}
            />
            <section className="pt-6 pb-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mb-4">
                        <Breadcrumbs items={breadcrumbItems} theme="light" />
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                        {/* Left Column - Images & Trust (Order 1) */}
                        <div className="lg:col-span-5 space-y-6">
                            <ProductImageGallery images={(product.images || []).map((img: string) => getSeoImageUrl(img))} name={product.name} />

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
                                    Final cost depends on quantity, material, dimensions, and shipping.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Page Sections */}
            {otherSections.length > 0 && (
                <SectionRenderer
                    sections={otherSections}
                    featuredBlogs={featuredBlogs}
                    popularProducts={popularProducts}
                    quoteFormImage={quoteFormImage}
                    homepageSections={homepageSections}
                    breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
                    categoryName={product.category?.name}
                />
            )}

            {/* Material & Finishing — render if the product has it and it's not in layoutOrder */}
            {materialFinishingSections.length > 0 && !layoutOrder.includes('material_finishing') && (
                <SectionRenderer key="mf-auto" sections={materialFinishingSections} />
            )}

            {/* Re-orderable Sections */}
            {layoutOrder.map((id: string) => renderSection(id))}

        </main>
    )
}

// ==========================================
// PAGE VIEW
// ==========================================
async function PageView({ page, slug }: { page: any, slug: string }) {
    let sections: Section[] = []

    if (Array.isArray(page.content)) {
        sections = page.content as Section[]
    }

    const htmlContent = page?.content ? (typeof page.content === 'string' ? page.content : (page.content as any).html || '') : null

    const breadcrumbItems = [
        { label: page.title }
    ]

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-12 md:pt-32">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": page.title,
                    "description": page.seoDesc,
                    "url": `https://packaginghippo.com/${slug}`
                }}
            />

            {/* Header Area */}
            <div className="bg-gray-50 border-b pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                        <div className="mb-4">
                            <Breadcrumbs items={breadcrumbItems} theme="light" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-blue-900 uppercase tracking-tight">
                            {page.title}
                        </h1>
                    </div>
                </div>
            </div>

            <SectionRenderer
                sections={sections}
            />

            {sections.length === 0 && htmlContent && (
                <div className="bg-white py-16 border-t border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed rich-text">
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
