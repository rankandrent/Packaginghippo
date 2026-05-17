import { sanitizeInternalLinkRel } from "@/lib/utils"

export function SeoContent({ data }: { data: any }) {
    const collapsedHeight = data.collapsedHeight || 300

    if (!data.content) return null

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                {data.heading && (
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">{data.heading}</h2>
                )}
                <div
                    className="overflow-y-auto pr-3 custom-scrollbar"
                    style={{ maxHeight: `${collapsedHeight}px` }}
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
                        dangerouslySetInnerHTML={{ __html: sanitizeInternalLinkRel(data.content) }}
                        suppressHydrationWarning
                    />
                </div>
            </div>
        </section>
    )
}
