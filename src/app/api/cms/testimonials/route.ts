import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all testimonials or single by ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const activeOnly = searchParams.get('activeOnly') === 'true'

        if (id) {
            const testimonial = await prisma.testimonial.findUnique({
                where: { id }
            })
            if (!testimonial) {
                return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
            }
            return NextResponse.json({ testimonial })
        }

        const testimonials = await prisma.testimonial.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ testimonials })
    } catch (error) {
        console.error('Error fetching testimonials:', error)
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
    }
}

// POST create a new testimonial
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, role, content, rating, image, isActive } = body

        if (!name || !content) {
            return NextResponse.json({ error: 'Name and Content are required' }, { status: 400 })
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                role,
                content,
                rating: rating || 5,
                image,
                isActive: isActive ?? true
            }
        })

        return NextResponse.json({ testimonial })
    } catch (error) {
        console.error('Error creating testimonial:', error)
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
    }
}

// PUT update a testimonial
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, role, content, rating, image, isActive } = body

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        const updated = await prisma.testimonial.update({
            where: { id },
            data: {
                name,
                role,
                content,
                rating,
                image,
                isActive,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({ testimonial: updated })
    } catch (error) {
        console.error('Error updating testimonial:', error)
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
    }
}

// DELETE a testimonial
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        await prisma.testimonial.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting testimonial:', error)
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
    }
}
