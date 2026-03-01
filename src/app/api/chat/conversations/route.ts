import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET — List all conversations for dashboard
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    try {
        const where: any = {}
        if (status !== 'all') {
            where.status = status
        }

        const conversations = await prisma.chatConversation.findMany({
            where,
            orderBy: { lastMessageAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // Only get the last message for preview
                }
            }
        })

        return NextResponse.json({ conversations })
    } catch (error: any) {
        console.error('Error fetching conversations:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PATCH — Update conversation status (close / reopen)
export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, status } = body

        const conversation = await prisma.chatConversation.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json({ conversation })
    } catch (error: any) {
        console.error('Error updating conversation:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
