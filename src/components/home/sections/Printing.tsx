"use client"

import { Printer } from "lucide-react"

export function Printing({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-zinc-900 text-white">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-black mb-6 leading-tight">{data.heading}</h2>
                    <p className="text-gray-400 text-lg mb-8">{data.text}</p>

                    <div className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700">
                        <h3 className="text-2xl font-bold mb-2 text-white">{data.subheading}</h3>
                        <p className="text-gray-400">{data.subtext}</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20" />
                    <div className="relative bg-zinc-800 rounded-3xl p-8 border border-zinc-700 min-h-[400px] flex items-center justify-center">
                        <Printer className="w-32 h-32 text-zinc-600" />
                    </div>
                </div>
            </div>
        </section>
    )
}
