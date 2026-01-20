"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Plus, Trash2, Image as ImageIcon } from "lucide-react"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { HomepageSection } from "@/types/cms"

export default function HomepageEditor() {
    const [sections, setSections] = useState<HomepageSection[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)

    useEffect(() => {
        fetchSections()
    }, [])

    async function fetchSections() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("cms_homepage")
                .select("*")
                .order("section_key")

            if (error) throw error
            setSections(data || [])
        } catch (error) {
            console.error("Error fetching sections:", error)
        } finally {
            setLoading(false)
        }
    }

    async function saveSection(section: HomepageSection) {
        try {
            setSaving(section.id)

            const { error } = await supabase
                .from("cms_homepage")
                .update({
                    content: section.content,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", section.id)

            if (error) throw error
            // small delay to show success
            await new Promise(r => setTimeout(r, 500))
        } catch (error) {
            console.error("Error saving section:", error)
            alert("Error saving section")
        } finally {
            setSaving(null)
        }
    }

    const updateSectionContent = (id: string, newContent: any) => {
        setSections(sections.map(s => s.id === id ? { ...s, content: newContent } : s))
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Homepage Editor</h2>
                <p className="text-muted-foreground">
                    Customize the content of your homepage sections securely and easily.
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4 bg-card">
                        <AccordionTrigger className="capitalize text-lg font-medium hover:no-underline">
                            {section.section_key.replace(/_/g, " ")}
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-6 space-y-6">

                            <SectionEditor
                                sectionKey={section.section_key}
                                content={section.content}
                                onChange={(c) => updateSectionContent(section.id, c)}
                            />

                            <div className="flex justify-end pt-4 border-t">
                                <Button
                                    onClick={() => saveSection(section)}
                                    disabled={saving === section.id}
                                    className="w-full sm:w-auto"
                                >
                                    {saving === section.id && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

function SectionEditor({ sectionKey, content, onChange }: { sectionKey: string, content: any, onChange: (c: any) => void }) {
    if (sectionKey === 'hero') return <HeroEditor content={content} onChange={onChange} />
    if (sectionKey === 'intro') return <IntroEditor content={content} onChange={onChange} />
    if (sectionKey === 'benefits') return <BenefitsEditor content={content} onChange={onChange} />
    if (sectionKey === 'faq') return <FaqEditor content={content} onChange={onChange} />
    // Fallback for generic or unknown sections
    return <GenericJsonEditor content={content} onChange={onChange} />
}

// --- Specific Section Editors ---

function HeroEditor({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input value={content.heading || ''} onChange={e => onChange({ ...content, heading: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Subheading</Label>
                    <Textarea value={content.subheading || ''} onChange={e => onChange({ ...content, subheading: e.target.value })} />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input value={content.cta_text || ''} onChange={e => onChange({ ...content, cta_text: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>CTA Link</Label>
                    <Input value={content.cta_link || ''} onChange={e => onChange({ ...content, cta_link: e.target.value })} />
                </div>
            </div>
        </div>
    )
}

function IntroEditor({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={content.heading || ''} onChange={e => onChange({ ...content, heading: e.target.value })} />
            </div>
            <div className="space-y-2">
                <Label>Main Text</Label>
                <Textarea className="min-h-[100px]" value={content.text || ''} onChange={e => onChange({ ...content, text: e.target.value })} />
            </div>
        </div>
    )
}

function BenefitsEditor({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const addItem = () => {
        const newItems = [...(content.items || []), { title: 'New Benefit', desc: 'Description here' }]
        onChange({ ...content, items: newItems })
    }

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...(content.items || [])]
        newItems[index] = { ...newItems[index], [field]: value }
        onChange({ ...content, items: newItems })
    }

    const removeItem = (index: number) => {
        const newItems = content.items.filter((_: any, i: number) => i !== index)
        onChange({ ...content, items: newItems })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Heading</Label>
                <Input value={content.heading || ''} onChange={e => onChange({ ...content, heading: e.target.value })} />
            </div>
            <div className="space-y-2">
                <Label>Section Intro</Label>
                <Textarea value={content.intro || ''} onChange={e => onChange({ ...content, intro: e.target.value })} />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Benefit Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
                </div>
                <div className="grid gap-4">
                    {content.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 items-start p-4 border rounded-md bg-muted/40 relative group">
                            <div className="flex-1 space-y-2">
                                <Input placeholder="Title" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} className="font-bold" />
                                <Textarea placeholder="Description" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} rows={2} />
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function FaqEditor({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const addItem = () => {
        const newItems = [...(content.items || []), { q: 'New Question?', a: 'Answer here.' }]
        onChange({ ...content, items: newItems })
    }

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...(content.items || [])]
        newItems[index] = { ...newItems[index], [field]: value }
        onChange({ ...content, items: newItems })
    }

    const removeItem = (index: number) => {
        const newItems = content.items.filter((_: any, i: number) => i !== index)
        onChange({ ...content, items: newItems })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Heading</Label>
                <Input value={content.heading || ''} onChange={e => onChange({ ...content, heading: e.target.value })} />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Questions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add Question</Button>
                </div>
                <div className="space-y-4">
                    {content.items?.map((item: any, i: number) => (
                        <div key={i} className="space-y-2 p-4 border rounded-md bg-muted/20">
                            <div className="flex justify-between">
                                <Label className="text-xs uppercase text-muted-foreground">Question {i + 1}</Label>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            <Input placeholder="Question" value={item.q} onChange={e => updateItem(i, 'q', e.target.value)} className="font-medium" />
                            <Textarea placeholder="Answer" value={item.a} onChange={e => updateItem(i, 'a', e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function GenericJsonEditor({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    return (
        <div className="space-y-2">
            <Label>Raw JSON Content</Label>
            <p className="text-xs text-muted-foreground">This section doesn't have a specific editor yet.</p>
            <Textarea
                className="font-mono text-sm min-h-[200px]"
                value={JSON.stringify(content, null, 2)}
                onChange={(e) => {
                    try {
                        onChange(JSON.parse(e.target.value))
                    } catch (e) {
                        // allow typing, invalid json will just not save properly if not handled at save level
                        // but here we just want to update valid json to state. 
                        // For better UX we might use a separate state for text.
                    }
                }}
            />
        </div>
    )
}

