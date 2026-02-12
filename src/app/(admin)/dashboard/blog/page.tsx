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
import { Plus, Pencil, Trash2, Loader2, ExternalLink, User, FolderOpen, Star } from "lucide-react"
import Link from "next/link"

type BlogPost = {
    id: string
    title: string
    slug: string
    isPublished: boolean
    publishedAt: string | null
    updatedAt: string
    author?: { name: string }
    category?: { name: string }
    createdAt: string
    isFeatured: boolean
}

export default function BlogListPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/blogs')
            const data = await res.json()
            setPosts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching blogs:", error)
        } finally {
            setLoading(false)
        }
    }

    async function deletePost(id: string) {
        if (!confirm("Are you sure you want to delete this blog post?")) return

        try {
            const res = await fetch(`/api/cms/blogs?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')
            setPosts(posts.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting blog:", error)
            alert("Error deleting blog")
        }
    }

    async function toggleFeatured(post: BlogPost) {
        try {
            const newStatus = !post.isFeatured
            // Optimistic update
            setPosts(posts.map(p => p.id === post.id ? { ...p, isFeatured: newStatus } : p))

            const res = await fetch('/api/cms/blogs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: post.id, isFeatured: newStatus }),
            })

            if (!res.ok) {
                // Revert if failed
                setPosts(posts.map(p => p.id === post.id ? { ...p, isFeatured: post.isFeatured } : p))
                throw new Error('Failed to update')
            }
        } catch (error) {
            console.error("Error updating featured status:", error)
            // alert("Error updating featured status") // Optional: maybe too intrusive
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
                    <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
                    <p className="text-muted-foreground">Manage your articles and SEO content</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/blog/authors">
                            <User className="mr-2 h-4 w-4" /> Authors
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/blog/categories">
                            <FolderOpen className="mr-2 h-4 w-4" /> Categories
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/blog/new">
                            <Plus className="mr-2 h-4 w-4" /> New Post
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                                    <TableCell>{post.author?.name || 'N/A'}</TableCell>
                                    <TableCell>{post.category?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleFeatured(post)}
                                            className={post.isFeatured ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-yellow-500"}
                                        >
                                            <Star className={`h-4 w-4 ${post.isFeatured ? "fill-current" : ""}`} />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {post.publishedAt
                                            ? new Date(post.publishedAt).toLocaleDateString()
                                            : post.createdAt
                                                ? new Date(post.createdAt).toLocaleDateString()
                                                : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link href={`/dashboard/blog/${post.id}`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deletePost(post.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {posts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No blogs found. Create your first post!
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
