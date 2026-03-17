import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all pages
export async function GET() {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { updatedAt: 'desc' },
        })
        return NextResponse.json({ pages })
    } catch (error) {
        console.error('Error fetching pages:', error)
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
    }
}

// POST create a new page
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, slug } = body

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content: null,
                isPublished: false,
            },
        })

        return NextResponse.json({ page })
    } catch (error) {
        console.error('Error creating page:', error)
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
    }
}

// PUT update a page
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, title, slug, content, seoTitle, seoDesc, seoKeywords, isPublished } = body

        const updated = await prisma.page.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                seoTitle,
                seoDesc,
                seoKeywords,
                isPublished,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({ page: updated })
    } catch (error) {
        console.error('Error updating page:', error)
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
    }
}

// DELETE a page
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        await prisma.page.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting page:', error)
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
    }
}
