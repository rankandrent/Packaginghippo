"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, FolderOpen, Home, Loader2, MessageSquare, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const [stats, setStats] = useState({
        pages: 0,
        products: 0,
        categories: 0,
        sections: 0,
        inquiries: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            const [pagesRes, productsRes, categoriesRes, sectionsRes, inquiriesRes] = await Promise.all([
                fetch('/api/cms/pages'),
                fetch('/api/cms/products'),
                fetch('/api/cms/categories'),
                fetch('/api/cms/homepage'),
                fetch('/api/cms/inquiries'),
            ])

            const [pages, products, categories, sections, inquiries] = await Promise.all([
                pagesRes.json(),
                productsRes.json(),
                categoriesRes.json(),
                sectionsRes.json(),
                inquiriesRes.json(),
            ])

            setStats({
                pages: pages.pages?.length || 0,
                products: products.products?.length || 0,
                categories: categories.categories?.length || 0,
                sections: sections.sections?.length || 0,
                inquiries: inquiries?.length || 0,
            })
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    const cards = [
        { title: "Pages", value: stats.pages, icon: FileText, href: "/dashboard/pages", color: "text-blue-500" },
        { title: "Products", value: stats.products, icon: Package, href: "/dashboard/products", color: "text-green-500" },
        { title: "Categories", value: stats.categories, icon: FolderOpen, href: "/dashboard/categories", color: "text-purple-500" },
        { title: "Homepage Sections", value: stats.sections, icon: Home, href: "/dashboard/homepage", color: "text-yellow-500" },
        { title: "Leads/Inquiries", value: stats.inquiries, icon: MessageSquare, href: "/dashboard/inquiries", color: "text-red-500" },
    ]

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tight">System Overview</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Real-time stats from Packaging Hippo Engine
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20 bg-white rounded-3xl border border-dashed">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    {cards.map((card) => (
                        <Link key={card.title} href={card.href}>
                            <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all border-none shadow-sm cursor-pointer overflow-hidden group">
                                <div className={`h-1 w-full opacity-50 group-hover:opacity-100 transition-opacity bg-current ${card.color}`} />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">{card.title}</CardTitle>
                                    <card.icon className={`h-4 w-4 ${card.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-blue-900">{card.value}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm bg-blue-900 text-white overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase italic">System Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-xs font-bold uppercase tracking-widest">MongoDB Status: Connected & Healthy</p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <p className="text-xs font-bold uppercase tracking-widest">CMS Engine: V2.4 Stable Build</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm overflow-hidden">
                    <div className="h-1 bg-yellow-500 w-full" />
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase text-blue-900 italic">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-3">
                        <Link href="/dashboard/homepage" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                            <span className="text-xs font-black uppercase text-gray-600 group-hover:text-blue-900">Customise Homepage</span>
                            <Home className="h-4 w-4 text-gray-400 group-hover:text-blue-900" />
                        </Link>
                        <Link href="/dashboard/seo-issues" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors group">
                            <span className="text-xs font-black uppercase text-gray-600 group-hover:text-red-600">Audit SEO Health</span>
                            <AlertTriangle className={`h-4 w-4 text-gray-400 group-hover:text-red-600`} />
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                            <span className="text-xs font-black uppercase text-gray-600 group-hover:text-blue-900">Global SEO Settings</span>
                            <FolderOpen className="h-4 w-4 text-gray-400 group-hover:text-blue-900" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
