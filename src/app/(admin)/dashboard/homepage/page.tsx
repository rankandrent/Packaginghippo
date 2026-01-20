"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Loader2, Save, Eye, EyeOff, RefreshCw } from "lucide-react"

type HomepageSection = {
    id: string
    sectionKey: string
    title: string | null
    content: any
    order: number
    isActive: boolean
}

export default function HomepageEditor() {
    const [sections, setSections] = useState<HomepageSection[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [showJson, setShowJson] = useState<string | null>(null)

    useEffect(() => {
        fetchSections()
    }, [])

    async function fetchSections() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/homepage')
            const data = await res.json()
            setSections(data.sections || [])
        } catch (error) {
            console.error("Error fetching sections:", error)
        } finally {
            setLoading(false)
        }
    }

    async function saveSection(section: HomepageSection) {
        try {
            setSaving(section.id)

            const res = await fetch('/api/cms/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: section.id,
                    content: section.content,
                    isActive: section.isActive,
                }),
            })

            if (!res.ok) throw new Error('Failed to save')
            alert("Section saved!")
        } catch (error) {
            console.error("Error saving section:", error)
            alert("Error saving section")
        } finally {
            setSaving(null)
        }
    }

    const updateSectionContent = (id: string, key: string, value: any) => {
        setSections(sections.map(s => {
            if (s.id !== id) return s
            return {
                ...s,
                content: { ...s.content, [key]: value }
            }
        }))
    }

    const updateSectionContentJson = (id: string, jsonString: string) => {
        try {
            const parsed = JSON.parse(jsonString)
            setSections(sections.map(s => s.id === id ? { ...s, content: parsed } : s))
        } catch (e) {
            // Invalid JSON, ignore
        }
    }

    const toggleActive = (id: string) => {
        setSections(sections.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s))
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Homepage Editor</h2>
                    <p className="text-muted-foreground">
                        Edit homepage sections. All changes are saved to MongoDB.
                    </p>
                </div>
                <Button variant="outline" onClick={fetchSections}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id} className="border rounded-lg mb-2 px-2">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${section.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className="capitalize font-semibold">
                                    {section.title || section.sectionKey.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">({section.sectionKey})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 p-4 pt-2">

                            {/* Visual Editor based on section type */}
                            <SectionEditor
                                section={section}
                                onUpdate={(key, value) => updateSectionContent(section.id, key, value)}
                            />

                            {/* Toggle JSON View */}
                            <div className="border-t pt-4 mt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowJson(showJson === section.id ? null : section.id)}
                                >
                                    {showJson === section.id ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {showJson === section.id ? 'Hide' : 'Show'} Raw JSON
                                </Button>

                                {showJson === section.id && (
                                    <Textarea
                                        className="font-mono text-xs mt-2 min-h-[150px]"
                                        value={JSON.stringify(section.content, null, 2)}
                                        onChange={(e) => updateSectionContentJson(section.id, e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={() => saveSection(section)}
                                    disabled={saving === section.id}
                                >
                                    {saving === section.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => toggleActive(section.id)}
                                >
                                    {section.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {sections.length === 0 && (
                <Card>
                    <CardContent className="text-center py-10 text-muted-foreground">
                        No sections found. Run the seed script to populate data.
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

// Component to render visual editor based on section type
function SectionEditor({ section, onUpdate }: { section: HomepageSection, onUpdate: (key: string, value: any) => void }) {
    const content = section.content || {}

    // Common fields most sections have
    const hasHeading = 'heading' in content
    const hasText = 'text' in content
    const hasItems = 'items' in content

    return (
        <div className="space-y-4">
            {hasHeading && (
                <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={(e) => onUpdate('heading', e.target.value)}
                        placeholder="Section heading"
                    />
                </div>
            )}

            {'subheading' in content && (
                <div className="space-y-2">
                    <Label>Subheading</Label>
                    <Textarea
                        value={content.subheading || ''}
                        onChange={(e) => onUpdate('subheading', e.target.value)}
                        placeholder="Section subheading"
                        rows={2}
                    />
                </div>
            )}

            {hasText && (
                <div className="space-y-2">
                    <Label>Text Content</Label>
                    <Textarea
                        value={content.text || ''}
                        onChange={(e) => onUpdate('text', e.target.value)}
                        placeholder="Main text content"
                        rows={4}
                    />
                </div>
            )}

            {'intro' in content && (
                <div className="space-y-2">
                    <Label>Introduction</Label>
                    <Textarea
                        value={content.intro || ''}
                        onChange={(e) => onUpdate('intro', e.target.value)}
                        rows={3}
                    />
                </div>
            )}

            {'ctaText' in content && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>CTA Button Text</Label>
                        <Input
                            value={content.ctaText || ''}
                            onChange={(e) => onUpdate('ctaText', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>CTA Button Link</Label>
                        <Input
                            value={content.ctaLink || ''}
                            onChange={(e) => onUpdate('ctaLink', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {'primaryCtaText' in content && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Primary CTA Text</Label>
                        <Input
                            value={content.primaryCtaText || ''}
                            onChange={(e) => onUpdate('primaryCtaText', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Primary CTA Link</Label>
                        <Input
                            value={content.primaryCtaLink || ''}
                            onChange={(e) => onUpdate('primaryCtaLink', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Items display - simplified for now, shows count */}
            {hasItems && Array.isArray(content.items) && (
                <div className="bg-muted p-4 rounded-lg">
                    <Label className="text-sm text-muted-foreground">
                        List Items: {content.items.length} items
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        Use the JSON editor below for detailed item editing
                    </p>
                </div>
            )}

            {'points' in content && Array.isArray(content.points) && (
                <div className="bg-muted p-4 rounded-lg">
                    <Label className="text-sm text-muted-foreground">
                        Points: {content.points.length} items
                    </Label>
                </div>
            )}
        </div>
    )
}
