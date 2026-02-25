import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import prisma from "@/lib/db"
import { constructMetadataTitle } from "@/lib/utils"
import { QuoteForm } from "@/components/forms/QuoteForm"
import { JsonLd } from "@/components/seo/JsonLd"

export const dynamic = 'force-dynamic'

async function getServicesPage() {
    return await prisma.page.findUnique({
        where: { slug: "services" }
    })
}

export async function generateMetadata(): Promise<Metadata> {
    const page = await getServicesPage()

    return {
        title: constructMetadataTitle(page?.seoTitle || "All Packaging Categories | Packaging Hippo"),
        description: page?.seoDesc || "Browse our complete range of custom packaging categories. From corrugated boxes to luxury rigid packaging.",
        keywords: page?.seoKeywords || undefined,
    }
}

function PackageIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    )
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    )
}

export default async function ServicesPage() {
    const page = await getServicesPage()
    const categories = await prisma.productCategory.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
            _count: {
                select: { products: true }
            }
        }
    })

    const htmlContent = page?.content ? (typeof page.content === 'string' ? page.content : (page.content as any).html || '') : null

    return (
        <main className="min-h-screen bg-white">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "@id": "https://packaginghippo.com/services",
                    "name": page?.title || "All Packaging Categories",
                    "description": page?.seoDesc || "Browse our complete range of custom packaging categories. From corrugated boxes to luxury rigid packaging.",
                    "url": "https://packaginghippo.com/services",
                    "mainEntity": {
                        "@type": "ItemList",
                        "numberOfItems": categories.length,
                        "itemListElement": categories.map((item, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://packaginghippo.com/services/${item.slug}`,
                            "name": item.name
                        }))
                    }
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Services", "item": "https://packaginghippo.com/services" }
                    ]
                }}
            />
            {/* Header Section */}
            <div className="bg-zinc-950 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/10 via-zinc-950 to-zinc-950"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {page?.title || "Explore All Categories"}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {page?.seoDesc || "Discover our comprehensive range of custom packaging solutions designed for every industry and need."}
                    </p>
                </div>
            </div>

            {/* Managed Content Area */}
            {htmlContent && (
                <section className="py-16 bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 prose prose-lg max-w-none text-gray-700 leading-relaxed rich-text">
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>
                </section>
            )}

            {/* Categories Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((item, i) => (
                            <Link href={`/${item.slug}`} key={item.id}>
                                <Card className="group cursor-pointer hover:shadow-2xl transition-all border-none shadow-sm h-full rounded-2xl overflow-hidden bg-gray-50/50 hover:bg-white border border-gray-100">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
                                                <PackageIcon className="w-12 h-12 text-yellow-500 opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                            <span className="bg-white/90 text-gray-900 text-xs font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                View Products
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 text-center">
                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-yellow-600 transition-colors uppercase tracking-tight">{item.name}</h3>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* RFQ Form Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <QuoteForm
                        theme="dark"
                        title="Can't find what you're looking for?"
                        subtitle="Request a custom quote and our packaging experts will get back to you within 24 hours."
                        pageSource="All Categories Page"
                    />
                </div>
            </section>
        </main>
    )
}
