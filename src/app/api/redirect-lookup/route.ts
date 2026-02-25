import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const sourceUrl = searchParams.get('sourceUrl')

    if (!sourceUrl) {
        return NextResponse.json({ error: 'Missing sourceUrl' }, { status: 400 })
    }

    try {
        const redirect = await prisma.redirect.findUnique({
            where: { sourceUrl },
            select: { targetUrl: true, type: true, isActive: true }
        })

        if (!redirect || !redirect.isActive) {
            return NextResponse.json({ found: false })
        }

        return NextResponse.json({
            found: true,
            targetUrl: redirect.targetUrl,
            type: redirect.type
        })
    } catch (error) {
        console.error('Redirect lookup error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
