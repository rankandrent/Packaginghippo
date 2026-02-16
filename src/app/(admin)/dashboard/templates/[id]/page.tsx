
"use client"

import { useEffect, useState, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionBuilder, Section } from "@/components/admin/SectionBuilder"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Template = {
    id: string
    name: string
    type: 'product' | 'category'
    sections: any[]
}

export default function TemplateEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const isNew = id === 'new'
    const router = useRouter()
    const searchParams = useSearchParams()

    const [template, setTemplate] = useState<Template>({
        id: '',
        name: '',
        type: (searchParams.get('type') as 'product' | 'category') || 'product',
        sections: []
    })

    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [sections, setSections] = useState<Section[]>([])

    useEffect(() => {
        if (!isNew) {
            fetchTemplate()
        }
    }, [id])

    async function fetchTemplate() {
        try {
            const res = await fetch(`/api/cms/templates/${id}`)
            const data = await res.json()
            if (res.ok && data.template) {
                setTemplate(data.template)
                setSections(data.template.sections || [])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function saveTemplate(e: React.FormEvent) {
        e.preventDefault()
        if (!template.name) return alert("Please enter a template name")

        setSaving(true)
        try {
            const url = isNew ? '/api/cms/templates' : `/api/cms/templates/${id}`
            const method = isNew ? 'POST' : 'PUT'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: template.name,
                    type: template.type,
                    sections: sections
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            alert("Template saved successfully!")
            router.push('/dashboard/templates')
        } catch (error) {
            console.error(error)
            alert("Error saving template")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <form onSubmit={saveTemplate} className="max-w-[1200px] mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/templates">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{isNew ? 'Create Template' : 'Edit Template'}</h2>
                        <p className="text-sm text-muted-foreground">{isNew ? 'Design a new content structure' : 'Modify existing template'}</p>
                    </div>
                </div>
                <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Template
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Template Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Luxury Product Layout"
                                    value={template.name}
                                    onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Template Type</Label>
                                {isNew ? (
                                    <Select
                                        value={template.type}
                                        onValueChange={(val: 'product' | 'category') => setTemplate({ ...template, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="product">Product Page</SelectItem>
                                            <SelectItem value="category">Category Page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="p-2 border rounded bg-muted text-muted-foreground capitalize">
                                        {template.type} Page
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Determines where this template can be used.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg">Template Sections</h3>
                            <p className="text-sm text-muted-foreground">
                                Define the default sections for this template.
                                Content entered here will be copied to new pages created with this template.
                            </p>
                        </div>
                        <SectionBuilder sections={sections} onChange={setSections} />
                    </div>
                </div>
            </div>
        </form>
    )
}
