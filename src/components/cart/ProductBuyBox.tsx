"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, ShoppingCart, Check } from "lucide-react"
import { toast } from "sonner"

interface ProductBuyBoxProps {
    id: string
    name: string
    slug: string
    price: number
    image: string
}

const MAX_QTY = 100000

export function ProductBuyBox({ id, name, slug, price, image }: ProductBuyBoxProps) {
    const { addItem } = useCart()
    const router = useRouter()
    const [qty, setQty] = useState(1)
    const [added, setAdded] = useState(false)

    const total = price * qty

    const dec = () => setQty((q) => Math.max(1, q - 1))
    const inc = () => setQty((q) => Math.min(MAX_QTY, q + 1))
    const onInput = (v: string) => {
        const n = parseInt(v.replace(/\D/g, ""), 10)
        setQty(Number.isFinite(n) ? Math.max(1, Math.min(MAX_QTY, n)) : 1)
    }

    const add = () => {
        addItem({ id, name, slug, price, image, quantity: qty })
        setAdded(true)
        toast.success(`${qty} × ${name} added to cart!`)
        setTimeout(() => setAdded(false), 1800)
    }

    const buyNow = () => {
        addItem({ id, name, slug, price, image, quantity: qty })
        router.push("/checkout")
    }

    return (
        <div className="space-y-4">
            {/* Quantity selector + live total */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#011f7b]">Quantity</span>
                    <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden bg-white">
                        <button
                            type="button"
                            onClick={dec}
                            disabled={qty <= 1}
                            aria-label="Decrease quantity"
                            className="px-3 py-3 text-[#011f7b] hover:bg-[#011f7b]/5 disabled:opacity-40 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input
                            value={qty}
                            onChange={(e) => onInput(e.target.value)}
                            inputMode="numeric"
                            aria-label="Quantity"
                            className="w-16 text-center font-black text-[#011f7b] outline-none bg-transparent"
                        />
                        <button
                            type="button"
                            onClick={inc}
                            aria-label="Increase quantity"
                            className="px-3 py-3 text-[#011f7b] hover:bg-[#011f7b]/5 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-medium text-gray-500">Total</div>
                    <div className="text-2xl font-black text-[#011f7b]">${total.toFixed(2)}</div>
                    <div className="text-[11px] text-gray-400">${price.toFixed(2)} each</div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={add}
                    variant="outline"
                    className="w-full h-14 text-base font-bold rounded-xl border-2 border-[#011f7b] text-[#011f7b] hover:bg-[#011f7b]/5"
                >
                    {added ? (
                        <><Check className="w-5 h-5 mr-2" /> Added</>
                    ) : (
                        <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                    )}
                </Button>
                <Button
                    onClick={buyNow}
                    className="btn-gold w-full h-14 text-base font-black rounded-xl"
                >
                    Buy Now
                </Button>
            </div>

            <div className="text-center">
                <Link href="/quote" className="text-sm font-semibold text-[#011f7b] hover:text-[#DAA520] transition-colors">
                    Need bulk pricing? Get a custom quote →
                </Link>
            </div>
        </div>
    )
}
