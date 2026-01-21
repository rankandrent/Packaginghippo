"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function BlogAuthorsPage() {
    const [authors, setAuthors] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [newAuthor, setNewAuthor] = useState({ name: "", slug: "", role: "", bio: "", image: "" })

    useEffect(() => {
        fetchAuthors()
    }, [])

    async function fetchAuthors() {
        try {
            const res = await fetch('/api/cms/authors')
            setAuthors(await res.json())
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
        }
    }

    async function handleAdd() {
        if (!newAuthor.name) return
        setLoading(true)
        try {
            const slug = newAuthor.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            const res = await fetch('/api/cms/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newAuthor, slug }),
            })
            if (res.ok) {
                fetchAuthors()
                setNewAuthor({ name: "", slug: "", role: "", bio: "", image: "" })
            }
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="flex justify-center p-8 text-muted-foreground">Loading authors...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/blog"><ArrowLeft className="h-5 w-5" /></Link>
                </Button>
                <h2 className="text-3xl font-bold">Manage Authors (EEAT)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Add New Author</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input value={newAuthor.name} onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })} placeholder="Author Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role/Title</label>
                            <Input value={newAuthor.role} onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value })} placeholder="e.g. Packaging Expert" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <Textarea value={newAuthor.bio} onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })} placeholder="Author bio for EEAT signals" rows={3} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image URL</label>
                            <Input value={newAuthor.image} onChange={(e) => setNewAuthor({ ...newAuthor, image: e.target.value })} placeholder="https://..." />
                        </div>
                        <Button className="w-full" onClick={handleAdd} disabled={loading || !newAuthor.name}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add Author
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {authors.map(author => (
                        <Card key={author.id}>
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border shrink-0">
                                    {author.image && <img src={author.image} alt={author.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold">{author.name}</h4>
                                    <p className="text-xs text-muted-foreground">{author.role}</p>
                                    <p className="text-xs text-muted-foreground">{author._count?.posts || 0} posts</p>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {authors.length === 0 && <p className="text-center text-muted-foreground py-8">No authors found.</p>}
                </div>
            </div>
        </div>
    )
}
