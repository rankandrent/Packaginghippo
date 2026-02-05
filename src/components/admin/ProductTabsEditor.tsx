"use client"

import { useState } from "react"
import { Trash2, Upload, X } from "lucide-react"
import Image from "next/image"

interface TabContent {
    content: string
    images?: string[]
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

    const currentTabData = value[activeTab as keyof typeof value] || { content: '', images: [] }

    return (
        <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-bold mb-4">Product Tabs</h3>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
                {TAB_CONFIG.map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.key
                                ? 'bg-blue-900 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Editor */}
            <div className="space-y-6">
                {/* Images Section */}
                <div>
                    <label className="block text-sm font-medium mb-2">Images</label>

                    {/* Image Grid */}
                    {currentTabData.images && currentTabData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {currentTabData.images.map((image, index) => (
                                <div key={index} className="relative aspect-square group">
                                    <Image
                                        src={image}
                                        alt={`${activeTab} image ${index + 1}`}
                                        fill
                                        className="object-cover rounded-lg"
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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Paste image URL"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const input = e.currentTarget
                                    if (input.value.trim()) {
                                        addImage(activeTab, input.value.trim())
                                        input.value = ''
                                    }
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                if (input.value.trim()) {
                                    addImage(activeTab, input.value.trim())
                                    input.value = ''
                                }
                            }}
                        >
                            <Upload className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to upload image URL</p>
                </div>

                {/* Content Editor */}
                <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                        value={currentTabData.content || ''}
                        onChange={(e) => updateTabContent(activeTab, e.target.value)}
                        placeholder={`Enter content for ${TAB_CONFIG.find(t => t.key === activeTab)?.label}...`}
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supports HTML formatting</p>
                </div>
            </div>
        </div>
    )
}
