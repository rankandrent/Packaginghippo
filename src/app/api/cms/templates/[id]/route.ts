
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const template = await prisma.pageTemplate.findUnique({
            where: { id },
        })

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 })
        }

        return NextResponse.json({ template })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, sections } = body

        const template = await prisma.pageTemplate.update({
            where: { id },
            data: {
                name,
                sections,
            },
        })

        return NextResponse.json({ template })
    } catch (error) {
        console.error('Error updating template:', error)
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.pageTemplate.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
    }
}
