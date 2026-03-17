"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2, Eye, Trash2, Package, CheckCircle2, XCircle, Clock, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Order = {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone: string | null
    totalAmount: number
    status: string
    paymentStatus: string
    createdAt: string
    items: any[]
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        try {
            setLoading(true)
            const res = await fetch('/api/cms/orders')
            const data = await res.json()
            setOrders(data.orders || [])
        } catch (error) {
            console.error("Error fetching orders:", error)
            toast.error("Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    async function updateOrderStatus(orderId: string, updates: any) {
        try {
            setIsUpdating(true)
            const res = await fetch('/api/cms/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, ...updates }),
            })

            if (!res.ok) throw new Error('Failed to update')
            
            toast.success("Order updated successfully")
            setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o))
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, ...updates })
            }
        } catch (error) {
            console.error("Error updating order:", error)
            toast.error("Error updating order")
        } finally {
            setIsUpdating(false)
        }
    }

    async function deleteOrder(id: string) {
        if (!confirm("Are you sure you want to delete this order?")) return

        try {
            const res = await fetch(`/api/cms/orders?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')
            setOrders(orders.filter(o => o.id !== id))
            toast.success("Order deleted")
        } catch (error) {
            console.error("Error deleting order:", error)
            toast.error("Error deleting order")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
            case 'PROCESSING': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Package className="w-3 h-3 mr-1" /> Processing</Badge>
            case 'SHIPPED': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><Truck className="w-3 h-3 mr-1" /> Shipped</Badge>
            case 'DELIVERED': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>
            case 'CANCELLED': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground italic">Loading your orders...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight italic">Orders</h2>
                    <p className="text-muted-foreground">Manage your ecommerce transactions</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-bold">{order.orderNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.customerName}</span>
                                            <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Order Details: {order.orderNumber}</DialogTitle>
                                                    <DialogDescription>
                                                        Placed on {new Date(order.createdAt).toLocaleString()}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                
                                                {selectedOrder && (
                                                    <div className="grid gap-6 py-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <Label className="text-xs text-muted-foreground uppercase">Customer Info</Label>
                                                                <p className="font-bold">{selectedOrder.customerName}</p>
                                                                <p className="text-sm">{selectedOrder.customerEmail}</p>
                                                                <p className="text-sm">{selectedOrder.customerPhone || 'No phone'}</p>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs text-muted-foreground uppercase">Order Status</Label>
                                                                    <Select 
                                                                        disabled={isUpdating}
                                                                        value={selectedOrder.status} 
                                                                        onValueChange={(val) => updateOrderStatus(selectedOrder.id, { status: val })}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="PENDING">Pending</SelectItem>
                                                                            <SelectItem value="PROCESSING">Processing</SelectItem>
                                                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground uppercase">Order Items</Label>
                                                            <div className="border rounded-xl divide-y">
                                                                {selectedOrder.items?.map((item: any) => (
                                                                    <div key={item.id} className="p-3 flex justify-between items-center bg-gray-50/50">
                                                                        <div>
                                                                            <p className="font-bold">{item.product?.name || 'Product Details Not Found'}</p>
                                                                            <p className="text-xs text-muted-foreground italic">Qty: {item.quantity}</p>
                                                                        </div>
                                                                        <p className="font-black text-primary">${(item.priceAtTime * item.quantity).toFixed(2)}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-900 text-white p-4 rounded-2xl flex justify-between items-center">
                                                            <span className="font-bold text-lg">Total Amount</span>
                                                            <span className="font-black text-2xl">${selectedOrder.totalAmount.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                        
                                        <Button variant="ghost" size="icon" onClick={() => deleteOrder(order.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic">
                                        No orders found in the system.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
