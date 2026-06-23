import { Star } from "lucide-react"

export function HowItWorks({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="bg-[#011f7b] section-py text-white relative overflow-hidden">
            <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-[#DAA520]/10 blur-3xl"></div>
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="brand-eyebrow mb-4">How It Works</span>
                    <h2 className="text-4xl font-black mb-4 tracking-tight mt-3 text-white">{data.heading}</h2>
                    <p className="text-lg font-medium text-white/75">{data.text}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.subsections?.map((item: any, i: number) => (
                        <div
                            key={i}
                            className="bg-white/[0.06] border border-white/10 p-8 rounded-2xl relative group hover:bg-white/[0.1] hover:border-[#DAA520]/40 transition-all duration-300"
                        >
                            <div className="bg-[#DAA520] text-[#011f7b] w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                <Star className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                            <p className="text-sm font-medium text-white/70 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
