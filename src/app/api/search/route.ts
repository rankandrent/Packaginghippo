import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query || query.length < 2) {
            return NextResponse.json({ products: [], categories: [], blogs: [] })
        }

        const [products, categories, blogs] = await Promise.all([
            prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { shortDesc: { contains: query, mode: 'insensitive' } }
                    ],
                    isActive: true
                },
                take: 5,
                select: { id: true, name: true, slug: true, images: true, category: { select: { slug: true } } }
            }),
            prisma.productCategory.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' },
                    isActive: true
                },
                take: 5,
                select: { id: true, name: true, slug: true, imageUrl: true }
            }),
            prisma.blogPost.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { excerpt: { contains: query, mode: 'insensitive' } }
                    ],
                    isPublished: true
                },
                take: 5,
                select: { id: true, title: true, slug: true, mainImage: true }
            })
        ])

        return NextResponse.json({ products, categories, blogs })
    } catch (error) {
        console.error('Search API error:', error)
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
    }
}
