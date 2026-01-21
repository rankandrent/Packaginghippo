"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Save, ArrowLeft, Plus, Trash2, Pencil } from "lucide-react"
import Link from "next/link"

export default function BlogCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [newName, setNewName] = useState("")

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        try {
            const res = await fetch('/api/cms/blog-categories')
            setCategories(await res.json())
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
        }
    }

    async function handleAdd() {
        if (!newName) return
        setLoading(true)
        try {
            const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            const res = await fetch('/api/cms/blog-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, slug }),
            })
            if (res.ok) {
                fetchCategories()
                setNewName("")
            }
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="flex justify-center p-8 text-muted-foreground">Loading categories...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/blog"><ArrowLeft className="h-5 w-5" /></Link>
                </Button>
                <h2 className="text-3xl font-bold">Manage Blog Categories</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Add New Category</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category Name</label>
                            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Industry Trends" />
                        </div>
                        <Button className="w-full" onClick={handleAdd} disabled={loading || !newName}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add Category
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    {categories.map(cat => (
                        <Card key={cat.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <h4 className="font-bold">{cat.name}</h4>
                                    <p className="text-xs text-muted-foreground">/{cat.slug} • {cat._count?.posts || 0} posts</p>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {categories.length === 0 && <p className="text-center text-muted-foreground py-8">No categories found.</p>}
                </div>
            </div>
        </div>
    )
}
