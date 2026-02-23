import Image from "next/image"

export type MaterialFinishingItem = {
    title: string
    desc: string
    image: string
}

export type MaterialFinishingData = {
    heading?: string
    stockHeading?: string
    finishingHeading?: string
    stockTypes: MaterialFinishingItem[]
    finishing: MaterialFinishingItem[]
}

export function MaterialFinishing({ data }: { data: MaterialFinishingData }) {
    if (!data) return null

    const stockTypes = data.stockTypes || []
    const finishing = data.finishing || []

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">

                {data.heading && (
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight relative inline-block">
                            {data.heading}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-primary rounded-full"></div>
                        </h2>
                    </div>
                )}

                {/* Stock Type & Thickness */}
                {stockTypes.length > 0 && (
                    <div className="mb-20">
                        {data.stockHeading && (
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-100 pb-2 inline-block">
                                {data.stockHeading}
                            </h3>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {stockTypes.map((item, idx) => (
                                <div key={idx} className="group">
                                    <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden mb-5 relative border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title || "Stock Type"}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Finishing Assortment */}
                {finishing.length > 0 && (
                    <div>
                        {data.finishingHeading && (
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-100 pb-2 inline-block">
                                {data.finishingHeading}
                            </h3>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {finishing.map((item, idx) => (
                                <div key={idx} className="group">
                                    <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden mb-5 relative border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title || "Finishing Option"}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    )
}
