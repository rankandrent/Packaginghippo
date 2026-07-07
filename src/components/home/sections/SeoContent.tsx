import { CollapsibleText } from "@/components/public/CollapsibleText"

export function SeoContent({ data }: { data: any }) {
    const collapsedHeight = data.collapsedHeight || 300

    if (!data.content) return null

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                {data.heading && (
                    <h2 className="text-3xl font-bold mb-8 text-[#011f7b]">{data.heading}</h2>
                )}
                <CollapsibleText content={data.content} collapsedHeight={collapsedHeight} />
            </div>
        </section>
    )
}
