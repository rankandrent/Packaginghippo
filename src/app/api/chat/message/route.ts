import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Support team member names — each visitor gets assigned one randomly
const SUPPORT_AGENTS = [
    'Sarah',
    'Michael',
    'Emma',
    'James',
    'Olivia',
    'Daniel',
    'Sophia',
    'David',
    'Ava',
    'Ryan',
]

function getRandomAgent(): string {
    return SUPPORT_AGENTS[Math.floor(Math.random() * SUPPORT_AGENTS.length)]
}

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
                // Assign a random support agent name to this conversation
                conversation = await prisma.chatConversation.create({
                    data: {
                        visitorId,
                        visitorName,
                        visitorEmail: visitorEmail || null,
                        assignedAgent: getRandomAgent(),
                    }
                })
            }

            convoId = conversation.id

            // Increment unread count for agents & clear visitor typing
            await prisma.chatConversation.update({
                where: { id: convoId },
                data: {
                    unreadCount: { increment: 1 },
                    lastMessageAt: new Date(),
                    status: 'active', // Reopen if closed
                    visitorTyping: null, // Clear typing indicator on send
                }
            })
        } else if (sender === 'agent') {
            if (!convoId) {
                return NextResponse.json({ error: 'conversationId is required for agent messages' }, { status: 400 })
            }

            // Fetch the assigned agent name for this conversation
            const convo = await prisma.chatConversation.findUnique({ where: { id: convoId } })

            // Update lastMessageAt, set handledBy to 'human' (agent takeover), clear typing
            await prisma.chatConversation.update({
                where: { id: convoId },
                data: {
                    lastMessageAt: new Date(),
                    agentTyping: null,
                    handledBy: 'human', // Agent takes over from AI
                    status: 'active', // Reopen if AI had closed it
                }
            })
        }

        // Create the message — use the conversation's assigned agent name
        let finalAgentName = agentName || 'Support'
        if (sender === 'agent' && convoId) {
            const convo = await prisma.chatConversation.findUnique({
                where: { id: convoId },
                select: { assignedAgent: true }
            })
            if (convo?.assignedAgent) {
                finalAgentName = convo.assignedAgent
            }
        }

        const message = await prisma.chatMessage.create({
            data: {
                conversationId: convoId,
                content,
                sender,
                agentName: sender === 'agent' ? finalAgentName : null,
            }
        })

        return NextResponse.json({ message, conversationId: convoId })
    } catch (error: any) {
        console.error('Error sending message:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
