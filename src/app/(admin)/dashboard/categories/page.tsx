"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, Search, Filter, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Category = {
    id: string
    name: string
    slug: string
    description: string | null
    isActive: boolean
    _count?: { products: number }
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    useEffect(() => {
        fetchCategories()
        fetchTemplates()
    }, [])

    const [templates, setTemplates] = useState<{ id: string, name: string }[]>([])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none")

    async function fetchTemplates() {
        try {
            const res = await fetch('/api/cms/templates?type=category')
            const data = await res.json()
            setTemplates(data.templates || [])
        } catch (error) {
            console.error(error)
        }
    }

    async function fetchCategories() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/categories')
            const data = await res.json()
            setCategories(data.categories || [])
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }

    async function createCategory(e: React.FormEvent) {
        e.preventDefault()
        if (!newName) return

        const slug = newName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")

        try {
            const res = await fetch('/api/cms/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, slug, templateId: selectedTemplateId === 'none' ? undefined : selectedTemplateId }),
            })

            if (!res.ok) throw new Error('Failed to create')
            const data = await res.json()

            // Redirect to the editor immediately so user can set SEO, etc.
            router.push(`/dashboard/categories/${data.category.id}`)
        } catch (error) {
            console.error("Error creating category:", error)
            alert("Error creating category")
        }
    }

    async function deleteCategory(id: string) {
        if (!confirm("Are you sure? Products in this category will be orphaned.")) return

        try {
            const res = await fetch(`/api/cms/categories?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')
            setCategories(categories.filter(c => c.id !== id))
        } catch (error) {
            console.error("Error deleting category:", error)
            alert("Error deleting category")
        }
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage your product categories and structure.</p>
                </div>

                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                                Start by naming your category. You can add more details later.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={createCategory} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Mailer Boxes"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template">Template (Optional)</Label>
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
                            <DialogFooter>
                                <Button type="submit" className="w-full sm:w-auto">Create & Edit</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Categories</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search categories..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <TableRow key={cat.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => router.push(`/dashboard/categories/${cat.id}`)}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{cat.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-sm">{cat.slug}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {cat._count?.products || 0} products
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={cat.isActive ? 'default' : 'secondary'} className={cat.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'}>
                                                {cat.isActive ? 'Published' : 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => window.open(`/services/${cat.slug}`, '_blank')}
                                                    title="View Category"
                                                >
                                                    <Eye className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/dashboard/categories/${cat.id}`)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => deleteCategory(cat.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <p>No categories found</p>
                                            {searchQuery && <p className="text-sm">Try adjusting your search query</p>}
                                        </div>
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
