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
import { Loader2, ArrowLeft, Save, Plus, Trash2 } from "lucide-react"

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
    specifications: string | null // currently string in schema? No, checked schema: dimensions, materials, finishings are strings. 
    // Wait, the schema has: dimensions, materials, finishings.
    // The previous file had "specifications" JSON? No, previously supabase used JSON. Prisma has specific fields. 
    // I need to map "specifications" UI to dimensions/materials/finishings OR add a specs JSON field?
    // User asked for "jitne bhi sections hon... edit kar sakoon". SectionBuilder handles generic content.
    // For specific specs, I will map the named fields. 
    dimensions: string | null
    materials: string | null
    finishings: string | null

    seoTitle: string | null
    seoDesc: string | null
    seoKeywords: string | null
    descriptionCollapsedHeight: number
    isActive: boolean
    isTopProduct: boolean
    sections: any // Json

    // Legacy fields from Supabase version if needed or just use sections?
    // User wants "sections". SectionBuilder is enough for generic "benefits/features".
    // I will stick to schema fields.
}

export const dynamicParams = false

export async function generateStaticParams() {
    return []
}

export default function ProductEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [product, setProduct] = useState<Product | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    // Helper for SectionBuilder type
    const [sections, setSections] = useState<Section[]>([])

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchProduct(), fetchCategories()])
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
            if (data.product.sections && Array.isArray(data.product.sections)) {
                setSections(data.product.sections)
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
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isTopProduct"
                                checked={product.isTopProduct || false}
                                onChange={(e) => setProduct({ ...product, isTopProduct: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="isTopProduct">Top Product</Label>
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
