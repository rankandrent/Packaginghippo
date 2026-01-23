"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function SeoContent({ data }: { data: any }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const collapsedHeight = data.collapsedHeight || 300

    if (!data.content) return null

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                {data.heading && (
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">{data.heading}</h2>
                )}

                <div className="relative">
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? '' : 'relative'}`}
                        style={{ maxHeight: isExpanded ? 'none' : `${collapsedHeight}px` }}
                    >
                        <div
                            className="prose max-w-none text-gray-700 leading-relaxed rich-text 
                            prose-headings:font-bold prose-headings:text-gray-900 
                            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 
                            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                            prose-p:mb-4 prose-p:leading-7
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                            prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4
                            prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4
                            prose-li:mb-2"
                            dangerouslySetInnerHTML={{ __html: data.content }}
                            suppressHydrationWarning
                        />

                        {/* Gradient Fade Overlay when collapsed */}
                        {!isExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <Button
                            variant="outline"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-sm transition-all"
                        >
                            {isExpanded ? (
                                <>Read Less <ChevronDown className="ml-2 w-4 h-4 rotate-180" /></>
                            ) : (
                                <>Read More <ChevronDown className="ml-2 w-4 h-4" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
