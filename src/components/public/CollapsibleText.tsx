"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface CollapsibleTextProps {
    content: string
    collapsedHeight?: number
    className?: string
}

export function CollapsibleText({ content, collapsedHeight = 300, className }: CollapsibleTextProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    if (!content) return null

    return (
        <div className={className}>
            <div className="relative">
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? '' : 'relative'}`}
                    style={{ maxHeight: isExpanded ? 'none' : `${collapsedHeight}px` }}
                >
                    <div
                        className="prose max-w-none text-gray-600 leading-relaxed rich-text text-justify"
                        dangerouslySetInnerHTML={{ __html: content }}
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
    )
}
