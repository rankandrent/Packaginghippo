"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Check } from "lucide-react"
import { getSeoImageUrl, getAltFromUrl } from "@/lib/image-seo"
import { useCart } from "@/context/CartContext"

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
                    : 'bg-blue-900 hover:bg-blue-800 text-white'
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

export function MerchantProductsSection({ data }: { data: any }) {
    if (!data) return null
    const products: MerchantProduct[] = Array.isArray(data.products) ? data.products : []
    if (products.length === 0) return null

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-4">
                        {data.heading || "Featured Products"}
                    </h2>
                    {data.subheading && (
                        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                            {data.subheading}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {products.slice(0, 7).map((product, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group flex flex-col"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-square bg-gray-50 overflow-hidden">
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
                            </div>

                            {/* Product Info */}
                            <div className="p-3 flex flex-col flex-1 gap-2">
                                <h3 className="font-bold text-zinc-800 text-sm leading-tight line-clamp-2">
                                    {product.name || "Custom Packaging"}
                                </h3>
                                {product.price && (
                                    <p className="text-blue-700 font-black text-sm">
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
