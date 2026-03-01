import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST — Send a message (from visitor or agent)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { visitorId, visitorName, visitorEmail, content, sender, agentName, conversationId } = body

        if (!content || !sender) {
            return NextResponse.json({ error: 'content and sender are required' }, { status: 400 })
        }

        let convoId = conversationId

        // If visitor is sending and no conversationId, find or create conversation
        if (sender === 'visitor') {
            if (!visitorId || !visitorName) {
                return NextResponse.json({ error: 'visitorId and visitorName are required for visitors' }, { status: 400 })
            }

            let conversation = await prisma.chatConversation.findUnique({
                where: { visitorId }
            })

            if (!conversation) {
                conversation = await prisma.chatConversation.create({
                    data: {
                        visitorId,
                        visitorName,
                        visitorEmail: visitorEmail || null,
                    }
                })
            }

            convoId = conversation.id

            // Increment unread count for agents
            await prisma.chatConversation.update({
                where: { id: convoId },
                data: {
                    unreadCount: { increment: 1 },
                    lastMessageAt: new Date(),
                    status: 'active', // Reopen if closed
                }
            })
        } else if (sender === 'agent') {
            if (!convoId) {
                return NextResponse.json({ error: 'conversationId is required for agent messages' }, { status: 400 })
            }

            // Update lastMessageAt
            await prisma.chatConversation.update({
                where: { id: convoId },
                data: { lastMessageAt: new Date() }
            })
        }

        // Create the message
        const message = await prisma.chatMessage.create({
            data: {
                conversationId: convoId,
                content,
                sender,
                agentName: sender === 'agent' ? (agentName || 'Support') : null,
            }
        })

        return NextResponse.json({ message, conversationId: convoId })
    } catch (error: any) {
        console.error('Error sending message:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
