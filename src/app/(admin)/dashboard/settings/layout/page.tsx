"use client"

import { useEffect, useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, GripVertical } from "lucide-react"

// Define available sections
const AVAILABLE_SECTIONS = [
    { id: 'content', label: 'Main Content (Description/Overview)' },
    { id: 'related_categories', label: 'Related Categories' },
    { id: 'quote_form', label: 'Get Custom Quote Form' },
    { id: 'testimonials', label: 'Testimonials' },
]

// Draggable Item Component
function SortableItem(props: { id: string, label: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-3 p-3 bg-white border rounded-md mb-2 cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors">
            <GripVertical className="text-gray-400" />
            <span className="font-medium text-gray-700">{props.label}</span>
        </div>
    )
}

export default function LayoutSettingsPage() {
    const [productSections, setProductSections] = useState(AVAILABLE_SECTIONS)
    const [categorySections, setCategorySections] = useState(AVAILABLE_SECTIONS)

    // Loading states
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/settings')
            const data = await res.json()

            data.settings?.forEach((s: any) => {
                if (s.key === 'layout_product') {
                    // Merge saved order with available sections to ensure all are present
                    const savedOrder = s.value as string[]
                    const ordered = mapOrder(AVAILABLE_SECTIONS, savedOrder, 'id')
                    setProductSections(ordered)
                }
                if (s.key === 'layout_category') {
                    const savedOrder = s.value as string[]
                    const ordered = mapOrder(AVAILABLE_SECTIONS, savedOrder, 'id')
                    setCategorySections(ordered)
                }
            })
        } catch (error) {
            console.error("Error fetching settings:", error)
        } finally {
            setLoading(false)
        }
    }

    // Helper to sort array based on saved ID list
    function mapOrder(array: any[], order: string[], key: string) {
        if (!order || order.length === 0) return array

        const sorted = [...array].sort((a, b) => {
            const A = a[key], B = b[key];
            if (order.indexOf(A) > -1 && order.indexOf(B) > -1) {
                return order.indexOf(A) - order.indexOf(B);
            } else {
                return order.indexOf(A) > -1 ? -1 : 1;
            }
        });
        return sorted;
    }

    // Handle Drag End
    function handleDragEnd(event: DragEndEvent, type: 'product' | 'category') {
        const { active, over } = event

        if (active.id !== over?.id) {
            if (type === 'product') {
                setProductSections((items) => {
                    const oldIndex = items.findIndex((item) => item.id === active.id)
                    const newIndex = items.findIndex((item) => item.id === over!.id)
                    return arrayMove(items, oldIndex, newIndex)
                })
            } else {
                setCategorySections((items) => {
                    const oldIndex = items.findIndex((item) => item.id === active.id)
                    const newIndex = items.findIndex((item) => item.id === over!.id)
                    return arrayMove(items, oldIndex, newIndex)
                })
            }
        }
    }

    async function saveLayout(key: string, sections: typeof AVAILABLE_SECTIONS) {
        try {
            setSaving(key)
            // Save only the IDs
            const value = sections.map(s => s.id)

            const res = await fetch('/api/cms/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            })

            if (!res.ok) throw new Error('Failed to save')
            alert(`${key === 'layout_product' ? 'Product' : 'Category'} layout saved!`)
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Error saving settings")
        } finally {
            setSaving(null)
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
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Page Layouts</h2>
                <p className="text-muted-foreground">
                    Reorder sections for Product and Category pages. Drag and drop to change the order.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Product Layout */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Page Layout</CardTitle>
                        <CardDescription>Order of sections below the main product details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, 'product')}
                        >
                            <SortableContext
                                items={productSections.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {productSections.map((section) => (
                                    <SortableItem key={section.id} id={section.id} label={section.label} />
                                ))}
                            </SortableContext>
                        </DndContext>

                        <Button
                            onClick={() => saveLayout('layout_product', productSections)}
                            disabled={saving === 'layout_product'}
                            className="w-full mt-4"
                        >
                            {saving === 'layout_product' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Product Layout
                        </Button>
                    </CardContent>
                </Card>

                {/* Category Layout */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Page Layout</CardTitle>
                        <CardDescription>Order of sections below the hero/products grid</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, 'category')}
                        >
                            <SortableContext
                                items={categorySections.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {categorySections.map((section) => (
                                    <SortableItem key={section.id} id={section.id} label={section.label} />
                                ))}
                            </SortableContext>
                        </DndContext>

                        <Button
                            onClick={() => saveLayout('layout_category', categorySections)}
                            disabled={saving === 'layout_category'}
                            className="w-full mt-4"
                        >
                            {saving === 'layout_category' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Category Layout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
