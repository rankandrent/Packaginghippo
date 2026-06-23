import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Box, CheckCircle, Star, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

import { getSeoImageUrl, getSeoAltText } from "@/lib/image-seo"

export function Hero({ data }: { data: any }) {
    if (!data) return null
    const headingLines = String(data.heading || "Custom Packaging").split("\n").filter(Boolean)

    // SEO Data Preparation
    const seoValues = {
        imageUrl: getSeoImageUrl(data.hero_image),
        altText: getSeoAltText(data, 'Custom Packaging Boxes on Yellow Background')
    }

    return (
        <section className="relative bg-[#011f7b] pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
            {/* Layered brand background: navy gradient + gold glow + soft dot texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#DAA520]/25 via-[#011f7b] to-[#01154f]" />
            <div className="absolute -top-32 -left-28 w-[28rem] h-[28rem] rounded-full bg-[#DAA520]/10 blur-3xl" />
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
                    {/* ---------- Left: copy ---------- */}
                    <div className="space-y-7 text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#DAA520]/40 bg-[#DAA520]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#DAA520]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                            Premium Custom Packaging
                        </span>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
                            {headingLines.map((line, index) => (
                                <span
                                    key={index}
                                    className={`block ${index === headingLines.length - 1 && headingLines.length > 1 ? "text-[#DAA520]" : ""}`}
                                >
                                    {line}
                                </span>
                            ))}
                        </h1>

                        <p className="text-lg text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            {data.subheading || "Elevate your brand with premium custom boxes."}
                        </p>

                        {/* Feature chips */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white/90">
                                <CheckCircle className="w-4 h-4 text-[#DAA520]" /> No Die &amp; Plate Charges
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white/90">
                                <CheckCircle className="w-4 h-4 text-[#DAA520]" /> Fast Turnaround
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-1">
                            <Button variant="default" size="lg" className="btn-gold text-base px-8 py-6 rounded-full" asChild>
                                <Link href={data.cta_link || "/quote"}>{data.cta_text || "Get Custom Quote"} <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                            <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-full border-white/40 bg-white/5 text-white hover:bg-white hover:text-[#011f7b] hover:border-white" asChild>
                                <Link href="/products">View All Products</Link>
                            </Button>
                        </div>

                        {/* Social proof strip */}
                        <div className="flex items-center justify-center lg:justify-start gap-4 pt-3">
                            <div className="flex -space-x-3">
                                {[0, 1, 2, 3].map((i) => (
                                    <span
                                        key={i}
                                        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#DAA520] to-[#c4901a] ring-2 ring-[#011f7b]"
                                    />
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex text-[#DAA520]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                                </div>
                                <span className="text-xs font-semibold text-white/80">{data.badge_text || "500+ Happy Clients"}</span>
                            </div>
                        </div>
                    </div>

                    {/* ---------- Right: visual ---------- */}
                    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                        {/* Gold glow behind the image */}
                        <div className="absolute -inset-6 bg-gradient-to-tr from-[#DAA520]/30 to-transparent rounded-[2rem] blur-2xl" />

                        {/* Decorative gold ring + dots */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-2 border-[#DAA520]/40 hidden md:block" />

                        <div className="relative z-10 w-full aspect-[4/5] sm:aspect-square rounded-[1.75rem] overflow-hidden border border-white/15 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                            {data.hero_image ? (
                                <Image
                                    src={seoValues.imageUrl}
                                    alt={seoValues.altText}
                                    title={seoValues.altText}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                                    className="object-cover"
                                    priority={true}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#DAA520] to-[#c4901a] flex items-center justify-center">
                                    <Box className="w-32 h-32 md:w-48 md:h-48 text-[#011f7b] opacity-60" />
                                </div>
                            )}
                            {/* subtle bottom gradient for depth */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#01154f]/60 to-transparent" />
                        </div>

                        {/* Floating verified chip */}
                        <div className="absolute -top-4 left-4 z-20 flex items-center gap-2 bg-white rounded-full pl-2 pr-4 py-2 shadow-xl">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#DAA520]">
                                <ShieldCheck className="w-4 h-4 text-[#011f7b]" />
                            </span>
                            <span className="text-xs font-bold text-[#011f7b]">Trusted Supplier</span>
                        </div>

                        {/* Floating review card */}
                        <div className="absolute -bottom-6 -left-2 md:-left-8 z-20 bg-white p-4 md:p-5 rounded-2xl shadow-xl max-w-[230px] md:max-w-[260px]">
                            <div className="flex text-[#DAA520] mb-1.5">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                            <div className="text-sm font-bold text-[#011f7b] mb-1">{data.badge_text || "500+ Happy Clients"}</div>
                            <p className="text-xs text-[#212529]/70 leading-snug">{data.badge_subtext || "\"Best packaging service we've used!\""}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
