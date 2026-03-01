import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const AI_AGENT_NAME = 'Hippo AI'

const SYSTEM_PROMPT = `You are a friendly, professional AI support agent for Packaging Hippo — a custom packaging company that manufactures premium custom boxes.

Your PRIMARY goal is to:
1. Greet the customer warmly
2. Understand their packaging needs by asking relevant questions
3. Gather these KEY REQUIREMENTS one by one (don't ask all at once):
   - What type of product they need packaging for
   - Box type (mailer boxes, rigid boxes, folding cartons, display boxes, etc.)
   - Approximate size/dimensions  
   - Quantity needed
   - Material preference (cardboard, corrugated, kraft, rigid)
   - Printing/finishing needs (full color, foil stamping, embossing, matte/gloss)
   - Timeline/deadline
4. Once you have enough info, summarize their requirements and let them know our sales team will follow up with a custom quote

RULES:
- Keep responses SHORT (2-3 sentences max)
- Be conversational and helpful, not robotic
- Ask ONE question at a time
- If the customer asks something unrelated to packaging, politely redirect
- When you have gathered at least box type + quantity + product type, you can summarize and close
- When closing, say exactly: "I've noted all your requirements! Our sales team will reach out shortly with a custom quote. Thank you for choosing Packaging Hippo! 📦"
- NEVER make up prices or delivery times
- You represent Packaging Hippo, always speak as "we" and "our team"`

// POST — Generate AI reply for a conversation
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { conversationId } = body

        if (!conversationId) {
            return NextResponse.json({ error: 'conversationId required' }, { status: 400 })
        }

        if (!OPENROUTER_API_KEY) {
            return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
        }

        const conversation = await prisma.chatConversation.findUnique({
            where: { id: conversationId }
        })

        if (!conversation || conversation.status !== 'active') {
            return NextResponse.json({ error: 'Conversation not active' }, { status: 400 })
        }

        // Don't reply if a human agent has taken over
        if ((conversation as any).handledBy === 'human') {
            return NextResponse.json({ skipped: true, reason: 'human_takeover' })
        }

        // Fetch message history
        const messages = await prisma.chatMessage.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            take: 30 // Last 30 messages for context
        })

        // Build chat history for LLM
        const chatHistory = messages.map(msg => ({
            role: msg.sender === 'visitor' ? 'user' as const : 'assistant' as const,
            content: msg.content
        }))

        // Call OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://packaginghippo.com',
                'X-Title': 'Packaging Hippo Chat'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...chatHistory
                ],
                max_tokens: 200,
                temperature: 0.7,
            })
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('OpenRouter error:', errText)
            return NextResponse.json({ error: 'AI service error' }, { status: 502 })
        }

        const aiData = await response.json()
        const aiReply = aiData.choices?.[0]?.message?.content?.trim()

        if (!aiReply) {
            return NextResponse.json({ error: 'No AI response' }, { status: 500 })
        }

        // Check if AI is closing the conversation (has the closing phrase)
        const isClosing = aiReply.includes('sales team will reach out') ||
            aiReply.includes('custom quote') && aiReply.includes('Thank you')

        // Save AI message
        const message = await prisma.chatMessage.create({
            data: {
                conversationId,
                content: aiReply,
                sender: 'ai',
                agentName: AI_AGENT_NAME,
            }
        })

        // Update conversation
        const updateData: any = {
            lastMessageAt: new Date(),
            agentTyping: null,
        }

        // Mark as AI handled if not already human
        if ((conversation as any).handledBy !== 'human') {
            updateData.handledBy = 'ai'
        }

        // If AI is closing the lead
        if (isClosing) {
            updateData.status = 'ai_closed'
        }

        await prisma.chatConversation.update({
            where: { id: conversationId },
            data: updateData
        })

        return NextResponse.json({ message, isClosing })
    } catch (error: any) {
        console.error('AI reply error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
