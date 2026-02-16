import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const count = await prisma.inquiry.count({
            where: {
                status: 'PENDING'
            }
        })

        return NextResponse.json({ count })
    } catch (error) {
        console.error('Error fetching inquiry count:', error)
        return NextResponse.json({ count: 0 }, { status: 500 })
    }
}
