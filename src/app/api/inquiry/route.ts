import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        let isSpamSubmission = false
        let spamScore = 0

        // 1. Honeypot check (Highest severity)
        if (body.hp_field) {
            console.warn('Spam detected (Honeypot):', body.email)
            isSpamSubmission = true
            spamScore = 100
        }

        // 2. Advanced Content Filtering (SEO & Link Spam)
        const checkSpamContent = (text: string = ''): number => {
            let score = 0
            const lowerText = text.toLowerCase()

            // Keyword: SEO / Marketing Services
            const spamKeywords = [
                'seo', 'ranking', 'google first page', 'backlink', 'guest post',
                'link building', 'domain authority', 'da/pa', 'marketing service',
                'website traffic', 'improve your', 'first page', 'web design', 'development service'
            ]

            spamKeywords.forEach(word => {
                if (lowerText.includes(word)) score += 20
            })

            // Keyword: Cyrillic / Non-Latin (often spam)
            if (/[а-яА-Я]/.test(text)) score += 50

            // Keyword: Excessive URLs
            const urlCount = (text.match(/https?:\/\//g) || []).length
            if (urlCount > 1) score += (urlCount * 15)

            return score
        }

        if (!isSpamSubmission) {
            const messageScore = checkSpamContent(body.message)
            const nameScore = checkSpamContent(body.name) // Sometimes they put URLs in name
            spamScore = messageScore + nameScore

            if (spamScore >= 40) { // Threshold for identifying as proper spam
                isSpamSubmission = true
            }
        }

        // Basic validation (only if not spam, or lenient if spam to ensure we capture it?)
        // We still need name/email to save it db
        if (!body.name && !isSpamSubmission) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                name: body.name || 'Spam Suspect', // Fallback for spam with empty name
                email: body.email || 'no-email@spam.com',
                phone: body.phone,
                company: body.company,
                boxType: body.boxType,
                quantity: body.quantity,
                dimensions: body.details?.dimensions || body.dimensions,
                material: body.details?.material || body.material,
                color: body.color,
                turnaround: body.turnaround,
                message: body.message,
                type: body.type,
                details: body.details,
                sourceUrl: body.sourceUrl,
                sourcePage: body.sourcePage,
                // Spam fields
                isSpam: isSpamSubmission,
                spamScore: spamScore,
                status: isSpamSubmission ? 'SPAM' : 'PENDING'
            }
        })

        return NextResponse.json({ success: true, inquiry })
    } catch (error: any) {
        console.error('CRITICAL_API_ERROR (Inquiry):', error)
        return NextResponse.json({
            error: 'Failed to submit inquiry',
            details: error.message || 'Internal Server Error'
        }, { status: 500 })
    }
}
