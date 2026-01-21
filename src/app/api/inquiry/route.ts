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
                phone: body.phone ? String(body.phone) : null,
                message: body.message || null,
                type: body.type || 'quote',
                sourceUrl: body.sourceUrl || null,
                sourcePage: body.sourcePage || null,
                status: 'PENDING',
                // Explicitly mapping details if provided
                details: body.details || null,
                // These specific fields are also in the schema, let's populate them for convenience if available in details
                quantity: body.details?.quantity?.toString() || null,
                dimensions: body.details?.dimensions || null,
                material: body.details?.material || null,
                color: body.details?.color || null,
                turnaround: body.details?.turnaround || null,
            },
        })

        return NextResponse.json({ success: true, inquiry })
    } catch (error: any) {
        console.error('CRITICAL_API_ERROR (Inquiry):', error)
        return NextResponse.json({
            error: 'Failed to submit inquiry',
            details: error.message || 'Internal Server Error'
        }, { status: 500 })
    }
}
