import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { Metadata } from "next"
import { SectionRenderer } from "@/components/public/SectionRenderer"
import { Section } from "@/components/admin/SectionBuilder"

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
        description: category.seoDesc || category.description,
        openGraph: {
            title: category.seoTitle || category.name,
            description: category.seoDesc || category.description,
            images: category.imageUrl ? [category.imageUrl] : [],
        },
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const category = await getCategory(slug)

    if (!category) {
        notFound()
    }

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

    return (
        <main className="min-h-screen">
            <SectionRenderer sections={sections} />
        </main>
    )
}
