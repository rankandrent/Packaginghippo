"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-yellow-500 text-black text-center">
            <div className="container mx-auto px-4 max-w-3xl space-y-8">
                <h2 className="text-5xl font-black tracking-tight">{data.cta_text || "Ready to Elevate Your Brand?"}</h2>
                <p className="text-xl font-medium opacity-80">{data.text || "Get a competitive price quote for your custom packaging project today."}</p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-10 h-14 rounded-full" asChild>
                        <Link href="/quote">Start Your Project</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-white text-lg px-10 h-14 rounded-full font-bold" asChild>
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
