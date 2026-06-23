"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { getSeoImageUrl } from "@/lib/image-seo"

interface Product {
    id: string
    name: string
    slug: string
    shortDesc: string | null
    images: string[]
    price: number | null
}

interface PopularProductsProps {
    categoryName: string
    products: Product[]
}

export function PopularProducts({ categoryName, products }: PopularProductsProps) {
    if (!products || products.length === 0) return null

    return (
        <section className="section-py bg-[#F8F9FA]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="brand-eyebrow mb-3">Bestsellers</span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#011f7b] mb-4 mt-3">
                        Discover Our Popular {categoryName}
                    </h2>
                    <p className="text-[#212529]/70 max-w-2xl mx-auto">
                        Explore our most requested solutions, trusted by businesses for their quality and impact.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="brand-card group bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col border border-gray-100">
                            <Link href={`/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
                                {product.images && product.images[0] ? (
                                    <Image
                                        src={getSeoImageUrl(product.images[0])}
                                        alt=""
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                                        <span className="text-4xl font-bold opacity-20">{product.name[0]}</span>
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 bg-[#DAA520] text-[#011f7b] text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> Popular
                                </div>
                            </Link>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-black text-[#011f7b] group-hover:text-[#DAA520] transition-colors tracking-tight">
                                    <Link href={`/${product.slug}`}>
                                        {product.name}
                                    </Link>
                                </h3>

                                <div className="flex items-center justify-end mt-auto">
                                    <Link
                                        href={`/${product.slug}`}
                                        aria-label={`View ${product.name}`}
                                        className="bg-[#011f7b] text-white p-2 rounded-full hover:bg-[#DAA520] hover:text-[#011f7b] transition-colors shadow-md group-hover:scale-110 transform duration-300"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
