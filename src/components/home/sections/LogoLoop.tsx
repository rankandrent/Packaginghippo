"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function LogoLoop({ data }: { data: any }) {
    if (!data) return null

    // Default placeholder logos if none provided
    const logos = data.items || [
        "Company 1", "Company 2", "Company 3", "Company 4", "Company 5",
        "Company 6", "Company 7", "Company 8"
    ]

    return (
        <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                {data.heading && (
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                        {data.heading}
                    </h3>
                )}
            </div>

            <div className="flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-10 after:bg-gradient-to-l after:from-white after:to-transparent">
                <motion.div
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    initial={{ translateX: 0 }}
                    animate={{ translateX: "-50%" }}
                    className="flex flex-none gap-16 pr-16 items-center"
                >
                    {[...logos, ...logos].map((logo: string | any, index: number) => (
                        <div key={index} className="flex items-center justify-center min-w-[150px] grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                            {/* Support both image URLs and simple text placeholders */}
                            {typeof logo === 'string' && logo.startsWith('http') ? (
                                <div className="relative h-12 w-32">
                                    <Image
                                        src={logo}
                                        alt="Client Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <span className="text-xl font-black text-gray-400 hover:text-blue-900 transition-colors">
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
