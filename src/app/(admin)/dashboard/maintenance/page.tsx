"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2 } from "lucide-react"

export default function MaintenancePage() {
    const [counts, setCounts] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    async function fetchCounts() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/maintenance')
            const data = await res.json()
            setCounts(data.counts || null)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCounts()
    }, [])

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    if (!counts) return <div className="p-8">Error fetching database stats.</div>

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Database Maintenance</h1>
            <p className="text-muted-foreground">
                Your database storage is critical. Your limit is 512MB. If you are seeing quota errors, delete old or large data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><CardTitle>Products</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-bold">{counts.products}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-bold">{counts.categories}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Inquiries</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-bold">{counts.inquiries}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Blog Posts</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-bold">{counts.blogPosts}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Pages</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-bold">{counts.pages}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-bold">{counts.siteSettings}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Homepage Sections</CardTitle></CardHeader>
                    <CardContent className="text-2xl font-bold">{counts.homepageSections}</CardContent>
                </Card>
            </div>
        </div>
    )
}
