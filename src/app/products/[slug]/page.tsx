
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Star, Package, ArrowRight } from "lucide-react"
import { STATIC_PRODUCT_CATEGORIES } from "@/lib/data/products-data"

// Revalidate every 60 seconds
export const revalidate = 60

type Props = {
    params: Promise<{ slug: string }>
}

async function getProductData(slug: string) {
    // 1. Try to find in static data first (fastest, and covers our new manual pages)
    const staticData = STATIC_PRODUCT_CATEGORIES[slug]
    if (staticData) return staticData

    // 2. If not found, we could check DB (cms_categories) here in future
    return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await getProductData(slug)

    if (!product) {
        return {
            title: "Product Not Found",
        }
    }

    return {
        title: `${product.name} | Custom Packaging`,
        description: product.description,
        alternates: {
            canonical: `/products/${slug}`,
        },
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params
    const product = await getProductData(slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white">
            {/* HEADER */}
            <div className="bg-zinc-950 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-zinc-950 to-zinc-950"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 capitalize text-yellow-500">
                        {product.name}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        {product.description}
                    </p>
                    <div className="mt-8">
                        <Button variant="default" size="lg" className="text-lg px-8 py-6 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold" asChild>
                            <Link href="/quote">Get Custom Quote <ArrowRight className="ml-2 w-5 h-5" /></Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-12">
                {/* MAIN CONTENT */}
                <div className="md:col-span-2 space-y-12">

                    {/* Intro Block */}
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p className="lead text-xl font-medium text-gray-900">
                            {product.longDescription}
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-4">Key Benefits</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {product.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-700">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-2xl font-bold mt-8 mb-4">Standard Features</h3>
                        <ul className="space-y-2">
                            {product.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-6 pt-8 border-t">
                        <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
                        {[
                            { q: "What is the minimum order quantity?", a: "Our standard MOQ starts at 100 units, but we can accommodate smaller runs for specific prototypes." },
                            { q: "Can I print on the inside of the box?", a: "Yes! We offer full inside and outside printing to give your customers a premium unboxing experience." },
                            { q: "How long does production take?", a: "Standard turnaround is 8-10 business days after design approval. Rush options are available." }
                        ].map((faq, i) => (
                            <div key={i} className="border-b pb-4 last:border-0">
                                <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                </div>

                {/* SIDEBAR (Sticky CTA) */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="shadow-2xl border-yellow-500/20 border-2 overflow-hidden">
                            <div className="h-2 bg-yellow-500 w-full" />
                            <CardContent className="p-8 space-y-6 text-center">
                                <Package className="w-12 h-12 text-yellow-500 mx-auto" />

                                <div>
                                    <h3 className="text-2xl font-black mb-2">Ready to Order?</h3>
                                    <p className="text-gray-500">Get a competitive quote for your custom {product.name.toLowerCase()} today.</p>
                                </div>

                                <Button variant="default" className="w-full h-14 text-lg bg-black hover:bg-zinc-800 text-white font-bold shadow-lg" asChild>
                                    <Link href="/quote">Request Free Quote</Link>
                                </Button>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500" /> Free 3D Mockup
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500" /> Fast Shipping
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500" /> 24/7 Support
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                            <p className="font-bold text-gray-900 mb-1">Need Help Designing?</p>
                            <p className="text-sm text-gray-500 mb-4">Our expert designers are here to help you create the perfect package.</p>
                            <Link href="/contact" className="text-yellow-600 font-bold hover:underline text-sm">Contact Design Team →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
