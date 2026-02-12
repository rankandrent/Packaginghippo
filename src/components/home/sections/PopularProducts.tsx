"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

function PackageIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    )
}

export function PopularProducts({ data }: { data: any }) {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories?limit=6')
                if (res.ok) {
                    const json = await res.json()
                    setCategories(json.categories || [])
                }
            } catch (err) {
                console.error("Error fetching categories for homepage:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

    if (!data) return null

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{data.heading || "Most Popular Custom Box Types We Offer"}</h2>
                        <p className="text-gray-600 text-lg">Choose from our wide range of premium packaging solutions tailored to your brand.</p>
                    </div>
                    <Link href="/services" className="group flex items-center gap-2 text-yellow-600 font-bold text-lg hover:text-yellow-700 transition-colors">
                        View All Categories <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map((item: any, i: number) => (
                            <Link href={`/${item.slug}`} key={i}>
                                <Card className="group cursor-pointer hover:shadow-xl transition-all border-none shadow-sm h-full rounded-2xl overflow-hidden bg-white">
                                    <CardContent className="p-8">
                                        {item.imageUrl ? (
                                            <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-gray-100">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mb-6 bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-yellow-500 group-hover:rotate-6 transition-all duration-300">
                                                <PackageIcon className="w-7 h-7 text-yellow-600 group-hover:text-black transition-colors" />
                                            </div>
                                        )}
                                        <h3 className="font-black text-xl text-gray-900 group-hover:text-yellow-600 transition-colors mb-3">{item.name}</h3>
                                        <div className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                            {item.description ? (
                                                <div dangerouslySetInnerHTML={{ __html: item.description.slice(0, 120) + '...' }} />
                                            ) : (
                                                "Premium packaging solution for your brand."
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
