"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { CmsCategory } from "@/types/cms"

export default function CategoryEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [category, setCategory] = useState<CmsCategory | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchCategory()
    }, [])

    async function fetchCategory() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("cms_categories")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            setCategory(data)
        } catch (error) {
            console.error("Error fetching category:", error)
            alert("Category not found")
            router.push('/dashboard/categories')
        } finally {
            setLoading(false)
        }
    }

    async function saveCategory(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!category) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from("cms_categories")
                .update({
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    image_url: category.image_url,
                    seo_title: category.seo_title,
                    seo_description: category.seo_description,
                    content: category.content
                    // updated_at is usually handled by DB trigger or standard Supabase behavior if column exists
                })
                .eq("id", category.id)

            if (error) throw error
            alert("Category saved successfully!")
        } catch (error) {
            console.error("Error saving category:", error)
            alert("Error saving category")
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

    if (!category) return null

    return (
        <form onSubmit={saveCategory} className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/categories">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
                        <p className="text-muted-foreground text-sm">ID: {category.id}</p>
                    </div>
                </div>
                <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-lg">General Information</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={category.name}
                                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={category.slug}
                                    onChange={(e) => setCategory({ ...category, slug: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <RichTextEditor
                                content={category.description || ""}
                                onChange={(html) => setCategory({ ...category, description: html })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category Image</Label>
                            <div className="border rounded-md p-4 bg-gray-50/50">
                                <ImageUploader
                                    value={category.image_url ? [category.image_url] : []}
                                    onChange={(urls) => setCategory({ ...category, image_url: urls[0] || null })}
                                    maxFiles={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-lg">SEO Settings</h3>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="seo_title">Meta Title</Label>
                                <Input
                                    id="seo_title"
                                    value={category.seo_title || ""}
                                    onChange={(e) => setCategory({ ...category, seo_title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seo_desc">Meta Description</Label>
                                <Textarea
                                    id="seo_desc"
                                    rows={4}
                                    value={category.seo_description || ""}
                                    onChange={(e) => setCategory({ ...category, seo_description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
