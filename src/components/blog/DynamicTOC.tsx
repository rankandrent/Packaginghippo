
"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TOCItem {
    id: string
    text: string
    level: number
}

export function DynamicTOC({ selector = ".prose" }: { selector?: string }) {
    const [headings, setHeadings] = useState<TOCItem[]>([])
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll(`${selector} h2, ${selector} h3`))
        const tocItems = elements.map((el, index) => {
            const text = el.textContent || ""
            const id = el.id || text.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + index
            el.id = id // Ensure element has ID for scrolling
            return {
                id,
                text,
                level: el.tagName === "H2" ? 2 : 3
            }
        })
        setHeadings(tocItems)

        // Intersection Observer for active state
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries.find((entry) => entry.isIntersecting)
                if (visibleEntry) {
                    setActiveId(visibleEntry.target.id)
                }
            },
            { rootMargin: "0% 0% -80% 0%" }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [selector])

    if (headings.length === 0) return null

    return (
        <div className="sticky top-32 space-y-4">
            <h3 className="font-bold text-blue-900 uppercase tracking-wider text-xs border-b pb-2">Table of Contents</h3>
            <nav className="max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                <ul className="space-y-3">
                    {headings.map((item) => (
                        <li
                            key={item.id}
                            style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className={cn(
                                    "block text-xs font-semibold transition-all hover:text-blue-900",
                                    activeId === item.id ? "text-blue-900 translate-x-1" : "text-gray-400"
                                )}
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
