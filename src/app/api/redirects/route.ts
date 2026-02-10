import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const redirects = await prisma.redirect.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(redirects)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch redirects' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { sourceUrl, targetUrl, type, isActive } = body

        // Basic Validation
        if (!sourceUrl || !targetUrl) {
            return NextResponse.json({ error: "Source and Target URLs are required" }, { status: 400 })
        }

        // Ensure source starts with /
        const formattedSource = sourceUrl.startsWith('/') ? sourceUrl : `/${sourceUrl}`
        const formattedTarget = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`

        const redirect = await prisma.redirect.create({
            data: {
                sourceUrl: formattedSource,
                targetUrl: formattedTarget,
                type: parseInt(type) || 301,
                isActive: isActive ?? true
            }
        })
        return NextResponse.json(redirect)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create redirect' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.redirect.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete redirect' }, { status: 500 })
    }
}
