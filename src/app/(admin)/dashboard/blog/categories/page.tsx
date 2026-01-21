"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Save, ArrowLeft, Plus, Trash2, Pencil, X } from "lucide-react"
import Link from "next/link"

export default function BlogCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newName, setNewName] = useState("")

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        try {
            const res = await fetch('/api/cms/blog-categories')
            const data = await res.json()
            setCategories(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
        }
    }

    async function handleSave() {
        if (!newName) return
        setLoading(true)
        try {
            const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            const url = '/api/cms/blog-categories'
            const method = editingId ? 'PUT' : 'POST'
            const body = editingId ? { id: editingId, name: newName, slug } : { name: newName, slug }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                fetchCategories()
                resetForm()
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure? This will delete the category. Existing posts in this category may become uncategorized.")) return
        try {
            const res = await fetch(`/api/cms/blog-categories?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchCategories()
        } catch (error) {
            console.error(error)
        }
    }

    function resetForm() {
        setNewName("")
        setEditingId(null)
    }

    function startEdit(cat: any) {
        setEditingId(cat.id)
        setNewName(cat.name)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (fetching) return <div className="flex justify-center p-8 text-muted-foreground"><Loader2 className="animate-spin mr-2" /> Loading categories...</div>

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/blog"><ArrowLeft className="h-5 w-5" /></Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Categories</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Organize your editorial content</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Column */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-2 border-blue-50 overflow-hidden">
                        <div className="h-1 bg-yellow-500 w-full" />
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-blue-900 uppercase">
                                {editingId ? "Edit Category" : "New Category"}
                            </CardTitle>
                            {editingId && (
                                <Button variant="ghost" size="icon" onClick={resetForm}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category Name</label>
                                <Input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Eco-Friendly Packaging"
                                    className="font-bold h-12 text-lg"
                                />
                                {newName && (
                                    <p className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1 mt-1">
                                        <Link href="#" className="underline">/{newName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</Link>
                                    </p>
                                )}
                            </div>

                            <Button
                                className="w-full bg-blue-900 hover:bg-blue-800 font-bold uppercase py-6 transition-all"
                                onClick={handleSave}
                                disabled={loading || !newName}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                {editingId ? "Update Category" : "Create Category"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Current Taxonomies ({categories.length})</h3>
                    </div>

                    <div className="grid gap-3">
                        {categories.map(cat => (
                            <Card key={cat.id} className={editingId === cat.id ? "border-blue-500 bg-blue-50/50" : "hover:border-blue-100 transition-colors"}>
                                <CardContent className="flex items-center justify-between p-5">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-blue-900 text-lg uppercase truncate">{cat.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded">/{cat.slug}</span>
                                            <span className="text-[10px] font-black uppercase text-gray-400 border border-gray-100 px-2 py-0.5 rounded">{cat._count?.posts || 0} Articles</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" onClick={() => startEdit(cat)} className="hover:bg-blue-50 border-gray-100">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDelete(cat.id)} className="hover:bg-red-50 text-red-500 border-gray-100">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                            <p className="text-lg font-bold uppercase tracking-tighter">Empty Taxonomy</p>
                            <p className="text-xs">Create your first category to group your blog content.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
