
"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { toast } from "sonner" // Assuming sonner or similar toast
import { Loader2, Save, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

type PageData = {
    id: string
    title: string
    slug: string
    content: any
    seoTitle: string | null
    seoDesc: string | null
    seoKeywords: string | null
    isPublished: boolean
}

export const dynamicParams = false

export async function generateStaticParams() {
    return []
}

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
    const [page, setPage] = useState<PageData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const { id } = use(params)

    useEffect(() => {
        fetchPage()
    }, [id])

    async function fetchPage() {
        try {
            setLoading(true)
            const res = await fetch(`/api/cms/pages`) // The API returns all, we find the one
            const data = await res.json()
            const found = data.pages.find((p: any) => p.id === id)
            if (found) {
                setPage(found)
            }
        } catch (error) {
            console.error("Error fetching page:", error)
        } finally {
            setLoading(false)
        }
    }

    async function savePage(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!page) return

        try {
            setSaving(true)
            const res = await fetch('/api/cms/pages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(page),
            })

            if (!res.ok) throw new Error('Failed to save')

            alert("Page saved successfully!")
        } catch (error) {
            console.error("Error saving page:", error)
            alert("Error saving page")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!page) {
        return <div>Page not found</div>
    }

    return (
        <form onSubmit={savePage} className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/pages">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Page</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/${page.slug}`} target="_blank">
                        <Button variant="outline" size="sm" type="button">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Live
                        </Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                            id="title"
                            value={page.title}
                            onChange={(e) => setPage({ ...page, title: e.target.value })}
                            required
                            className="text-lg font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        {/* We store HTML string in content field for now, simplifying JSONB */}
                        <RichTextEditor
                            content={typeof page.content === 'string' ? page.content : page.content?.html || ''}
                            onChange={(html) => setPage({ ...page, content: html })} // Storing as direct string or object? Let's treat as string for simplicity or wrapped
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                        <h3 className="font-semibold leading-none tracking-tight">
                            Publishing
                        </h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPublished"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={page.isPublished}
                                onChange={(e) =>
                                    setPage({ ...page, isPublished: e.target.checked })
                                }
                            />
                            <Label htmlFor="isPublished">Published</Label>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                        <h3 className="font-semibold leading-none tracking-tight">SEO Settings</h3>
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                                id="slug"
                                value={page.slug}
                                onChange={(e) => setPage({ ...page, slug: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seoTitle">Meta Title</Label>
                            <Input
                                id="seoTitle"
                                value={page.seoTitle || ""}
                                onChange={(e) =>
                                    setPage({ ...page, seoTitle: e.target.value })
                                }
                                placeholder="Browser tab title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seoDesc">Meta Description</Label>
                            <Textarea
                                id="seoDesc"
                                value={page.seoDesc || ""}
                                onChange={(e) =>
                                    setPage({ ...page, seoDesc: e.target.value })
                                }
                                placeholder="For search engines..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
