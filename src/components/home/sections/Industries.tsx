"use client"

export function Industries({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-black mb-12 text-center">{data.heading || "Industries We Serve"}</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {data.items?.map((ind: string, i: number) => (
                        <div key={i} className="px-6 py-4 bg-gray-50 rounded-xl text-lg font-bold text-gray-800 border hover:border-yellow-500 hover:bg-yellow-50 transition-all cursor-default">
                            {ind}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
