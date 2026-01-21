import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const categories = await prisma.blogCategory.findMany({
            include: { _count: { select: { posts: true } } }
        })
        return NextResponse.json(categories)
    } catch (error) {
        console.error("GET /api/cms/blog-categories error:", error)
        return NextResponse.json({ error: 'Failed to fetch blog categories' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const category = await prisma.blogCategory.create({
            data: body
        })
        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}

// PUT update a category
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...data } = body
        const category = await prisma.blogCategory.update({
            where: { id },
            data
        })
        return NextResponse.json(category)
    } catch (error) {
        console.error("PUT /api/cms/blog-categories error:", error)
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
}

// DELETE a category
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.blogCategory.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE /api/cms/blog-categories error:", error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
