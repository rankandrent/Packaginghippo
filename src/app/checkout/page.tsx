3/////////////÷÷÷÷÷/////////////////////////////"use client"

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingBag, ArrowLeft, Loader2, CheckCircle2, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, subtotal, clearCart, totalItems } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          subtotal,
          total: subtotal // For now, no tax/shipping logic
        })
      })

      if (!response.ok) throw new Error('Failed to place order')

      const data = await response.json()
      setOrderComplete(data.orderNumber)
      clearCart()
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-gray-900">Thank You!</h1>
            <p className="text-xl text-gray-600">Your order <span className="font-bold text-blue-600">#{orderComplete}</span> has been placed successfully.</p>
            <p className="text-gray-500">We've sent a confirmation email to <span className="font-medium text-gray-900">{formData.email}</span> with your order details.</p>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="h-14 px-8 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-8 rounded-2xl font-bold">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/products" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Form */}
            <div className="lg:col-span-7 space-y-8">
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</div>
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</Label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</Label>
                    <Input id="email" type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2 flex flex-col md:col-span-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">2</div>
                  Shipping Address
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col md:col-span-2">
                    <Label htmlFor="address" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Street Address</Label>
                    <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} placeholder="123 Packaging St" className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="city" className="text-xs font-bold text-gray-500 uppercase tracking-widest">City</Label>
                    <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} placeholder="New York" className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="state" className="text-xs font-bold text-gray-500 uppercase tracking-widest">State / Province</Label>
                    <Input id="state" name="state" required value={formData.state} onChange={handleInputChange} placeholder="NY" className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="zip" className="text-xs font-bold text-gray-500 uppercase tracking-widest">ZIP / Postal Code</Label>
                    <Input id="zip" name="zip" required value={formData.zip} onChange={handleInputChange} placeholder="10001" className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="country" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Country</Label>
                    <Input id="country" name="country" required value={formData.country} onChange={handleInputChange} className="h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl" />
                  </div>
                </div>
              </section>

              <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-200">
                <div className="flex items-start gap-4 text-white">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Ready to place your order?</h3>
                    <p className="text-blue-100 text-sm mt-1">By clicking the button below, your order will be processed and our team will start preparing your custom packaging solutions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-32">
                <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight italic">Order Summary</h2>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6 scrollbar-hide">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                          x{item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-blue-600 font-bold text-xs">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-black text-gray-900 text-sm italic">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {cart.length === 0 && <p className="text-center text-gray-400 py-8">Your cart is empty.</p>}
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-1 rounded">Calculated at production</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black text-gray-900 pt-3 border-t">
                    <span>Total</span>
                    <span className="text-blue-600 italic font-black">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg mt-8 shadow-xl shadow-blue-200 transition-all active:scale-95 group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Place Order Now</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </motion.div>
                    </div>
                  )}
                </Button>

                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-tighter">
                  Secure Checkout — SSL Encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
