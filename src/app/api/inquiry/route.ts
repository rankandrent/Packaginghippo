import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        if (!body.name || !body.email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone || '',
                message: body.message || '',
                type: body.type || 'contact', // 'contact' or 'quote'
                details: body.details || {}, // Store dimensions, material etc here
                status: 'PENDING',
                createdAt: new Date(),
            },
        })

        return NextResponse.json({ success: true, inquiry })
    } catch (error) {
        console.error('Error creating inquiry:', error)
        return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
    }
}
