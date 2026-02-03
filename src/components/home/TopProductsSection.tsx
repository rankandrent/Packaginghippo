"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

type Product = {
    id: string
    name: string
    slug: string
    images: string[]
}

export function TopProductsSection({ products = [] }: { products: Product[] }) {
    if (!products || products.length === 0) return null

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 text-left border-b pb-4">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-gray-900">Popular Custom Boxes</h2>
                        <span className="hidden md:inline text-gray-400">|</span>
                        <p className="text-gray-600 text-sm md:text-base">Find The Best Custom Packaging For Every Products!</p>
                    </div>

                    <Link href="/products" className="group flex items-center gap-1 text-green-600 font-bold text-sm hover:text-green-700 transition-colors whitespace-nowrap">
                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <Link href={`/products/${product.slug}`} key={product.id} className="group block text-center">
                            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-50 group-hover:shadow-lg transition-all duration-300">
                                {product.images && product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-sm md:text-base px-2">
                                {product.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
