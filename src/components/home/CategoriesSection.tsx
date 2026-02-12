"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

type Category = {
    id: string
    name: string
    slug: string
    imageUrl: string | null
    description: string | null
}

export function CategoriesSection({ categories = [] }: { categories: Category[] }) {
    if (!categories || categories.length === 0) return null

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 text-left border-b pb-4">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
                        <span className="hidden md:inline text-gray-400">|</span>
                        <p className="text-gray-600 text-sm md:text-base">Find the perfect packaging for your industry.</p>
                    </div>

                    <Link href="/services" className="group flex items-center gap-1 text-green-600 font-bold text-sm hover:text-green-700 transition-colors whitespace-nowrap">
                        View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categories.map((category) => (
                        <Link href={`/${category.slug}`} key={category.id} className="group block text-center h-full">
                            <div className="relative aspect-[4/3] mb-4 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:border-green-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
                                {category.imageUrl ? (
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50/50 group-hover:bg-gray-50 transition-colors">
                                        <span className="text-4xl font-black text-gray-200 group-hover:text-green-200 transition-colors duration-300">{category.name.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="bg-white/90 text-gray-900 text-xs font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        View Products
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-sm md:text-base px-2">
                                {category.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
