"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Eye, Trash2, Loader2, X, MapPin, Mail, Phone, User, ShoppingBag } from "lucide-react"

interface OrderItem {
    id: string
    quantity: number
    priceAtTime: number
    product?: { name: string; slug: string }
}

interface Order {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    country: string
    subtotal: number
    totalAmount: number
    shippingCost: number
    taxAmount: number
    status: string
    paymentStatus: string
    items: OrderItem[]
    createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Order | null>(null)

    useEffect(() => { fetchOrders() }, [])

    async function fetchOrders() {
        try {
            const res = await fetch('/api/orders')
            if (res.ok) {
                const data = await res.json()
                setOrders(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this order?")) return
        try {
            const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== id))
                if (selected?.id === id) setSelected(null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500">Manage customer orders.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No orders yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className={`cursor-pointer hover:bg-blue-50/50 transition-colors ${selected?.id === order.id ? 'bg-blue-50' : ''}`}
                                    onClick={() => setSelected(selected?.id === order.id ? null : order)}
                                >
                                    <TableCell className="font-bold text-blue-600">#{order.orderNumber}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.items?.length || 0} items</TableCell>
                                    <TableCell className="font-bold">${(order.totalAmount || order.subtotal || 0).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {order.status || 'PENDING'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelected(selected?.id === order.id ? null : order)}
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(order.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Order Detail Panel */}
            {selected && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900">Order #{selected.orderNumber}</h2>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[selected.status] || 'bg-gray-100 text-gray-600'}`}>
                                {selected.status}
                            </span>
                        </div>
                        <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-widest">Customer</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{selected.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{selected.customerEmail}</span>
                                </div>
                                {selected.customerPhone && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{selected.customerPhone}</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-widest pt-2">Shipping Address</h3>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p>{selected.addressLine1}</p>
                                    {selected.addressLine2 && <p>{selected.addressLine2}</p>}
                                    <p>{selected.city}, {selected.state} {selected.zipCode}</p>
                                    <p>{selected.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items + Totals */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-widest">Items Ordered</h3>
                            {selected.items && selected.items.length > 0 ? (
                                <div className="space-y-2">
                                    {selected.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.product?.name || 'Product'}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.priceAtTime.toFixed(2)}</p>
                                            </div>
                                            <p className="font-bold text-gray-900">${(item.quantity * item.priceAtTime).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No items recorded</p>
                            )}

                            <div className="border-t pt-3 space-y-1 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${selected.subtotal?.toFixed(2)}</span>
                                </div>
                                {selected.shippingCost > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>${selected.shippingCost.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-black text-gray-900 text-base pt-1 border-t">
                                    <span>Total</span>
                                    <span className="text-blue-600">${(selected.totalAmount || selected.subtotal || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <span className="text-xs text-gray-500">Payment:</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${selected.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {selected.paymentStatus || 'UNPAID'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
