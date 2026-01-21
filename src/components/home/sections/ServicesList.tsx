"use client"

export function ServicesList({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">{data.heading}</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {data.items?.map((item: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
