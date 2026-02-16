"use client"

export function WhyChooseUs({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-black mb-8 text-yellow-500">{data.heading}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-12">{data.text}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.points?.map((point: any, i: number) => (
                        <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center text-center font-medium">
                            {typeof point === 'string' ? (
                                point
                            ) : (
                                <>
                                    {point.title && <span className="font-bold text-white mb-1 block">{point.title}</span>}
                                    {point.desc && <span className="text-sm text-gray-400 block">{point.desc}</span>}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
