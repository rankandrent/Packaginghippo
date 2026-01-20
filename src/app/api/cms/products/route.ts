import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const categoryId = searchParams.get('categoryId')

        const products = await prisma.product.findMany({
            where: categoryId ? { categoryId } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                category: {
                    select: { name: true, slug: true }
                }
            }
        })
        return NextResponse.json({ products })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

// POST create a new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, slug, categoryId } = body

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                categoryId,
                images: [],
            },
        })

        return NextResponse.json({ product })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}

// PUT update a product
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            id, name, slug, description, shortDesc,
            images, minOrder, price, categoryId,
            dimensions, materials, finishings,
            seoTitle, seoDesc, isActive
        } = body

        const updated = await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                shortDesc,
                images,
                minOrder,
                price,
                categoryId,
                dimensions,
                materials,
                finishings,
                seoTitle,
                seoDesc,
                isActive,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({ product: updated })
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

// DELETE a product
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
