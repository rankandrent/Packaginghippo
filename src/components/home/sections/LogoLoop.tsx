"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function LogoLoop({ data }: { data: any }) {
    if (!data || data.isActive === false) return null

    // Default placeholder logos if none provided
    const logos = data.items || [
        "Company 1", "Company 2", "Company 3", "Company 4", "Company 5",
        "Company 6", "Company 7", "Company 8"
    ]

    return (
        <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-4 text-center">
                {data.heading && (
                    <h3 className="text-xs font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4">
                        {data.heading}
                    </h3>
                )}
            </div>

            <div className="flex relative overflow-hidden">
                {/* Gradient Masks for smooth fade */}
                <div className="absolute left-0 top-0 z-10 h-full w-20 md:w-32 bg-gradient-to-r from-white to-transparent" />
                <div className="absolute right-0 top-0 z-10 h-full w-20 md:w-32 bg-gradient-to-l from-white to-transparent" />

                <motion.div
                    animate={{ x: ["0%", "-33.33%"] }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className="flex flex-none gap-10 md:gap-16 items-center py-4"
                >
                    {[...logos, ...logos, ...logos].map((logo: string | any, index: number) => (
                        <div key={index} className="flex items-center justify-center min-w-[100px] md:min-w-[140px] transition-all duration-500 hover:scale-110">
                            {typeof logo === 'string' && logo.startsWith('http') ? (
                                <div className="relative h-12 w-32 filter grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100">
                                    <Image
                                        src={logo}
                                        alt="Client Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <span className="text-lg md:text-xl font-black text-gray-300 hover:text-blue-900 transition-all duration-500 uppercase tracking-tighter opacity-50 hover:opacity-100 italic">
                                    {typeof logo === 'string' ? logo : logo.name}
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
