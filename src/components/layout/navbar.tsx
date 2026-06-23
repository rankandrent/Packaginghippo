"use client"
import { getSeoImageUrl } from "@/lib/image-seo"
// Navigation component for Packaging Hippo

import Link from "next/link"
import { useState, FormEvent, useEffect } from "react"
import { Menu, X, Phone, Search, ShoppingCart, ChevronDown, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/context/CartContext"
import dynamic from "next/dynamic"
import { BrandLogo } from "@/components/brand/BrandLogo"
import { BRAND_LOGO_MENU } from "@/lib/brand"

const CartDrawer = dynamic(
    () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
    { ssr: false }
)

type NavbarProps = {
    settings?: {
        siteName?: string
        phone?: string
        email?: string
        logoUrl?: string
    }
    menuData?: { id: string; label: string; href: string }[] | null
}

const DEFAULT_MENU = [
    { id: "home", label: "Home", href: "/" },
    { id: "products", label: "Custom Packaging", href: "/products", hasChildren: true },
    { id: "quote", label: "Request A Quote", href: "/quote" },
    { id: "contact", label: "Contact Us", href: "/contact-us" }
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
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [hideTopBar, setHideTopBar] = useState(false)
    const { totalItems } = useCart()
    const siteName = settings?.siteName || "PackagingHippo"
    const phone = settings?.phone || "+1 845 379 9277"
    const logoUrl = BRAND_LOGO_MENU

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

    // Hide the logo/top bar when scrolling down, reveal it when scrolling up.
    // The bottom nav bar stays pinned at the top of the (sticky) header.
    //
    // Two mechanisms keep this stable and stop the bar from flickering /
    // "filling itself" on slow up-and-down scrolls:
    //   1. Directional hysteresis — we only toggle after the user has moved a
    //      sustained THRESHOLD distance in one direction (anchorY is reset on
    //      every direction change, so jittery deltas never accumulate).
    //   2. A cooldown lock — collapsing/expanding the bar animates for 300ms,
    //      and that reflow generates its own scroll events that used to flip
    //      the bar straight back. After every toggle we ignore further toggles
    //      for COOLDOWN ms (just re-anchoring), breaking that feedback loop.
    useEffect(() => {
        const TOP_ZONE = 140   // always show the bar this close to the top
        const THRESHOLD = 50   // px of sustained scroll in one direction before toggling
        const COOLDOWN = 450   // ms to ignore toggles after one (> CSS transition of 300ms)

        let lastY = window.scrollY
        let anchorY = window.scrollY // reference for the current scroll direction
        let dir: -1 | 0 | 1 = 0      // -1 = up, 1 = down
        let hidden = false           // current logical state (mirrors hideTopBar)
        let lockedUntil = 0          // timestamp until which toggles are ignored
        let ticking = false

        const update = () => {
            ticking = false
            const now = performance.now()
            const y = window.scrollY

            // Near the very top: force the bar visible and reset tracking.
            if (y <= TOP_ZONE) {
                if (hidden) { hidden = false; setHideTopBar(false); lockedUntil = now + COOLDOWN }
                lastY = y; anchorY = y; dir = 0
                return
            }

            // While locked (bar is mid-transition), keep re-anchoring but never
            // toggle — this absorbs the reflow-induced scroll events.
            if (now < lockedUntil) {
                lastY = y; anchorY = y; dir = 0
                return
            }

            // Direction; reset the anchor when it changes so the threshold
            // measures *sustained* movement, not jittery back-and-forth.
            const newDir: -1 | 0 | 1 = y > lastY ? 1 : y < lastY ? -1 : dir
            if (newDir !== dir && newDir !== 0) {
                dir = newDir
                anchorY = y
            }

            if (dir === 1 && !hidden && y - anchorY > THRESHOLD) {
                hidden = true
                setHideTopBar(true)
                lockedUntil = now + COOLDOWN
            } else if (dir === -1 && hidden && anchorY - y > THRESHOLD) {
                hidden = false
                setHideTopBar(false)
                lockedUntil = now + COOLDOWN
            }

            lastY = y
        }

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(update)
                ticking = true
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Helper for Recursive Menu Rendering
    const renderMenuItem = (item: any) => {
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            const itemHref = item.href?.startsWith('/') || item.href?.startsWith('http') ? item.href : `/${item.href}`;
            return (
                <div key={item.id} className="group relative h-full flex items-center">
                    <Link href={itemHref || "#"} className="text-sm font-bold text-gray-700 group-hover:text-primary flex items-center gap-1">
                        {item.label} <ChevronDown className="w-3 h-3" />
                    </Link>
                    <div className="absolute top-full left-0 min-w-[250px] bg-white shadow-xl border-t-2 border-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 rounded-b-lg">
                        <ul className="space-y-1">
                            {item.children.map((child: any) => {
                                const childHref = child.href?.startsWith('/') || child.href?.startsWith('http') ? child.href : `/${child.href}`;
                                return (
                                    <li key={child.id}>
                                        <Link href={childHref || "#"} className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded">
                                            {child.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            )
        }

        const itemHref = item.href?.startsWith('/') || item.href?.startsWith('http') ? item.href : `/${item.href}`;
        return (
            <Link key={item.id} href={itemHref || "#"} className="text-sm font-bold text-gray-700 hover:text-primary h-full flex items-center">
                {item.label}
            </Link>
        )
    }

    const displayItems = navItems || [
        { id: '1', label: "Home", href: "/" },
        { id: '2', label: "Request A Quote", href: "/quote" }
    ];

    return (
        <header className="site-navbar w-full z-50 bg-white sticky top-0">
            <div className={`border-b transition-all duration-300 ease-in-out ${hideTopBar ? 'max-h-0 opacity-0 overflow-hidden border-transparent' : 'max-h-28 opacity-100 overflow-visible'}`}>
                <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <BrandLogo siteName={siteName} logoUrl={logoUrl} fallbackLogoUrl={BRAND_LOGO_MENU} size="lg" />
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-auto relative search-container">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Input
                                type="text"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                                placeholder="Search..."
                                className="w-full bg-white border border-gray-200 rounded-full h-10 pl-5 pr-11 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                            />
                            <button
                                type="submit"
                                aria-label="Search products, categories, or blogs"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-primary hover:text-primary/70 transition-colors"
                            >
                                {isSearching ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" /> : <Search className="w-5 h-5" />}
                            </button>
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
                                                    href={`/${p.slug}`}
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-gray-50 rounded border flex-shrink-0 relative overflow-hidden">
                                                        {p.images?.[0] ? <img src={getSeoImageUrl(p.images[0])} alt="" className="object-cover w-full h-full" /> : <Search className="w-4 h-4 m-3 text-gray-300" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-[#212529] group-hover:text-primary">{p.name}</span>
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
                                                    href={`/${c.slug}`}
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-gray-50 rounded border flex-shrink-0 relative overflow-hidden p-1">
                                                        {c.imageUrl ? <img src={getSeoImageUrl(c.imageUrl)} alt="" className="object-contain w-full h-full" /> : <Search className="w-4 h-4 m-3 text-gray-300" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-[#212529] group-hover:text-primary">{c.name}</span>
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
                                                        {b.mainImage ? <img src={getSeoImageUrl(b.mainImage)} alt="" className="object-cover w-full h-full" /> : <Search className="w-4 h-4 m-3 text-gray-300" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-[#212529] group-hover:text-primary line-clamp-1">{b.title}</span>
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
                    <div className="hidden lg:flex items-center gap-6">
                        <Button asChild className="btn-gold rounded-md h-10 px-6 whitespace-nowrap">
                            <Link href="/quote">Request a Quote</Link>
                        </Button>
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                            <Phone className="w-8 h-8 text-primary fill-primary/10" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium">Call Us 24/7</span>
                                <span className="text-sm font-bold text-[#212529]">{phone}</span>
                            </div>
                        </a>
                        <button
                            type="button"
                            aria-label="Open cart"
                            onClick={() => setIsCartOpen(true)}
                            className="relative hover:opacity-80 transition-opacity"
                        >
                            <ShoppingCart className="w-8 h-8 text-primary" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="lg:hidden text-[#212529]"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* BOTTOM NAV BAR */}
            <div className="bg-white border-b hidden lg:block shadow-sm">
                <div className="container mx-auto px-4 h-14 flex items-center">
                    <nav className="flex items-center gap-8 h-full">
                        {displayItems.map((item) => renderMenuItem(item))}
                    </nav>
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
                        {navItems.map((item, idx) => {
                            const itemHref = item.href?.startsWith('/') || item.href?.startsWith('http') ? item.href : `/${item.href}`;
                            return (
                                <Link key={idx} href={itemHref || "#"} className="text-sm font-bold text-[#212529] border-b pb-2" onClick={() => setIsOpen(false)}>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="pt-2 flex flex-col gap-3">
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Phone className="w-5 h-5 text-primary" />
                            <span className="text-sm font-bold">{phone}</span>
                        </a>
                        <Button asChild className="w-full btn-gold">
                            <Link href="/quote" onClick={() => setIsOpen(false)}>Request a Quote</Link>
                        </Button>
                    </div>
                </div>
            )}

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    )
}
