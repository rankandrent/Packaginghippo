"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Truck } from "lucide-react"
import { ExitIntentPopup } from "./ExitIntentPopup"

interface CustomQuoteFormSectionProps {
    image?: string
}

export function CustomQuoteFormSection({ image }: CustomQuoteFormSectionProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        quantity: "",
        color: "",
        productName: "",
        length: "",
        width: "",
        depth: "",
        unit: "inch",
        message: "",
        hp_field: "",
        captcha: ""
    })

    const [captchaQuestion] = useState(() => {
        const num1 = Math.floor(Math.random() * 10) + 1
        const num2 = Math.floor(Math.random() * 10) + 1
        return { num1, num2, answer: num1 + num2 }
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate captcha
        if (parseInt(formData.captcha) !== captchaQuestion.answer) {
            toast.error("Incorrect answer. Please try again.")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `Product: ${formData.productName}
Quantity: ${formData.quantity}
Color: ${formData.color}
Size: ${formData.length} x ${formData.width} x ${formData.depth} ${formData.unit}

Message: ${formData.message}`,
                    hp_field: formData.hp_field,
                    source: 'Homepage Custom Quote'
                })
            })

            if (response.ok) {
                setIsSubmitted(true)
                toast.success("Quote request submitted successfully!")
                // Reset form
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    quantity: "",
                    color: "",
                    productName: "",
                    length: "",
                    width: "",
                    depth: "",
                    unit: "inch",
                    message: "",
                    hp_field: "",
                    captcha: ""
                })
            } else {
                toast.error("Failed to submit. Please try again.")
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Form */}
                    <div className="lg:col-span-8 bg-white rounded-2xl shadow-xl p-8 border min-h-[500px] flex flex-col justify-center">
                        {isSubmitted ? (
                            <div className="text-center space-y-6 py-12">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-blue-900 uppercase">Thank You!</h2>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Your quote request has been received. Our team will review your requirements and get back to you shortly with a competitive price.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold uppercase rounded-lg transition-all"
                                >
                                    Submit Another Quote
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-black text-blue-900 uppercase">
                                        Get Custom Quote
                                    </h2>
                                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                                        <Truck className="w-4 h-4 text-blue-900" />
                                        <span className="text-xs font-bold text-blue-900 uppercase">Free Shipping</span>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Row 1: Name, Phone, Email */}
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone No"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                        />
                                    </div>

                                    {/* Row 2: Qty, Color, Product */}
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <input
                                            type="number"
                                            name="quantity"
                                            placeholder="Quantity"
                                            required
                                            min="1"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                        />
                                        <select
                                            name="color"
                                            required
                                            value={formData.color}
                                            onChange={handleChange}
                                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm bg-white"
                                        >
                                            <option value="">Select Color</option>
                                            <option value="CMYK">CMYK</option>
                                            <option value="PMS">PMS</option>
                                            <option value="Black">Black</option>
                                            <option value="White">White</option>
                                            <option value="Custom">Custom Color</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="productName"
                                            placeholder="Product Name"
                                            required
                                            value={formData.productName}
                                            onChange={handleChange}
                                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                        />
                                    </div>

                                    {/* Row 3: Size */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase">Size:</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            <input
                                                type="number"
                                                name="length"
                                                placeholder="L"
                                                required
                                                min="0"
                                                step="0.1"
                                                value={formData.length}
                                                onChange={handleChange}
                                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                            />
                                            <input
                                                type="number"
                                                name="width"
                                                placeholder="W"
                                                required
                                                min="0"
                                                step="0.1"
                                                value={formData.width}
                                                onChange={handleChange}
                                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                            />
                                            <input
                                                type="number"
                                                name="depth"
                                                placeholder="D"
                                                required
                                                min="0"
                                                step="0.1"
                                                value={formData.depth}
                                                onChange={handleChange}
                                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                            />
                                            <select
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleChange}
                                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm bg-white"
                                            >
                                                <option value="inch">inch</option>
                                                <option value="cm">cm</option>
                                                <option value="mm">mm</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <textarea
                                        name="message"
                                        placeholder="Write short message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm resize-none"
                                    />

                                    {/* Honeypot field (hidden) */}
                                    <div className="hidden" aria-hidden="true">
                                        <input
                                            type="text"
                                            name="hp_field"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={formData.hp_field}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Captcha */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                            <span className="font-bold text-blue-900">{captchaQuestion.num1}</span>
                                            <span className="text-gray-600">+</span>
                                            <span className="font-bold text-blue-900">{captchaQuestion.num2}</span>
                                            <span className="text-gray-600">=</span>
                                            <input
                                                type="number"
                                                name="captcha"
                                                placeholder="?"
                                                required
                                                value={formData.captcha}
                                                onChange={handleChange}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">(Are you human?)</span>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-black uppercase py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    {/* Right: Image */}
                    <div className="lg:col-span-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-xl overflow-hidden min-h-[400px] h-full relative">
                        {image ? (
                            <Image
                                src={image}
                                alt="Custom Quote"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full p-8">
                                <div className="text-center text-white/60">
                                    <p className="text-sm font-medium">Upload an image from the dashboard</p>
                                    <p className="text-xs mt-2">Go to Homepage Sections → Custom Quote Form</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ExitIntentPopup isQuoteSubmitted={isSubmitted} />
        </section>
    )
}
