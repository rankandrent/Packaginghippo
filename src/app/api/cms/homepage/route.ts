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
// POST create a new homepage section
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { sectionKey, title, order } = body

        // Defaults
        const content = body.content || {}
        const isActive = body.isActive !== undefined ? body.isActive : true

        // Get max order if not provided
        let newOrder = order
        if (newOrder === undefined) {
            const lastSection = await prisma.homepageSection.findFirst({
                orderBy: { order: 'desc' },
            })
            newOrder = (lastSection?.order || 0) + 1
        }

        const newSection = await prisma.homepageSection.create({
            data: {
                sectionKey,
                title: title || sectionKey.replace(/_/g, ' ').toUpperCase(),
                content,
                order: newOrder,
                isActive,
            },
        })

        return NextResponse.json({ section: newSection })
    } catch (error) {
        console.error('Error creating homepage section:', error)
        return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
    }
}
