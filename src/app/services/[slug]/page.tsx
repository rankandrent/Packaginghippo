
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Star, User, Package } from "lucide-react"

// Revalidate every 60 seconds
export const revalidate = 60

type Props = {
    params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
    const { data, error } = await supabase
        .from("cms_categories")
        .select("*, products:cms_products(*)")
        .eq("slug", slug)
        .single()

    if (error || !data) {
        return null
    }
    return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const category = await getCategory(slug)

    if (!category) {
        return {
            title: "Category Not Found",
        }
    }

    return {
        title: `${category.name} | Custom Packaging`,
        description: category.description,
        alternates: {
            canonical: `/services/${slug}`,
        },
    }
}

export default async function ServicePage({ params }: Props) {
    const { slug } = await params
    const category = await getCategory(slug)

    if (!category) {
        notFound() // Or render a fallback for hardcoded legacy services if needed
    }

    return (
        <div className="min-h-screen bg-white">
            {/* HEADER */}
            <div className="bg-gray-900 text-white pt-32 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 capitalize text-yellow-500">
                        {category.name}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        {category.description || `Premium quality ${category.name} tailored to your brand needs.`}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
                {/* MAIN CONTENT */}
                <div className="md:col-span-2 space-y-12">

                    {/* Intro Block */}
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p className="lead text-xl font-medium text-gray-900">
                            Looking for the best <strong>{category.name}</strong> manufacturer?
                            Packaging Hippo offers top-tier custom packaging solutions designed to specific industry standards.
                        </p>
                        <h3>Why Choose Our Custom {category.name}?</h3>
                        <p>
                            We utilize state-of-the-art offset and digital printing technology to ensure your boxes stand out.
                            Whether you need retail packaging, shipping boxes, or gift boxes, our {category.name}
                            provide the perfect blend of protection and presentation.
                        </p>
                        <ul>
                            <li>High-Quality Cardboard & Corrugated Stock</li>
                            <li>Free Design Support & 3D Mockups</li>
                            <li>Fast Turnaround (6-8 Business Days)</li>
                            <li>Competitive Wholesale Pricing</li>
                        </ul>
                    </div>

                    {/* Products List in this Category */}
                    {category.products && category.products.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Available Products</h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {category.products.map((product: any) => (
                                    <Link href={`/quote?product=${product.slug}`} key={product.id}>
                                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                            <CardContent className="p-4">
                                                <div className="aspect-square relative bg-gray-100 mb-4 rounded-md overflow-hidden">
                                                    {product.images && product.images[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-400">
                                                            <Package className="w-10 h-10" />
                                                        </div>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                                                {product.price > 0 && <p className="text-yellow-600 font-bold">${product.price}</p>}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Long Form Content Placeholder - Could come from DB if added to schema */}
                    {/* ... keeping existing static content structure if needed, or removing ... */}

                    {/* FAQ Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
                        {[
                            { q: "What is the minimum order quantity?", a: "Our MOQ starts at just 100 units for this product category." },
                            { q: "Can I get a physical sample?", a: "Yes, we offer sample kits and custom prototypes." },
                            { q: "Do you offer eco-friendly options?", a: "Absolutely! We have Kraft and recycled materials available." }
                        ].map((faq, i) => (
                            <div key={i} className="border-b pb-4">
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <div className="bg-yellow-100 text-yellow-700 p-1 rounded-full"><Check className="w-4 h-4" /></div>
                                    {faq.q}
                                </h4>
                                <p className="text-gray-600 pl-8">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                </div>

                {/* SIDEBAR (Sticky CTA) */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="shadow-2xl border-yellow-500/20 border-2">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-xl font-bold text-center">Get Instant Quote</h3>
                                <p className="text-center text-sm text-gray-500">Best Price Guaranteed. Fast Response.</p>
                                <Button variant="default" className="w-full h-12 text-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold" asChild>
                                    <Link href="/quote">Request Quote Now</Link>
                                </Button>
                                <div className="flex justify-center text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
