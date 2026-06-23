import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="section-py bg-[#011f7b] text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#DAA520]/15 via-transparent to-transparent"></div>
            <div className="container mx-auto px-4 max-w-3xl space-y-8 relative">
                <h2 className="text-5xl font-black tracking-tight text-white">{data.cta_text || "Ready to Elevate Your Brand?"}</h2>
                <p className="text-xl font-medium text-white/80">{data.text || "Get a competitive price quote for your custom packaging project today."}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="btn-gold text-lg px-10 h-14 rounded-full" asChild>
                        <Link href="/quote">Start Your Project</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-[#011f7b] hover:border-white text-lg px-10 h-14 rounded-full font-bold" asChild>
                        <Link href="/contact-us">Contact Support</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
