"use client"

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
import { Plus, Pencil, Trash2, Loader2, Star, Sparkles, RefreshCcw } from "lucide-react"

type Testimonial = {
    id: string
    name: string
    role: string | null
    content: string
    rating: number
    isActive: boolean
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const router = useRouter()

    async function handleGenerate() {
        if (!confirm("This will generate AI reviews for up to 5 products/categories that don't have enough reviews yet. Continue?")) return
        setGenerating(true)
        try {
            const res = await fetch('/api/cms/testimonials/generate', {
                method: 'POST',
                body: JSON.stringify({ type: 'all' })
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || data.message || "Failed request")
            }

            if (data.created) {
                alert(`Successfully generated ${data.created} new testimonials!`)
                router.refresh()
                fetchTestimonials()
            } else {
                alert(data.message || "Finished processing. No new reviews needed.")
            }
        } catch (e: any) {
            console.error(e)
            alert(`Error: ${e.message}`)
        } finally {
            setGenerating(false)
        }
    }

    useEffect(() => {
        fetchTestimonials()
    }, [])

    async function fetchTestimonials() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/testimonials')
            const data = await res.json()
            setTestimonials(data.testimonials || [])
        } catch (error) {
            console.error("Error fetching testimonials:", error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteTestimonial(id: string) {
        if (!confirm("Are you sure you want to delete this testimonial?")) return

        try {
            const res = await fetch(`/api/cms/testimonials?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')
            setTestimonials(testimonials.filter(t => t.id !== id))
        } catch (error) {
            console.error("Error deleting testimonial:", error)
            alert("Error deleting testimonial")
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
                    <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
                    <p className="text-muted-foreground">Manage customer testimonials</p>
                </div>
                <div className="space-x-2">
                    <Button
                        onClick={handleGenerate}
                        variant="outline"
                        disabled={generating}
                        className="border-dashed border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                        {generating ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {generating ? "Generating..." : "Auto-Generate Reviews"}
                    </Button>
                    <Button onClick={() => router.push('/dashboard/testimonials/new')}>
                        <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Preview</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.name}</TableCell>
                                    <TableCell>{t.role || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="ml-1 text-sm text-gray-600">{t.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate text-muted-foreground">
                                        {t.content}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {t.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => router.push(`/dashboard/testimonials/${t.id}`)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTestimonial(t.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {testimonials.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No testimonials found. Click "Add Testimonial" to create one.
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
