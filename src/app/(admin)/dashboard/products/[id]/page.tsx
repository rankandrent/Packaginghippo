"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Save, Trash2, Plus, GripVertical } from "lucide-react"
import { toast } from "sonner"

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [id])

    async function fetchData() {
        try {
            setLoading(true)
            const [prodRes, catsRes] = await Promise.all([
                fetch(`/api/cms/products`),
                fetch(`/api/cms/categories`)
            ])
            
            const prodData = await prodRes.json()
            const catsData = await catsRes.json()

            const foundProduct = prodData.products.find((p: any) => p.id === id)
            if (!foundProduct) {
                toast.error("Product not found")
                router.push('/dashboard/products')
                return
            }

            setProduct(foundProduct)
            setCategories(catsData.categories || [])
        } catch (error) {
            console.error(error)
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        try {
            setSaving(true)
            const res = await fetch('/api/cms/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            })
            if (!res.ok) throw new Error('Save failed')
            toast.success("Product updated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Error saving product")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight italic">Edit Product</h2>
                </div>
                <Button onClick={handleSave} disabled={saving} className="font-bold">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="general" className="rounded-lg font-bold">General Info</TabsTrigger>
                    <TabsTrigger value="ecommerce" className="rounded-lg font-bold">E-commerce</TabsTrigger>
                    <TabsTrigger value="seo" className="rounded-lg font-bold">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 pt-4">
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader><CardTitle className="italic">Required Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold">Product Name</Label>
                                    <Input value={product.name} onChange={e => setProduct({...product, name: e.target.value})} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">URL Slug</Label>
                                    <Input value={product.slug} onChange={e => setProduct({...product, slug: e.target.value})} className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Category</Label>
                                <select 
                                    className="w-full p-2 border rounded-xl"
                                    value={product.categoryId}
                                    onChange={e => setProduct({...product, categoryId: e.target.value})}
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Short Description</Label>
                                <Textarea value={product.shortDesc || ''} onChange={e => setProduct({...product, shortDesc: e.target.value})} className="rounded-xl min-h-[100px]" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ecommerce" className="space-y-4 pt-4">
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader><CardTitle className="italic">Pricing & Stock</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-2xl border">
                                <Switch 
                                    checked={product.isEcommerce} 
                                    onCheckedChange={checked => setProduct({...product, isEcommerce: checked})} 
                                />
                                <Label className="font-bold">Enable E-commerce (Add to Cart)</Label>
                            </div>

                            {product.isEcommerce && (
                                <div className="grid grid-cols-2 gap-4 p-4 border rounded-2xl border-dashed">
                                    <div className="space-y-2">
                                        <Label className="font-bold">Sale Price ($)</Label>
                                        <Input type="number" value={product.ecommercePrice || ''} onChange={e => setProduct({...product, ecommercePrice: parseFloat(e.target.value)})} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Stock Status</Label>
                                        <select 
                                            className="w-full p-2 border rounded-xl"
                                            value={product.stockStatus}
                                            onChange={e => setProduct({...product, stockStatus: e.target.value})}
                                        >
                                            <option value="IN_STOCK">In Stock</option>
                                            <option value="OUT_OF_STOCK">Out of Stock</option>
                                            <option value="PRE_ORDER">Pre Order</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 pt-4">
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader><CardTitle className="italic">Search Engine Optimization</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="font-bold">SEO Title</Label>
                                <Input value={product.seoTitle || ''} onChange={e => setProduct({...product, seoTitle: e.target.value})} className="rounded-xl" />
                                <p className="text-[10px] text-muted-foreground italic">Target: 50-60 characters</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">SEO Description</Label>
                                <Textarea value={product.seoDesc || ''} onChange={e => setProduct({...product, seoDesc: e.target.value})} className="rounded-xl" />
                                <p className="text-[10px] text-muted-foreground italic">Target: 150-160 characters</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
