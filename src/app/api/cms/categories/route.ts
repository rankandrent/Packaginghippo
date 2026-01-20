import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.productCategory.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        })
        return NextResponse.json({ categories })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

// POST create a new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, slug, description } = body

        const category = await prisma.productCategory.create({
            data: {
                name,
                slug,
                description,
            },
        })

        return NextResponse.json({ category })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}

// PUT update a category
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, slug, description, imageUrl, seoTitle, seoDesc, order, isActive } = body

        const updated = await prisma.productCategory.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                imageUrl,
                seoTitle,
                seoDesc,
                order,
                isActive,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({ category: updated })
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }
}

// DELETE a category
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        await prisma.productCategory.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting category:', error)
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }
}
