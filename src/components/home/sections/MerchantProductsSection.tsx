"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Check } from "lucide-react"
import { getSeoImageUrl, getAltFromUrl } from "@/lib/image-seo"
import { useCart } from "@/context/CartContext"
import { merchantHref } from "@/lib/merchant"

type MerchantProduct = {
    image: string
    name: string
    price: string
    link: string
}

function AddToCartButton({ product, index }: { product: MerchantProduct, index: number }) {
    const { addItem } = useCart()
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        const slug = product.link?.replace(/^\//, '') || `product-${index}`
        const parsedPrice = parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0') || 0

        addItem({
            id: slug,
            name: product.name || "Custom Packaging",
            slug,
            price: parsedPrice,
            quantity: 1,
            image: product.image || '',
        })

        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 w-full text-xs font-bold py-2 px-3 rounded-lg transition-all duration-200 ${
                added
                    ? 'bg-green-600 text-white'
                    : 'bg-[#011f7b] hover:bg-[#01154f] text-white'
            }`}
        >
            {added ? (
                <><Check className="w-3.5 h-3.5" /> Added!</>
            ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
            )}
        </button>
    )
}

function PlaceholderCard() {
    return (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 overflow-hidden flex flex-col">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <div className="p-3 flex flex-col gap-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                <div className="h-7 bg-gray-200 rounded-lg animate-pulse mt-1" />
            </div>
        </div>
    )
}

export function MerchantProductsSection({ data }: { data: any }) {
    if (!data) return null
    const products: MerchantProduct[] = Array.isArray(data.products) ? data.products : []

    // Show placeholder skeleton when no products added yet
    if (products.length === 0) {
        return (
            <section className="section-py bg-[#F8F9FA]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-10 bg-gray-200 rounded-xl animate-pulse max-w-xs mx-auto mb-4" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse max-w-sm mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {Array.from({ length: 5 }).map((_, i) => <PlaceholderCard key={i} />)}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="section-py bg-[#F8F9FA]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-[#011f7b] mb-4">
                        {data.heading || "Featured Products"}
                    </h2>
                    {data.subheading && (
                        <p className="text-lg text-[#212529]/70 max-w-2xl mx-auto">
                            {data.subheading}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {products.slice(0, 7).map((product, index) => (
                        <div
                            key={index}
                            className="brand-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group flex flex-col"
                        >
                            {/* Product Image */}
                            <Link href={merchantHref(product)} className="relative aspect-square bg-gray-50 overflow-hidden block">
                                {product.image ? (
                                    <Image
                                        src={getSeoImageUrl(product.image)}
                                        alt={getAltFromUrl(product.image, product.name || "Product Image")}
                                        fill
                                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300 text-xs font-bold uppercase tracking-widest">
                                        No Image
                                    </div>
                                )}
                            </Link>

                            {/* Product Info */}
                            <div className="p-3 flex flex-col flex-1 gap-2">
                                <Link href={merchantHref(product)} className="font-bold text-[#011f7b] text-sm leading-tight line-clamp-2 hover:text-[#DAA520] transition-colors">
                                    {product.name || "Custom Packaging"}
                                </Link>
                                {product.price && (
                                    <p className="text-[#DAA520] font-black text-sm">
                                        {product.price}
                                    </p>
                                )}
                                <div className="mt-auto pt-1">
                                    <AddToCartButton product={product} index={index} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
