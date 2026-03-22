"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, ChevronRight, User, Mail, Phone, Package, MessageSquare, ChevronDown, Zap, Shield, Clock } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().optional(),
    quantity: z.string().min(1, "Quantity is required"),
    width: z.string().optional(),
    length: z.string().optional(),
    depth: z.string().optional(),
    unit: z.string(),
    stock: z.string().optional(),
    message: z.string().optional(),
    hp_field: z.string().optional(),
})

export function ProductHeroQuoteForm({ productSlug }: { productSlug: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { unit: "Inches", stock: "12pt Cardboard", quantity: "100" }
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
                    phone: values.phone || '',
                    type: 'quote',
                    message: values.message,
                    hp_field: values.hp_field,
                    sourceUrl: window.location.href,
                    sourcePage: `Product: ${productSlug}`,
                    details: {
                        dimensions: values.width ? `${values.width}x${values.length}x${values.depth} ${values.unit}` : 'Not specified',
                        material: values.stock,
                        quantity: values.quantity
                    }
                }),
            })
            if (!res.ok) throw new Error('Failed')
            setIsSuccess(true)
            form.reset()
        } catch {
            alert("Submission failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-white border-2 border-green-400 rounded-2xl p-10 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-100">
                    <CheckCircle2 className="w-9 h-9 text-green-500" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900">Quote Request Sent!</h3>
                    <p className="text-gray-500 text-sm mt-1">We'll email your pricing within 2 hours.</p>
                </div>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full rounded-xl py-5 font-bold text-gray-600">
                    Submit Another Request
                </Button>
            </div>
        )
    }

    const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm py-3 px-3 pl-10 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
    const labelClass = "text-xs font-semibold text-gray-700 mb-1.5 block"
    const iconClass = "absolute left-3 top-[34px] w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none"

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-black text-lg leading-tight">Get Your Free Quote</h2>
                    <p className="text-blue-200 text-xs mt-0.5">No commitment · 100% free · Fast turnaround</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 shrink-0">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-bold">Reply in 2hrs</span>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Name + Email */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group">
                            <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                            <User className={iconClass} />
                            <input {...form.register("name")} placeholder="John Smith" className={inputClass} />
                            {form.formState.errors.name && (
                                <p className="text-red-500 text-[10px] mt-0.5 ml-0.5">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="relative group">
                            <label className={labelClass}>Email Address <span className="text-red-400">*</span></label>
                            <Mail className={iconClass} />
                            <input {...form.register("email")} placeholder="you@company.com" className={inputClass} />
                            {form.formState.errors.email && (
                                <p className="text-red-500 text-[10px] mt-0.5 ml-0.5">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Phone + Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group">
                            <label className={labelClass}>
                                Phone <span className="text-gray-400 font-normal text-[10px]">(optional)</span>
                            </label>
                            <Phone className={iconClass} />
                            <input {...form.register("phone")} placeholder="+1 (000) 000-0000" className={inputClass} />
                        </div>
                        <div className="relative group">
                            <label className={labelClass}>Quantity <span className="text-red-400">*</span></label>
                            <Package className={iconClass} />
                            <input {...form.register("quantity")} type="number" min="1" placeholder="e.g. 500" className={inputClass} />
                            {form.formState.errors.quantity && (
                                <p className="text-red-500 text-[10px] mt-0.5 ml-0.5">{form.formState.errors.quantity.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Optional Details Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors px-4 py-2.5 rounded-xl border border-blue-100"
                    >
                        <span>
                            + Add Dimensions & Material
                            <span className="text-blue-400 font-normal ml-1">(optional — helps us quote faster)</span>
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", showDetails && "rotate-180")} />
                    </button>

                    {showDetails && (
                        <div className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                            <div>
                                <label className={labelClass}>Box Dimensions (W × L × D)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    <input {...form.register("width")} placeholder="W" className="w-full bg-white border border-gray-200 text-sm py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none placeholder:text-gray-400" />
                                    <input {...form.register("length")} placeholder="L" className="w-full bg-white border border-gray-200 text-sm py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none placeholder:text-gray-400" />
                                    <input {...form.register("depth")} placeholder="D" className="w-full bg-white border border-gray-200 text-sm py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none placeholder:text-gray-400" />
                                    <select {...form.register("unit")} className="w-full bg-white border border-gray-200 text-sm py-2.5 px-2 rounded-xl outline-none cursor-pointer text-gray-700">
                                        <option value="Inches">in</option>
                                        <option value="CM">cm</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Material Stock</label>
                                <select {...form.register("stock")} className="w-full bg-white border border-gray-200 text-gray-700 text-sm py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer">
                                    <option value="12pt Cardboard">12pt Cardboard (Standard)</option>
                                    <option value="14pt Cardboard">14pt Cardboard (Premium)</option>
                                    <option value="Rigid">Luxury Rigid</option>
                                    <option value="Kraft">Eco-Kraft</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    <div className="relative group">
                        <label className={labelClass}>
                            Special Requirements <span className="text-gray-400 font-normal text-[10px]">(optional)</span>
                        </label>
                        <MessageSquare className={iconClass} />
                        <input {...form.register("message")} placeholder="Printing style, finish, custom artwork..." className={inputClass} />
                    </div>

                    {/* Honeypot */}
                    <div className="hidden" aria-hidden="true">
                        <input {...form.register("hp_field")} type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    {/* Trust pills */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { icon: Zap, label: "2hr Response" },
                            { icon: Shield, label: "100% Free" },
                            { icon: Clock, label: "10–12 Day Lead" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-2 justify-center border border-gray-100">
                                <Icon className="w-3 h-3 text-blue-500 shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-xl shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all text-base border-b-4 border-blue-800 hover:border-blue-900"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            <>Get My Free Quote <ChevronRight className="w-5 h-5 ml-1" /></>
                        )}
                    </Button>

                    <p className="text-center text-[10px] text-gray-400">
                        ⭐⭐⭐⭐⭐ Trusted by 5,000+ businesses · No spam, ever
                    </p>
                </form>
            </div>
        </div>
    )
}
