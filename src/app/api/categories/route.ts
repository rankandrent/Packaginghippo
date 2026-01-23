import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

        const categories = await prisma.productCategory.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            take: limit,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                imageUrl: true,
            }
        })

        return NextResponse.json({ categories })
    } catch (error) {
        console.error('Error fetching public categories:', error)
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}
