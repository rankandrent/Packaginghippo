export function WhyChooseUs({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="section-py bg-[#011f7b] text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#DAA520]/10 blur-3xl"></div>
            <div className="container mx-auto px-4 text-center relative">
                <h2 className="text-4xl font-black mb-8 text-[#DAA520]">{data.heading}</h2>
                <p className="text-white/75 max-w-2xl mx-auto mb-12">{data.text}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.points?.map((point: any, i: number) => (
                        <div key={i} className="p-4 rounded-lg border border-white/10 bg-white/[0.06] flex flex-col items-center justify-center text-center font-medium hover:border-[#DAA520]/40 transition-colors">
                            {typeof point === 'string' ? (
                                point
                            ) : (
                                <>
                                    {point.title && <span className="font-bold text-white mb-1 block">{point.title}</span>}
                                    {point.desc && <span className="text-sm text-white/75 block">{point.desc}</span>}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
