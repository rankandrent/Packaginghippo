import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const categorySlug = searchParams.get('category')
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

        if (!categorySlug) {
            // If no category, return all active products (e.g. for a general shop page)
            const products = await prisma.product.findMany({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    category: {
                        select: { name: true, slug: true }
                    }
                }
            })
            return NextResponse.json({ products })
        }

        // Fetch products for a specific category
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                category: {
                    slug: categorySlug
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                category: {
                    select: { name: true, slug: true }
                }
            }
        })

        return NextResponse.json({ products })
    } catch (error) {
        console.error('Error fetching public products:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}
