import Image from "next/image"
import { getSeoImageUrl } from "@/lib/image-seo"
import { CheckCircle } from "lucide-react"

export function Benefits({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="section-py bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-[#011f7b]">{data.heading}</h2>
                        <p className="text-lg text-[#212529]/70">{data.intro}</p>
                        <div className="space-y-4 pt-4">
                            {data.items?.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 bg-[#DAA520]/15 p-2 rounded-lg h-fit">
                                        <CheckCircle className="w-5 h-5 text-[#DAA520]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#011f7b]">{item.title}</h3>
                                        <p className="text-[#212529]/70">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center p-4 overflow-hidden">
                        {data.image ? (
                            <div className="relative h-full w-full">
                                <Image
                                    src={getSeoImageUrl(data.image)}
                                    alt={data.heading || "Benefits"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover rounded-xl"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                                Placeholder Image
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
