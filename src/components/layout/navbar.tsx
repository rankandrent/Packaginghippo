"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Phone, ShoppingCart } from "lucide-react"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="site-navbar fixed w-full z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="text-2xl font-black text-yellow-500 tracking-tighter uppercase">
                        Packaging<span className="text-white">Hippo</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-white hover:text-yellow-500 transition-colors">
                        Home
                    </Link>
                    <Link href="/products" className="text-sm font-medium text-white hover:text-yellow-500 transition-colors">
                        Products
                    </Link>
                    <Link href="/services" className="text-sm font-medium text-white hover:text-yellow-500 transition-colors">
                        Services
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Blog
                    </Link>
                </nav>

                {/* CTA & Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                        <Phone className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold">(510) 500-9533</span>
                    </div>
                    <Link
                        href="/quote"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105"
                    >
                        Get Custom Quote
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black border-t border-gray-800 p-4 space-y-4">
                    <Link href="/products" className="block text-white font-medium">Products</Link>
                    <Link href="/services" className="block text-white font-medium">Services</Link>
                    <Link href="/quote" className="block bg-yellow-500 text-black text-center py-3 rounded-lg font-bold">
                        Get Quote
                    </Link>
                </div>
            )}
        </header>
    )
}
