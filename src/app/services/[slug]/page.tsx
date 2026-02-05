import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { Metadata } from "next"
import { SectionRenderer, Section } from "@/components/public/SectionRenderer"


import { Breadcrumbs } from "@/components/public/Breadcrumbs"
import { CollapsibleText } from "@/components/public/CollapsibleText"
import { JsonLd } from "@/components/seo/JsonLd"

export const revalidate = 60 // ISR

async function getCategory(slug: string) {
    const category = await prisma.productCategory.findUnique({
        where: { slug, isActive: true },
        include: {
            products: {
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    shortDesc: true,
                    images: true,
                    price: true
                }
            }
        }
    })
    return category
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const category = await getCategory(slug)

    if (!category) return {}

    return {
        title: category.seoTitle || category.name,
        description: (category.seoDesc || category.description) || undefined,
        keywords: category.seoKeywords || undefined,
        alternates: {
            canonical: `/services/${slug}`,
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

import TestimonialsSection from "@/components/home/TestimonialsSection"

async function getTestimonials(categoryId?: string) {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: {
                isActive: true,
                OR: [
                    { categoryId: categoryId },
                    { productId: null, categoryId: null }
                ]
            },
            take: 6
        })

        return testimonials.sort((a: any, b: any) => {
            if (a.categoryId === categoryId && b.categoryId !== categoryId) return -1
            if (a.categoryId !== categoryId && b.categoryId === categoryId) return 1
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


async function getRelatedCategories(currentSlug: string) {
    const categories = await prisma.productCategory.findMany({
        where: {
            isActive: true,
            slug: { not: currentSlug }
        },
        take: 4,
        orderBy: {
            createdAt: 'desc' // Or 'random' if supported, but simple ordering for now
        },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            description: true
        }
    });
    return categories;
}

async function getPopularProducts(categoryId: string) {
    const products = await prisma.product.findMany({
        where: {
            categoryId: categoryId,
            isActive: true,
            isFeaturedInCategory: true
        },
        take: 8,
        select: {
            id: true,
            name: true,
            slug: true,
            shortDesc: true,
            images: true,
            price: true
        }
    });

    // If no manually selected products, fallback to top products or just random active ones
    if (products.length === 0) {
        return await prisma.product.findMany({
            where: {
                categoryId: categoryId,
                isActive: true
            },
            take: 4,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                shortDesc: true,
                images: true,
                price: true
            }
        })
    }

    return products;
}

import { RelatedCategories } from "@/components/category/RelatedCategories"
import { PopularProducts } from "@/components/category/PopularProducts"
import { CustomQuoteFormSection } from "@/components/home/CustomQuoteFormSection"

async function getQuoteFormImage() {
    try {
        const section = await prisma.homepageSection.findFirst({
            where: {
                sectionKey: 'custom_quote_form',
                isActive: true
            }
        })
        return (section?.content as any)?.image || null
    } catch (error) {
        console.error("Error fetching quote form image:", error)
        return null
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const category = await getCategory(slug)

    if (!category) {
        notFound()
    }

    const testimonials = await getTestimonials(category.id)
    const relatedCategories = await getRelatedCategories(slug)
    const popularProducts = await getPopularProducts(category.id)
    const quoteFormImage = await getQuoteFormImage()

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
                    "name": category.name,
                    "description": category.seoDesc || category.description,
                    "url": `https://packaginghippo.com/services/${slug}`,
                    "mainEntity": {
                        "@type": "ItemList",
                        "numberOfItems": category.products.length,
                        "itemListElement": category.products.map((product, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Product",
                                "name": product.name,
                                "description": product.shortDesc,
                                "url": `https://packaginghippo.com/products/${product.slug}`,
                                "image": product.images?.[0],
                                "brand": {
                                    "@type": "Brand",
                                    "name": "Packaging Hippo"
                                },
                                "offers": {
                                    "@type": "Offer",
                                    "availability": "https://schema.org/InStock",
                                    "priceCurrency": "USD",
                                    "price": product.price || "1.00"
                                }
                            }
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
            />

            <TestimonialsSection testimonials={testimonials} />

            <RelatedCategories categories={relatedCategories} />

            <CustomQuoteFormSection image={quoteFormImage} />

            {/* Category Description (SEO Content) */}
            {category.description && (
                <section className="py-16 bg-white border-t">
                    <div className="container mx-auto px-4 prose max-w-4xl">
                        <h2 className="text-3xl font-bold mb-8">{category.name} Overview</h2>
                        <CollapsibleText content={category.description} collapsedHeight={category.descriptionCollapsedHeight || 300} />
                    </div>
                </section>
            )}
        </main>
    )
}
