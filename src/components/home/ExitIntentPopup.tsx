"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

interface ExitIntentPopupProps {
    isQuoteSubmitted: boolean
}

export function ExitIntentPopup({ isQuoteSubmitted }: ExitIntentPopupProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (
                e.clientY <= 0 &&
                !isQuoteSubmitted &&
                !sessionStorage.getItem('exitIntentShown')
            ) {
                setOpen(true)
                sessionStorage.setItem('exitIntentShown', 'true')
            }
        }

        document.addEventListener('mouseleave', handleMouseLeave)
        return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, [isQuoteSubmitted])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `Message: ${formData.message}`,
                    source: 'Exit Intent Popup'
                })
            })

            if (response.ok) {
                toast.success("Message sent successfully!")
                setOpen(false)
                setFormData({ name: "", email: "", phone: "", message: "" })
            } else {
                toast.error("Failed to send message. Please try again.")
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-blue-900 uppercase text-center">
                        Wait! Don't Miss Out
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Get a free quote today and save up to 20% on your first order.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                    <textarea
                        name="message"
                        placeholder="Tell us what you need..."
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm resize-none"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-black uppercase py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isSubmitting ? "Sending..." : "Get My Free Quote"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                            No thanks, I don't need a discount
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
