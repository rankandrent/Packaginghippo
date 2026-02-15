"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50 hover:bg-white transition-colors duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left"
            >
                <span className="font-bold text-lg text-gray-900">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function FAQ({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-4xl font-black text-center mb-16">{data.heading}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {data.items?.map((item: any, i: number) => (
                        <FaqItem key={i} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    )
}
