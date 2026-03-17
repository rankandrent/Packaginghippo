import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { customer, items, subtotal, totalAmount, paymentMethod, notes } = body

        // Generate a random order number
        const orderNumber = `PH-${Math.floor(10000 + Math.random() * 90000)}`

        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                addressLine1: customer.address,
                addressLine2: customer.address2 || '',
                city: customer.city,
                state: customer.state,
                zipCode: customer.zip,
                country: customer.country || 'USA',
                subtotal: parseFloat(subtotal),
                totalAmount: parseFloat(totalAmount || subtotal),
                paymentMethod: paymentMethod || 'INQUIRY',
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                notes: notes || '',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: parseInt(item.quantity),
                        priceAtTime: parseFloat(item.price)
                    }))
                }
            },
            include: {
                items: true
            }
        })

        return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: order.id })
    } catch (error: any) {
        console.error('Error creating order:', error)
        return NextResponse.json({ error: 'Failed to place order', details: error.message }, { status: 500 })
    }
}
