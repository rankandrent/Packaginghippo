"use client"
// Navigation component for Packaging Hippo

import Link from "next/link"
import { useState, FormEvent, useEffect } from "react"
import { Menu, X, Phone, Search, ShoppingCart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

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
    const router = useRouter()
    const searchParams = useSearchParams()

    // Search state
    const initialSearch = searchParams?.get('search') || ""
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [suggestions, setSuggestions] = useState<{ products: any[], categories: any[], blogs: any[] } | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    const [isOpen, setIsOpen] = useState(false)
    const siteName = settings?.siteName || "PackagingHippo"
    const phone = settings?.phone || "+1 845 379 9277"

    const navItems = menuData || DEFAULT_MENU;

    // Fetch suggestions with debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true)
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    const data = await res.json()
                    setSuggestions(data)
                    setShowSuggestions(true)
                } catch (e) {
                    console.error("Search error:", e)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setSuggestions(null)
                setShowSuggestions(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleSearch = (e: FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
            setShowSuggestions(false)
            setIsOpen(false)
        }
    }

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('.search-container')) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Helper for Recursive Menu Rendering
    const renderMenuItem = (item: any) => {
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return (
                <div key={item.id} className="group relative h-full flex items-center">
                    <Link href={item.href} className="text-sm font-bold text-gray-700 group-hover:text-primary uppercase tracking-wide flex items-center gap-1">
                        {item.label} <ChevronDown className="w-3 h-3" />
                    </Link>
                    <div className="absolute top-full left-0 min-w-[250px] bg-white shadow-xl border-t-2 border-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 rounded-b-lg">
                        <ul className="space-y-1">
                            {item.children.map((child: any) => (
                                <li key={child.id}>
                                    <Link href={child.href} className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded">
                                        {child.label}
                                    </Link>
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

    const displayItems = navItems || [
        { id: '1', label: "Home", href: "/" },
        { id: '2', label: "Request A Quote", href: "/quote" }
    ];

    return (
        <header className="site-navbar w-full z-50 bg-white">
            <div className="border-b">
                <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
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
                    <div className="hidden lg:flex flex-1 max-w-2xl mx-auto relative search-container">
                        <form onSubmit={handleSearch} className="relative w-full flex">
                            <Input
                                type="text"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                                placeholder="Search products, categories or blogs..."
                                className="w-full bg-gray-50 border-gray-200 rounded-l-md rounded-r-none h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Button type="submit" className="h-11 rounded-l-none rounded-r-md bg-primary hover:bg-primary/90 px-6">
                                {isSearching ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Search className="w-5 h-5" />}
                            </Button>
                        </form>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions && (
                            <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border border-gray-100 rounded-b-xl mt-1 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="max-h-[70vh] overflow-y-auto p-2 space-y-4">
                                    {/* Products */}
                                    {suggestions.products.length > 0 && (
                                        <div>
                                            <h4 className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Products</h4>
                                            {suggestions.products.map(p => (
                                                <Link
                                                    key={p.id}
                                                    href={`/services/${p.category.slug}/${p.slug}`}
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-gray-50 rounded border flex-shrink-0 relative overflow-hidden">
                                                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="object-cover w-full h-full" /> : <Search className="w-4 h-4 m-3 text-gray-300" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary">{p.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Categories */}
                                    {suggestions.categories.length > 0 && (
                                        <div>
                                            <h4 className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Categories</h4>
                                            {suggestions.categories.map(c => (
                                                <Link
                                                    key={c.id}
                                                    href={`/services/${c.slug}`}
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-gray-50 rounded border flex-shrink-0 relative overflow-hidden p-1">
                                                        {c.imageUrl ? <img src={c.imageUrl} alt="" className="object-contain w-full h-full" /> : <Search className="w-4 h-4 m-3 text-gray-300" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary">{c.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Blogs */}
                                    {suggestions.blogs.length > 0 && (
                                        <div>
                                            <h4 className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Blog Posts</h4>
                                            {suggestions.blogs.map(b => (
                                                <Link
                                                    key={b.id}
                                                    href={`/blog/${b.slug}`}
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-gray-50 rounded border flex-shrink-0 relative overflow-hidden">
                                                        {b.mainImage ? <img src={b.mainImage} alt="" className="object-cover w-full h-full" /> : <Search className="w-4 h-4 m-3 text-gray-300" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary line-clamp-1">{b.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {suggestions.products.length === 0 && suggestions.categories.length === 0 && suggestions.blogs.length === 0 && (
                                        <div className="p-8 text-center">
                                            <p className="text-sm text-gray-400">No results found for "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-3 border-t text-center">
                                    <button
                                        onClick={handleSearch}
                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                    >
                                        View all results
                                    </button>
                                </div>
                            </div>
                        )}
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
                    <form onSubmit={handleSearch}>
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products, categories or blogs..."
                            className="w-full bg-gray-50 mb-4"
                        />
                    </form>

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
