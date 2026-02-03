"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch" // Assuming you have a Switch component, or use a checkbox
import { Loader2, ArrowLeft, Save } from "lucide-react"

export default function TestimonialEditor() {
    const params = useParams()
    const router = useRouter()
    const id = params.id === 'new' ? null : params.id
    // Handle params.id possibly being an array
    const testimonialId = Array.isArray(params.id) ? params.id[0] : params.id;
    const isNew = testimonialId === 'new';

    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        rating: 5.0,
        isActive: true,
        image: ""
    })

    useEffect(() => {
        if (!isNew && testimonialId) {
            fetchTestimonial(testimonialId)
        }
    }, [testimonialId, isNew])

    async function fetchTestimonial(id: string) {
        try {
            const res = await fetch(`/api/cms/testimonials?id=${id}`)
            const data = await res.json()
            if (data.testimonial) {
                setFormData({
                    name: data.testimonial.name,
                    role: data.testimonial.role || "",
                    content: data.testimonial.content,
                    rating: data.testimonial.rating,
                    isActive: data.testimonial.isActive,
                    image: data.testimonial.image || ""
                })
            }
        } catch (error) {
            console.error("Error fetching testimonial:", error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            const url = '/api/cms/testimonials'
            const method = isNew ? 'POST' : 'PUT'
            const body = {
                ...formData,
                id: isNew ? undefined : testimonialId
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error('Failed to save')

            router.push('/dashboard/testimonials')
            router.refresh()
        } catch (error) {
            console.error("Error saving testimonial:", error)
            alert("Error saving testimonial")
        } finally {
            setSaving(false)
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
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isNew ? "Create Testimonial" : "Edit Testimonial"}
                    </h2>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Testimonial Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Customer Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role / Company (Optional)</Label>
                            <Input
                                id="role"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                placeholder="e.g. CEO, TechCorp"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating (1-5)</Label>
                            <Input
                                id="rating"
                                type="number"
                                min="1"
                                max="5"
                                step="0.1"
                                value={formData.rating}
                                onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Review Content</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="isActive">Active (Visible on site)</Label>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
