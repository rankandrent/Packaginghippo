"use client"

export function Intro({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">{data.heading}</h2>
                <div className="text-lg text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: (data.text || "").replace(/\n/g, "<br/>") }} />
            </div>
        </section>
    )
}
