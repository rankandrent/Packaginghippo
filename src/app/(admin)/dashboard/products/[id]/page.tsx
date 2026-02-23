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
import { Loader2, ArrowLeft, Save, Plus, Trash2, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEFAULT_PRODUCT_TEMPLATE } from "@/lib/cms/templates"


type Category = {
    id: string
    name: string
}

type Product = {
    id: string
    name: string
    slug: string
    description: string | null
    shortDesc: string | null
    price: number | null
    categoryId: string
    images: string[]
    dimensions: string | null
    materials: string | null
    finishings: string | null

    seoTitle: string | null
    seoDesc: string | null
    seoKeywords: string | null
    descriptionCollapsedHeight: number
    isActive: boolean
    sections: any
    relatedProductIds: string[]
}

export default function ProductEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [product, setProduct] = useState<Product | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [allProducts, setAllProducts] = useState<{ id: string, name: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    // Helper for SectionBuilder type
    const [sections, setSections] = useState<Section[]>([])

    const [scrapeUrl, setScrapeUrl] = useState("")
    const [scraping, setScraping] = useState(false)

    async function handleScrape() {
        if (!scrapeUrl) return
        setScraping(true)
        try {
            const res = await fetch('/api/cms/products/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: scrapeUrl }),
            })
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()

            setProduct(prev => prev ? ({
                ...prev,
                name: data.name || prev.name,
                slug: data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : prev.slug,
                description: data.description || prev.description,
                shortDesc: data.shortDesc || prev.shortDesc,
                price: data.price || prev.price,
                seoTitle: data.name || prev.seoTitle,
                seoDesc: data.seoDesc || prev.seoDesc,
                images: data.images && data.images.length > 0 ? data.images : prev.images
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
            await Promise.all([fetchProduct(), fetchCategories(), fetchTemplates(), fetchAllProducts()])
            setLoading(false)
        }
        init()
    }, [])

    async function fetchProduct() {
        try {
            const res = await fetch(`/api/cms/products?id=${id}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            setProduct(data.product)
            // Parse sections if existing
            if (data.product.sections && Array.isArray(data.product.sections) && data.product.sections.length > 0) {
                setSections(data.product.sections)
            } else {
                // Load default template for new/empty products
                setSections(JSON.parse(JSON.stringify(DEFAULT_PRODUCT_TEMPLATE)))
            }
        } catch (error) {
            console.error("Error fetching product:", error)
            // router.push('/dashboard/products')
        }
    }

    async function fetchCategories() {
        try {
            const res = await fetch("/api/cms/categories")
            const data = await res.json()
            setCategories(data.categories || [])
        } catch (e) {
            console.error(e)
        }
    }

    const [templates, setTemplates] = useState<{ id: string, name: string, sections: any }[]>([])

    async function fetchTemplates() {
        try {
            const res = await fetch('/api/cms/templates?type=product')
            const data = await res.json()
            setTemplates(data.templates || [])
        } catch (error) {
            console.error(error)
        }
    }

    async function fetchAllProducts() {
        try {
            const res = await fetch('/api/cms/products')
            const data = await res.json()
            setAllProducts((data.products || []).map((p: any) => ({ id: p.id, name: p.name })))
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
            await Promise.all([fetchProduct(), fetchCategories(), fetchTemplates(), fetchAllProducts()])
            setLoading(false)
        }
        init()
    }, [])

    async function saveProduct(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!product) return

        try {
            setSaving(true)
            const res = await fetch('/api/cms/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...product,
                    sections: sections // Save the sections from state
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            alert("Product saved successfully!")
            router.refresh()
        } catch (error) {
            console.error("Error saving product:", error)
            alert("Error saving product")
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

    if (!product) return <div>Product not found</div>

    return (
        <form onSubmit={saveProduct} className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/products">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
                        <p className="text-sm text-muted-foreground">ID: {product.id}</p>
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
                            placeholder="https://example.com/product-page"
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
                        Paste a product URL to automatically fill the name, description, price, images, and SEO settings.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">

                    {/* Basic Info */}
                    <div className="space-y-4 rounded-lg border bg-card p-6">
                        <h3 className="font-semibold text-lg">Product Details</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input value={product.slug} onChange={(e) => setProduct({ ...product, slug: e.target.value })} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Short Description (Plain)</Label>
                            <Textarea value={product.shortDesc || ""} onChange={(e) => setProduct({ ...product, shortDesc: e.target.value })} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <RichTextEditor
                                content={product.description || ""} // Kept || "" for safety as description can be null
                                onChange={(html) => setProduct({ ...product, description: html })}
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <Label className="text-xs text-muted-foreground whitespace-nowrap">Collapsed Height (px):</Label>
                                <Input
                                    type="number"
                                    className="w-24 h-8 text-xs"
                                    value={product.descriptionCollapsedHeight || 300}
                                    onChange={(e) => setProduct({ ...product, descriptionCollapsedHeight: parseInt(e.target.value) || 300 })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specifications (Fixed Fields) */}
                    <div className="space-y-4 rounded-lg border bg-card p-6">
                        <h3 className="font-semibold text-lg">Specifications</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Dimensions</Label>
                                <Input value={product.dimensions || ''} onChange={(e) => setProduct({ ...product, dimensions: e.target.value })} placeholder="e.g. 10x10x5" />
                            </div>
                            <div className="space-y-2">
                                <Label>Materials</Label>
                                <Input value={product.materials || ''} onChange={(e) => setProduct({ ...product, materials: e.target.value })} placeholder="e.g. Cardboard" />
                            </div>
                            <div className="space-y-2">
                                <Label>Finishings</Label>
                                <Input value={product.finishings || ''} onChange={(e) => setProduct({ ...product, finishings: e.target.value })} placeholder="e.g. Matte, Gloss" />
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC SECTIONS */}
                    <div className="space-y-4 rounded-lg border bg-card p-6">
                        <div className="mb-4">
                            <h3 className="font-semibold text-lg">Page Sections</h3>
                            <p className="text-sm text-muted-foreground">Add custom sections to the product page (Benefits, Features, FAQ, etc.)</p>
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
                    {/* Images */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <Label className="text-lg font-semibold">Product Images</Label>
                        <ImageUploader
                            value={product.images || []}
                            onChange={(urls) => setProduct({ ...product, images: urls })}
                            maxFiles={10}
                        />
                    </div>

                    {/* Settings */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Settings</h3>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                type="number"
                                id="price"
                                value={product.price || 0}
                                onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={product.categoryId || ""}
                                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                            >
                                <option value="">Select Category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={product.isActive}
                                onChange={(e) => setProduct({ ...product, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="isActive">Published</Label>
                        </div>
                        <div className="pt-4 mt-4 border-t space-y-3">
                            <Label className="font-semibold block">Related Products (Manual Selection)</Label>
                            <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2 bg-white text-sm">
                                {allProducts.length === 0 ? (
                                    <div className="text-muted-foreground p-2">No products available.</div>
                                ) : (
                                    allProducts.filter(p => p.id !== product.id).map(p => (
                                        <div key={p.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                                            <input
                                                type="checkbox"
                                                id={`related-${p.id}`}
                                                checked={product.relatedProductIds?.includes(p.id) || false}
                                                onChange={(e) => {
                                                    const current = product.relatedProductIds || []
                                                    const updated = e.target.checked
                                                        ? [...current, p.id]
                                                        : current.filter(id => id !== p.id)
                                                    setProduct({ ...product, relatedProductIds: updated })
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor={`related-${p.id}`} className="font-normal cursor-pointer flex-1">
                                                {p.name}
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">
                                These selected products will be displayed in the equivalent "Popular Products" module for this specific product.
                            </p>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-lg">SEO</h3>
                        <div className="space-y-2">
                            <Label htmlFor="seo_title">Meta Title</Label>
                            <Input
                                id="seo_title"
                                value={product.seoTitle || ""}
                                onChange={(e) => setProduct({ ...product, seoTitle: e.target.value })}
                                placeholder="SEO Title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <Textarea
                                id="meta_description"
                                value={product.seoDesc || ""}
                                onChange={(e) => setProduct({ ...product, seoDesc: e.target.value })}
                                rows={4}
                                placeholder="SEO Description for search engines"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seo_keywords">Meta Keywords</Label>
                            <Input
                                id="seo_keywords"
                                value={product.seoKeywords || ""}
                                onChange={(e) => setProduct({ ...product, seoKeywords: e.target.value })}
                                placeholder="Keywords separated by commas"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
