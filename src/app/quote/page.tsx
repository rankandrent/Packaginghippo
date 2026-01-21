"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

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
})

export default function QuotePage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

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
                    details: {
                        dimensions: `${values.width}x${values.length}x${values.depth} ${values.unit}`,
                        material: values.material,
                        color: values.color,
                        turnaround: values.turnaround,
                        quantity: values.quantity
                    }
                }),
            })

            if (!res.ok) throw new Error('Submission failed')
            setIsSuccess(true)
            form.reset()
        } catch (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center pt-24">
                <div className="text-center space-y-4 p-8 bg-white rounded-2xl shadow-sm border max-w-md mx-auto">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">Quote Requested!</h1>
                    <p className="text-gray-500">Thank you for your interest. Our packaging experts will review your request and contact you soon.</p>
                    <button onClick={() => setIsSuccess(false)} className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors">Request Another Quote</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-8 md:py-12 md:pt-28">
            <div className="container mx-auto px-4">

                {/* Compact Form Container */}
                <div className="max-w-3xl mx-auto bg-[#1a2b4b] rounded-lg shadow-xl overflow-hidden text-white">
                    <div className="text-center py-6 border-b border-white/10">
                        <h1 className="text-2xl font-bold uppercase tracking-wide">Get a Quote !</h1>
                    </div>

                    <div className="p-6 md:p-8">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                            {/* Row 1: Name & Email */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold flex gap-0.5">Name <span className="text-red-400">*</span></label>
                                    <input {...form.register("name")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Enter your name" />
                                    {form.formState.errors.name && <p className="text-red-300 text-[10px]">{form.formState.errors.name.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold flex gap-0.5">Email <span className="text-red-400">*</span></label>
                                    <input {...form.register("email")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Enter your email" />
                                    {form.formState.errors.email && <p className="text-red-300 text-[10px]">{form.formState.errors.email.message}</p>}
                                </div>
                            </div>

                            {/* Row 2: Phone */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold flex gap-0.5">Phone Number <span className="text-red-400">*</span></label>
                                <input {...form.register("phone")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Enter your phone number" />
                                {form.formState.errors.phone && <p className="text-red-300 text-[10px]">{form.formState.errors.phone.message}</p>}
                            </div>

                            {/* Row 3: Dimensions */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold flex gap-0.5">Width <span className="text-red-400">*</span></label>
                                    <input {...form.register("width")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Width" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold flex gap-0.5">Length <span className="text-red-400">*</span></label>
                                    <input {...form.register("length")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Length" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold flex gap-0.5">Depth <span className="text-red-400">*</span></label>
                                    <input {...form.register("depth")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Depth" />
                                </div>
                            </div>

                            {/* Row 4: Units & Material */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold flex gap-0.5">Units <span className="text-red-400">*</span></label>
                                    <select {...form.register("unit")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400">
                                        <option value="inch">Inch</option>
                                        <option value="cm">Cm</option>
                                        <option value="mm">Mm</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Select Material</label>
                                    <select {...form.register("material")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400">
                                        <option value="">Choose Option</option>
                                        <option value="cardstock">Cardstock</option>
                                        <option value="corrugated">Corrugated</option>
                                        <option value="kraft">Eco-Friendly Kraft</option>
                                        <option value="rigid">Rigid Board</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 5: Color & Turnaround */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Color Options</label>
                                    <select {...form.register("color")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400">
                                        <option value="">Choose Option</option>
                                        <option value="1-color">1 Color Print</option>
                                        <option value="4-color">4 Color CMYK</option>
                                        <option value="pantone">Pantone PMS</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Turn Around Time</label>
                                    <select {...form.register("turnaround")} className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400">
                                        <option value="">Choose Option</option>
                                        <option value="standard">Standard (8-10 Days)</option>
                                        <option value="rush">Rush (4-6 Days)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Quantity & File Upload */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold flex gap-0.5">Quantity <span className="text-red-400">*</span></label>
                                    <input {...form.register("quantity")} type="number" className="w-full p-2 text-sm rounded border-none text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Qty" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Upload Artwork</label>
                                    <div className="flex items-center gap-2 w-full p-1.5 bg-gray-100 rounded text-gray-900">
                                        <button type="button" className="bg-gray-200 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300 transition">Choose File</button>
                                        <span className="text-xs text-gray-500 truncate">No file</span>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-white">Message</label>
                                <textarea {...form.register("message")} rows={3} className="w-full p-2 text-sm rounded text-gray-900 bg-gray-100 outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Message..." />
                            </div>

                            {/* Submit */}
                            <div className="pt-2">
                                <Button type="submit" disabled={isSubmitting} variant="yellow" className="w-full py-2.5 text-sm font-bold uppercase tracking-wider shadow-md hover:bg-yellow-400 hover:scale-[1.01] transition-all">
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                    Submit Quote
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
