import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { Metadata } from "next"
import { SectionRenderer, Section } from "@/components/public/SectionRenderer"
import { QuoteForm } from "@/components/forms/QuoteForm"


import { Breadcrumbs } from "@/components/public/Breadcrumbs"
import { CollapsibleText } from "@/components/public/CollapsibleText"

export const revalidate = 60 // ISR

async function getCategory(slug: string) {
    const category = await prisma.productCategory.findUnique({
        where: { slug, isActive: true },
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const category = await getCategory(slug)

    if (!category) {
        notFound()
    }

    const testimonials = await getTestimonials(category.id)

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
            }
        ]
    }

    const breadcrumbItems = [
        { label: "Services", href: "/services" },
        { label: category.name }
    ]

    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 pt-32 -mb-24 relative z-10">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <SectionRenderer sections={sections} />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <QuoteForm
                        theme="dark"
                        title={`Get a Quote for ${category.name}`}
                        subtitle="Professional packaging solutions tailored for your business."
                        pageSource={`Category: ${category.name}`}
                    />
                </div>
            </section>

            {/* Category Description (SEO Content) */}
            {category.description && (
                <section className="py-16 bg-white border-t">
                    <div className="container mx-auto px-4 prose max-w-4xl">
                        <h2 className="text-3xl font-bold mb-8">{category.name} Overview</h2>
                        <CollapsibleText content={category.description} collapsedHeight={category.descriptionCollapsedHeight || 300} />
                    </div>
                </section>
            )}

            <TestimonialsSection testimonials={testimonials} />
        </main>
    )
}
