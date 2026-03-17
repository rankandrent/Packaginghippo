import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const authors = await prisma.author.findMany({
            include: { _count: { select: { posts: true } } }
        })
        return NextResponse.json(authors)
    } catch (error) {
        console.error("GET /api/cms/authors error:", error)
        return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const author = await prisma.author.create({
            data: body
        })
        return NextResponse.json(author)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create author' }, { status: 500 })
    }
}

// PUT update an author
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...data } = body
        const author = await prisma.author.update({
            where: { id },
            data
        })
        return NextResponse.json(author)
    } catch (error) {
        console.error("PUT /api/cms/authors error:", error)
        return NextResponse.json({ error: 'Failed to update author' }, { status: 500 })
    }
}

// DELETE an author
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.author.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE /api/cms/authors error:", error)
        return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 })
    }
}
