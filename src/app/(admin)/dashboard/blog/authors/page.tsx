"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, ArrowLeft, Plus, Trash2, Pencil, X } from "lucide-react"
import Link from "next/link"
import { ImageUploader } from "@/components/admin/ImageUploader"

export default function BlogAuthorsPage() {
    const [authors, setAuthors] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newAuthor, setNewAuthor] = useState({ name: "", slug: "", role: "", bio: "", image: "" })

    useEffect(() => {
        fetchAuthors()
    }, [])

    async function fetchAuthors() {
        try {
            const res = await fetch('/api/cms/authors')
            const data = await res.json()
            setAuthors(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
        }
    }

    async function handleSave() {
        if (!newAuthor.name) return
        setLoading(true)
        try {
            const slug = newAuthor.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            const url = '/api/cms/authors'
            const method = editingId ? 'PUT' : 'POST'
            const body = editingId ? { ...newAuthor, id: editingId } : { ...newAuthor, slug }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                fetchAuthors()
                resetForm()
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure? This will remove the author metadata. Existing posts will remain but without author info.")) return
        try {
            const res = await fetch(`/api/cms/authors?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchAuthors()
        } catch (error) {
            console.error(error)
        }
    }

    function resetForm() {
        setNewAuthor({ name: "", slug: "", role: "", bio: "", image: "" })
        setEditingId(null)
    }

    function startEdit(author: any) {
        setEditingId(author.id)
        setNewAuthor({
            name: author.name,
            slug: author.slug,
            role: author.role || "",
            bio: author.bio || "",
            image: author.image || ""
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (fetching) return <div className="flex justify-center p-8 text-muted-foreground"><Loader2 className="animate-spin mr-2" /> Loading authors...</div>

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/blog"><ArrowLeft className="h-5 w-5" /></Link>
                </Button>
                <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Manage Authors (EEAT)</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-2 border-blue-50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-blue-900 uppercase">
                                {editingId ? "Edit Author" : "Add New Author"}
                            </CardTitle>
                            {editingId && (
                                <Button variant="ghost" size="icon" onClick={resetForm}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Profile Image</label>
                                <ImageUploader
                                    value={newAuthor.image ? [newAuthor.image] : []}
                                    onChange={(urls) => setNewAuthor({ ...newAuthor, image: urls[0] || "" })}
                                    bucket="authors"
                                    maxFiles={1}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                <Input value={newAuthor.name} onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })} placeholder="e.g. John Doe" className="font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Role</label>
                                <Input value={newAuthor.role} onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value })} placeholder="e.g. Packaging Design Lead" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Biography (EEAT)</label>
                                <Textarea value={newAuthor.bio} onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })} placeholder="Brief background of the author..." rows={4} />
                                <p className="text-[10px] text-muted-foreground italic leading-tight">Biographies help search engines verify author expertise.</p>
                            </div>
                            <Button className="w-full bg-blue-900 hover:bg-blue-800 font-bold uppercase transition-all" onClick={handleSave} disabled={loading || !newAuthor.name}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                {editingId ? "Update Profile" : "Create Author"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Registered Authors ({authors.length})</h3>
                    {authors.map(author => (
                        <Card key={author.id} className={editingId === author.id ? "border-blue-500 bg-blue-50/30" : "hover:border-blue-100 transition-colors"}>
                            <CardContent className="flex items-center gap-6 p-6">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm shrink-0">
                                    {author.image ? (
                                        <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-bold text-2xl">
                                            {author.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-blue-900 text-lg uppercase truncate">{author.name}</h4>
                                    <p className="text-sm text-blue-700 font-bold mb-2">{author.role || 'Contributor'}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2 italic mb-3">"{author.bio || 'No bio provided'}"</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{author._count?.posts || 0} Articles</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => startEdit(author)} className="hover:bg-blue-50">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => handleDelete(author.id)} className="hover:bg-red-50 text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {authors.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
                            <p className="text-lg font-bold uppercase tracking-tight">No Authors Found</p>
                            <p className="text-sm">Add your first author to start publishing.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
