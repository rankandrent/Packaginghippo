"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`border rounded-xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-[#DAA520]/40 bg-white' : 'border-gray-200 bg-[#F8F9FA] hover:bg-white'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left"
            >
                <span className="font-bold text-lg text-[#011f7b]">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#DAA520]' : 'text-gray-500'}`}
                />
            </button>
            <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-[#212529]/70 leading-relaxed">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function FAQ({ data }: { data: any }) {
    if (!data) return null

    return (
        <section className="section-py bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <span className="brand-eyebrow mb-3">FAQ</span>
                    <h2 className="text-4xl font-black text-[#011f7b] mt-3">{data.heading}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {data.items?.map((item: any, i: number) => (
                        <FaqItem key={i} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    )
}
