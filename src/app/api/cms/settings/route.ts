import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const settingSchema = z.object({
    key: z.string().min(1),
    value: z.any(),
})

// GET settings by key
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

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
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        
        // Validate input
        const validation = settingSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 })
        }

        const { key, value } = validation.data

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
        return NextResponse.json({ error: 'Failed to update settings', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}
