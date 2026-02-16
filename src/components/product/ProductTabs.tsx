"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TabContent {
    content: string
    images?: string[]
    structuredSpecs?: { label: string, value: string }[]
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
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-1 mb-0 pb-1">
                    {TAB_CONFIG.map(tab => {
                        const content = tabs[tab.key as keyof typeof tabs]
                        const hasContent = content?.content || (content?.structuredSpecs && content.structuredSpecs.length > 0)
                        if (!hasContent) return null

                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "px-6 py-4 text-sm font-black uppercase transition-all border-t-2 border-x-2 rounded-t-xl -mb-[2px]",
                                    activeTab === tab.key
                                        ? "bg-[#8bc34a] text-white border-[#8bc34a] shadow-[0_-4px_10px_rgba(139,195,74,0.2)]"
                                        : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600"
                                )}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content Container */}
                {activeContent && (
                    <div className="bg-white border-2 border-gray-100 rounded-b-2xl rounded-tr-2xl p-0 shadow-xl shadow-gray-200/50 overflow-hidden">

                        {/* Specification Table (Special Case) */}
                        {activeTab === 'specification' && activeContent.structuredSpecs && activeContent.structuredSpecs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <tbody>
                                        {activeContent.structuredSpecs.map((spec, i) => (
                                            <tr
                                                key={i}
                                                className={cn(
                                                    "border-b border-gray-100 last:border-0",
                                                    i % 2 === 0 ? "bg-white" : "bg-[#f9fbf2]"
                                                )}
                                            >
                                                <td className="py-4 px-8 text-sm font-black text-gray-900 w-1/3 border-r border-gray-100 uppercase tracking-tight">
                                                    {spec.label}
                                                </td>
                                                <td className="py-4 px-8 text-sm text-gray-700 font-medium">
                                                    {spec.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-10">
                                {/* Images Grid for other tabs */}
                                {activeContent.images && activeContent.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                                        {activeContent.images.map((image, index) => (
                                            <div key={index} className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-inner group border border-gray-100">
                                                <Image
                                                    src={image}
                                                    alt={`${activeTab} ${index + 1}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Rich Text Content */}
                                {activeContent.content && (
                                    <div
                                        className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: activeContent.content }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
