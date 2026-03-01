import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET — Get messages for a conversation by visitorId (for the widget)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')
    const after = searchParams.get('after') // ISO timestamp to get only new messages

    if (!visitorId) {
        return NextResponse.json({ error: 'visitorId is required' }, { status: 400 })
    }

    try {
        const conversation = await prisma.chatConversation.findUnique({
            where: { visitorId }
        })

        if (!conversation) {
            return NextResponse.json({ messages: [], conversationId: null, status: null })
        }

        const where: any = { conversationId: conversation.id }
        if (after) {
            where.createdAt = { gt: new Date(after) }
        }

        const messages = await prisma.chatMessage.findMany({
            where,
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({
            messages,
            conversationId: conversation.id,
            status: conversation.status,
            assignedAgent: conversation.assignedAgent,
            rating: conversation.rating,
        })
    } catch (error: any) {
        console.error('Error fetching visitor messages:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
