import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all homepage sections
export async function GET() {
    try {
        const sections = await prisma.homepageSection.findMany({
            orderBy: { order: 'asc' },
        })
        return NextResponse.json({ sections })
    } catch (error) {
        console.error('Error fetching homepage sections:', error)
        return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
    }
}

// PUT update a homepage section
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, content, isActive } = body

        const updated = await prisma.homepageSection.update({
            where: { id },
            data: {
                content,
                isActive,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({ section: updated })
    } catch (error) {
        console.error('Error updating homepage section:', error)
        return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
    }
}
