"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, ChevronRight, Info } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number required"),
    width: z.string().min(1, "Width required"),
    length: z.string().min(1, "Length required"),
    depth: z.string().min(1, "Depth required"),
    unit: z.string(),
    material: z.string().optional(),
    color: z.string().optional(),
    turnaround: z.string().optional(),
    quantity: z.string().min(1, "Quantity is required"),
    message: z.string().optional(),
    hp_field: z.string().optional(),
})

interface QuoteFormProps {
    theme?: "light" | "dark"
    title?: string
    subtitle?: string
    showTitle?: boolean
    pageSource?: string
}

export function QuoteForm({
    theme = "dark",
    title = "Get a Instant Quote",
    subtitle = "Fill in the details below and get pricing within 24 hours.",
    showTitle = true,
    pageSource = "General"
}: QuoteFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [currentUrl, setCurrentUrl] = useState("")

    useEffect(() => {
        setCurrentUrl(window.location.href)
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unit: "inch",
            material: "",
            color: "",
            turnaround: ""
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
                    sourceUrl: currentUrl,
                    sourcePage: pageSource,
                    details: {
                        dimensions: `${values.width}x${values.length}x${values.depth} ${values.unit}`,
                        material: values.material,
                        color: values.color,
                        turnaround: values.turnaround,
                        quantity: values.quantity
                    }
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.details || errorData.error || 'Submission failed')
            }
            setIsSuccess(true)
            form.reset()
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className={cn(
                "w-full max-w-2xl mx-auto p-8 text-center space-y-4 rounded-2xl shadow-xl border animate-in fade-in zoom-in duration-300",
                theme === "dark" ? "bg-[#1a2b4b] text-white border-white/10" : "bg-white text-gray-900 border-gray-100"
            )}>
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Quote Requested Successfully!</h3>
                <p className={cn("text-sm max-w-xs mx-auto", theme === "dark" ? "text-gray-300" : "text-gray-500")}>
                    Our team of packaging experts will review your requirements and reach out within 24 hours.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="yellow" className="w-full mt-4 font-bold uppercase rounded-lg py-6">
                    Request Another Quote
                </Button>
            </div>
        )
    }

    const inputClasses = cn(
        "w-full p-3 text-sm rounded-lg border-none outline-none focus:ring-2 focus:ring-yellow-400 transition-all",
        theme === "dark" ? "bg-white/10 text-white placeholder:text-gray-400" : "bg-gray-100 text-gray-900 placeholder:text-gray-500"
    )

    const labelClasses = cn(
        "text-xs font-bold uppercase tracking-wider block mb-1.5",
        theme === "dark" ? "text-gray-300" : "text-gray-700"
    )

    return (
        <div className={cn(
            "w-full max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-700",
            theme === "dark" ? "bg-[#1a2b4b] text-white" : "bg-white text-gray-900"
        )}>
            {showTitle && (
                <div className={cn("p-6 text-center border-b", theme === "dark" ? "border-white/10" : "border-gray-100")}>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">{title}</h2>
                    <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-500")}>{subtitle}</p>
                </div>
            )}

            <div className="p-6 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className={cn("text-sm font-black uppercase tracking-widest border-l-4 border-yellow-500 pl-3 mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Contact Details</h4>
                            <div className="space-y-1.5">
                                <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                                <input {...form.register("name")} className={inputClasses} placeholder="John Doe" />
                                {form.formState.errors.name && <p className="text-red-400 text-[10px] font-bold mt-1 uppercase">{form.formState.errors.name.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                                <input {...form.register("email")} className={inputClasses} placeholder="email@company.com" />
                                {form.formState.errors.email && <p className="text-red-400 text-[10px] font-bold mt-1 uppercase">{form.formState.errors.email.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClasses}>Phone Number <span className="text-red-500">*</span></label>
                                <input {...form.register("phone")} className={inputClasses} placeholder="+1 (000) 000-0000" />
                                {form.formState.errors.phone && <p className="text-red-400 text-[10px] font-bold mt-1 uppercase">{form.formState.errors.phone.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClasses}>Quantity <span className="text-red-500">*</span></label>
                                <input {...form.register("quantity")} type="number" className={inputClasses} placeholder="Min 100 units" />
                                {form.formState.errors.quantity && <p className="text-red-400 text-[10px] font-bold mt-1 uppercase">{form.formState.errors.quantity.message}</p>}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <h4 className={cn("text-sm font-black uppercase tracking-widest border-l-4 border-yellow-500 pl-3 mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Specifications</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Width</label>
                                    <input {...form.register("width")} className={inputClasses} placeholder="W" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Length</label>
                                    <input {...form.register("length")} className={inputClasses} placeholder="L" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Depth</label>
                                    <input {...form.register("depth")} className={inputClasses} placeholder="D" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Unit</label>
                                    <select {...form.register("unit")} className={cn(inputClasses, "appearance-none")}>
                                        <option value="inch">Inch</option>
                                        <option value="cm">Cm</option>
                                        <option value="mm">Mm</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Material</label>
                                    <select {...form.register("material")} className={cn(inputClasses, "appearance-none")}>
                                        <option value="">Select Material</option>
                                        <option value="cardstock">Cardstock</option>
                                        <option value="corrugated">Corrugated</option>
                                        <option value="kraft">Eco-Kraft</option>
                                        <option value="rigid">Rigid Board</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Printing</label>
                                    <select {...form.register("color")} className={cn(inputClasses, "appearance-none")}>
                                        <option value="">None</option>
                                        <option value="1-color">1 Color</option>
                                        <option value="4-color">Full Color</option>
                                        <option value="pantone">PMS / Spot</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClasses}>Turnaround</label>
                                    <select {...form.register("turnaround")} className={cn(inputClasses, "appearance-none")}>
                                        <option value="standard">Standard</option>
                                        <option value="rush">Rush</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={labelClasses}>Any Additional Requirements?</label>
                        <textarea {...form.register("message")} rows={3} className={cn(inputClasses, "resize-none")} placeholder="Describe any special finishing, coatings, or design needs..." />
                    </div>

                    {/* Honeypot field (hidden) */}
                    <div className="hidden" aria-hidden="true">
                        <input {...form.register("hp_field")} type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="yellow"
                            className="w-full py-7 text-lg font-black uppercase tracking-widest shadow-2xl hover:bg-yellow-400 hover:scale-[1.01] transition-all group"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                            Send My Custom Quote <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <p className={cn("text-[10px] text-center mt-4 font-bold uppercase tracking-widest opacity-50", theme === "dark" ? "text-white" : "text-gray-900")}>
                            Secure Submission & Instant Processing
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
