"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    FileText,
    Package,
    FolderOpen,
    Home,
    Settings,
    LogOut,
    Loader2,
    Menu,
    BookOpen,
    MessageSquare,
    AlertTriangle,
    Star,
    Image,
    Link as LinkIcon,
    LayoutTemplate
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Pages",
        href: "/dashboard/pages",
        icon: FileText,
    },
    {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
    },
    {
        title: "Templates",
        href: "/dashboard/templates",
        icon: LayoutTemplate,
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: FolderOpen,
    },
    {
        title: "Homepage",
        href: "/dashboard/homepage",
        icon: Home,
    },
    {
        title: "Testimonials",
        href: "/dashboard/testimonials",
        icon: Star,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        title: "Redirects",
        href: "/dashboard/redirects",
        icon: LinkIcon,
    },
    {
        title: "Menu",
        href: "/dashboard/settings/menu",
        icon: Menu,
    },
    {
        title: "Media",
        href: "/dashboard/media",
        icon: Image,
    },
    {
        title: "Blog",
        href: "/dashboard/blog",
        icon: BookOpen,
    },
    {
        title: "SEO Issues",
        href: "/dashboard/seo-issues",
        icon: AlertTriangle,
    },
    {
        title: "Inquiries",
        href: "/dashboard/inquiries",
        icon: MessageSquare,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)
    const [user, setUser] = useState<{ name?: string; email: string } | null>(null)
    const [pendingInquiriesCount, setPendingInquiriesCount] = useState(0)
    const [seoIssuesCount, setSeoIssuesCount] = useState(0)

    useEffect(() => {
        // Fetch current user session
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    setUser(data.user)
                }
            })
            .catch(() => { })

        // Fetch counts
        const fetchCounts = () => {
            fetch('/api/cms/inquiries/count')
                .then(res => res.json())
                .then(data => setPendingInquiriesCount(data.count))
                .catch(() => { })

            fetch('/api/cms/seo-audit/count')
                .then(res => res.json())
                .then(data => setSeoIssuesCount(data.count))
                .catch(() => { })
        }

        fetchCounts()
        const interval = setInterval(fetchCounts, 30000) // Poll every 30 seconds
        return () => clearInterval(interval)
    }, [])

    async function handleLogout() {
        setLoggingOut(true)
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/dashboard/login')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
            setLoggingOut(false)
        }
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-64 flex-col border-r bg-white z-40 shadow-sm flex">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="text-xl font-bold">Pakiging Hippo</span>
                </Link>
            </div>
            <div className="flex-1 py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </div>
                            {item.title === "Inquiries" && pendingInquiriesCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center animate-pulse">
                                    {pendingInquiriesCount}
                                </span>
                            )}
                            {item.title === "SEO Issues" && seoIssuesCount > 0 && (
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                    {seoIssuesCount}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                {user && (
                    <div className="px-3 py-2 mb-2 text-sm">
                        <p className="font-medium text-gray-900">{user.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary cursor-pointer disabled:opacity-50"
                >
                    {loggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <LogOut className="h-4 w-4" />
                    )}
                    Logout
                </button>
            </div>
        </div>
    )
}

