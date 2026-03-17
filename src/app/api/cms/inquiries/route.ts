import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            const inquiry = await prisma.inquiry.findUnique({
                where: { id }
            })
            return NextResponse.json(inquiry)
        }

        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(inquiries)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, status } = body

        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: { status }
        })
        return NextResponse.json(inquiry)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.inquiry.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
    }
}
