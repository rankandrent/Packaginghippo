"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

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
    if (!data) return null

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{data.heading}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {data.items?.map((item: any, i: number) => (
                        <Link href={`/services/${item.title?.toLowerCase().replace(/ /g, '-')}`} key={i}>
                            <Card className="group cursor-pointer hover:shadow-lg transition-all border-none shadow-sm h-full">
                                <CardContent className="p-6">
                                    <div className="mb-4 bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                                        <PackageIcon className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
