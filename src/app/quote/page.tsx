"use client"

import { QuoteForm } from "@/components/forms/QuoteForm"
import { ShieldCheck, Truck, Clock, Sparkles, CheckCircle2 } from "lucide-react"

export default function QuotePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Premium Hero Header */}
            <div className="bg-[#1a2b4b] pt-32 pb-20 md:pt-40 md:pb-32 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500 text-black text-xs font-black uppercase tracking-widest mb-4">
                            Premium Packaging Solutions
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                            Tailored Packaging <br /> <span className="text-yellow-500">Fast & Affordable</span>
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                            Join 5,000+ brands worldwide who trust Packaging Hippo for high-quality,
                            custom-made boxes delivered with industry-leading speed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form & Trust Signals Section */}
            <div className="container mx-auto px-4 -mt-16 md:-mt-24 pb-20 relative z-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-start">

                    {/* The Form - Main Focus */}
                    <div className="lg:col-span-8">
                        <QuoteForm
                            theme="light"
                            title="Start your project"
                            subtitle="Provide your specifications below and our experts will handle the rest."
                            pageSource="Dedicated Quote Page"
                        />
                    </div>

                    {/* Trust Sidebar */}
                    <div className="lg:col-span-4 space-y-8 lg:pt-24">
                        <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black uppercase tracking-tight text-blue-900 border-b pb-4">Why Packaging Hippo?</h3>

                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-900 shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase">Lightning Fast Turnaround</h4>
                                    <p className="text-xs text-gray-500">Production in as little as 4-6 business days with rush options.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 shrink-0">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase">Premium Quality Print</h4>
                                    <p className="text-xs text-gray-500">Offset, digital, and flexographic printing with premium finishes.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-900 shrink-0">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase">Global Free Shipping</h4>
                                    <p className="text-xs text-gray-500">Enjoy free shipping on bulk orders across major locations.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600 shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase">Price Match Guarantee</h4>
                                    <p className="text-xs text-gray-500">Found a better price? We'll beat it without compromising quality.</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof Mini Card */}
                        <div className="bg-blue-900 p-8 rounded-2xl shadow-xl text-white space-y-4">
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500">★</div>)}
                            </div>
                            <p className="text-sm italic font-medium">"Packaging Hippo transformed our unboxing experience. The quality of the rigid boxes was beyond expectations!"</p>
                            <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                                <div className="w-8 h-8 rounded-full bg-gray-600" />
                                <div>
                                    <p className="text-xs font-bold uppercase">Johnathan R.</p>
                                    <p className="text-[10px] text-blue-300">CEO, TechStore Inc.</p>
                                </div>
                            </div>
                        </div>

                        {/* Guarantee List */}
                        <div className="space-y-3 px-2">
                            {["No Hidden Dies or Plate Charges", "Instant Proof Verification", "Free Design Support", "Eco-Friendly Materials"].map(item => (
                                <div key={item} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-900" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
