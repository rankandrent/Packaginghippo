import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { Metadata } from "next"
import { SectionRenderer } from "@/components/public/SectionRenderer"
import { Section } from "@/components/admin/SectionBuilder"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, Star } from "lucide-react"

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
        description: product.seoDesc || product.shortDesc,
        openGraph: {
            title: product.seoTitle || product.name,
            description: product.seoDesc || product.shortDesc,
            images: product.images || [],
        },
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) notFound()

    const sections = (product.sections as unknown as Section[]) || []

    return (
        <main className="min-h-screen bg-white">
            {/* Standard Product Hero (Always present) */}
            <section className="pt-32 pb-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border">
                                {product.images?.[0] ? (
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {product.images?.slice(1, 5).map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-white">
                                        <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-6">
                            <div>
                                {product.category && <span className="text-yellow-600 font-bold tracking-wide text-sm uppercase">{product.category.name}</span>}
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">{product.name}</h1>
                            </div>

                            {product.price && (
                                <div className="text-3xl font-bold text-gray-900">${product.price}</div>
                            )}

                            <div className="prose text-gray-600">
                                <p>{product.shortDesc}</p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-14 px-8 rounded-full" asChild>
                                    <Link href="/quote">Get Custom Quote</Link>
                                </Button>
                            </div>

                            {/* Specs */}
                            <div className="bg-white p-6 rounded-xl border space-y-3">
                                <h3 className="font-bold text-lg">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {product.dimensions && (
                                        <div><span className="text-gray-500">Dimensions:</span> <br /> <span className="font-medium">{product.dimensions}</span></div>
                                    )}
                                    {product.materials && (
                                        <div><span className="text-gray-500">Material:</span> <br /> <span className="font-medium">{product.materials}</span></div>
                                    )}
                                    {product.finishings && (
                                        <div><span className="text-gray-500">Finishings:</span> <br /> <span className="font-medium">{product.finishings}</span></div>
                                    )}
                                    {product.minOrder && (
                                        <div><span className="text-gray-500">Min Order:</span> <br /> <span className="font-medium">{product.minOrder} Units</span></div>
                                    )}
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
                <section className="py-16 container mx-auto px-4 prose max-w-4xl">
                    <h2 className="text-3xl font-bold">Product Description</h2>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </section>
            )}
        </main>
    )
}
