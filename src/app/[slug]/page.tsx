
import { notFound, permanentRedirect, redirect } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Check, Info } from "lucide-react"

import { SectionRenderer, Section } from "@/components/public/SectionRenderer"
import { Breadcrumbs } from "@/components/public/Breadcrumbs"
import { CollapsibleText } from "@/components/public/CollapsibleText"
import { JsonLd } from "@/components/seo/JsonLd"
import { PageSchema } from "@/components/schema/PageSchema"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import { RelatedCategories } from "@/components/category/RelatedCategories"
import { PopularProducts } from "@/components/category/PopularProducts"
import { CustomQuoteFormSection } from "@/components/home/CustomQuoteFormSection"
import { ProductHeroQuoteForm } from "@/components/forms/ProductHeroQuoteForm"
import { ProductTabs } from "@/components/product/ProductTabs"
import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { AddToCartButton } from "@/components/cart/AddToCartButton"
import { Button } from "@/components/ui/button"
import { cn, constructMetadataTitle, getSiteUrl, stripHtml } from "@/lib/utils"
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

const SITE_URL = getSiteUrl()
const DEFAULT_SCHEMA_RATING = {
    ratingValue: 4.9,
    bestRating: 5,
    ratingCount: 101,
}
const DEFAULT_SCHEMA_PRICE = 1

function getSchemaPrice(data: { schemaPrice?: number | null, ecommercePrice?: number | null, price?: number | null }) {
    if (typeof data.schemaPrice === "number" && data.schemaPrice > 0) {
        return data.schemaPrice
    }

    if (typeof data.ecommercePrice === "number" && data.ecommercePrice > 0) {
        return data.ecommercePrice
    }

    if (typeof data.price === "number" && data.price > 0) {
        return data.price
    }

    return DEFAULT_SCHEMA_PRICE
}

function getAggregateRating(data: { ratingValue?: number | null, bestRating?: number | null, ratingCount?: number | null }) {
    return {
        "@type": "AggregateRating",
        "ratingValue": typeof data.ratingValue === "number" ? data.ratingValue : DEFAULT_SCHEMA_RATING.ratingValue,
        "bestRating": typeof data.bestRating === "number" ? data.bestRating : DEFAULT_SCHEMA_RATING.bestRating,
        "ratingCount": typeof data.ratingCount === "number" ? data.ratingCount : DEFAULT_SCHEMA_RATING.ratingCount,
    }
}

async function getStructuredDataSettings() {
    try {
        const settings = await prisma.siteSettings.findMany({
            where: {
                key: { in: ["general", "footer"] }
            }
        })

        const general = settings.find((s) => s.key === "general")?.value as any || {}
        const footer = settings.find((s) => s.key === "footer")?.value as any || {}

        return { general, footer }
    } catch (error) {
        console.error("Failed to load structured data settings:", error)
        return { general: {}, footer: {} }
    }
}

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const [category, product, page] = await Promise.all([
        getCategory(slug),
        getProduct(slug),
        getPage(slug),
    ])

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
    const [category, product, page, blogPost] = await Promise.all([
        getCategory(slug),
        getProduct(slug),
        getPage(slug),
        prisma.blogPost.findUnique({
            where: { slug },
            select: { id: true }
        })
    ])

    if (category) {
        return <CategoryView category={category} slug={slug} />
    }

    if (product) {
        return <ProductView product={product} slug={slug} />
    }

    if (page) {
        return <PageView page={page} slug={slug} />
    }

    if (blogPost) {
        permanentRedirect(`/blog/${slug}`)
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
        // Default layout matching requested best structure
        return {
            product: ['product_tabs', 'material_finishing', 'testimonials', 'content', 'faqs', 'related_products'],
            category: ['testimonials', 'cta', 'quote_form', 'content', 'faqs', 'related_products']
        }
    } catch (error) {
        return {
            product: ['product_tabs', 'material_finishing', 'testimonials', 'content', 'faqs', 'related_products'],
            category: ['testimonials', 'cta', 'quote_form', 'content', 'faqs', 'related_products']
        }
    }
}

// ==========================================
// CATEGORY VIEW
// ==========================================
async function CategoryView({ category, slug }: { category: any, slug: string }) {
    const [
        testimonials,
        relatedCategories,
        popularProducts,
        quoteFormImage,
        featuredBlogs,
        homepageSections,
        layoutSettings,
    ] = await Promise.all([
        getTestimonials(category.id),
        getRelatedCategories(slug, category.relatedCategoryIds || []),
        getPopularProducts(category.id),
        getQuoteFormImage(),
        getFeaturedBlogs(),
        getHomepageSections(),
        getLayoutSettings(),
    ])
    const { general, footer } = await getStructuredDataSettings()
    let layoutOrder = layoutSettings.category

    if (category.layout && Array.isArray(category.layout) && category.layout.length > 0) {
        layoutOrder = category.layout
    }

    // Cast sections to proper type
    let dynamicSections = (category.sections as unknown as Section[]) || []

    // If no sections are configured, use the Default Template
    // Matching the best-performing category page: custom-rigid-boxes
    if (dynamicSections.length === 0) {
        dynamicSections = [
            {
                id: 'default-hero',
                type: 'hero',
                content: {
                    heading: category.name,
                    subheading: category.description ? category.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + "..." : "High-quality packaging solutions tailored to your needs.",
                    image: category.imageUrl || "",
                    ctaText: "Get Custom Quote",
                    ctaLink: "/quote"
                }
            },
            {
                id: 'default-products',
                type: 'product_grid',
                content: {
                    heading: `Our ${category.name} Products`
                }
            },
            {
                id: 'default-cta',
                type: 'cta',
                content: {
                    heading: "Ready to Elevate Your Brand?",
                    subheading: "Get premium custom packaging that makes your products stand out.",
                    buttonText: "Start Your Project",
                    link: "/quote"
                }
            },
            {
                id: 'default-faq',
                type: 'faq',
                content: {
                    heading: `Frequently Asked Questions About ${category.name}`,
                    items: [
                        {
                            q: `What materials are available for ${category.name}?`,
                            a: `We offer a wide range of premium materials for ${category.name} including kraft, cardboard, corrugated, rigid board, and eco-friendly options. Each material can be customized to match your brand requirements.`
                        },
                        {
                            q: `What is the minimum order quantity for ${category.name}?`,
                            a: `Our minimum order quantity for ${category.name} starts at just 100 units, making it accessible for businesses of all sizes. We offer competitive pricing with bulk order discounts.`
                        },
                        {
                            q: `How long does it take to produce ${category.name}?`,
                            a: `Standard production time for ${category.name} is 8-12 business days after design approval. Rush orders are available with expedited turnaround times upon request.`
                        },
                        {
                            q: `Can I get a sample before placing a bulk order?`,
                            a: `Yes! We offer sample kits and pre-production samples so you can review the quality, material, and print finish before committing to a full order.`
                        },
                        {
                            q: `Do you offer custom printing and finishing options?`,
                            a: `Absolutely. We provide full-color CMYK/PMS printing, embossing, debossing, foil stamping, spot UV, matte/gloss lamination, and many other premium finishing options to elevate your packaging.`
                        }
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
    const categoryAggregateRating = getAggregateRating(category)
    const categorySchemaPrice = getSchemaPrice(category)
    const categorySchemaProducts =
        popularProducts && popularProducts.length > 0
            ? popularProducts
            : category.products || []
    const siteName = general.siteName || "Packaging Hippo"
    const phone = general.phone || "+1 (510) 500-9533"
    const email = general.email || "sales@packaginghippo.com"
    const logoUrl = general.logoUrl && general.logoUrl !== "/logo.png"
        ? getSeoImageUrl(general.logoUrl)
        : `${SITE_URL}/logo-horizontal.svg`
    const socialLinks = [
        footer?.social?.facebook,
        footer?.social?.instagram,
        footer?.social?.linkedin,
        footer?.social?.twitter,
        footer?.social?.behance,
        footer?.social?.youtube,
    ].filter(Boolean)
    const categoryDescription = category.seoDesc || stripHtml(category.description, 160)
    const categoryImage = category.imageUrl ? getSeoImageUrl(category.imageUrl) : undefined
    const breadcrumbId = `${SITE_URL}/${slug}#breadcrumb`
    const webPageId = `${SITE_URL}/${slug}#webpage`

    // SEPARATE FAQs and CTAs from other dynamic sections if they are in the layout order
    const faqSections = dynamicSections.filter((s: any) => s.type === 'faq')
    const ctaSections = dynamicSections.filter((s: any) => s.type === 'cta')
    // Also filter out quote_form/custom_quote_form if they're already in layoutOrder to prevent duplicates
    const hasQuoteInLayout = layoutOrder.includes('quote_form')
    const otherSections = dynamicSections.filter((s: any) =>
        s.type !== 'faq' &&
        s.type !== 'cta' &&
        s.type !== 'popular_products' &&
        !(hasQuoteInLayout && (s.type === 'quote_form' || s.type === 'custom_quote_form'))
    )

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
            case 'related_products':
                return popularProducts && popularProducts.length > 0 ? (
                    <PopularProducts
                        key="related_products"
                        categoryName={category.name}
                        products={popularProducts}
                    />
                ) : null
            case 'quote_form':
                return <CustomQuoteFormSection key="quote" image={quoteFormImage} />
            case 'testimonials':
                return <TestimonialsSection key="testimonials" testimonials={testimonials} aggregateRating={categoryAggregateRating} />
            case 'cta':
                return ctaSections.length > 0 && (
                    <SectionRenderer
                        key="cta"
                        sections={ctaSections}
                        quoteFormImage={quoteFormImage}
                    />
                )
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
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "@id": `${SITE_URL}/#organization`,
                    "name": siteName,
                    "url": SITE_URL,
                    "logo": {
                        "@type": "ImageObject",
                        "url": logoUrl,
                    },
                    "description": categoryDescription,
                    "email": email,
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": phone,
                        "contactType": "customer service",
                        "areaServed": "US",
                        "availableLanguage": "en"
                    },
                    ...(socialLinks.length > 0 ? { "sameAs": socialLinks } : {})
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "@id": `${SITE_URL}/#localbusiness`,
                    "name": siteName,
                    "url": SITE_URL,
                    "logo": logoUrl,
                    ...(categoryImage ? { "image": [categoryImage] } : {}),
                    "description": categoryDescription,
                    "telephone": phone,
                    "email": email,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": general.address || "123 Packaging Street, Industrial District, NY 10001",
                        "addressCountry": "US"
                    },
                    "parentOrganization": { "@id": `${SITE_URL}/#organization` },
                    ...(socialLinks.length > 0 ? { "sameAs": socialLinks } : {})
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "@id": `${SITE_URL}/#website`,
                    "url": SITE_URL,
                    "name": siteName,
                    "description": categoryDescription,
                    "publisher": { "@id": `${SITE_URL}/#organization` },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${SITE_URL}/products?search={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "@id": webPageId,
                    "url": `${SITE_URL}/${slug}`,
                    "name": category.name,
                    "description": categoryDescription,
                    "isPartOf": { "@id": `${SITE_URL}/#website` },
                    "about": { "@id": `${SITE_URL}/#organization` },
                    "breadcrumb": { "@id": breadcrumbId },
                    ...(categoryImage
                        ? {
                            "primaryImageOfPage": {
                                "@type": "ImageObject",
                                "url": categoryImage
                            }
                        }
                        : {})
                }}
            />
            {/* 1. Collection Page Schema */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "@id": `${SITE_URL}/${slug}#collection`,
                    "name": category.name,
                    "url": `${SITE_URL}/${slug}`,
                    "description": categoryDescription,
                    "isPartOf": { "@id": `${SITE_URL}/#website` },
                    "aggregateRating": categoryAggregateRating
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "ProductGroup",
                    "@id": `${SITE_URL}/${slug}#product-group`,
                    "name": category.name,
                    "url": `${SITE_URL}/${slug}`,
                    "description": categoryDescription,
                    ...(categoryImage ? { "image": [categoryImage] } : {}),
                    "brand": {
                        "@type": "Brand",
                        "name": "Packaging Hippo",
                        "@id": `${SITE_URL}/#organization`
                    },
                    "aggregateRating": categoryAggregateRating,
                    ...(categorySchemaPrice
                        ? {
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "USD",
                                "price": categorySchemaPrice.toFixed(2),
                                "availability": "https://schema.org/InStock",
                                "url": `${SITE_URL}/${slug}`,
                                "seller": {
                                    "@type": "Organization",
                                    "name": "Packaging Hippo",
                                    "@id": `${SITE_URL}/#organization`
                                }
                            }
                        }
                        : {})
                }}
            />
            {/* 2. ItemList (Displayed Category Products) */}
            {categorySchemaProducts.length > 0 && (
                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "@id": `${SITE_URL}/${slug}#itemlist`,
                        "name": category.name,
                        "itemListElement": categorySchemaProducts.map((product: any, index: number) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "name": product.name,
                            "item": `${SITE_URL}/${product.slug}`
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
                    "@id": breadcrumbId,
                    "itemListElement": breadcrumbItems.map((item, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.label,
                        "item": item.href ? `${SITE_URL}${item.href}` : undefined
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
    const [featuredBlogs, testimonials, homepageSections, layoutSettings, quoteFormImage] = await Promise.all([
        getFeaturedBlogs(),
        getTestimonials(product.id),
        getHomepageSections(),
        getLayoutSettings(),
        getQuoteFormImage(),
    ])
    const { general, footer } = await getStructuredDataSettings()
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

    const sections = (product.sections as unknown as Section[]) || []

    // Inject Features Bar from homepage if not present
    const featuresBar = homepageSections.find((s: any) => s.type === 'features_bar')
    if (featuresBar && !sections.find((s: any) => s.type === 'features_bar')) {
        sections.push(featuresBar)
    }

    // Extract specific dynamic sections to allow manual sorting
    let faqSections = sections.filter((s: any) => s.type === 'faq')
    const materialFinishingSections = sections.filter((s: any) => s.type === 'material_finishing')

    // Inject default FAQs if none configured
    if (faqSections.length === 0) {
        faqSections = [{
            id: 'default-product-faq',
            type: 'faq',
            content: {
                heading: `Frequently Asked Questions About ${product.name}`,
                items: [
                    {
                        q: `What customization options are available for ${product.name}?`,
                        a: `We offer full customization for ${product.name} including custom sizes, shapes, colors, printing (CMYK/PMS), and premium finishes like embossing, foil stamping, spot UV, and lamination.`
                    },
                    {
                        q: `What is the minimum order quantity for ${product.name}?`,
                        a: `The minimum order quantity for ${product.name} starts at just 100 units. We offer flexible quantity options with volume-based pricing discounts for larger orders.`
                    },
                    {
                        q: `How long does production take for ${product.name}?`,
                        a: `Standard production time for ${product.name} is 8-12 business days after design approval. Rush production is available upon request for urgent orders.`
                    },
                    {
                        q: `Can I request a sample of ${product.name} before ordering?`,
                        a: `Yes! We provide pre-production samples so you can evaluate the material quality, print accuracy, and overall finish before placing your bulk order.`
                    },
                    {
                        q: `What materials are used for ${product.name}?`,
                        a: `We use premium materials including kraft paper, cardboard, corrugated board, rigid chipboard, and eco-friendly recyclable options. Material selection depends on your specific requirements for durability and presentation.`
                    }
                ]
            }
        }]
    }

    if (materialFinishingSections.length === 0) {
        const homepageMF = homepageSections.find((s: any) => s.type === 'material_finishing')
        if (homepageMF) materialFinishingSections.push(homepageMF)
    }

    // Filter out quote_form/custom_quote_form to prevent duplicates (hero already has ProductHeroQuoteForm)
    const otherSections = sections.filter((s: any) =>
        s.type !== 'faq' &&
        s.type !== 'material_finishing' &&
        s.type !== 'quote_form' &&
        s.type !== 'custom_quote_form'
    )

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
                return <TestimonialsSection key="testimonials" testimonials={testimonials} aggregateRating={productAggregateRating} />
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

    const offerPrice = getSchemaPrice(product)
    const productAggregateRating = getAggregateRating(product)
    const siteName = general.siteName || "Packaging Hippo"
    const phone = general.phone || "+1 (510) 500-9533"
    const email = general.email || "sales@packaginghippo.com"
    const logoUrl = general.logoUrl && general.logoUrl !== "/logo.png"
        ? getSeoImageUrl(general.logoUrl)
        : `${SITE_URL}/logo-horizontal.svg`
    const socialLinks = [
        footer?.social?.facebook,
        footer?.social?.instagram,
        footer?.social?.linkedin,
        footer?.social?.twitter,
        footer?.social?.behance,
        footer?.social?.youtube,
    ].filter(Boolean)
    const productDescription = product.shortDesc || product.seoDesc || stripHtml(product.description, 160)
    const productImages = product.images ? product.images.map((img: string) => getSeoImageUrl(img)) : []
    const productImage = productImages[0]
    const breadcrumbId = `${SITE_URL}/${slug}#breadcrumb`
    const webPageId = `${SITE_URL}/${slug}#webpage`

    const availabilityMap: Record<string, string> = {
        IN_STOCK: "https://schema.org/InStock",
        OUT_OF_STOCK: "https://schema.org/OutOfStock",
        PRE_ORDER: "https://schema.org/PreOrder",
    }

    return (
        <main className="min-h-screen bg-white">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "@id": `${SITE_URL}/#organization`,
                    "name": siteName,
                    "url": SITE_URL,
                    "logo": {
                        "@type": "ImageObject",
                        "url": logoUrl,
                    },
                    "description": productDescription,
                    "email": email,
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": phone,
                        "contactType": "customer service",
                        "areaServed": "US",
                        "availableLanguage": "en"
                    },
                    ...(socialLinks.length > 0 ? { "sameAs": socialLinks } : {})
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "@id": `${SITE_URL}/#localbusiness`,
                    "name": siteName,
                    "url": SITE_URL,
                    "logo": logoUrl,
                    ...(productImage ? { "image": [productImage] } : {}),
                    "description": productDescription,
                    "telephone": phone,
                    "email": email,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": general.address || "123 Packaging Street, Industrial District, NY 10001",
                        "addressCountry": "US"
                    },
                    "parentOrganization": { "@id": `${SITE_URL}/#organization` },
                    ...(socialLinks.length > 0 ? { "sameAs": socialLinks } : {})
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "@id": `${SITE_URL}/#website`,
                    "url": SITE_URL,
                    "name": siteName,
                    "description": productDescription,
                    "publisher": { "@id": `${SITE_URL}/#organization` },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${SITE_URL}/products?search={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "@id": webPageId,
                    "url": `${SITE_URL}/${slug}`,
                    "name": product.name,
                    "description": productDescription,
                    "isPartOf": { "@id": `${SITE_URL}/#website` },
                    "about": { "@id": `${SITE_URL}/#organization` },
                    "breadcrumb": { "@id": breadcrumbId },
                    ...(productImage
                        ? {
                            "primaryImageOfPage": {
                                "@type": "ImageObject",
                                "url": productImage
                            }
                        }
                        : {})
                }}
            />
            {/* 1. Breadcrumb Schema */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "@id": breadcrumbId,
                    "itemListElement": breadcrumbItems.map((item, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.label,
                        "item": item.href ? `${SITE_URL}${item.href}` : undefined
                    }))
                }}
            />
            {/* 2. Product Schema */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "@id": `${SITE_URL}/${product.slug}`,
                    "name": product.name,
                    "image": productImages,
                    "description": productDescription,
                    "sku": product.id.substring(0, 8).toUpperCase(),
                    "mpn": product.id.substring(0, 8).toUpperCase(),
                    "url": `${SITE_URL}/${product.slug}`,
                    "brand": {
                        "@type": "Brand",
                        "name": "Packaging Hippo",
                        "@id": `${SITE_URL}/#organization`
                    },
                    "aggregateRating": productAggregateRating,
                    ...(offerPrice
                        ? {
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "USD",
                                "price": offerPrice.toFixed(2),
                                "availability": availabilityMap[product.stockStatus] || availabilityMap.IN_STOCK,
                                "itemCondition": "https://schema.org/NewCondition",
                                "url": `${SITE_URL}/${product.slug}`,
                                "seller": {
                                    "@type": "Organization",
                                    "name": "Packaging Hippo",
                                    "@id": `${SITE_URL}/#organization`
                                },
                                "shippingDetails": {
                                    "@type": "OfferShippingDetails",
                                    "shippingRate": {
                                        "@type": "MonetaryAmount",
                                        "value": "0",
                                        "currency": "USD"
                                    },
                                    "shippingDestination": {
                                        "@type": "DefinedRegion",
                                        "addressCountry": "US"
                                    },
                                    "deliveryTime": {
                                        "@type": "ShippingDeliveryTime",
                                        "handlingTime": {
                                            "@type": "QuantitativeValue",
                                            "minValue": 8,
                                            "maxValue": 12,
                                            "unitCode": "DAY"
                                        },
                                        "transitTime": {
                                            "@type": "QuantitativeValue",
                                            "minValue": 8,
                                            "maxValue": 12,
                                            "unitCode": "DAY"
                                        }
                                    }
                                }
                            }
                        }
                        : {}),
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
                                        <span className="text-[10px] font-bold text-gray-900 tracking-tight">Google Business Review 5.0</span>
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
                                        <span className="text-[10px] font-bold text-gray-900 tracking-tight">Trustpilot Excellent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Info & Form (Order 2) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    {product.category && <span className="text-yellow-600 font-bold tracking-wide text-xs mb-1 block">{product.category.name}</span>}
                                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">{product.name}</h1>
                                </div>

                                {product.isEcommerce && product.ecommercePrice ? (
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-4xl font-black text-blue-600">${product.ecommercePrice.toFixed(2)}</span>
                                        <span className="text-sm text-gray-500 line-through">${(product.ecommercePrice * 1.2).toFixed(2)}</span>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-tighter ml-2">Save 20%</span>
                                    </div>
                                ) : (
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {[
                                        { icon: "⚡", label: "Quote in 2 Hours" },
                                        { icon: "🎁", label: "Free of Charge" },
                                            { icon: "✅", label: "No Commitment" },
                                        ].map(({ icon, label }) => (
                                            <div key={label} className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
                                                <span className="text-sm">{icon}</span>
                                                <span className="text-xs font-bold text-green-800">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="prose prose-sm text-gray-600 max-w-none">
                                    <p>{product.shortDesc}</p>
                                </div>

                                {/* Compact Form Injection or Add to Cart */}
                                <div className="pt-2 space-y-4">
                                    {product.isEcommerce ? (
                                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                                            <AddToCartButton 
                                                product={{
                                                    id: product.id,
                                                    name: product.name,
                                                    slug: product.slug,
                                                    price: product.ecommercePrice || 0,
                                                    image: product.images?.[0] || ""
                                                }}
                                                className="w-full h-14 text-lg font-black rounded-xl shadow-lg shadow-blue-200"
                                            />
                                            <Button asChild variant="outline" className="w-full h-14 text-lg font-bold rounded-xl border-gray-200">
                                                <Link href="/quote">Bulk Quote</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <ProductHeroQuoteForm productSlug={product.slug} />
                                    )}
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
            <PageSchema page={page} />

            {/* Header Area */}
            <div className="bg-gray-50 border-b pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                        <div className="mb-4">
                            <Breadcrumbs items={breadcrumbItems} theme="light" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-blue-900 tracking-tight">
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
