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
import { Loader2, ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import { CmsProduct } from "@/types/cms"

type Category = {
    id: string
    name: string
}

export default function ProductEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [product, setProduct] = useState<CmsProduct | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchProduct()
        fetchCategories()
    }, [])

    async function fetchProduct() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("cms_products")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            setProduct(data)
        } catch (error) {
            console.error("Error fetching product:", error)
            router.push('/dashboard/products')
        } finally {
            setLoading(false)
        }
    }

    async function fetchCategories() {
        const { data } = await supabase.from("cms_categories").select("id, name")
        setCategories(data || [])
    }

    async function saveProduct(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!product) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from("cms_products")
                .update({
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    description: product.description, // Rich text short desc
                    short_description: product.short_description, // Plain text really short
                    specifications: product.specifications,
                    benefits: product.benefits,
                    features: product.features,
                    faq: product.faq,
                    category_id: product.category_id,
                    images: product.images,
                    seo_title: product.seo_title,
                    meta_description: product.meta_description,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", product.id)

            if (error) throw error
            alert("Product saved!")
        } catch (error) {
            console.error("Error saving product:", error)
            alert("Error saving product")
        } finally {
            setSaving(false)
        }
    }

    // --- Helper Functions for Arrays ---

    const updateSpec = (key: string, value: string) => {
        if (!product) return
        const currentSpecs = (product.specifications || {})
        setProduct({
            ...product,
            specifications: { ...currentSpecs, [key]: value },
        })
    }

    const removeSpec = (key: string) => {
        if (!product) return
        const currentSpecs = { ...(product.specifications || {}) }
        delete currentSpecs[key]
        setProduct({ ...product, specifications: currentSpecs })
    }

    const addBenefit = () => {
        if (!product) return
        setProduct({ ...product, benefits: [...(product.benefits || []), "New Benefit"] })
    }

    const updateBenefit = (index: number, value: string) => {
        if (!product) return
        const newBenefits = [...(product.benefits || [])]
        newBenefits[index] = value
        setProduct({ ...product, benefits: newBenefits })
    }

    const removeBenefit = (index: number) => {
        if (!product) return
        setProduct({ ...product, benefits: (product.benefits || []).filter((_, i) => i !== index) })
    }

    const addFeature = () => {
        if (!product) return
        setProduct({ ...product, features: [...(product.features || []), "New Feature"] })
    }

    const updateFeature = (index: number, value: string) => {
        if (!product) return
        const newFeatures = [...(product.features || [])]
        newFeatures[index] = value
        setProduct({ ...product, features: newFeatures })
    }

    const removeFeature = (index: number) => {
        if (!product) return
        setProduct({ ...product, features: (product.features || []).filter((_, i) => i !== index) })
    }

    const addFaq = () => {
        if (!product) return
        setProduct({ ...product, faq: [...(product.faq || []), { q: "Question?", a: "Answer" }] })
    }

    const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
        if (!product) return
        const newFaq = [...(product.faq || [])]
        newFaq[index] = { ...newFaq[index], [field]: value }
        setProduct({ ...product, faq: newFaq })
    }

    const removeFaq = (index: number) => {
        if (!product) return
        setProduct({ ...product, faq: (product.faq || []).filter((_, i) => i !== index) })
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!product) {
        return <div>Product not found</div>
    }

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
                            <Textarea value={product.short_description || ""} onChange={(e) => setProduct({ ...product, short_description: e.target.value })} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label>Full Description (Rich Text)</Label>
                            <RichTextEditor content={product.description || ""} onChange={(html) => setProduct({ ...product, description: html })} />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-4 rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Specifications</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                                const key = prompt("Enter spec name:")
                                if (key) updateSpec(key, "")
                            }}>+ Add Spec</Button>
                        </div>
                        <div className="space-y-2">
                            {Object.entries((product.specifications || {})).map(([key, value]) => (
                                <div key={key} className="flex gap-2 items-center">
                                    <Label className="w-1/3 truncate">{key}</Label>
                                    <Input value={value} onChange={(e) => updateSpec(key, e.target.value)} className="h-8" />
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSpec(key)} className="text-destructive h-8 w-8 p-0">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Lists (Benefits, Features, FAQ) */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Benefits */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Key Benefits</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addBenefit}><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {product.benefits?.map((benefit, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input value={benefit} onChange={(e) => updateBenefit(i, e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeBenefit(i)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Features</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addFeature}><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {product.features?.map((feature, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input value={feature} onChange={(e) => updateFeature(i, e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="space-y-4 rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">FAQ</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addFaq}>+ Add FAQ</Button>
                        </div>
                        <div className="space-y-4">
                            {product.faq?.map((item, i) => (
                                <div key={i} className="space-y-2 p-3 bg-muted/30 rounded-md border">
                                    <div className="flex justify-between">
                                        <Label className="uppercase text-xs text-muted-foreground">Question {i + 1}</Label>
                                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFaq(i)}><Trash2 className="w-3 h-3" /></Button>
                                    </div>
                                    <Input placeholder="Question" value={item.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} className="font-bold" />
                                    <Textarea placeholder="Answer" value={item.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} rows={2} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Images */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <Label className="text-lg font-semibold">Product Images</Label>
                        <ImageUploader
                            value={product.images || []}
                            onChange={(urls) => setProduct({ ...product, images: urls })}
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
                                value={product.category_id || ""}
                                onChange={(e) => setProduct({ ...product, category_id: e.target.value || null })}
                            >
                                <option value="">Select Category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-lg">SEO</h3>
                        <div className="space-y-2">
                            <Label htmlFor="seo_title">Meta Title</Label>
                            <Input
                                id="seo_title"
                                value={product.seo_title || ""}
                                onChange={(e) => setProduct({ ...product, seo_title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <Textarea
                                id="meta_description"
                                value={product.meta_description || ""}
                                onChange={(e) => setProduct({ ...product, meta_description: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
