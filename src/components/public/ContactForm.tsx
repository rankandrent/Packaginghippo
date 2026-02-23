"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export function ContactForm() {
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
            <div className="text-center space-y-4 p-8 bg-white rounded-2xl shadow-sm border h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Message Sent!</h2>
                <p className="text-gray-500">Thank you for contacting us. Our team will get back to you shortly.</p>
                <Button onClick={() => setIsSuccess(false)} className="w-full max-w-xs bg-blue-900 hover:bg-blue-800 mt-4 outline-none">
                    Send Another Message
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex-1 h-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col h-full justify-between">
                <div className="space-y-4">
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

                    <div className="space-y-2 flex-grow flex flex-col">
                        <label className="text-sm font-bold text-gray-700">Message</label>
                        <textarea
                            {...form.register("message")}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition flex-grow min-h-[120px] resize-none"
                            placeholder="How can we help you?"
                        />
                        {form.formState.errors.message && <p className="text-red-500 text-xs mt-1">{form.formState.errors.message.message}</p>}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 mt-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/10 outline-none"
                >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Send Message
                </Button>
            </form>
        </div>
    )
}
