"use client"

import { Box, Ruler, Palette, ShoppingCart } from "lucide-react"

export function OrderingProcess({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-black mb-4">{data.heading}</h2>
                <p className="text-xl text-gray-600 mb-16">{data.subheading}</p>

                <div className="grid md:grid-cols-4 gap-8">
                    {data.steps?.map((step: any, i: number) => {
                        const Icon =
                            step.icon === "Box" ? Box :
                                step.icon === "Ruler" ? Ruler :
                                    step.icon === "Palette" ? Palette :
                                        step.icon === "ShoppingCart" ? ShoppingCart : Box

                        return (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-20 h-20 mb-6 relative">
                                    <div className="absolute inset-0 bg-yellow-100 rounded-2xl transform rotate-6"></div>
                                    <div className="absolute inset-0 bg-white border-2 border-black rounded-2xl flex items-center justify-center relative z-10">
                                        <Icon className="w-10 h-10 text-black" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed max-w-xs">{step.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
