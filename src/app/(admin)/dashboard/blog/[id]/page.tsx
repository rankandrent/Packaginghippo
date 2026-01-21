"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function BlogEditorPage() {
    const params = useParams()
    const router = useRouter()
    const isNew = params.id === 'new'

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!isNew)
    const [authors, setAuthors] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])

    const [post, setPost] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        mainImage: "",
        authorId: "",
        categoryId: "",
        seoTitle: "",
        seoDesc: "",
        seoKeywords: "",
        isPublished: false
    })

    useEffect(() => {
        fetchMetadata()
        if (!isNew) fetchPost()
    }, [])

    async function fetchMetadata() {
        const [authRes, catRes] = await Promise.all([
            fetch('/api/cms/authors'),
            fetch('/api/cms/blog-categories')
        ])
        setAuthors(await authRes.json())
        setCategories(await catRes.json())
    }

    async function fetchPost() {
        try {
            const res = await fetch(`/api/cms/blogs?slug=${params.id}`) // Actually using ID here if matches
            // If ID not found by slug, we'll need to fetch by ID. Let's adjust the API or use a separate fetch.
            // For now assuming we can fetch by ID in the same route
            const res2 = await fetch(`/api/cms/blogs?id=${params.id}`)
            const data = await res2.json()
            if (data) setPost(data)
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/cms/blogs', {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isNew ? post : { ...post, id: params.id }),
            })

            if (!res.ok) throw new Error('Failed to save')
            router.push('/dashboard/blog')
        } catch (error) {
            alert("Error saving post")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/blog"><ArrowLeft className="h-5 w-5" /></Link>
                    </Button>
                    <h2 className="text-3xl font-bold">{isNew ? "New Post" : "Edit Post"}</h2>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Blog Post
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={post.title}
                                    onChange={(e) => {
                                        const title = e.target.value
                                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                                        setPost({ ...post, title, slug: isNew ? slug : post.slug })
                                    }}
                                    placeholder="Enter blog title"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug</label>
                                <Input value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} placeholder="url-slug" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Excerpt (Short Summary)</label>
                                <Textarea value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} placeholder="Short summary for listing cards" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content (HTML/Rich Text)</label>
                                <Textarea value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })} placeholder="Write your blog content here..." className="min-h-[400px] font-mono text-sm" required />
                                <p className="text-xs text-muted-foreground">HTML is supported. Use standard tags like h2, h3, p, etc.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SEO Meta Title</label>
                                <Input value={post.seoTitle} onChange={(e) => setPost({ ...post, seoTitle: e.target.value })} placeholder="Target keyword included title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SEO Meta Description</label>
                                <Textarea value={post.seoDesc} onChange={(e) => setPost({ ...post, seoDesc: e.target.value })} placeholder="Compelling summary for Google search results" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SEO Keywords</label>
                                <Input value={post.seoKeywords} onChange={(e) => setPost({ ...post, seoKeywords: e.target.value })} placeholder="keyword1, keyword2, keyword3" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Publish Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={post.isPublished}
                                    onChange={(e) => setPost({ ...post, isPublished: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isPublished" className="text-sm font-medium">Published</label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Author</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={post.authorId}
                                    onChange={(e) => setPost({ ...post, authorId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Author</option>
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                                <p className="text-xs italic text-blue-600 cursor-pointer" onClick={() => router.push('/dashboard/blog/authors')}>+ Create new author</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={post.categoryId}
                                    onChange={(e) => setPost({ ...post, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Featured Image</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {post.mainImage && (
                                <img src={post.mainImage} alt="Preview" className="w-full h-40 object-cover rounded-md border" />
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URL</label>
                                <Input value={post.mainImage} onChange={(e) => setPost({ ...post, mainImage: e.target.value })} placeholder="https://..." />
                            </div>
                            <Button variant="outline" className="w-full" type="button">
                                <ImageIcon className="mr-2 h-4 w-4" /> Change Image
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
