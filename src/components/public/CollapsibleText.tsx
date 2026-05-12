interface CollapsibleTextProps {
    content: string
    collapsedHeight?: number
    className?: string
}

export function CollapsibleText({ content, collapsedHeight = 300, className }: CollapsibleTextProps) {
    if (!content) return null

    return (
        <div className={className}>
            <div
                className="overflow-y-auto pr-3 custom-scrollbar"
                style={{ maxHeight: `${collapsedHeight}px` }}
            >
                <div
                    className="prose max-w-none text-gray-600 leading-relaxed rich-text text-justify"
                    dangerouslySetInnerHTML={{ __html: content }}
                    suppressHydrationWarning
                />
            </div>
        </div>
    )
}
