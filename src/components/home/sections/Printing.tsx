import { Printer } from "lucide-react"

export function Printing({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="section-py bg-[#011f7b] text-white">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-black mb-6 leading-tight text-white">{data.heading}</h2>
                    <p className="text-white/75 text-lg mb-8">{data.text}</p>

                    <div className="bg-white/[0.06] p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold mb-2 text-[#DAA520]">{data.subheading}</h3>
                        <p className="text-white/75">{data.subtext}</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-[#DAA520] blur-3xl opacity-20" />
                    <div className="relative bg-white/[0.06] rounded-3xl p-8 border border-white/10 min-h-[400px] flex items-center justify-center">
                        <Printer className="w-32 h-32 text-[#DAA520]/60" />
                    </div>
                </div>
            </div>
        </section>
    )
}
