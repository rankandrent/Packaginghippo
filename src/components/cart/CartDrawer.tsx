"use client"

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Trash2, Plus, Minus, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateQuantity, subtotal, totalItems } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white/95 backdrop-blur-md">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              Your Cart
              {totalItems > 0 && (
                <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 px-6">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-4"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <Button onClick={onClose} variant="outline" className="mt-4">
                  Continue Shopping
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 group"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-blue-600 font-bold mt-1 text-sm">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-gray-50 transition-colors border-r border-gray-100"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-900 min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-gray-50 transition-colors border-l border-gray-100"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                        <p className="font-black text-gray-900 text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-6 bg-gray-50/50 border-t flex-col space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900">
                <span>Total</span>
                <span className="text-blue-600">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest pt-2">
                Shipping and taxes calculated at checkout
              </p>
            </div>
            
            <div className="flex flex-col gap-3 pt-2">
              <Button asChild className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-blue-200/50">
                <Link href="/checkout" onClick={onClose} className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" onClick={onClose} className="font-bold text-gray-500 hover:text-gray-900">
                Continue Shopping
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
