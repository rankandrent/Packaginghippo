"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function HowItWorks({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="bg-yellow-500 py-24 text-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">{data.heading}</h2>
                    <p className="text-lg font-medium opacity-80">{data.text}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.subsections?.map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-yellow-400/50 border-2 border-black/10 p-8 rounded-2xl relative group hover:bg-white hover:shadow-xl transition-all duration-300"
                        >
                            <div className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                <Star className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-sm font-medium opacity-70 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
