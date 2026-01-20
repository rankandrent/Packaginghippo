
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
    seo_title: string | null
    meta_description: string | null
    is_published: boolean
}

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
    const [page, setPage] = useState<PageData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    // Unwrap params using React.use()
    const { id } = use(params)

    useEffect(() => {
        fetchPage()
    }, [])

    async function fetchPage() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("cms_pages")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            setPage(data)
        } catch (error) {
            console.error("Error fetching page:", error)
            // toast.error("Could not load page")
        } finally {
            setLoading(false)
        }
    }

    async function savePage(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!page) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from("cms_pages")
                .update({
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    seo_title: page.seo_title,
                    meta_description: page.meta_description,
                    is_published: page.is_published,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", page.id)

            if (error) throw error
            // toast.success("Page saved successfully")
            alert("Page saved!")
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
                                id="is_published"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={page.is_published}
                                onChange={(e) =>
                                    setPage({ ...page, is_published: e.target.checked })
                                }
                            />
                            <Label htmlFor="is_published">Published</Label>
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
                            <Label htmlFor="seo_title">Meta Title</Label>
                            <Input
                                id="seo_title"
                                value={page.seo_title || ""}
                                onChange={(e) =>
                                    setPage({ ...page, seo_title: e.target.value })
                                }
                                placeholder="Browser tab title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <Textarea
                                id="meta_description"
                                value={page.meta_description || ""}
                                onChange={(e) =>
                                    setPage({ ...page, meta_description: e.target.value })
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
