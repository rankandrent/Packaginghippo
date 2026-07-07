"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { sanitizeInternalLinkRel } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CollapsibleTextProps {
    content: string
    collapsedHeight?: number
    className?: string
}

export function CollapsibleText({ content, collapsedHeight = 300, className }: CollapsibleTextProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollMore, setCanScrollMore] = useState(false)

    // Show the "scroll for more" hint + fade only when the content actually
    // overflows and the user hasn't reached the bottom yet.
    const evaluate = () => {
        const el = scrollRef.current
        if (!el) return
        const remaining = el.scrollHeight - el.clientHeight - el.scrollTop
        setCanScrollMore(el.scrollHeight > el.clientHeight + 4 && remaining > 8)
    }

    useEffect(() => {
        evaluate()
        const el = scrollRef.current
        if (!el) return
        el.addEventListener("scroll", evaluate, { passive: true })
        window.addEventListener("resize", evaluate)
        return () => {
            el.removeEventListener("scroll", evaluate)
            window.removeEventListener("resize", evaluate)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content])

    if (!content) return null

    return (
        <div className={cn("relative", className)}>
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div
                    ref={scrollRef}
                    className="overflow-y-auto custom-scrollbar px-5 py-5 md:px-7 md:py-6"
                    style={{ maxHeight: `${collapsedHeight}px` }}
                >
                    <div
                        className="prose max-w-none leading-relaxed rich-text"
                        dangerouslySetInnerHTML={{ __html: sanitizeInternalLinkRel(content) }}
                        suppressHydrationWarning
                    />
                </div>

                {/* Bottom fade — hints that more content sits below the fold */}
                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent transition-opacity duration-300",
                        canScrollMore ? "opacity-100" : "opacity-0"
                    )}
                />

                {/* Scroll hint pill */}
                <div
                    className={cn(
                        "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[#011f7b] text-white text-xs font-semibold px-3.5 py-1.5 shadow-md transition-all duration-300",
                        canScrollMore ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    )}
                >
                    <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                    Scroll to read more
                </div>
            </div>
        </div>
    )
}
