"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { SectionBuilder, Section } from "@/components/admin/SectionBuilder"
import { LayoutSorter } from "@/components/admin/LayoutSorter"
import { Loader2, ArrowLeft, Save, Sparkles } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEFAULT_CATEGORY_TEMPLATE } from "@/lib/cms/templates"


type Category = {
    id: string
    name: string
    slug: string
    description: string | null
    imageUrl: string | null
    seoTitle: string | null
    seoDesc: string | null
    seoKeywords: string | null
    descriptionCollapsedHeight: number
    isActive: boolean
    sections: any
    layout: string[] | null
}

export default function CategoryEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [category, setCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [sections, setSections] = useState<Section[]>([])
    const [layout, setLayout] = useState<string[]>(['testimonials', 'quote_form', 'content', 'faqs', 'related_categories'])
    const router = useRouter()

    const [scrapeUrl, setScrapeUrl] = useState("")
    const [scraping, setScraping] = useState(false)

    async function handleScrape() {
        if (!scrapeUrl) return
        setScraping(true)
        try {
            const res = await fetch('/api/cms/categories/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: scrapeUrl }),
            })
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()

            setCategory(prev => prev ? ({
                ...prev,
                name: data.name || prev.name,
                slug: data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : prev.slug,
                description: data.description || prev.description,
                seoTitle: data.name || prev.seoTitle,
                seoDesc: data.seoDesc || prev.seoDesc,
                imageUrl: data.imageUrl || prev.imageUrl
            }) : null)
            alert("Content fetched successfully!")
        } catch (error) {
            console.error(error)
            alert("Error fetching content from URL")
        } finally {
            setScraping(false)
        }
    }

    // Initial fetch
    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchCategory(), fetchTemplates()])
        }
        init()
    }, [])

    async function fetchCategory() {
        try {
            setLoading(true)
            const res = await fetch(`/api/cms/categories?id=${id}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            setCategory(data.category)
            if (data.category.sections && Array.isArray(data.category.sections) && data.category.sections.length > 0) {
                setSections(data.category.sections)
            } else {
                // Load default template for new/empty categories
                // Deep copy to avoid reference issues
                setSections(JSON.parse(JSON.stringify(DEFAULT_CATEGORY_TEMPLATE)))
            }
            if (data.category.layout && Array.isArray(data.category.layout) && data.category.layout.length > 0) {
                setLayout(data.category.layout)
            }
        } catch (error) {
            console.error("Error fetching category:", error)
            router.push('/dashboard/categories')
        } finally {
            setLoading(false)
        }
    }

    const [templates, setTemplates] = useState<{ id: string, name: string, sections: any }[]>([])

    async function fetchTemplates() {
        try {
            const res = await fetch('/api/cms/templates?type=category')
            const data = await res.json()
            setTemplates(data.templates || [])
        } catch (error) {
            console.error(error)
        }
    }

    function applyTemplate(templateId: string) {
        const template = templates.find(t => t.id === templateId)
        if (template && confirm("This will replace current sections with the template. Continue?")) {
            setSections(template.sections)
        }
    }

    useEffect(() => {
        const init = async () => {
            // ... existing init
            await Promise.all([fetchCategory(), fetchTemplates()])
        }
        init()
    }, [])

    async function saveCategory(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!category) return

        try {
            setSaving(true)
            const res = await fetch('/api/cms/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...category,
                    sections: sections,
                    layout: layout
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            alert("Category saved successfully!")
            router.refresh()
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

    if (!category) return <div>Category not found</div>

    return (
        <form onSubmit={saveCategory} className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/categories">
                        <Button variant="outline" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
                        <p className="text-muted-foreground">Manage category details and content</p>
                    </div>
                </div>
                <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

            <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        Quick Import from URL
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="https://example.com/category-page"
                            value={scrapeUrl}
                            onChange={(e) => setScrapeUrl(e.target.value)}
                            className="bg-white"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleScrape}
                            disabled={scraping || !scrapeUrl}
                        >
                            {scraping ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Fetch Content"}
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                        Paste a category URL to automatically fill the name, description, image, and SEO settings.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
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
                            <div className="flex items-center gap-2 mt-2">
                                <Label className="text-xs text-muted-foreground whitespace-nowrap">Collapsed Height (px):</Label>
                                <Input
                                    type="number"
                                    className="w-24 h-8 text-xs"
                                    value={category.descriptionCollapsedHeight || 300}
                                    onChange={(e) => setCategory({ ...category, descriptionCollapsedHeight: parseInt(e.target.value) || 300 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Category Image</Label>
                            <div className="border rounded-md p-4 bg-muted/20">
                                <ImageUploader
                                    value={category.imageUrl ? [category.imageUrl] : []}
                                    onChange={(urls) => setCategory({ ...category, imageUrl: urls[0] || null })}
                                    maxFiles={1}
                                />
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC SECTIONS */}
                    <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                        <div className="mb-4">
                            <h3 className="font-semibold text-lg">Page Sections</h3>
                            <p className="text-sm text-muted-foreground">Add custom sections to the category page.</p>
                        </div>

                        <div className="mb-6 p-4 border rounded-md bg-muted/20">
                            <Label className="mb-2 block">Load From Template</Label>
                            <Select onValueChange={applyTemplate}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a template to apply..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-2">Warning: Applying a template will replace all current sections.</p>
                        </div>
                        <SectionBuilder sections={sections} onChange={setSections} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
                        <h3 className="font-semibold text-lg">Visibility</h3>
                        <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
                            <h3 className="font-semibold text-lg">Section Layout</h3>
                            <p className="text-sm text-muted-foreground">Drag to reorder standard sections.</p>
                            <LayoutSorter items={layout} onChange={setLayout} />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
                            <div className="space-y-0.5">
                                <Label htmlFor="isActive" className="text-base">Published Status</Label>
                                <p className="text-xs text-muted-foreground">
                                    {category.isActive ? 'Category is live and visible' : 'Category is in draft mode'}
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={category.isActive}
                                onCheckedChange={(checked) => setCategory({ ...category, isActive: checked })}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
                        <h3 className="font-semibold text-lg">SEO Settings</h3>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="seo_title">Meta Title</Label>
                                <Input
                                    id="seo_title"
                                    value={category.seoTitle || ""}
                                    onChange={(e) => setCategory({ ...category, seoTitle: e.target.value })}
                                    placeholder="SEO Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seo_desc">Meta Description</Label>
                                <Textarea
                                    id="seo_desc"
                                    rows={4}
                                    value={category.seoDesc || ""}
                                    onChange={(e) => setCategory({ ...category, seoDesc: e.target.value })}
                                    placeholder="SEO Description"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seo_keywords">Meta Keywords</Label>
                                <Input
                                    id="seo_keywords"
                                    value={category.seoKeywords || ""}
                                    onChange={(e) => setCategory({ ...category, seoKeywords: e.target.value })}
                                    placeholder="Keywords separated by commas"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
