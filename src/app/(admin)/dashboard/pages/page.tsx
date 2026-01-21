"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react"

type Page = {
    id: string
    title: string
    slug: string
    isPublished: boolean
    updatedAt: string
}

export default function PagesListPage() {
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchPages()
    }, [])

    async function fetchPages() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/pages')
            const data = await res.json()
            setPages(data.pages || [])
        } catch (error) {
            console.error("Error fetching pages:", error)
        } finally {
            setLoading(false)
        }
    }

    async function createPage() {
        const title = prompt("Enter page title:")
        if (!title) return

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")

        try {
            const res = await fetch('/api/cms/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, slug }),
            })

            if (!res.ok) throw new Error('Failed to create')
            const data = await res.json()
            router.push(`/dashboard/pages/${data.page.id}`)
        } catch (error) {
            console.error("Error creating page:", error)
            alert("Error creating page")
        }
    }

    async function deletePage(id: string) {
        if (!confirm("Are you sure you want to delete this page?")) return

        try {
            const res = await fetch(`/api/cms/pages?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')
            setPages(pages.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting page:", error)
            alert("Error deleting page")
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pages</h2>
                    <p className="text-muted-foreground">Manage static pages (About, Contact, etc.)</p>
                </div>
                <Button onClick={createPage}>
                    <Plus className="mr-2 h-4 w-4" /> Add Page
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.title}</TableCell>
                                    <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${page.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {page.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(page.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => window.open(`/${page.slug}`, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => router.push(`/dashboard/pages/${page.id}`)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deletePage(page.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No pages found. Click "Add Page" to create one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
