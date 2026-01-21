import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const authors = await prisma.author.findMany({
            include: { _count: { select: { posts: true } } }
        })
        return NextResponse.json(authors)
    } catch (error) {
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
