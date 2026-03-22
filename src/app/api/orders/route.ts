import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: { select: { name: true, slug: true } }
                    }
                }
            }
        })
        return NextResponse.json(orders)
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {
            customerName, customerEmail, customerPhone,
            addressLine1, addressLine2, city, state, zipCode, country,
            subtotal, shippingCost, taxAmount, totalAmount,
            status, paymentStatus, items
        } = body

        // Resolve product IDs from slugs
        const resolvedItems: { productId: string, quantity: number, priceAtTime: number }[] = []
        if (Array.isArray(items)) {
            for (const item of items) {
                const slug = item.slug || item.productId
                let productId = item.productId

                // If slug provided (not a MongoDB ObjectId), look up the real ID
                if (slug && !/^[a-f\d]{24}$/i.test(slug)) {
                    const product = await prisma.product.findFirst({ where: { slug }, select: { id: true } })
                    if (product) productId = product.id
                }

                if (productId && /^[a-f\d]{24}$/i.test(productId)) {
                    resolvedItems.push({
                        productId,
                        quantity: parseInt(item.quantity) || 1,
                        priceAtTime: parseFloat(item.price) || 0,
                    })
                }
            }
        }

        const order = await prisma.order.create({
            data: {
                orderNumber: `PH-${Date.now().toString().slice(-6)}`,
                customerName: customerName || "Unknown",
                customerEmail: customerEmail || "unknown@example.com",
                customerPhone,
                addressLine1: addressLine1 || "N/A",
                addressLine2,
                city: city || "N/A",
                state: state || "N/A",
                zipCode: zipCode || "N/A",
                country: country || "USA",
                subtotal: parseFloat(subtotal) || 0,
                shippingCost: parseFloat(shippingCost) || 0,
                taxAmount: parseFloat(taxAmount) || 0,
                totalAmount: parseFloat(totalAmount) || 0,
                status: status || 'PENDING',
                paymentStatus: paymentStatus || 'UNPAID',
                ...(resolvedItems.length > 0 && {
                    items: { create: resolvedItems }
                }),
            },
            include: {
                items: true
            }
        })
        return NextResponse.json(order)
    } catch (error) {
        console.error('Failed to create order:', error)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.order.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete order:', error)
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }
}
