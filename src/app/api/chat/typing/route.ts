import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST — Update typing status
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { visitorId, conversationId, who } = body // who: 'visitor' | 'agent'

        if (who === 'visitor' && visitorId) {
            const convo = await prisma.chatConversation.findUnique({ where: { visitorId } })
            if (convo) {
                await prisma.chatConversation.update({
                    where: { visitorId },
                    data: { visitorTyping: new Date() }
                })
            }
        } else if (who === 'agent' && conversationId) {
            await prisma.chatConversation.update({
                where: { id: conversationId },
                data: { agentTyping: new Date() }
            })
        }

        return NextResponse.json({ ok: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// GET — Check typing status
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')
    const conversationId = searchParams.get('conversationId')
    const who = searchParams.get('who') // 'visitor' checks if agent is typing; 'agent' checks if visitor is typing

    try {
        let convo: any = null
        if (visitorId) {
            convo = await prisma.chatConversation.findUnique({ where: { visitorId } })
        } else if (conversationId) {
            convo = await prisma.chatConversation.findUnique({ where: { id: conversationId } })
        }

        if (!convo) return NextResponse.json({ isTyping: false })

        const now = Date.now()
        const threshold = 4000 // 4 seconds

        if (who === 'visitor') {
            // Visitor wants to know if agent is typing
            const isTyping = convo.agentTyping && (now - new Date(convo.agentTyping).getTime()) < threshold
            return NextResponse.json({ isTyping: !!isTyping, assignedAgent: convo.assignedAgent })
        } else {
            // Agent wants to know if visitor is typing
            const isTyping = convo.visitorTyping && (now - new Date(convo.visitorTyping).getTime()) < threshold
            return NextResponse.json({ isTyping: !!isTyping })
        }
    } catch (error: any) {
        return NextResponse.json({ isTyping: false })
    }
}
