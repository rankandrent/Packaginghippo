"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Package, ShoppingCart, MessageSquare, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "Pages Content", href: "/dashboard/pages" },
    { icon: Package, label: "Products Catalog", href: "/dashboard/products" },
    { icon: ShoppingCart, label: "Categories", href: "/dashboard/categories" },
    { icon: MessageSquare, label: "Inquiries", href: "/dashboard/inquiries" },
    { icon: Settings, label: "Site Settings", href: "/dashboard/settings" },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-xl font-bold text-yellow-500">Packaging Hippo</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-yellow-500 text-black shadow-lg"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg">
                    Logout
                </button>
            </div>
        </div>
    )
}
