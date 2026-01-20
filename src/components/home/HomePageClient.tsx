
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Box, CheckCircle, Palette, Printer, Star, Leaf, ShieldCheck, Clock, ChevronDown, Ruler, ShoppingCart } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { DEFAULT_HOME_DATA } from "@/lib/data/home-content"

type HomepageData = {
    hero: any
    intro: any
    services_list: any
    benefits: any
    how_it_works: any
    eco_friendly: any
    popular_products: any
    industries: any
    printing: any
    steps: any
    why_choose_us: any
    why_choose_us: any
    faq: any
    ordering_process: any
}

export default function HomePageClient({ data }: { data: HomepageData }) {
    // Safe access to data with fallbacks in case of missing keys
    const hero = data?.hero || DEFAULT_HOME_DATA.hero
    const intro = data?.intro || DEFAULT_HOME_DATA.intro
    const services = data?.services_list || DEFAULT_HOME_DATA.services_list
    const benefits = data?.benefits || DEFAULT_HOME_DATA.benefits
    const howItWorks = data?.how_it_works || DEFAULT_HOME_DATA.how_it_works
    const eco = data?.eco_friendly || DEFAULT_HOME_DATA.eco_friendly
    const popular = data?.popular_products || DEFAULT_HOME_DATA.popular_products
    const industries = data?.industries || DEFAULT_HOME_DATA.industries
    const printing = data?.printing || DEFAULT_HOME_DATA.printing
    const steps = data?.steps || DEFAULT_HOME_DATA.steps
    const whyUs = data?.why_choose_us || DEFAULT_HOME_DATA.why_choose_us
    const faq = data?.faq || DEFAULT_HOME_DATA.faq
    const orderingProcess = data?.ordering_process || DEFAULT_HOME_DATA.ordering_process

    return (
        <div className="flex flex-col min-h-screen">

            {/* HERO SECTION */}
            <section className="relative bg-zinc-950 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-zinc-950 to-zinc-950"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
                                {hero.heading || "Custom Packaging"} <br />
                                <span className="text-yellow-500">Your Customers Love.</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                                {hero.subheading || "Elevate your brand with premium custom boxes."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button variant="default" size="lg" className="text-lg px-8 py-6 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold" asChild>
                                    <Link href={hero.cta_link || "/quote"}>{hero.cta_text || "Get Custom Quote"} <ArrowRight className="ml-2 w-5 h-5" /></Link>
                                </Button>
                                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-gray-700 text-gray-300 hover:bg-gray-800" asChild>
                                    <Link href="/products">View All Products</Link>
                                </Button>
                            </div>
                            <div className="flex items-center gap-6 pt-8 text-gray-500 text-sm font-medium">
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> No Die & Plate Charges</div>
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Fast Turnaround</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-10 w-full aspect-square bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-3xl shadow-2xl shadow-yellow-500/20 transform rotate-[-5deg] flex items-center justify-center border-t border-white/20">
                                <Box className="w-48 h-48 text-black opacity-50" />
                                <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl transform rotate-[5deg] max-w-xs">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                                            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white" />
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">500+ Happy Clients</div>
                                    </div>
                                    <p className="text-xs text-gray-500">"Best packaging service we've used!"</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* INTRO SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900">{intro.heading}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">{intro.text}</p>
                </div>
            </section>

            {/* SERVICES LIST */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">{services.heading}</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {services.items?.map((item: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black">{benefits.heading}</h2>
                            <p className="text-lg text-gray-600">{benefits.intro}</p>
                            <div className="space-y-4 pt-4">
                                {benefits.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 bg-yellow-100 p-2 rounded-lg h-fit">
                                            <CheckCircle className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                            <p className="text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center p-12">
                            <Image src="/placeholder.svg" width={400} height={400} alt="Packaging Benefits" className="opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-yellow-500 py-24 text-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">{howItWorks.heading}</h2>
                        <p className="text-lg font-medium opacity-80">{howItWorks.text}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.subsections?.map((item: any, i: number) => (
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

            {/* ECO FRIENDLY */}
            <section className="py-24 bg-green-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                            <Leaf className="w-4 h-4" /> Eco-Friendly
                        </div>
                        <h2 className="text-4xl font-black mb-4">{eco.heading}</h2>
                        <p className="text-lg text-gray-600">{eco.text}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {eco.materials?.map((mat: any, i: number) => (
                            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-2 text-green-800">{mat.name}</h3>
                                    <p className="text-sm text-gray-500">{mat.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* POPULAR PRODUCTS */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">{popular.heading}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {popular.items?.map((item: any, i: number) => (
                            <Link href={`/services/${item.title?.toLowerCase().replace(/ /g, '-')}`} key={i}>
                                <Card className="group cursor-pointer hover:shadow-lg transition-all border-none shadow-sm h-full">
                                    <CardContent className="p-6">
                                        <div className="mb-4 bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                                            <PackageIcon className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRINTING SECTION */}
            <section className="py-24 bg-zinc-900 text-white">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-black mb-6 leading-tight">{printing.heading}</h2>
                        <p className="text-gray-400 text-lg mb-8">{printing.text}</p>

                        <div className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700">
                            <h3 className="text-2xl font-bold mb-2 text-white">{printing.subheading}</h3>
                            <p className="text-gray-400">{printing.subtext}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20" />
                        <div className="relative bg-zinc-800 rounded-3xl p-8 border border-zinc-700 min-h-[400px] flex items-center justify-center">
                            <Printer className="w-32 h-32 text-zinc-600" />
                        </div>
                    </div>
                </div>
            </section>

            {/* INDUSTRIES WE SERVE */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-black mb-12 text-center">{industries.heading || "Industries We Serve"}</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {industries.items?.map((ind: string, i: number) => (
                            <div key={i} className="px-6 py-4 bg-gray-50 rounded-xl text-lg font-bold text-gray-800 border hover:border-yellow-500 hover:bg-yellow-50 transition-all cursor-default">
                                {ind}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STEPS */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-black mb-16 text-center">{steps.heading}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.steps?.map((step: any, i: number) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border relative">
                                <div className="text-6xl font-black text-gray-100 absolute top-4 right-4 z-0">{i + 1}</div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2 text-yellow-600">{step.title}</h3>
                                    <p className="text-gray-600">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ORDERING PROCESS */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black mb-4">{orderingProcess.heading}</h2>
                    <p className="text-xl text-gray-600 mb-16">{orderingProcess.subheading}</p>

                    <div className="grid md:grid-cols-4 gap-8">
                        {orderingProcess.steps?.map((step: any, i: number) => {
                            const Icon =
                                step.icon === "Box" ? Box :
                                    step.icon === "Ruler" ? Ruler :
                                        step.icon === "Palette" ? Palette :
                                            step.icon === "ShoppingCart" ? ShoppingCart : Box

                            return (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-20 h-20 mb-6 relative">
                                        <div className="absolute inset-0 bg-yellow-100 rounded-2xl transform rotate-6"></div>
                                        <div className="absolute inset-0 bg-white border-2 border-black rounded-2xl flex items-center justify-center relative z-10">
                                            <Icon className="w-10 h-10 text-black" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed max-w-xs">{step.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-24 bg-black text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black mb-8 text-yellow-500">{whyUs.heading}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-12">{whyUs.text}</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyUs.points?.map((point: string, i: number) => (
                            <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center font-medium">
                                {point}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 bg-yellow-500 text-black text-center">
                <div className="container mx-auto px-4 max-w-3xl space-y-8">
                    <h2 className="text-5xl font-black tracking-tight">{hero?.cta_text ? "Ready to start?" : "Ready to Elevate Your Brand?"}</h2>
                    <p className="text-xl font-medium opacity-80">Get a competitive price quote for your custom packaging project today.</p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-10 h-14 rounded-full" asChild>
                            <Link href="/quote">Start Your Project</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-white text-lg px-10 h-14 rounded-full font-bold" asChild>
                            <Link href="/contact">Contact Support</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-4xl font-black text-center mb-16">{faq.heading}</h2>
                    <div className="space-y-4">
                        {faq.items?.map((item: any, i: number) => (
                            <FaqItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}


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

function PackageIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    )
}
