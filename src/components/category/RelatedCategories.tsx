"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface Category {
    id: string
    name: string
    slug: string
    imageUrl?: string | null
    description?: string | null
}

interface RelatedCategoriesProps {
    categories: Category[]
}

export function RelatedCategories({ categories }: RelatedCategoriesProps) {
    if (!categories || categories.length === 0) return null

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-blue-900 uppercase">
                        Related Categories
                    </h2>
                    <Link
                        href="/services"
                        className="hidden md:flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-600 transition-colors"
                    >
                        View All Categories <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/services/${category.slug}`}
                            className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                                {category.imageUrl ? (
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <span className="text-4xl font-bold opacity-20">{category.name[0]}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white text-lg font-bold truncate shadow-sm">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
                                    {category.description ? category.description.replace(/<[^>]*>?/gm, '') : 'Explore our high-quality packaging solutions.'}
                                </p>
                                <span className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:text-yellow-500 transition-colors">
                                    Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-600 transition-colors"
                    >
                        View All Categories <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
