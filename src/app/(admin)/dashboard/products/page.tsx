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
import { Plus, Pencil, Trash2, Loader2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = {
    id: string
    name: string
    slug: string
    price: number | null
    isActive: boolean
    isTopProduct: boolean
    images: string[]
    category: { name: string; slug: string }
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/products')
            const data = await res.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    // State for creation dialog
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [newCategoryId, setNewCategoryId] = useState("")
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])

    // Fetch categories when component mounts (or when dialog opens)
    useEffect(() => {
        fetch("/api/cms/categories").then(res => res.json()).then(data => setCategories(data.categories || []))
        fetchTemplates()
    }, [])

    const [templates, setTemplates] = useState<{ id: string, name: string }[]>([])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none")

    async function fetchTemplates() {
        try {
            const res = await fetch('/api/cms/templates?type=product')
            const data = await res.json()
            setTemplates(data.templates || [])
        } catch (error) {
            console.error(error)
        }
    }

    async function createProduct(e: React.FormEvent) {
        e.preventDefault()
        if (!newName || !newCategoryId) return

        const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")

        try {
            const res = await fetch('/api/cms/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, slug, categoryId: newCategoryId, templateId: selectedTemplateId === 'none' ? undefined : selectedTemplateId }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.details || errorData.error || 'Failed to create')
            }
            const data = await res.json()
            router.push(`/dashboard/products/${data.product.id}`)
        } catch (error: any) {
            console.error("Error creating product:", error)
            alert(error.message || "Error creating product")
        }
    }

    async function deleteProduct(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const res = await fetch(`/api/cms/products?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')
            setProducts(products.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting product:", error)
            alert("Error deleting product")
        }
    }

    async function toggleTopProduct(product: Product) {
        try {
            // Optimistic update
            const newStatus = !product.isTopProduct
            setProducts(products.map(p => p.id === product.id ? { ...p, isTopProduct: newStatus } : p))

            const res = await fetch('/api/cms/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, isTopProduct: newStatus }),
            })

            if (!res.ok) throw new Error('Failed to update')
            router.refresh()
        } catch (error) {
            console.error("Error updating top product status:", error)
            alert("Error updating status")
            // Revert on error
            setProducts(products.map(p => p.id === product.id ? { ...p, isTopProduct: !product.isTopProduct } : p))
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
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>

                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={createProduct} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Product Name</Label>
                                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Custom Mailer Box" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={newCategoryId} onValueChange={setNewCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Template (Optional)</Label>
                                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Default Layout</SelectItem>
                                        {templates.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Create Product</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Top Product</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="h-12 w-12 rounded bg-muted/50 overflow-hidden relative border">
                                            {product.images && product.images[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{product.slug}</TableCell>
                                    <TableCell>{product.category?.name || '-'}</TableCell>
                                    <TableCell>{product.price ? `$${product.price}` : 'Quote'}</TableCell>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={product.isTopProduct || false}
                                            onChange={() => toggleTopProduct(product)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary cursor-pointer"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {product.isActive ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                                            title="View Product"
                                        >
                                            <Eye className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => router.push(`/dashboard/products/${product.id}`)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No products found. Click "Add Product" to create one.
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
