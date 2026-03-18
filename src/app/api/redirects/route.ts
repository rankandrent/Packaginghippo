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

        // Normalize source URL: ensure it starts with / and is lowercased
        let formattedSource = sourceUrl.trim()
        if (!formattedSource.startsWith('/')) {
            formattedSource = `/${formattedSource}`
        }
        // Remove trailing slash (except root)
        if (formattedSource.length > 1 && formattedSource.endsWith('/')) {
            formattedSource = formattedSource.slice(0, -1)
        }
        formattedSource = formattedSource.toLowerCase()

        // Format target URL: keep external URLs as-is, only add / prefix for relative paths
        let formattedTarget = targetUrl.trim()
        if (!formattedTarget.startsWith('http') && !formattedTarget.startsWith('/')) {
            formattedTarget = `/${formattedTarget}`
        }

        // Check for duplicate source URL
        const existing = await prisma.redirect.findFirst({
            where: { sourceUrl: { equals: formattedSource, mode: 'insensitive' } }
        })
        if (existing) {
            return NextResponse.json({ error: "A redirect for this source URL already exists" }, { status: 409 })
        }

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
        console.error('Failed to create redirect:', error)
        return NextResponse.json({ error: 'Failed to create redirect' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, sourceUrl, targetUrl, type, isActive } = body

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const updateData: any = {}

        if (sourceUrl !== undefined) {
            let formattedSource = sourceUrl.trim()
            if (!formattedSource.startsWith('/')) formattedSource = `/${formattedSource}`
            if (formattedSource.length > 1 && formattedSource.endsWith('/')) {
                formattedSource = formattedSource.slice(0, -1)
            }
            updateData.sourceUrl = formattedSource.toLowerCase()
        }

        if (targetUrl !== undefined) {
            let formattedTarget = targetUrl.trim()
            if (!formattedTarget.startsWith('http') && !formattedTarget.startsWith('/')) {
                formattedTarget = `/${formattedTarget}`
            }
            updateData.targetUrl = formattedTarget
        }

        if (type !== undefined) updateData.type = parseInt(type) || 301
        if (isActive !== undefined) updateData.isActive = isActive

        const redirect = await prisma.redirect.update({
            where: { id },
            data: updateData
        })
        return NextResponse.json(redirect)
    } catch (error) {
        console.error('Failed to update redirect:', error)
        return NextResponse.json({ error: 'Failed to update redirect' }, { status: 500 })
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
