"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: ""
        }
    })

    async function onSubmit(values: z.infer<typeof contactSchema>) {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, type: 'contact' }),
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
                    <h1 className="text-3xl font-black text-gray-900">Message Sent!</h1>
                    <p className="text-gray-500">Thank you for contacting us. Our team will get back to you shortly.</p>
                    <Button onClick={() => setIsSuccess(false)} className="w-full bg-blue-900 hover:bg-blue-800">Send Another Message</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 md:pt-32">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Info Section */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-4 uppercase">Contact Us</h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Have questions about our custom packaging solutions? Reach out to our experts today.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-blue-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Phone</h3>
                                        <p className="text-gray-600">+1 845 379 9277</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-blue-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Email</h3>
                                        <p className="text-gray-600">sales@packaginghippo.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Address</h3>
                                        <p className="text-gray-600">123 Packaging Street, Industrial District, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                                    <input
                                        {...form.register("name")}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                                        placeholder="Your name"
                                    />
                                    {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                                    <input
                                        {...form.register("email")}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                                        placeholder="your@email.com"
                                    />
                                    {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Phone (Optional)</label>
                                    <input
                                        {...form.register("phone")}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                                        placeholder="Your phone number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Message</label>
                                    <textarea
                                        {...form.register("message")}
                                        rows={4}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                                        placeholder="How can we help you?"
                                    />
                                    {form.formState.errors.message && <p className="text-red-500 text-xs">{form.formState.errors.message.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/10"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
