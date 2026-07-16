import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import { getMerchantProductBySlug, slugifyName, parsePrice } from "@/lib/merchant"
import { getSeoImageUrl } from "@/lib/image-seo"
import { ProductBuyBox } from "@/components/cart/ProductBuyBox"
import { Breadcrumbs } from "@/components/public/Breadcrumbs"
import { JsonLd } from "@/components/seo/JsonLd"

export const revalidate = 3600

const SITE = "https://packaginghippo.com"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const p = await getMerchantProductBySlug(slug)
    if (!p) return { title: "Product Not Found" }
    return {
        title: p.name,
        description: `Buy ${p.name} — custom packaging by Packaging Hippo.`,
        alternates: { canonical: `/buy/${slug}` },
    }
}

export default async function BuyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const p = await getMerchantProductBySlug(slug)
    if (!p) notFound()

    const price = parsePrice(p.price)
    const img = getSeoImageUrl(p.image)
    const imgAbs = img && img.startsWith("http") ? img : `${SITE}${img}`

    return (
        <main className="bg-white min-h-screen">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": p.name,
                    "image": imgAbs ? [imgAbs] : [],
                    "description": `Custom ${p.name} by Packaging Hippo.`,
                    "brand": { "@type": "Brand", "name": "Packaging Hippo" },
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "USD",
                        "price": price.toFixed(2),
                        "availability": "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition",
                        "url": `${SITE}/buy/${slug}`,
                    },
                }}
            />

            <section className="container mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: p.name }]} theme="light" />

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mt-6">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8F9FA] border border-gray-100">
                        {img ? (
                            <Image src={img} alt={p.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-contain p-6" priority />
                        ) : null}
                    </div>

                    <div className="space-y-5">
                        <h1 className="text-3xl md:text-4xl font-black text-[#011f7b] leading-tight">{p.name}</h1>
                        <div className="text-3xl font-black text-[#011f7b]">
                            ${price.toFixed(2)} <span className="text-sm font-medium text-gray-500">/ unit</span>
                        </div>
                        <p className="text-[#212529]/70 leading-relaxed">
                            Premium custom {p.name.toLowerCase()} made to your brand&apos;s specs. Choose your quantity and check out below, or request a custom quote for bulk pricing.
                        </p>
                        <ProductBuyBox id={slug} name={p.name} slug={slug} price={price} image={p.image} />
                    </div>
                </div>
            </section>
        </main>
    )
}
