"use client"

import { Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function EcoFriendly({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-green-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                        <Leaf className="w-4 h-4" /> Eco-Friendly
                    </div>
                    <h2 className="text-4xl font-black mb-4">{data.heading}</h2>
                    <p className="text-lg text-gray-600">{data.text}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.materials?.map((mat: any, i: number) => (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-2 text-green-800">{mat.name}</h3>
                                <p className="text-sm text-gray-500">{mat.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
