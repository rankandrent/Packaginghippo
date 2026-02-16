
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // 'product' | 'category'

        const where = type ? { type } : {}

        const templates = await prisma.pageTemplate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ templates })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, type, sections } = body

        if (!name || !type) {
            return NextResponse.json({ error: 'Name and Type are required' }, { status: 400 })
        }

        const template = await prisma.pageTemplate.create({
            data: {
                name,
                type,
                sections: sections || [],
            },
        })

        return NextResponse.json({ template })
    } catch (error) {
        console.error('Error creating template:', error)
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
    }
}
