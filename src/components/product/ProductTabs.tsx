"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TabContent {
    content: string
    images?: string[]
}

interface ProductTabsProps {
    tabs?: {
        specification?: TabContent
        box_features?: TabContent
        materials?: TabContent
        printing_methods?: TabContent
        inks?: TabContent
        finishing?: TabContent
        addons?: TabContent
    }
}

const TAB_CONFIG = [
    { key: 'specification', label: 'SPECIFICATION' },
    { key: 'box_features', label: 'BOX FEATURES' },
    { key: 'materials', label: 'MATERIALS' },
    { key: 'printing_methods', label: 'PRINTING METHODS' },
    { key: 'inks', label: 'INKS' },
    { key: 'finishing', label: 'FINISHING' },
    { key: 'addons', label: 'ADD-ONS' }
]

export function ProductTabs({ tabs }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState('specification')

    if (!tabs || Object.keys(tabs).length === 0) {
        return null
    }

    const activeContent = tabs[activeTab as keyof typeof tabs]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
                    {TAB_CONFIG.map(tab => {
                        const hasContent = tabs[tab.key as keyof typeof tabs]?.content
                        if (!hasContent) return null

                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "px-6 py-3 text-sm font-bold uppercase transition-all border-b-2",
                                    activeTab === tab.key
                                        ? "bg-green-500 text-white border-green-500"
                                        : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                                )}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                {activeContent && (
                    <div className="bg-gray-50 rounded-lg p-8">
                        {/* Images Grid */}
                        {activeContent.images && activeContent.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {activeContent.images.map((image, index) => (
                                    <div key={index} className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md group">
                                        <Image
                                            src={image}
                                            alt={`${activeTab} ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Text Content */}
                        <div
                            className="prose prose-gray max-w-none"
                            dangerouslySetInnerHTML={{ __html: activeContent.content }}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}
