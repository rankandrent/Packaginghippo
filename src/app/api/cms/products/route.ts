import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all products or single product by ?id=
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            const product = await prisma.product.findUnique({
                where: { id },
                include: { category: { select: { name: true, slug: true } } }
            })
            if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            return NextResponse.json({ product })
        }

        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: { name: true, slug: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json({ products })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

// POST create or clone a product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, slug, categoryId, templateId, cloneFromId } = body

        if (cloneFromId) {
            const source = await prisma.product.findUnique({
                where: { id: cloneFromId }
            })
            if (!source) {
                return NextResponse.json({ error: 'Source product not found' }, { status: 404 })
            }
            const product = await prisma.product.create({
                data: {
                    name,
                    slug,
                    description: source.description,
                    shortDesc: source.shortDesc,
                    images: source.images,
                    minOrder: source.minOrder,
                    price: source.price,
                    categoryId: source.categoryId,
                    relatedProductIds: source.relatedProductIds,
                    dimensions: source.dimensions,
                    materials: source.materials,
                    finishings: source.finishings,
                    content: source.content,
                    sections: source.sections,
                    layout: source.layout,
                    seoTitle: source.seoTitle,
                    seoDesc: source.seoDesc,
                    seoKeywords: source.seoKeywords,
                    tabs: source.tabs,
                    isEcommerce: source.isEcommerce,
                    ecommercePrice: source.ecommercePrice,
                    stockStatus: source.stockStatus,
                    isActive: false,
                },
            })
            return NextResponse.json({ product })
        }

        let initialSections: any[] = []
        if (templateId) {
            const template = await prisma.pageTemplate.findUnique({
                where: { id: templateId }
            })
            if (template) {
                initialSections = template.sections as any[]
            }
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                categoryId,
                sections: initialSections,
                isActive: false,
            },
        })

        return NextResponse.json({ product })
    } catch (error: any) {
        console.error('Error creating product:', error)
        return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 })
    }
}

// PUT update a product
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        // Strip non-schema fields that come from include() in GET (e.g. nested category object)
        const { id, category, createdAt, ...data } = body

        const updated = await prisma.product.update({
            where: { id },
            data: {
                ...data,
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
