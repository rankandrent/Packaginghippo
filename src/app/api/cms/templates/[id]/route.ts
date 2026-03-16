import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
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
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
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
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { id } = await params
        await prisma.pageTemplate.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
    }
}
