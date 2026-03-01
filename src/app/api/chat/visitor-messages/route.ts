import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// GET — Get messages for a conversation by visitorId (for the widget)
// Also auto-triggers AI reply if no agent replied within 1 minute
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')

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

        const messages = await prisma.chatMessage.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'asc' }
        })

        // --- AUTO AI REPLY CHECK ---
        // If the conversation is active and the last message is from visitor,
        // and it's been more than 60 seconds, and no human has taken over → trigger AI
        if (
            conversation.status === 'active' &&
            (conversation as any).handledBy !== 'human' &&
            messages.length > 0
        ) {
            const lastMsg = messages[messages.length - 1]
            const timeSince = Date.now() - new Date(lastMsg.createdAt).getTime()

            // Check if AI was recently triggered (use agentTyping as a debounce flag)
            const lastAiTrigger = conversation.agentTyping ? new Date(conversation.agentTyping).getTime() : 0
            const aiCooldown = Date.now() - lastAiTrigger > 10_000 // 10-second cooldown

            // Only trigger AI if:
            // 1. Last message is from visitor (not AI or agent — prevents re-triggering after success)
            // 2. More than 5 seconds have passed since that message (near-instant AI reply)
            // 3. Cooldown period has passed (prevents spam when AI API fails)
            if (lastMsg.sender === 'visitor' && timeSince > 5_000 && aiCooldown) {
                // Set agentTyping as a debounce marker
                await prisma.chatConversation.update({
                    where: { id: conversation.id },
                    data: { agentTyping: new Date() }
                })

                // Trigger AI reply in the background (don't await — keep response fast)
                fetch(`${SITE_URL}/api/chat/ai-reply`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ conversationId: conversation.id })
                }).catch(err => console.error('AI trigger failed:', err))
            }
        }

        return NextResponse.json({
            messages,
            conversationId: conversation.id,
            status: conversation.status,
            assignedAgent: conversation.assignedAgent,
            handledBy: (conversation as any).handledBy || null,
            rating: (conversation as any).rating || null,
        })
    } catch (error: any) {
        console.error('Error fetching visitor messages:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
