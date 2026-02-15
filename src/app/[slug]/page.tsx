
import { notFound } from "next/navigation"
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
import { CustomQuoteFormSection } from "@/components/home/CustomQuoteFormSection"
import { ProductHeroQuoteForm } from "@/components/forms/ProductHeroQuoteForm"
import { ProductTabs } from "@/components/product/ProductTabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
            title: category.seoTitle || category.name,
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
            title: product.seoTitle || product.name,
            description: (product.seoDesc || product.shortDesc) || undefined,
            keywords: product.seoKeywords || undefined,
            alternates: {
                canonical: `/${slug}`,
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

    // 3. Check if it's a Page
    const page = await getPage(slug)
    if (page) {
        return {
            title: page.seoTitle || page.title,
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

    // 4. Not Found
    notFound()
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

    // Cast sections to proper type
    let sections = (category.sections as unknown as Section[]) || []

    // If no sections are configured, use the Default Template
    if (sections.length === 0) {
        sections = [
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
    if (logoLoop && !sections.find((s: any) => s.type === 'logo_loop')) {
        sections.splice(1, 0, logoLoop)
    }

    const breadcrumbItems = [
        { label: "Services", href: "/services" },
        { label: category.name }
    ]

    return (
        <main className="min-h-screen">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "@id": `https://packaginghippo.com/${slug}`,
                    "name": category.name,
                    "description": category.seoDesc || category.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
                    "url": `https://packaginghippo.com/${slug}`,
                    "mainEntity": {
                        "@type": "ItemList",
                        "numberOfItems": category.products.length,
                        "itemListElement": category.products.map((product: any, index: number) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://packaginghippo.com/${product.slug}`,
                            "name": product.name,
                            "image": product.images?.[0]
                        }))
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
            <SectionRenderer
                sections={sections}
                popularProducts={popularProducts}
                categoryName={category.name}
                breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
                featuredBlogs={featuredBlogs}
                homepageSections={homepageSections}
                quoteFormImage={quoteFormImage}
            />

            <TestimonialsSection testimonials={testimonials} />

            <RelatedCategories categories={relatedCategories} />

            <CustomQuoteFormSection image={quoteFormImage} />

            {/* Category Description (SEO Content) */}
            {category.description && (
                <section className="py-16 bg-white border-t">
                    <div className="container mx-auto px-4 prose max-w-none text-gray-700 leading-relaxed">
                        <h2 className="text-3xl font-bold mb-8">{category.name} Overview</h2>
                        <CollapsibleText content={category.description} collapsedHeight={category.descriptionCollapsedHeight || 300} />
                    </div>
                </section>
            )}
        </main>
    )
}

// ==========================================
// PRODUCT VIEW
// ==========================================
async function ProductView({ product, slug }: { product: any, slug: string }) {
    const featuredBlogs = await getFeaturedBlogs()
    const popularProducts = await getPopularProducts(product.categoryId)
    const quoteFormImage = await getQuoteFormImage()
    const testimonials = await getTestimonials(product.id)
    const homepageSections = await getHomepageSections()

    let sections = (product.sections as unknown as Section[]) || []

    // Inject Logo Loop from homepage if not present
    const logoLoop = homepageSections.find((s: any) => s.type === 'logo_loop')
    const featuresBar = homepageSections.find((s: any) => s.type === 'features_bar')

    if (logoLoop && !sections.find((s: any) => s.type === 'logo_loop')) {
        sections.push(logoLoop)
    }
    if (featuresBar && !sections.find((s: any) => s.type === 'features_bar')) {
        sections.push(featuresBar)
    }

    const breadcrumbItems = [
        { label: "Products", href: "/products" },
        ...(product.category ? [{ label: product.category.name, href: `/${product.category.slug}` }] : []),
        { label: product.name }
    ]

    return (
        <main className="min-h-screen bg-white">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "@id": `https://packaginghippo.com/${product.slug}`,
                    "name": product.name,
                    "description": product.shortDesc || product.seoDesc || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
                    "image": product.images,
                    "sku": product.id.slice(-8).toUpperCase(),
                    "mpn": product.id.slice(-8).toUpperCase(),
                    "category": product.category?.name,
                    "material": product.materials,
                    "brand": {
                        "@type": "Brand",
                        "name": "Packaging Hippo",
                        "@id": "https://packaginghippo.com/#organization"
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
                        <Breadcrumbs items={breadcrumbItems} theme="light" />
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
                                {product.images?.slice(0, 5).map((img: string, i: number) => (
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

            {/* Dynamic Page Sections */}
            {sections.length > 0 && (
                <SectionRenderer
                    sections={sections}
                    featuredBlogs={featuredBlogs}
                    popularProducts={popularProducts}
                    quoteFormImage={quoteFormImage}
                    homepageSections={homepageSections}
                    breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
                    categoryName={product.category?.name}
                />
            )}

            <ProductTabs tabs={product.tabs as any} />

            <TestimonialsSection testimonials={testimonials} />

            {/* Product Description (SEO Content) - Fallback or additional overview */}
            {product.description && !sections.find(s => s.type === 'text') && (
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-4 prose max-w-none">
                        <h2 className="text-3xl font-bold mb-8">Product Overview</h2>
                        <CollapsibleText
                            content={product.description}
                            collapsedHeight={product.descriptionCollapsedHeight || 300}
                        />
                    </div>
                </section>
            )}
        </main>
    )
}

// ==========================================
// PAGE VIEW
// ==========================================
async function PageView({ page, slug }: { page: any, slug: string }) {
    // If content is array, it's sections. If it's string or object with 'html', it might be different.
    // Based on schema, 'content' is Json?

    // Check if it has 'sections' structure or just generic content
    let sections: Section[] = []

    if (Array.isArray(page.content)) {
        sections = page.content as Section[]
    } else {
        // Create a default text section if it's just raw content/html field inside json
        // Or if 'content' is the JSON object itself.
        // TODO: Adapt based on actual data structure. 
        // For now, assuming content might be { html: "..." } or similar if not array.
    }

    // Default breadcrumb
    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: page.title }
    ]

    return (
        <main className="min-h-screen">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": page.title,
                    "description": page.seoDesc,
                    "url": `https://packaginghippo.com/${slug}`
                }}
            />
            <SectionRenderer
                sections={sections}
                // popularProducts={popularProducts} // Optional
                // categoryName={category.name} // Optional
                breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
            />

            {/* Fallback if no sections: render generic content if available */}
            {sections.length === 0 && (
                <div className="container mx-auto px-4 py-16 prose max-w-none text-gray-700 leading-relaxed">
                    <h1>{page.title}</h1>
                    {/* Render raw content if possible, or just Show title */}
                    <div dangerouslySetInnerHTML={{ __html: JSON.stringify(page.content) }} />
                </div>
            )}
        </main>
    )
}
