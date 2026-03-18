import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const sourceUrl = searchParams.get('sourceUrl')

    if (!sourceUrl) {
        return NextResponse.json({ error: 'Missing sourceUrl' }, { status: 400 })
    }

    try {
        // Normalize: remove trailing slash and lowercase
        const normalized = sourceUrl.length > 1 && sourceUrl.endsWith('/')
            ? sourceUrl.slice(0, -1)
            : sourceUrl
        const normalizedLower = normalized.toLowerCase()

        // Try exact match first (case-insensitive via stored normalized URLs)
        let redirect = await prisma.redirect.findFirst({
            where: {
                sourceUrl: { equals: normalizedLower, mode: 'insensitive' },
                isActive: true
            },
            select: { targetUrl: true, type: true }
        })

        // If not found, also try with trailing slash variant
        if (!redirect) {
            redirect = await prisma.redirect.findFirst({
                where: {
                    sourceUrl: { equals: normalizedLower + '/', mode: 'insensitive' },
                    isActive: true
                },
                select: { targetUrl: true, type: true }
            })
        }

        if (!redirect) {
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
