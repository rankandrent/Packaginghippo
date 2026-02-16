"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TabItem {
    id: string
    label: string
    content?: string
    images?: string[]
    specs?: { label: string, value: string }[]
    specsLabelHeader?: string
    specsValueHeader?: string
    featureCards?: { image: string, title?: string, description: string }[]
}

interface TabsSectionProps {
    data: {
        heading?: string
        subheading?: string
        tabs: TabItem[]
    }
}

export default function TabsSection({ data }: TabsSectionProps) {
    const { tabs = [] } = data
    const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '')

    if (!tabs || tabs.length === 0) return null

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Heading */}
                {(data.heading || data.subheading) && (
                    <div className="text-center mb-10 max-w-3xl mx-auto">
                        {data.heading && <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">{data.heading}</h2>}
                        {data.subheading && <p className="text-lg text-gray-600 leading-relaxed">{data.subheading}</p>}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-1 mb-0 pb-1 justify-center md:justify-start">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={cn(
                                "px-6 py-4 text-sm font-black uppercase transition-all border-t-2 border-x-2 rounded-t-xl -mb-[2px]",
                                activeTabId === tab.id
                                    ? "bg-[#8bc34a] text-white border-[#8bc34a] shadow-[0_-4px_10px_rgba(139,195,74,0.2)] z-10"
                                    : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Container */}
                <div className="bg-white border-2 border-gray-100 rounded-b-2xl rounded-tr-2xl p-0 shadow-xl shadow-gray-200/50 overflow-hidden min-h-[300px]">
                    {activeTab && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            {/* Specification Table */}
                            {activeTab.specs && activeTab.specs.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        {(activeTab.specsLabelHeader || activeTab.specsValueHeader) && (
                                            <thead>
                                                <tr className="bg-gray-100 border-b border-gray-200">
                                                    <th className="py-3 px-8 text-left text-sm font-black text-gray-900 w-1/3 border-r border-gray-200 uppercase tracking-tight">
                                                        {activeTab.specsLabelHeader || 'Label'}
                                                    </th>
                                                    <th className="py-3 px-8 text-left text-sm font-black text-gray-900 uppercase tracking-tight">
                                                        {activeTab.specsValueHeader || 'Value'}
                                                    </th>
                                                </tr>
                                            </thead>
                                        )}
                                        <tbody>
                                            {activeTab.specs.map((spec, i) => (
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
                                <div className="p-8 md:p-10">
                                    {/* Feature Cards Grid (Box Features Style) */}
                                    {activeTab.featureCards && activeTab.featureCards.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                            {activeTab.featureCards.map((card, index) => (
                                                <div key={index} className="flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    {card.image && (
                                                        <div className="relative aspect-[4/3] bg-gray-50 border-b border-gray-100 p-4">
                                                            <Image
                                                                src={card.image}
                                                                alt={card.title || "Feature"}
                                                                fill
                                                                className="object-contain p-2"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="p-5 flex-grow">
                                                        {card.title && <h4 className="font-bold text-gray-900 mb-2">{card.title}</h4>}
                                                        <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Images Grid */}
                                    {activeTab.images && activeTab.images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                                            {activeTab.images.map((image, index) => (
                                                <div key={index} className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-inner group border border-gray-100">
                                                    <Image
                                                        src={image}
                                                        alt={`${activeTab.label} ${index + 1}`}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Rich Text Content */}
                                    {activeTab.content && (
                                        <div
                                            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: activeTab.content }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
