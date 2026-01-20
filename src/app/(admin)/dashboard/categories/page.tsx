"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Loader2, Folder, Edit, ExternalLink } from "lucide-react"

type Category = {
    id: string
    name: string
    slug: string
    created_at: string
}

export default function CategoriesDashboard() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("cms_categories")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setCategories(data || [])
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }

    async function createCategory() {
        const name = prompt("Enter category name:")
        if (!name) return

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")

        try {
            const { data, error } = await supabase
                .from("cms_categories")
                .insert([{ name, slug }])
                .select()
                .single()

            if (error) throw error
            setCategories([data, ...categories])
        } catch (error) {
            console.error("Error creating category:", error)
            alert("Error creating category. Slug might already exist.")
        }
    }

    async function deleteCategory(id: string) {
        if (!confirm("Are you sure? This might affect products in this category.")) return

        try {
            const { error } = await supabase.from("cms_categories").delete().eq("id", id)
            if (error) throw error
            setCategories(categories.filter((c) => c.id !== id))
        } catch (error) {
            console.error("Error deleting category:", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">
                        Organize your products into categories.
                    </p>
                </div>
                <Button onClick={createCategory}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        Manage your product categories here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No categories found. Add one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Folder className="h-4 w-4 text-muted-foreground" />
                                                    {category.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    /{category.slug}
                                                    <Link href={`/products/${category.slug}`} target="_blank" className="text-muted-foreground hover:text-primary">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/dashboard/categories/${category.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mr-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => deleteCategory(category.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
