import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        // Dashboard CMS specific orders fetch
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit for dashboard view
        })
        return NextResponse.json(orders)
    } catch (error) {
        console.error('CMS Orders fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}
