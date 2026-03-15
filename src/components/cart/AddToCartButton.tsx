"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart, CartItem } from '@/context/CartContext'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
  }
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  className?: string
  showIcon?: boolean
}

export function AddToCartButton({ 
  product, 
  variant = "default", 
  className = "",
  showIcon = true
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    
    // Simulate a small delay for premium feel
    setTimeout(() => {
      addItem({
        ...product,
        quantity: 1
      })
      
      setIsAdding(false)
      setIsSuccess(true)
      toast.success(`${product.name} added to cart!`)
      
      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)
    }, 600)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      variant={variant}
      className={`relative overflow-hidden group transition-all duration-300 ${className} ${
        isSuccess ? "bg-green-600 hover:bg-green-700 text-white" : ""
      }`}
    >
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="adding"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adding...</span>
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Added!</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            {showIcon && <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            <span>Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
