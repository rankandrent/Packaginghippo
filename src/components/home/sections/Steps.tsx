"use client"

export function Steps({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-black mb-16 text-center">{data.heading}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {data.steps?.map((step: any, i: number) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border relative">
                            <div className="text-6xl font-black text-gray-100 absolute top-4 right-4 z-0">{i + 1}</div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2 text-yellow-600">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
