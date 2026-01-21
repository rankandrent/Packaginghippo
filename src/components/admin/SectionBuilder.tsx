"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { RichTextEditor } from "./RichTextEditor"
import { ImageUploader } from "./ImageUploader"

export type Section = {
    id: string
    type: 'hero' | 'text' | 'benefits' | 'faq' | 'cta' | 'gallery' | 'product_grid' | 'seo_content'
    title?: string
    content: any
}

interface SectionBuilderProps {
    sections: Section[]
    onChange: (sections: Section[]) => void
}

export function SectionBuilder({ sections = [], onChange }: SectionBuilderProps) {

    const addSection = (type: Section['type']) => {
        const newSection: Section = {
            id: Math.random().toString(36).substring(7),
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} Section`,
            content: getDefaultContent(type)
        }
        onChange([...sections, newSection])
    }

    const removeSection = (index: number) => {
        const newSections = [...sections]
        newSections.splice(index, 1)
        onChange(newSections)
    }

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === sections.length - 1) return

        const newSections = [...sections]
        const temp = newSections[index]
        newSections[index] = newSections[index + (direction === 'up' ? -1 : 1)]
        newSections[index + (direction === 'up' ? -1 : 1)] = temp
        onChange(newSections)
    }

    const updateSection = (index: number, key: string, value: any) => {
        const newSections = [...sections]
        newSections[index] = {
            ...newSections[index],
            content: { ...newSections[index].content, [key]: value }
        }
        onChange(newSections)
    }

    const updateSectionTitle = (index: number, title: string) => {
        const newSections = [...sections]
        newSections[index] = { ...newSections[index], title }
        onChange(newSections)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border">
                <span className="text-sm font-semibold w-full text-muted-foreground mb-2">Add Section:</span>
                <Button size="sm" variant="outline" onClick={() => addSection('hero')}>+ Hero</Button>
                <Button size="sm" variant="outline" onClick={() => addSection('product_grid')}>+ Products</Button>
                <Button size="sm" variant="outline" onClick={() => addSection('seo_content')}>+ SEO Content</Button>
                <Button size="sm" variant="outline" onClick={() => addSection('text')}>+ Text Block</Button>
                <Button size="sm" variant="outline" onClick={() => addSection('benefits')}>+ Benefits</Button>
                <Button size="sm" variant="outline" onClick={() => addSection('faq')}>+ FAQ</Button>
                <Button size="sm" variant="outline" onClick={() => addSection('gallery')}>+ Gallery</Button>
                <Button size="sm" variant="outline" onClick={() => addSection('cta')}>+ CTA</Button>
            </div>

            <div className="space-y-4">
                {sections.map((section, index) => (
                    <Card key={section.id} className="relative group border-l-4 border-l-primary">
                        <CardHeader className="py-4 bg-muted/20 flex flex-row items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => moveSection(index, 'up')}>
                                    <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === sections.length - 1} onClick={() => moveSection(index, 'down')}>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </div>
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            <div className="flex-1">
                                <Input
                                    value={section.title}
                                    onChange={(e) => updateSectionTitle(index, e.target.value)}
                                    className="h-8 font-semibold max-w-sm bg-transparent border-transparent hover:border-input focus:border-input"
                                />
                                <span className="text-xs text-muted-foreground ml-2 uppercase">{section.type}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeSection(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            {renderEditor(section.type, section.content, (k, v) => updateSection(index, k, v))}
                        </CardContent>
                    </Card>
                ))}

                {sections.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        No sections added yet. Click a button above to add one.
                    </div>
                )}
            </div>
        </div>
    )
}

function getDefaultContent(type: string) {
    switch (type) {
        case 'hero': return { heading: 'Hero Heading', subheading: 'Subheading text', image: '', ctaText: 'Learn More', ctaLink: '#' }
        case 'text': return { content: '<p>Enter text content...</p>' }
        case 'product_grid': return { heading: 'Our Products' }
        case 'seo_content': return { heading: 'More Information', content: '<p>Enter long-form content here...</p>', collapsedHeight: 300 }
        case 'benefits': return { heading: 'Key Benefits', items: [{ title: 'Benefit 1', desc: 'Description' }] }
        case 'faq': return { heading: 'Frequently Asked Questions', items: [{ q: 'Question?', a: 'Answer' }] }
        case 'gallery': return { heading: 'Image Gallery', images: [] }
        case 'cta': return { heading: 'Join Us', text: 'Call to action text', btnText: 'Click Me', btnLink: '#' }
        default: return {}
    }
}

function renderEditor(type: string, content: any, onChange: (key: string, value: any) => void) {
    switch (type) {
        case 'hero':
            return (
                <div className="grid gap-4">
                    <div>
                        <Label>Heading</Label>
                        <Input value={content.heading || ''} onChange={e => onChange('heading', e.target.value)} />
                    </div>
                    <div>
                        <Label>Subheading</Label>
                        <Input value={content.subheading || ''} onChange={e => onChange('subheading', e.target.value)} />
                    </div>
                    <div>
                        <Label>Background Image</Label>
                        <ImageUploader value={content.image ? [content.image] : []} onChange={urls => onChange('image', urls[0])} maxFiles={1} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>CTA Text</Label><Input value={content.ctaText || ''} onChange={e => onChange('ctaText', e.target.value)} /></div>
                        <div><Label>CTA Link</Label><Input value={content.ctaLink || ''} onChange={e => onChange('ctaLink', e.target.value)} /></div>
                    </div>
                </div>
            )
        case 'text':
            return (
                <div>
                    <Label>Content (Rich Text)</Label>
                    <RichTextEditor content={content.content || ''} onChange={html => onChange('content', html)} />
                </div>
            )
        case 'product_grid':
            return (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                        This section automatically displays products belonging to this category.
                    </div>
                    <div>
                        <Label>Section Heading (Optional)</Label>
                        <Input value={content.heading || ''} onChange={e => onChange('heading', e.target.value)} placeholder="e.g. Explore Our Products" />
                    </div>
                </div>
            )
        case 'seo_content':
            return (
                <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800">
                        This section is for long-form SEO content. It will be collapsed by default with a "Read More" button.
                    </div>
                    <div>
                        <Label>Heading (Optional)</Label>
                        <Input value={content.heading || ''} onChange={e => onChange('heading', e.target.value)} placeholder="e.g. Detailed Information" />
                    </div>
                    <div>
                        <Label>Content</Label>
                        <RichTextEditor content={content.content || ''} onChange={html => onChange('content', html)} />
                    </div>
                    <div>
                        <Label>Collapsed Height (px) - Default: 300</Label>
                        <Input
                            type="number"
                            value={content.collapsedHeight || 300}
                            onChange={e => onChange('collapsedHeight', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            )
        case 'gallery':
            return (
                <div className="space-y-4">
                    <div><Label>Heading</Label><Input value={content.heading || ''} onChange={e => onChange('heading', e.target.value)} /></div>
                    <div>
                        <Label>Images</Label>
                        <ImageUploader value={content.images || []} onChange={urls => onChange('images', urls)} />
                    </div>
                </div>
            )
        case 'benefits':
            const benefits = Array.isArray(content.items) ? content.items : []
            return (
                <div className="space-y-4">
                    <div>
                        <Label>Section Heading</Label>
                        <Input value={content.heading || ''} onChange={e => onChange('heading', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>Benefits</Label>
                        {benefits.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                                <div className="flex-1 space-y-2">
                                    <Input
                                        value={item.title || ''}
                                        placeholder="Benefit Title"
                                        onChange={(e) => {
                                            const newItems = [...benefits]
                                            newItems[idx] = { ...newItems[idx], title: e.target.value }
                                            onChange('items', newItems)
                                        }}
                                    />
                                    <Textarea
                                        value={item.desc || ''}
                                        placeholder="Description"
                                        rows={2}
                                        onChange={(e) => {
                                            const newItems = [...benefits]
                                            newItems[idx] = { ...newItems[idx], desc: e.target.value }
                                            onChange('items', newItems)
                                        }}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => {
                                        const newItems = benefits.filter((_: any, i: number) => i !== idx)
                                        onChange('items', newItems)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onChange('items', [...benefits, { title: '', desc: '' }])}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Benefit
                        </Button>
                    </div>
                </div>
            )
        case 'faq':
            const faqs = Array.isArray(content.items) ? content.items : []
            return (
                <div className="space-y-4">
                    <div>
                        <Label>Section Heading</Label>
                        <Input value={content.heading || ''} onChange={e => onChange('heading', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>FAQs</Label>
                        {faqs.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                                <div className="flex-1 space-y-2">
                                    <Input
                                        value={item.q || ''}
                                        placeholder="Question"
                                        onChange={(e) => {
                                            const newItems = [...faqs]
                                            newItems[idx] = { ...newItems[idx], q: e.target.value }
                                            onChange('items', newItems)
                                        }}
                                    />
                                    <Textarea
                                        value={item.a || ''}
                                        placeholder="Answer"
                                        rows={3}
                                        onChange={(e) => {
                                            const newItems = [...faqs]
                                            newItems[idx] = { ...newItems[idx], a: e.target.value }
                                            onChange('items', newItems)
                                        }}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => {
                                        const newItems = faqs.filter((_: any, i: number) => i !== idx)
                                        onChange('items', newItems)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onChange('items', [...faqs, { q: '', a: '' }])}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add FAQ
                        </Button>
                    </div>
                </div>
            )
        case 'cta':
            return (
                <div className="grid gap-4">
                    <div>
                        <Label>Heading</Label>
                        <Input value={content.heading || ''} onChange={e => onChange('heading', e.target.value)} />
                    </div>
                    <div>
                        <Label>Text</Label>
                        <Textarea value={content.text || ''} onChange={e => onChange('text', e.target.value)} rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Button Text</Label><Input value={content.btnText || ''} onChange={e => onChange('btnText', e.target.value)} /></div>
                        <div><Label>Button Link</Label><Input value={content.btnLink || ''} onChange={e => onChange('btnLink', e.target.value)} /></div>
                    </div>
                </div>
            )
        default:
            return (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
                    Generic Editor for {type}. (Expand logic in SectionBuilder.tsx)
                    <pre className="mt-2 text-xs">{JSON.stringify(content, null, 2)}</pre>
                </div>
            )
    }
}
