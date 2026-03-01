import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET — Get all messages for a specific conversation
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        // Mark all visitor messages as read when agent opens conversation
        await prisma.chatMessage.updateMany({
            where: {
                conversationId: id,
                sender: 'visitor',
                isRead: false,
            },
            data: { isRead: true }
        })

        // Reset unread count
        await prisma.chatConversation.update({
            where: { id },
            data: { unreadCount: 0 }
        })

        const messages = await prisma.chatMessage.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: 'asc' }
        })

        const conversation = await prisma.chatConversation.findUnique({
            where: { id },
            select: { visitorName: true, visitorEmail: true, status: true, createdAt: true }
        })

        return NextResponse.json({ messages, conversation })
    } catch (error: any) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
