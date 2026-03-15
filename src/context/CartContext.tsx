"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  cart: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
      }
    }
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addItem = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === newItem.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      return [...prevCart, newItem]
    })
  }

  const removeItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
