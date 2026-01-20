import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET settings by key
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')

        if (key) {
            const setting = await prisma.siteSettings.findUnique({
                where: { key },
            })
            return NextResponse.json({ setting })
        }

        const settings = await prisma.siteSettings.findMany()
        return NextResponse.json({ settings })
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

// PUT update or create settings
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { key, value } = body

        const setting = await prisma.siteSettings.upsert({
            where: { key },
            update: {
                value,
                updatedAt: new Date(),
            },
            create: {
                key,
                value,
            },
        })

        return NextResponse.json({ setting })
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}
