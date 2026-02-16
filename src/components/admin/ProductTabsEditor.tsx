"use client"

import { useState } from "react"
import { Trash2, Upload, X, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "./RichTextEditor"

interface TabContent {
    content: string
    images?: string[]
    structuredSpecs?: { label: string, value: string }[]
}

interface ProductTabsEditorProps {
    value?: {
        specification?: TabContent
        box_features?: TabContent
        materials?: TabContent
        printing_methods?: TabContent
        inks?: TabContent
        finishing?: TabContent
        addons?: TabContent
    }
    onChange: (tabs: any) => void
}

const TAB_CONFIG = [
    { key: 'specification', label: 'Specification' },
    { key: 'box_features', label: 'Box Features' },
    { key: 'materials', label: 'Materials' },
    { key: 'printing_methods', label: 'Printing Methods' },
    { key: 'inks', label: 'Inks' },
    { key: 'finishing', label: 'Finishing' },
    { key: 'addons', label: 'Add-ons' }
]

export function ProductTabsEditor({ value = {}, onChange }: ProductTabsEditorProps) {
    const [activeTab, setActiveTab] = useState('specification')

    const updateTabContent = (tabKey: string, content: string) => {
        onChange({
            ...value,
            [tabKey]: {
                ...value[tabKey as keyof typeof value],
                content
            }
        })
    }

    const updateStructuredSpecs = (specs: { label: string, value: string }[]) => {
        onChange({
            ...value,
            specification: {
                ...value.specification,
                structuredSpecs: specs
            }
        })
    }

    const addImage = (tabKey: string, imageUrl: string) => {
        const currentTab = value[tabKey as keyof typeof value] || { content: '', images: [] }
        onChange({
            ...value,
            [tabKey]: {
                ...currentTab,
                images: [...(currentTab.images || []), imageUrl]
            }
        })
    }

    const removeImage = (tabKey: string, index: number) => {
        const currentTab = value[tabKey as keyof typeof value]
        if (!currentTab?.images) return

        onChange({
            ...value,
            [tabKey]: {
                ...currentTab,
                images: currentTab.images.filter((_, i) => i !== index)
            }
        })
    }

    const currentTabData = value[activeTab as keyof typeof value] || { content: '', images: [], structuredSpecs: [] }

    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-900 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></span>
                Product Information Tabs
            </h3>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 mb-6 border-b pb-4">
                {TAB_CONFIG.map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === tab.key
                            ? 'bg-blue-900 text-white shadow-md'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Editor */}
            <div className="space-y-8">
                {/* Specification Table Editor (Special UI) */}
                {activeTab === 'specification' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Detailed Specifications Table</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const specs = [...(currentTabData.structuredSpecs || [])]
                                    specs.push({ label: '', value: '' })
                                    updateStructuredSpecs(specs)
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Row
                            </Button>
                        </div>

                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-bold text-gray-900 w-1/3">Label</th>
                                        <th className="px-4 py-3 text-left font-bold text-gray-900">Value</th>
                                        <th className="px-4 py-3 text-right w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {(currentTabData.structuredSpecs || []).length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-400 italic">
                                                No specifications added yet. Click "Add Row" to start.
                                            </td>
                                        </tr>
                                    )}
                                    {(currentTabData.structuredSpecs || []).map((spec: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-2">
                                                <Input
                                                    value={spec.label}
                                                    placeholder="e.g. Dimensions"
                                                    className="h-9 border-none focus-visible:ring-1"
                                                    onChange={(e) => {
                                                        const specs = [...(currentTabData.structuredSpecs || [])]
                                                        specs[idx].label = e.target.value
                                                        updateStructuredSpecs(specs)
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <Input
                                                    value={spec.value}
                                                    placeholder="e.g. 10x10x5"
                                                    className="h-9 border-none focus-visible:ring-1"
                                                    onChange={(e) => {
                                                        const specs = [...(currentTabData.structuredSpecs || [])]
                                                        specs[idx].value = e.target.value
                                                        updateStructuredSpecs(specs)
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const specs = (currentTabData.structuredSpecs || []).filter((_: any, i: number) => i !== idx)
                                                        updateStructuredSpecs(specs)
                                                    }}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Content Editor (Always shown for other tabs, or as fallback for specification) */}
                {activeTab !== 'specification' && (
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                            {TAB_CONFIG.find(t => t.key === activeTab)?.label} Content
                        </label>
                        <RichTextEditor
                            content={currentTabData.content || ''}
                            onChange={(html) => updateTabContent(activeTab, html)}
                        />
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                            Use the editor above to add detailed content for this tab.
                        </p>
                    </div>
                )}

                {/* Shared Images Section */}
                <div className="pt-6 border-t">
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Related Images for {TAB_CONFIG.find(t => t.key === activeTab)?.label}</label>

                    {/* Image Grid */}
                    {currentTabData.images && currentTabData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                            {currentTabData.images.map((image, index) => (
                                <div key={index} className="relative aspect-square group rounded-xl overflow-hidden border">
                                    <Image
                                        src={image}
                                        alt={`${activeTab} image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(activeTab, index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Image Input */}
                    <div className="flex gap-2 max-w-xl">
                        <Input
                            placeholder="Paste image URL..."
                            className="bg-gray-50 border-gray-200"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const val = e.currentTarget.value.trim()
                                    if (val) {
                                        addImage(activeTab, val)
                                        e.currentTarget.value = ''
                                    }
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                                const val = input.value.trim()
                                if (val) {
                                    addImage(activeTab, val)
                                    input.value = ''
                                }
                            }}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Add
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
