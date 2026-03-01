import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST — Submit a rating for a closed conversation
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { visitorId, rating, feedback } = body

        if (!visitorId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'visitorId and rating (1-5) are required' }, { status: 400 })
        }

        const conversation = await prisma.chatConversation.findUnique({
            where: { visitorId }
        })

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
        }

        const updated = await prisma.chatConversation.update({
            where: { id: conversation.id },
            data: {
                rating: parseInt(rating),
                ratingFeedback: feedback || null,
            }
        })

        return NextResponse.json({ success: true, rating: updated.rating })
    } catch (error: any) {
        console.error('Error submitting rating:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
