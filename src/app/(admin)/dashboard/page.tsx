"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, FolderOpen, Home, Loader2, MessageSquare } from "lucide-react"
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
        fetchStats()
    }, [])

    async function fetchStats() {
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
            console.error("Error fetching stats:", error)
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
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Welcome to the CMS Dashboard. All data is stored in MongoDB.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Link key={card.title} href={card.href}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{card.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Click to manage</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        ✅ <strong>MongoDB Connected</strong> - All data is stored in your MongoDB database
                    </p>
                    <p className="text-sm text-muted-foreground">
                        📝 Edit <Link href="/dashboard/homepage" className="text-blue-500 underline">Homepage sections</Link> to update your website content
                    </p>
                    <p className="text-sm text-muted-foreground">
                        ⚙️ Configure <Link href="/dashboard/settings" className="text-blue-500 underline">SEO and site settings</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
