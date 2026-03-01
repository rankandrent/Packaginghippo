import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET — Return total unread message count (for sidebar badge)
export async function GET() {
    try {
        const result = await prisma.chatConversation.aggregate({
            _sum: { unreadCount: true },
            where: { status: 'active' }
        })

        return NextResponse.json({ count: result._sum.unreadCount || 0 })
    } catch (error: any) {
        console.error('Error fetching unread count:', error)
        return NextResponse.json({ count: 0 })
    }
}
