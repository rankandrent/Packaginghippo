
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Page = {
    id: string
    title: string
    slug: string
    is_published: boolean
    updated_at: string
}

export default function PagesDashboard() {
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchPages()
    }, [])

    async function fetchPages() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("cms_pages")
                .select("id, title, slug, is_published, updated_at")
                .order("updated_at", { ascending: false })

            if (error) throw error
            setPages(data || [])
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
            const { data, error } = await supabase
                .from("cms_pages")
                .insert([{ title, slug, content: {}, is_published: false }])
                .select()
                .single()

            if (error) throw error
            router.push(`/dashboard/pages/${data.id}`)
        } catch (error) {
            console.error("Error creating page:", error)
            alert("Error creating page. Slug might already exist.")
        }
    }

    async function deletePage(id: string) {
        if (!confirm("Are you sure you want to delete this page?")) return

        try {
            const { error } = await supabase.from("cms_pages").delete().eq("id", id)
            if (error) throw error
            fetchPages()
        } catch (error) {
            console.error("Error deleting page:", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pages</h2>
                    <p className="text-muted-foreground">
                        Manage your website&apos;s static content pages.
                    </p>
                </div>
                <Button onClick={createPage}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Page
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Pages</CardTitle>
                    <CardDescription>
                        A list of all pages on your website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No pages found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pages.map((page) => (
                                        <TableRow key={page.id}>
                                            <TableCell className="font-medium">{page.title}</TableCell>
                                            <TableCell>/{page.slug}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${page.is_published
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {page.is_published ? "Published" : "Draft"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(page.updated_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/dashboard/pages/${page.id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => deletePage(page.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
