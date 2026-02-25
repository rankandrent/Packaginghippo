"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

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
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-4">
                        Discover Our Popular {categoryName}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our most requested solutions, trusted by businesses for their quality and impact.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100">
                            <Link href={`/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
                                {product.images && product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                                        <span className="text-4xl font-bold opacity-20">{product.name[0]}</span>
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> Popular
                                </div>
                            </Link>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                    <Link href={`/${product.slug}`}>
                                        {product.name}
                                    </Link>
                                </h3>

                                <div className="flex items-center justify-end mt-auto">
                                    <Link
                                        href={`/${product.slug}`}
                                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-yellow-500 hover:text-blue-900 transition-colors shadow-md group-hover:scale-110 transform duration-300"
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
