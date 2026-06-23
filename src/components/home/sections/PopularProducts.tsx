import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { getSeoImageUrl } from "@/lib/image-seo"

function PackageIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    )
}

export function PopularProducts({ data, categories = [] }: { data: any, categories?: any[] }) {
    if (!data) return null

    return (
        <section className="section-py bg-[#F8F9FA]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left">
                    <div className="max-w-2xl">
                        <span className="brand-eyebrow mb-3">Our Range</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#011f7b] mb-4 mt-3">{data.heading || "Most Popular Custom Box Types We Offer"}</h2>
                        <p className="text-[#212529]/70 text-lg">Choose from our wide range of premium packaging solutions tailored to your brand.</p>
                    </div>
                    <Link href="/services" className="group flex items-center gap-2 text-[#011f7b] font-bold text-lg hover:text-[#DAA520] transition-colors">
                        View All Categories <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map((item: any, i: number) => (
                            <Link href={`/${item.slug}`} key={i}>
                                <Card className="brand-card group cursor-pointer border border-gray-100 shadow-sm h-full rounded-2xl overflow-hidden bg-white">
                                    <CardContent className="p-8">
                                        {item.imageUrl ? (
                                            <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-gray-100">
                                                <Image
                                                    src={getSeoImageUrl(item.imageUrl)}
                                                    alt=""
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1210px) 33vw, 400px"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mb-6 bg-[#DAA520]/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-[#DAA520] group-hover:rotate-6 transition-all duration-300">
                                                <PackageIcon className="w-7 h-7 text-[#DAA520] group-hover:text-[#011f7b] transition-colors" />
                                            </div>
                                        )}
                                        <h3 className="font-black text-xl text-[#011f7b] group-hover:text-[#DAA520] transition-colors tracking-tight">{item.name}</h3>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
