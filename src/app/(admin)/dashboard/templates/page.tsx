
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, LayoutTemplate, Pencil, Trash2, Loader2, FileBox, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Template = {
    id: string
    name: string
    type: 'product' | 'category'
    updatedAt: string
    sections: any[]
}

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchTemplates()
    }, [])

    async function fetchTemplates() {
        try {
            const res = await fetch("/api/cms/templates")
            const data = await res.json()
            setTemplates(data.templates || [])
        } catch (error) {
            console.error("Failed to fetch templates", error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteTemplate(id: string) {
        if (!confirm("Are you sure you want to delete this template?")) return

        setDeleting(id)
        try {
            const res = await fetch(`/api/cms/templates/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")
            setTemplates(prev => prev.filter(t => t.id !== id))
        } catch (error) {
            alert("Error deleting template")
        } finally {
            setDeleting(null)
        }
    }

    const productTemplates = templates.filter(t => t.type === 'product')
    const categoryTemplates = templates.filter(t => t.type === 'category')

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Page Templates</h2>
                    <p className="text-muted-foreground">Create and manage content layouts for products and categories.</p>
                </div>
                <Link href="/dashboard/templates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Template
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="product" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="product">Product Templates</TabsTrigger>
                    <TabsTrigger value="category">Category Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="product" className="space-y-4">
                    {productTemplates.length === 0 ? (
                        <EmptyState type="product" />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {productTemplates.map(template => (
                                <TemplateCard key={template.id} template={template} onDelete={deleteTemplate} deleting={deleting} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="category" className="space-y-4">
                    {categoryTemplates.length === 0 ? (
                        <EmptyState type="category" />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {categoryTemplates.map(template => (
                                <TemplateCard key={template.id} template={template} onDelete={deleteTemplate} deleting={deleting} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

function TemplateCard({ template, onDelete, deleting }: { template: Template, onDelete: (id: string) => void, deleting: string | null }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {template.name}
                </CardTitle>
                {template.type === 'product' ? <FileBox className="h-4 w-4 text-muted-foreground" /> : <Layers className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-2">
                    {template.sections?.length || 0} <span className="text-sm font-normal text-muted-foreground">Sections</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                    Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                    <Link href={`/dashboard/templates/${template.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </Link>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(template.id)} disabled={deleting === template.id}>
                        {deleting === template.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function EmptyState({ type }: { type: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20 text-center">
            <LayoutTemplate className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No {type} templates</h3>
            <p className="text-muted-foreground text-sm mb-4">Create a new template to get started.</p>
            <Link href={`/dashboard/templates/new?type=${type}`}>
                <Button variant="outline">Create {type === 'product' ? 'Product' : 'Category'} Template</Button>
            </Link>
        </div>
    )
}
