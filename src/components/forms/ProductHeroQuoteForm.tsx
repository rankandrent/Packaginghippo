"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, ChevronRight, User, Mail, Phone, Maximize2, Layers, Briefcase, FileText } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Invalid phone"),
    width: z.string().min(1, "W required"),
    length: z.string().min(1, "L required"),
    depth: z.string().min(1, "D required"),
    unit: z.string(),
    stock: z.string().optional(),
    quantity: z.string().min(1, "Qty required"),
    message: z.string().optional(),
    hp_field: z.string().optional(),
})

export function ProductHeroQuoteForm({ productSlug }: { productSlug: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unit: "Inches",
            stock: "12pt Cardboard",
            quantity: "100"
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    type: 'quote',
                    message: values.message,
                    hp_field: values.hp_field,
                    sourceUrl: window.location.href,
                    sourcePage: `Product: ${productSlug}`,
                    details: {
                        dimensions: `${values.width}x${values.length}x${values.depth} ${values.unit}`,
                        material: values.stock,
                        quantity: values.quantity
                    }
                }),
            })
            if (!res.ok) throw new Error('Failed')
            setIsSuccess(true)
            form.reset()
        } catch (error) {
            alert("Submission failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-white border-2 border-green-500 rounded-[2rem] p-10 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-100">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Success!</h3>
                    <p className="text-gray-500 font-medium">Your quote request has been sent.</p>
                </div>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 font-black rounded-xl py-6 tracking-widest">
                    REQUEST ANOTHER
                </Button>
            </div>
        )
    }

    const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs py-3 px-3 pl-10 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
    const labelClass = "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1 block"
    const iconClass = "absolute left-3.5 top-[36px] w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors"

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 select-none relative overflow-visible">
            {/* Attractive Floating Badge */}
            <div className="absolute -top-4 -right-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-[10px] font-black px-5 py-2 rounded-full shadow-lg uppercase tracking-wider animate-pulse z-10 border border-white/20">
                ⭐ Top Rated Service
            </div>

            <div className="relative">
                <div className="mb-8">
                    <h2 className="text-gray-900 font-black text-3xl uppercase tracking-tighter leading-none mb-2">
                        Get Your Quote
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-blue-500 rounded-full" />
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Personalized Pricing in 24h</p>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className={labelClass}>Full Name *</label>
                            <User className={iconClass} />
                            <input {...form.register("name")} placeholder="Your Name" className={inputClass} />
                        </div>
                        <div className="relative group">
                            <label className={labelClass}>Email Address *</label>
                            <Mail className={iconClass} />
                            <input {...form.register("email")} placeholder="email@company.com" className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className={labelClass}>Phone *</label>
                            <Phone className={iconClass} />
                            <input {...form.register("phone")} placeholder="+1 (000) 000-0000" className={inputClass} />
                        </div>
                        <div className="relative group">
                            <label className={labelClass}>Quantity *</label>
                            <Briefcase className={iconClass} />
                            <input {...form.register("quantity")} placeholder="Min 100" type="number" className={inputClass} />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className={labelClass}>Dimensions (Width, Length, Depth)</label>
                        <Maximize2 className={iconClass} />
                        <div className="grid grid-cols-4 gap-2">
                            <div className="col-span-1">
                                <input {...form.register("width")} placeholder="W" className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs py-3 px-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none pl-10" />
                            </div>
                            <input {...form.register("length")} placeholder="L" className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs py-3 px-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            <input {...form.register("depth")} placeholder="D" className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs py-3 px-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            <select {...form.register("unit")} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs py-3 px-1 rounded-xl focus:bg-white outline-none cursor-pointer">
                                <option value="Inches">Inches</option>
                                <option value="CM">CM</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className={labelClass}>Material Stock</label>
                            <Layers className={iconClass} />
                            <select {...form.register("stock")} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs py-3 px-3 pl-10 rounded-xl focus:bg-white outline-none cursor-pointer appearance-none">
                                <option value="12pt Cardboard">12pt Cardboard Stock</option>
                                <option value="14pt Cardboard">14pt Cardboard Stock</option>
                                <option value="Rigid">Luxury Rigid Stock</option>
                                <option value="Kraft">Eco-Kraft Stock</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <label className={labelClass}>Additional Info</label>
                            <FileText className={iconClass} />
                            <input {...form.register("message")} placeholder="Any specific requirements?" className={inputClass} />
                        </div>
                    </div>

                    {/* Honeypot field (hidden) */}
                    <div className="hidden" aria-hidden="true">
                        <input {...form.register("hp_field")} type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-8 rounded-2xl shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all mt-6 tracking-[0.1em] flex items-center justify-center gap-3 text-base border-b-4 border-blue-800 hover:border-blue-900 active:border-b-0"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                            <>
                                Claim My Free Quote
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>

                    <div className="flex flex-col items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            Trusted by 5,000+ businesses worldwide
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
