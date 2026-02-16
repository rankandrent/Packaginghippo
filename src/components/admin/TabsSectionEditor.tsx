"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "./RichTextEditor" // Assuming this is in same folder
import { ImageUploader } from "./ImageUploader" // Assuming this is in same folder
import { Trash2, Plus, GripVertical, Settings } from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TabItem {
    id: string
    label: string
    content?: string
    images?: string[]
    specs?: { label: string, value: string }[]
    specsLabelHeader?: string
    specsValueHeader?: string
    featureCards?: { image: string, title: string, description: string }[]
}

interface TabsSectionEditorProps {
    content: {
        heading?: string
        subheading?: string
        tabs?: TabItem[]
    }
    onChange: (key: string, value: any) => void
}

export function TabsSectionEditor({ content, onChange }: TabsSectionEditorProps) {
    const tabs = content.tabs || []
    const [activeTabId, setActiveTabId] = useState<string | null>(tabs[0]?.id || null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = tabs.findIndex((t) => t.id === active.id);
            const newIndex = tabs.findIndex((t) => t.id === over?.id);
            onChange('tabs', arrayMove(tabs, oldIndex, newIndex));
        }
    };

    const addTab = () => {
        const newTab: TabItem = {
            id: Math.random().toString(36).substring(7),
            label: 'New Tab',
            content: '',
            images: [],
            specs: []
        }
        onChange('tabs', [...tabs, newTab])
        setActiveTabId(newTab.id)
    }

    const removeTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const newTabs = tabs.filter(t => t.id !== id)
        onChange('tabs', newTabs)
        if (activeTabId === id) {
            setActiveTabId(newTabs[0]?.id || null)
        }
    }

    const updateTab = (id: string, key: keyof TabItem, value: any) => {
        const newTabs = tabs.map(t => t.id === id ? { ...t, [key]: value } : t)
        onChange('tabs', newTabs)
    }

    const activeTab = tabs.find(t => t.id === activeTabId)

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                <div>
                    <Label>Section Heading (Optional)</Label>
                    <Input
                        value={content.heading || ''}
                        onChange={e => onChange('heading', e.target.value)}
                        placeholder="e.g. Product Details"
                    />
                </div>
                <div>
                    <Label>Section Subheading (Optional)</Label>
                    <Input
                        value={content.subheading || ''}
                        onChange={e => onChange('subheading', e.target.value)}
                        placeholder="e.g. Everything you need to know"
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <Label className="mb-2 block">Tabs Management</Label>

                {/* Tabs List / Sortable */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={tabs.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2 mb-4">
                            {tabs.map(tab => (
                                <SortableTabItem
                                    key={tab.id}
                                    tab={tab}
                                    isActive={activeTabId === tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    onLabelChange={(val: string) => updateTab(tab.id, 'label', val)}
                                    onRemove={(e: React.MouseEvent) => removeTab(tab.id, e)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <Button onClick={addTab} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add New Tab
                </Button>
            </div>

            {/* Active Tab Editor */}
            {activeTab && (
                <div className="border-t pt-6 bg-gray-50/50 -mx-6 px-6 pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-sm uppercase text-blue-600">Editing: {activeTab.label}</h4>
                    </div>

                    <div className="space-y-6">
                        {/* Content Type Selection (Implicit via UI) */}

                        {/* 1. Specifications Mode */}
                        <div className="bg-white p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <Label className="text-xs uppercase text-gray-500 font-bold">Specification Table (Optional)</Label>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => updateTab(activeTab.id, 'specs', [...(activeTab.specs || []), { label: '', value: '' }])}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add Row
                                </Button>
                            </div>

                            {/* Table Headers Configuration */}
                            <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-md border border-gray-100">
                                <div className="flex-1">
                                    <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Left Column Header</Label>
                                    <Input
                                        value={activeTab.specsLabelHeader || ''}
                                        placeholder="e.g. Dimensions"
                                        className="h-7 text-xs bg-white"
                                        onChange={e => updateTab(activeTab.id, 'specsLabelHeader', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Right Column Header</Label>
                                    <Input
                                        value={activeTab.specsValueHeader || ''}
                                        placeholder="e.g. All Custom Sizes"
                                        className="h-7 text-xs bg-white"
                                        onChange={e => updateTab(activeTab.id, 'specsValueHeader', e.target.value)}
                                    />
                                </div>
                            </div>

                            {activeTab.specs && activeTab.specs.length > 0 && (
                                <div className="space-y-2 mb-2">
                                    {activeTab.specs.map((spec, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input
                                                value={spec.label}
                                                placeholder="Label"
                                                className="flex-1 h-8 text-xs"
                                                onChange={e => {
                                                    const newSpecs = [...activeTab.specs!]
                                                    newSpecs[idx].label = e.target.value
                                                    updateTab(activeTab.id, 'specs', newSpecs)
                                                }}
                                            />
                                            <Input
                                                value={spec.value}
                                                placeholder="Value"
                                                className="flex-1 h-8 text-xs"
                                                onChange={e => {
                                                    const newSpecs = [...activeTab.specs!]
                                                    newSpecs[idx].value = e.target.value
                                                    updateTab(activeTab.id, 'specs', newSpecs)
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-400 hover:text-red-600"
                                                onClick={() => {
                                                    const newSpecs = activeTab.specs!.filter((_, i) => i !== idx)
                                                    updateTab(activeTab.id, 'specs', newSpecs)
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-[10px] text-gray-400">Add rows here to display a structured specification table.</p>
                        </div>

                        {/* 2. Feature Cards (Image + Description) Mode - NEW */}
                        <div className="bg-white p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <Label className="text-xs uppercase text-gray-500 font-bold">Feature Cards (Image + Desc)</Label>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => updateTab(activeTab.id, 'featureCards', [...(activeTab.featureCards || []), { image: '', title: '', description: '' }])}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add Card
                                </Button>
                            </div>

                            {activeTab.featureCards && activeTab.featureCards.length > 0 ? (
                                <div className="space-y-4 mb-2">
                                    {activeTab.featureCards.map((card: any, idx: number) => (
                                        <div key={idx} className="border p-3 rounded-md bg-gray-50 relative group">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const newCards = activeTab.featureCards!.filter((_: any, i: number) => i !== idx)
                                                    updateTab(activeTab.id, 'featureCards', newCards)
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>

                                            <div className="grid gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 bg-white border rounded overflow-hidden flex-shrink-0">
                                                        {card.image ? (
                                                            <img src={card.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">No Img</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <ImageUploader
                                                            value={card.image ? [card.image] : []}
                                                            onChange={(urls) => {
                                                                const newCards = [...activeTab.featureCards!]
                                                                newCards[idx].image = urls[0]
                                                                updateTab(activeTab.id, 'featureCards', newCards)
                                                            }}
                                                            maxFiles={1}
                                                        />
                                                    </div>
                                                </div>
                                                <Input
                                                    value={card.title}
                                                    placeholder="Card Title (Optional)"
                                                    className="h-8 text-sm font-bold"
                                                    onChange={e => {
                                                        const newCards = [...activeTab.featureCards!]
                                                        newCards[idx].title = e.target.value
                                                        updateTab(activeTab.id, 'featureCards', newCards)
                                                    }}
                                                />
                                                <textarea
                                                    value={card.description}
                                                    placeholder="Description..."
                                                    className="w-full p-2 text-xs border rounded-md min-h-[60px]"
                                                    rows={3}
                                                    onChange={e => {
                                                        const newCards = [...activeTab.featureCards!]
                                                        newCards[idx].description = e.target.value
                                                        updateTab(activeTab.id, 'featureCards', newCards)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 border-2 border-dashed rounded-md">
                                    <p className="text-xs text-gray-400 mb-2">No feature cards added.</p>
                                    <p className="text-[10px] text-gray-400">Use this for "Box Features" style display (Image + Text).</p>
                                </div>
                            )}
                        </div>

                        {/* 3. Images Grid */}
                        <div className="bg-white p-4 border rounded-lg">
                            <Label className="text-xs uppercase text-gray-500 font-bold mb-2 block">Image Grid (Optional)</Label>
                            <ImageUploader
                                value={activeTab.images || []}
                                onChange={(urls) => updateTab(activeTab.id, 'images', urls)}
                            />
                        </div>

                        {/* 3. Rich Text Content */}
                        <div className="bg-white p-4 border rounded-lg">
                            <Label className="text-xs uppercase text-gray-500 font-bold mb-2 block">Rich Text Content</Label>
                            <RichTextEditor
                                content={activeTab.content || ''}
                                onChange={(html) => updateTab(activeTab.id, 'content', html)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function SortableTabItem({ tab, isActive, onClick, onLabelChange, onRemove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn(
            "flex items-center gap-2 p-2 border rounded-md bg-white cursor-pointer transition-colors",
            isActive ? "border-blue-500 ring-1 ring-blue-500" : "hover:border-gray-300"
        )} onClick={onClick}>
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
                <GripVertical className="w-4 h-4" />
            </div>
            <Input
                value={tab.label}
                onChange={(e) => onLabelChange(e.target.value)}
                className="h-8 border-transparent hover:border-gray-200 focus:border-blue-500 bg-transparent"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 ml-auto" onClick={onRemove}>
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    )
}
