import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

// GET all products or single by ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const categoryId = searchParams.get('categoryId')

        if (id) {
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: {
                        select: { name: true, slug: true }
                    }
                }
            })
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }
            return NextResponse.json({ product })
        }

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
        const { name, slug, categoryId, sections } = body

        if (!categoryId) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                categoryId,
                sections: sections || [], // Default to empty array
                images: [],
                isActive: false,
                isTopProduct: false,
            },
        })

        return NextResponse.json({ product })
    } catch (error: any) {
        console.error('Error creating product:', error)
        return NextResponse.json({
            error: 'Failed to create product',
            details: error.message
        }, { status: 500 })
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
            seoTitle, seoDesc, seoKeywords, descriptionCollapsedHeight, isActive, isTopProduct, sections
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
                seoKeywords,
                descriptionCollapsedHeight,
                isActive,
                isTopProduct,
                sections, // Save dynamic sections
                updatedAt: new Date(),
            },
        })

        // Revalidate the product page and listing
        revalidatePath(`/products/${slug}`)
        revalidatePath('/products')
        revalidatePath(`/services/${updated.categoryId}`) // Assuming we can get category slug, but revalidating path might fail if slug unknown. 
        // Better: revalidatePath('/', 'layout') wipes everything if needed, but specific is better.

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
