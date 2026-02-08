"use client"

export const dynamic = 'force-dynamic';

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
import { Loader2, Save, Eye, EyeOff, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown, Video, Image as ImageIcon } from "lucide-react"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { RichTextEditor } from "@/components/admin/RichTextEditor"

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

    // SEO Settings State
    const [seoSettings, setSeoSettings] = useState({
        title: '',
        description: '',
        keywords: ''
    })
    const [savingSeo, setSavingSeo] = useState(false)

    useEffect(() => {
        fetchSections()
        fetchSeoSettings()
    }, [])

    async function fetchSeoSettings() {
        try {
            const res = await fetch('/api/cms/settings?key=seo')
            const data = await res.json()
            if (data.setting?.value) {
                setSeoSettings({
                    title: data.setting.value.defaultTitle || '',
                    description: data.setting.value.defaultDescription || '',
                    keywords: data.setting.value.defaultKeywords || ''
                })
            }
        } catch (error) {
            console.error("Error fetching SEO settings:", error)
        }
    }

    async function saveSeoSettings() {
        try {
            setSavingSeo(true)
            const res = await fetch('/api/cms/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'seo',
                    value: {
                        defaultTitle: seoSettings.title,
                        defaultDescription: seoSettings.description,
                        defaultKeywords: seoSettings.keywords
                    }
                }),
            })

            if (!res.ok) throw new Error('Failed to save SEO')
            alert("SEO Settings Saved!")
        } catch (error) {
            console.error("Error saving SEO:", error)
            alert("Failed to save SEO settings")
        } finally {
            setSavingSeo(false)
        }
    }

    // Helper to sort active first, then by order
    const sortSections = (list: HomepageSection[]) => {
        return [...list].sort((a, b) => {
            // Active first
            if (a.isActive && !b.isActive) return -1
            if (!a.isActive && b.isActive) return 1
            // Then by order
            return a.order - b.order
        })
    }

    async function fetchSections() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/homepage')
            const data = await res.json()
            setSections(sortSections(data.sections || []))
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
                    order: section.order,
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

    const toggleActive = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setSections(sections.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s))

        try {
            setSaving(id)
            const res = await fetch('/api/cms/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    isActive: !currentStatus,
                }),
            })

            if (!res.ok) throw new Error('Failed to update status')
        } catch (error) {
            console.error("Error updating status:", error)
            // Revert on error
            setSections(sections.map(s => s.id === id ? { ...s, isActive: currentStatus } : s))
            alert("Failed to update status")
        } finally {
            setSaving(null)
        }
    }

    const moveSection = async (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= newSections.length) return

        // Swap order values
        const current = { ...newSections[index] }
        const target = { ...newSections[targetIndex] }

        const tempOrder = current.order
        current.order = target.order
        target.order = tempOrder

        newSections[index] = target
        newSections[targetIndex] = current

        // Sort by order to be safe
        newSections.sort((a, b) => a.order - b.order)
        setSections(newSections)

        // Save both to DB
        try {
            const savePromises = [
                fetch('/api/cms/homepage', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: current.id,
                        content: current.content,
                        order: current.order,
                        isActive: current.isActive,
                    }),
                }),
                fetch('/api/cms/homepage', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: target.id,
                        content: target.content,
                        order: target.order,
                        isActive: target.isActive,
                    }),
                })
            ]
            await Promise.all(savePromises)
        } catch (error) {
            console.error("Error moving section:", error)
        }
    }


    async function createSection(key: string) {
        try {
            setLoading(true)

            // Default content based on section type
            let title = 'New Section'
            let content: any = {}

            switch (key) {
                case 'seo_content':
                    title = 'New SEO Content'
                    content = {
                        heading: 'Detailed Information',
                        content: '<p>Content goes here...</p>',
                        collapsedHeight: 300
                    }
                    break
                case 'customer_reviews':
                    title = 'Customer Reviews'
                    content = {
                        heading: 'What Our Customers Say',
                        subheading: 'Trusted by thousands of businesses worldwide',
                        items: [
                            { name: 'John Doe', role: 'Business Owner', rating: 5, text: 'Excellent quality packaging!' }
                        ]
                    }
                    break
                case 'features_bar':
                    title = 'Features Bar'
                    content = {
                        heading: 'ONE PLACE - Where you get all your custom packaging needs',
                        items: [
                            { icon: 'dollar', title: 'NO DIE &', subtitle: 'PLATE CHARGES' },
                            { icon: 'clock', title: 'QUICK', subtitle: 'TURNAROUND TIME' },
                            { icon: 'truck', title: 'FREE', subtitle: 'SHIPPING' },
                            { icon: 'package', title: 'STARTING FROM', subtitle: '50 BOXES' },
                            { icon: 'palette', title: 'CUSTOMIZE SIZE', subtitle: '& STYLE' },
                            { icon: 'pen', title: 'FREE GRAPHIC', subtitle: 'DESIGNING' },
                        ]
                    }
                    break
                case 'logo_loop':
                    title = 'Client Logo Carousel'
                    content = {
                        heading: 'TRUSTED BY LEADING BRANDS',
                        items: [
                            'Company 1', 'Company 2', 'Company 3', 'Company 4'
                        ]
                    }
                    break
                case 'custom_quote_form':
                    title = 'Custom Quote Form'
                    content = {
                        image: ''
                    }
                    break
                case 'video_section':
                    title = 'Video Section'
                    content = {
                        heading: 'See How We Work',
                        subheading: 'Watch our process and see the quality we deliver.',
                        videoUrl: 'https://www.youtube.com/watch?v=C7s5rc3fEMk'
                    }
                    break
                case 'gallery_section':
                    title = 'Our Gallery'
                    content = {
                        heading: 'OUR GALLERY',
                        subheading: 'Explore our latest work and custom packaging solutions.',
                        items: [] // Array of { url, alt, title }
                    }
                    break
                default:
                    title = `New ${key.replace(/_/g, ' ')}`
                    content = { heading: 'New Section' }
            }

            const res = await fetch('/api/cms/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sectionKey: key, title, content }),
            })
            if (!res.ok) throw new Error("Failed to create")
            await fetchSections()
        } catch (e) {
            console.error(e)
            alert("Failed to create section")
        } finally {
            setLoading(false)
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
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Homepage Editor</h2>
                    <p className="text-muted-foreground">
                        Edit homepage sections and global SEO settings. All changes are saved to MongoDB.
                    </p>
                </div>
            </div>

            {/* Global SEO Settings */}
            <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Config</span>
                        Homepage Meta Data
                    </CardTitle>
                    <CardDescription>
                        Set the default Title, Description, and Keywords for the homepage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Meta Title</Label>
                        <Input
                            value={seoSettings.title}
                            onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                            placeholder="e.g. Packaging Hippo | Custom Boxes"
                            className="bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <Textarea
                            value={seoSettings.description}
                            onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                            placeholder="e.g. Premium custom packaging solutions..."
                            rows={2}
                            className="bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Keywords (comma separated)</Label>
                        <Input
                            value={seoSettings.keywords}
                            onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                            placeholder="e.g. custom boxes, packaging, wholesale"
                            className="bg-white"
                        />
                    </div>
                    <div className="pt-2">
                        <Button
                            onClick={saveSeoSettings}
                            disabled={savingSeo}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {savingSeo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save SEO Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={fetchSections}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </Button>
                <Button onClick={() => createSection('seo_content')}>
                    <Plus className="w-4 h-4 mr-2" /> Add SEO Content
                </Button>
                <Button onClick={() => createSection('customer_reviews')}>
                    <Plus className="w-4 h-4 mr-2" /> Add Customer Reviews
                </Button>
                <Button onClick={() => createSection('features_bar')}>
                    <Plus className="w-4 h-4 mr-2" /> Add Features Bar
                </Button>
                <Button onClick={() => createSection('logo_loop')} className="bg-blue-900 hover:bg-blue-800">
                    <Plus className="w-4 h-4 mr-2" /> Add Logo Carousel
                </Button>
                <Button onClick={() => createSection('custom_quote_form')}>
                    <Plus className="w-4 h-4 mr-2" /> Add Quote Form
                </Button>
                <Button onClick={() => createSection('video_section')} className="bg-red-600 hover:bg-red-700">
                    <Video className="w-4 h-4 mr-2" /> Add Video Section
                </Button>
                <Button onClick={() => createSection('gallery_section')} className="bg-purple-600 hover:bg-purple-700">
                    <ImageIcon className="w-4 h-4 mr-2" /> Add Gallery
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {sections.map((section, index) => (
                    <AccordionItem key={section.id} value={section.id} className="border rounded-lg mb-2 px-2">
                        <div className="flex items-center">
                            <div className="flex flex-col gap-0 px-2 border-r mr-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'up') }}
                                    className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-900 disabled:opacity-20"
                                    disabled={index === 0}
                                >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'down') }}
                                    className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-900 disabled:opacity-20"
                                    disabled={index === sections.length - 1}
                                >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <AccordionTrigger className="hover:no-underline flex-1 py-4">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${section.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className="capitalize font-semibold text-blue-900">
                                        {section.title || section.sectionKey.replace(/_/g, " ")}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2 leading-none border px-1.5 py-0.5 rounded bg-gray-50">
                                        {section.sectionKey}
                                    </span>
                                </div>
                            </AccordionTrigger>
                        </div>
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
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t px-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs font-black text-gray-400 uppercase">Order:</Label>
                                    <Input
                                        type="number"
                                        className="w-16 h-8 text-xs font-bold"
                                        value={section.order}
                                        onChange={(e) => {
                                            const newOrder = parseInt(e.target.value) || 0
                                            setSections(sections.map(s => s.id === section.id ? { ...s, order: newOrder } : s))
                                        }}
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => saveSection(section)}
                                    disabled={saving === section.id}
                                    className="bg-blue-900 hover:bg-blue-800 h-8"
                                >
                                    {saving === section.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleActive(section.id, section.isActive)}
                                    className="h-8"
                                    disabled={saving === section.id}
                                >
                                    {section.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {
                sections.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-10 text-muted-foreground">
                            No sections found. Run the seed script to populate data.
                        </CardContent>
                    </Card>
                )
            }
        </div >
    )
}

// Component to render visual editor based on section type
function SectionEditor({ section, onUpdate }: { section: HomepageSection, onUpdate: (key: string, value: any) => void }) {
    const content = section.content || {}
    const isLogoLoop = section.sectionKey === 'logo_loop'

    // Custom editor for Logo Loop
    if (isLogoLoop) {
        const items = Array.isArray(content.items) ? content.items : []

        const addLogo = (url: string) => {
            onUpdate('items', [...items, url])
        }

        const removeLogo = (index: number) => {
            const newItems = [...items]
            newItems.splice(index, 1)
            onUpdate('items', newItems)
        }

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Section Heading (Optional)</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={(e) => onUpdate('heading', e.target.value)}
                        placeholder="e.g. TRUSTED BY 100+ BRANDS"
                    />
                </div>

                <div className="space-y-4 border p-4 rounded-md">
                    <Label>Client Logos</Label>

                    {/* List of existing logos */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {items.map((item: string, idx: number) => (
                            <div key={idx} className="relative group border rounded-md p-2 flex items-center justify-center bg-gray-50 h-24">
                                {item.startsWith('http') ? (
                                    <img src={item} alt={`Logo ${idx}`} className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <span className="text-xs font-bold text-gray-500">{item}</span>
                                )}
                                <button
                                    onClick={() => removeLogo(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Uploader for new logo */}
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Add New Logo</Label>
                        <ImageUploader
                            value={[]}
                            bucket="products" // Reusing products bucket for now
                            onChange={(urls) => {
                                if (urls.length > 0) addLogo(urls[0])
                            }}
                            maxFiles={1}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Custom Quote Form Editor
    if (section.sectionKey === 'custom_quote_form') {
        return (
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                    Customize the quote form section. Currently, you can only update the sidebar image.
                </div>
                <div className="space-y-2">
                    <Label>Side Image</Label>
                    <div className="border rounded-md p-4 bg-muted/20">
                        {content.image ? (
                            <div className="relative aspect-video w-full max-h-60 mb-4 overflow-hidden rounded-md border bg-white">
                                <img src={content.image} alt="Side Image" className="w-full h-full object-contain" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={() => onUpdate('image', '')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No image uploaded
                            </div>
                        )}
                        <ImageUploader
                            value={[]}
                            bucket="homepage"
                            onChange={(urls) => {
                                if (urls.length > 0) onUpdate('image', urls[0])
                            }}
                            maxFiles={1}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Video Section Editor
    if (section.sectionKey === 'video_section') {
        return (
            <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded text-sm text-red-800">
                    Embed a YouTube video. Just paste the full URL.
                </div>
                <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={e => onUpdate('heading', e.target.value)}
                        placeholder="e.g. See How We Work"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subheading</Label>
                    <Input
                        value={content.subheading || ''}
                        onChange={e => onUpdate('subheading', e.target.value)}
                        placeholder="e.g. Watch our process..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>YouTube URL</Label>
                    <Input
                        value={content.videoUrl || ''}
                        onChange={e => onUpdate('videoUrl', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>
            </div>
        )
    }

    // Gallery Section Editor
    if (section.sectionKey === 'gallery_section') {
        const items = Array.isArray(content.items) ? content.items : []

        const addImages = (urls: string[]) => {
            const newItems = urls.map(url => ({
                url,
                alt: '',
                title: ''
            }))
            onUpdate('items', [...items, ...newItems])
        }

        const updateItem = (index: number, field: string, value: string) => {
            const newItems = [...items]
            newItems[index] = { ...newItems[index], [field]: value }
            onUpdate('items', newItems)
        }

        const removeItem = (index: number) => {
            const newItems = items.filter((_: any, i: number) => i !== index)
            onUpdate('items', newItems)
        }

        return (
            <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded text-sm text-purple-800">
                    Manage your gallery images. Don't forget to add Alt Text for SEO!
                </div>
                <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={e => onUpdate('heading', e.target.value)}
                        placeholder="e.g. OUR GALLERY"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subheading</Label>
                    <Input
                        value={content.subheading || ''}
                        onChange={e => onUpdate('subheading', e.target.value)}
                        placeholder="e.g. Explore our work..."
                    />
                </div>

                <div className="space-y-4 border p-4 rounded-md">
                    <Label>Gallery Images</Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {items.map((item: any, idx: number) => (
                            <div key={idx} className="border rounded-md p-3 flex gap-3 bg-gray-50 relative group">
                                <div className="w-24 h-24 flex-shrink-0 bg-white border rounded overflow-hidden">
                                    <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Alt Text (SEO)</Label>
                                        <Input
                                            value={item.alt || ''}
                                            onChange={e => updateItem(idx, 'alt', e.target.value)}
                                            placeholder="Describe image..."
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Title (Hover)</Label>
                                        <Input
                                            value={item.title || ''}
                                            onChange={e => updateItem(idx, 'title', e.target.value)}
                                            placeholder="Image Title..."
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Add New Images</Label>
                        <ImageUploader
                            value={[]}
                            bucket="gallery"
                            onChange={(urls) => {
                                if (urls.length > 0) addImages(urls)
                            }}
                            maxFiles={5}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Hero Section Editor
    if (section.sectionKey === 'hero') {
        return (
            <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800">
                    The Hero section is the first thing visitors see. Make it impactful!
                </div>
                <div className="space-y-2">
                    <Label>Heading</Label>
                    <Textarea
                        value={content.heading || ''}
                        onChange={e => onUpdate('heading', e.target.value)}
                        placeholder="e.g. Custom Boxes & Packaging"
                        rows={2}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subheading</Label>
                    <Textarea
                        value={content.subheading || ''}
                        onChange={e => onUpdate('subheading', e.target.value)}
                        placeholder="e.g. Elevate your brand with premium custom boxes."
                        rows={2}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>CTA Text</Label>
                        <Input
                            value={content.cta_text || ''}
                            onChange={e => onUpdate('cta_text', e.target.value)}
                            placeholder="e.g. Get Custom Quote"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>CTA Link</Label>
                        <Input
                            value={content.cta_link || ''}
                            onChange={e => onUpdate('cta_link', e.target.value)}
                            placeholder="e.g. /quote"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Hero Image URL (Right Side)</Label>
                    <Input
                        value={content.hero_image || ''}
                        onChange={e => onUpdate('hero_image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                    {content.hero_image && (
                        <div className="border rounded-md p-2 bg-muted/20">
                            <img src={content.hero_image} alt="Hero Preview" className="max-h-32 object-contain mx-auto" />
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Badge Text</Label>
                        <Input
                            value={content.badge_text || ''}
                            onChange={e => onUpdate('badge_text', e.target.value)}
                            placeholder="e.g. 500+ Happy Clients"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Badge Subtext</Label>
                        <Input
                            value={content.badge_subtext || ''}
                            onChange={e => onUpdate('badge_subtext', e.target.value)}
                            placeholder="e.g. Best packaging service we've used!"
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Benefits Section Editor
    if (section.sectionKey === 'benefits') {
        const items = Array.isArray(content.items) ? content.items : []
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={e => onUpdate('heading', e.target.value)}
                        placeholder="e.g. How Custom Packaging Can Boost Your Brand"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Introduction</Label>
                    <Textarea
                        value={content.intro || ''}
                        onChange={e => onUpdate('intro', e.target.value)}
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Section Image URL</Label>
                    <Input
                        value={content.image || ''}
                        onChange={e => onUpdate('image', e.target.value)}
                        placeholder="https://example.com/benefits-image.jpg"
                    />
                    {content.image && (
                        <div className="border rounded-md p-2 bg-muted/20">
                            <img src={content.image} alt="Benefits Preview" className="max-h-32 object-contain mx-auto" />
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    <Label>Benefit Items</Label>
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={item.title || ''}
                                    placeholder="Benefit Title"
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[idx] = { ...newItems[idx], title: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                                <Textarea
                                    value={item.desc || ''}
                                    placeholder="Description"
                                    rows={2}
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[idx] = { ...newItems[idx], desc: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newItems = items.filter((_: any, i: number) => i !== idx)
                                    onUpdate('items', newItems)
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
                        onClick={() => onUpdate('items', [...items, { title: '', desc: '' }])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Benefit
                    </Button>
                </div>
            </div>
        )
    }

    if (section.sectionKey === 'seo_content') {
        return (
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                    This section is for long-form SEO content. It will be collapsed by default with a "Read More" button.
                </div>
                <div className="space-y-2">
                    <Label>Heading (Optional)</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={e => onUpdate('heading', e.target.value)}
                        placeholder="e.g. Detailed Information"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor
                        content={content.content || ''}
                        onChange={html => onUpdate('content', html)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Collapsed Height (px) - Default: 300</Label>
                    <Input
                        type="number"
                        value={content.collapsedHeight || 300}
                        onChange={e => onUpdate('collapsedHeight', parseInt(e.target.value))}
                    />
                </div>
            </div>
        )
    }

    // Customer Reviews Editor
    if (section.sectionKey === 'customer_reviews') {
        const reviews = Array.isArray(content.items) ? content.items : []
        return (
            <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded text-sm text-green-800">
                    Customer reviews with star ratings. Great for building trust!
                </div>
                <div className="space-y-2">
                    <Label>Section Heading</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={e => onUpdate('heading', e.target.value)}
                        placeholder="e.g. What Our Customers Say"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subheading</Label>
                    <Input
                        value={content.subheading || ''}
                        onChange={e => onUpdate('subheading', e.target.value)}
                        placeholder="e.g. Trusted by thousands of businesses"
                    />
                </div>
                <div className="space-y-3">
                    <Label>Reviews</Label>
                    {reviews.map((review: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-lg bg-muted/20 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs">Name</Label>
                                    <Input
                                        value={review.name || ''}
                                        placeholder="Customer name"
                                        onChange={(e) => {
                                            const newItems = [...reviews]
                                            newItems[idx] = { ...newItems[idx], name: e.target.value }
                                            onUpdate('items', newItems)
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Role/Company</Label>
                                    <Input
                                        value={review.role || ''}
                                        placeholder="e.g. Business Owner"
                                        onChange={(e) => {
                                            const newItems = [...reviews]
                                            newItems[idx] = { ...newItems[idx], role: e.target.value }
                                            onUpdate('items', newItems)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs">Rating (1-5)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={review.rating || 5}
                                        onChange={(e) => {
                                            const newItems = [...reviews]
                                            newItems[idx] = { ...newItems[idx], rating: parseInt(e.target.value) }
                                            onUpdate('items', newItems)
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Image URL (optional)</Label>
                                    <Input
                                        value={review.image || ''}
                                        placeholder="https://..."
                                        onChange={(e) => {
                                            const newItems = [...reviews]
                                            newItems[idx] = { ...newItems[idx], image: e.target.value }
                                            onUpdate('items', newItems)
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs">Review Text</Label>
                                <Textarea
                                    value={review.text || ''}
                                    placeholder="Customer's review..."
                                    rows={3}
                                    onChange={(e) => {
                                        const newItems = [...reviews]
                                        newItems[idx] = { ...newItems[idx], text: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newItems = reviews.filter((_: any, i: number) => i !== idx)
                                    onUpdate('items', newItems)
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Remove Review
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate('items', [...reviews, { name: '', role: '', rating: 5, text: '' }])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Review
                    </Button>
                </div>
            </div>
        )
    }

    // Features Bar Editor
    if (section.sectionKey === 'features_bar') {
        const features = Array.isArray(content.items) ? content.items : []
        const iconOptions = ['dollar', 'clock', 'truck', 'package', 'palette', 'pen', 'sparkles', 'shield', 'zap', 'check']
        return (
            <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded text-sm text-purple-800">
                    Horizontal bar showing key features/USPs with icons.
                </div>
                <div className="space-y-2">
                    <Label>Section Heading</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={e => onUpdate('heading', e.target.value)}
                        placeholder="e.g. ONE PLACE - Where you get all your custom packaging needs"
                    />
                </div>
                <div className="space-y-3">
                    <Label>Features</Label>
                    {features.map((feature: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <div>
                                    <Label className="text-xs">Icon</Label>
                                    <select
                                        className="w-full h-10 border rounded-md px-2 text-sm"
                                        value={feature.icon || 'check'}
                                        onChange={(e) => {
                                            const newItems = [...features]
                                            newItems[idx] = { ...newItems[idx], icon: e.target.value }
                                            onUpdate('items', newItems)
                                        }}
                                    >
                                        {iconOptions.map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        value={feature.title || ''}
                                        placeholder="FREE"
                                        onChange={(e) => {
                                            const newItems = [...features]
                                            newItems[idx] = { ...newItems[idx], title: e.target.value }
                                            onUpdate('items', newItems)
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Subtitle</Label>
                                    <Input
                                        value={feature.subtitle || ''}
                                        placeholder="SHIPPING"
                                        onChange={(e) => {
                                            const newItems = [...features]
                                            newItems[idx] = { ...newItems[idx], subtitle: e.target.value }
                                            onUpdate('items', newItems)
                                        }}
                                    />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newItems = features.filter((_: any, i: number) => i !== idx)
                                    onUpdate('items', newItems)
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
                        onClick={() => onUpdate('items', [...features, { icon: 'check', title: '', subtitle: '' }])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Feature
                    </Button>
                </div>
            </div>
        )
    }
    // Common fields most sections have
    const hasHeading = 'heading' in content || !Object.keys(content).length
    const hasText = 'text' in content
    const hasItems = 'items' in content

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                    value={content.heading || ''}
                    onChange={(e) => onUpdate('heading', e.target.value)}
                    placeholder="Section heading"
                />
            </div>

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

            {/* FAQ Section Editor */}
            {section.sectionKey === 'faq' && Array.isArray(content.items) && (
                <div className="space-y-3">
                    <Label>FAQ Items</Label>
                    {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={item.q || item.question || ''}
                                    placeholder="Question"
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], q: e.target.value, question: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                                <Textarea
                                    value={item.a || item.answer || ''}
                                    placeholder="Answer"
                                    rows={3}
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], a: e.target.value, answer: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newItems = content.items.filter((_: any, i: number) => i !== idx)
                                    onUpdate('items', newItems)
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
                        onClick={() => onUpdate('items', [...(content.items || []), { q: '', a: '' }])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add FAQ
                    </Button>
                </div>
            )}

            {/* Benefits Section Editor */}
            {section.sectionKey === 'benefits' && Array.isArray(content.items) && (
                <div className="space-y-3">
                    <Label>Benefit Items</Label>
                    {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={item.title || ''}
                                    placeholder="Benefit Title"
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], title: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                                <Textarea
                                    value={item.desc || item.description || ''}
                                    placeholder="Description"
                                    rows={2}
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], desc: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newItems = content.items.filter((_: any, i: number) => i !== idx)
                                    onUpdate('items', newItems)
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
                        onClick={() => onUpdate('items', [...(content.items || []), { title: '', desc: '' }])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Benefit
                    </Button>
                </div>
            )}

            {/* Industries Section Editor */}
            {section.sectionKey === 'industries' && Array.isArray(content.items) && (
                <div className="space-y-3">
                    <Label>Industry Items</Label>
                    {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={item.name || item.title || ''}
                                    placeholder="Industry Name"
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], name: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                                <Input
                                    value={item.image || ''}
                                    placeholder="Image URL (optional)"
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], image: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newItems = content.items.filter((_: any, i: number) => i !== idx)
                                    onUpdate('items', newItems)
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
                        onClick={() => onUpdate('items', [...(content.items || []), { name: '', image: '' }])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Industry
                    </Button>
                </div>
            )}

            {/* Popular Products Section Editor */}
            {section.sectionKey === 'popular_products' && Array.isArray(content.items) && (
                <div className="space-y-3">
                    <Label>Product Items</Label>
                    {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={item.name || item.title || ''}
                                    placeholder="Product Name"
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], name: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                                <Input
                                    value={item.slug || ''}
                                    placeholder="Slug (e.g. mailer-boxes)"
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], slug: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                                <Input
                                    value={item.image || ''}
                                    placeholder="Image URL"
                                    onChange={(e) => {
                                        const newItems = [...content.items]
                                        newItems[idx] = { ...newItems[idx], image: e.target.value }
                                        onUpdate('items', newItems)
                                    }}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newItems = content.items.filter((_: any, i: number) => i !== idx)
                                    onUpdate('items', newItems)
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
                        onClick={() => onUpdate('items', [...(content.items || []), { name: '', slug: '', image: '' }])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </div>
            )}

            {/* Why Choose Us Section Editor - Points */}
            {'points' in content && Array.isArray(content.points) && (
                <div className="space-y-3">
                    <Label>Points</Label>
                    {content.points.map((point: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center p-2 border rounded-lg bg-muted/20">
                            <Input
                                className="flex-1"
                                value={typeof point === 'string' ? point : point.text || point.title || ''}
                                placeholder="Point text"
                                onChange={(e) => {
                                    const newPoints = [...content.points]
                                    newPoints[idx] = typeof point === 'string' ? e.target.value : { ...point, text: e.target.value }
                                    onUpdate('points', newPoints)
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                type="button"
                                onClick={() => {
                                    const newPoints = content.points.filter((_: any, i: number) => i !== idx)
                                    onUpdate('points', newPoints)
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
                        onClick={() => onUpdate('points', [...(content.points || []), ''])}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Point
                    </Button>
                </div>
            )}

            {/* Generic fallback for unknown items */}
            {hasItems && Array.isArray(content.items) &&
                !['faq', 'benefits', 'industries', 'popular_products'].includes(section.sectionKey) && (
                    <div className="bg-muted p-4 rounded-lg">
                        <Label className="text-sm text-muted-foreground">
                            List Items: {content.items.length} items
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Use the JSON editor below for detailed item editing
                        </p>
                    </div>
                )}
        </div>
    )
}
