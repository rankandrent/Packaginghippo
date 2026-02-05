"use client"
// Navigation component for Packaging Hippo

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Phone, Search, ShoppingCart, MessageCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type NavbarProps = {
    settings?: {
        siteName?: string
        phone?: string
        email?: string
    }
    menuData?: { id: string; label: string; href: string }[] | null
}

const DEFAULT_MENU = [
    { id: "home", label: "Home", href: "/" },
    { id: "products", label: "Custom Packaging", href: "/products", hasChildren: true },
    { id: "quote", label: "Request A Quote", href: "/quote" },
    { id: "contact", label: "Contact Us", href: "/contact" }
]

export function Navbar({ settings, menuData }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const siteName = settings?.siteName || "PackagingHippo"
    const phone = settings?.phone || "+1 845 379 9277"

    const navItems = menuData || DEFAULT_MENU;

    // Helper for Recursive Menu Rendering
    const renderMenuItem = (item: any) => {
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return (
                <div key={item.id} className="group relative h-full flex items-center">
                    <Link href={item.href} className="text-sm font-bold text-gray-700 group-hover:text-primary uppercase tracking-wide flex items-center gap-1">
                        {item.label} <ChevronDown className="w-3 h-3" />
                    </Link>
                    {/* Nested Dropdown */}
                    <div className="absolute top-full left-0 min-w-[250px] bg-white shadow-xl border-t-2 border-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 rounded-b-lg">
                        <ul className="space-y-1">
                            {item.children.map((child: any) => (
                                <li key={child.id}>
                                    <Link href={child.href} className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded">
                                        {child.label}
                                    </Link>
                                    {/* Support 2nd level nesting if needed? For now simple dropdown */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        }

        return (
            <Link key={item.id} href={item.href} className="text-sm font-bold text-gray-700 hover:text-primary uppercase tracking-wide h-full flex items-center">
                {item.label}
            </Link>
        )
    }

    // Default Fallback if no menuData provided
    const displayItems = navItems || [
        { id: '1', label: "Home", href: "/" },
        { id: '2', label: "Request A Quote", href: "/quote" }
    ];

    return (
        <header className="site-navbar w-full z-50 bg-white">
            {/* ... Top Bar Remains ... */}
            <div className="border-b">
                <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        {/* Placeholder Logo Icon */}
                        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded text-white font-bold text-xl">
                            PH
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-primary tracking-tighter uppercase leading-none">
                                {siteName.replace("Hippo", "")}
                            </span>
                            <span className="text-xl font-bold text-accent uppercase leading-none tracking-widest">
                                Hippo
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
                        <div className="relative w-full flex">
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-gray-50 border-gray-200 rounded-l-md rounded-r-none h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Button className="h-11 rounded-l-none rounded-r-md bg-primary hover:bg-primary/90 px-6">
                                <Search className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Phone className="w-8 h-8 text-primary fill-primary/10" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium">Call Us 24/7</span>
                                <span className="text-sm font-bold text-gray-900">{phone}</span>
                            </div>
                        </div>
                        <div className="relative">
                            <ShoppingCart className="w-8 h-8 text-primary" />
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">0</span>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden text-gray-900" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* BOTTOM NAV BAR */}
            <div className="bg-white border-b hidden lg:block shadow-sm">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <nav className="flex items-center gap-8 h-full">
                        {displayItems.map((item) => renderMenuItem(item))}
                    </nav>

                    <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider rounded-md h-10 px-6">
                        <Link href="/quote">Request A Quote</Link>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 p-4 space-y-4 absolute w-full shadow-xl z-50">
                    <Input type="text" placeholder="Search products..." className="w-full bg-gray-50 mb-4" />

                    <nav className="flex flex-col space-y-3">
                        {navItems.map((item, idx) => (
                            <Link key={idx} href={item.href} className="text-sm font-bold text-gray-900 uppercase border-b pb-2" onClick={() => setIsOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-2 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary" />
                            <span className="text-sm font-bold">{phone}</span>
                        </div>
                        <Button asChild className="w-full bg-primary hover:bg-primary/90">
                            <Link href="/quote" onClick={() => setIsOpen(false)}>Request A Quote</Link>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    )
}

