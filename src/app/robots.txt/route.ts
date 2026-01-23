import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const headersList = await headers()
        const host = headersList.get('host') || 'localhost:3000'
        const protocol = host.includes('localhost') ? 'http' : 'https'
        const baseUrl = `${protocol}://${host}`

        const settings = await prisma.siteSettings.findUnique({
            where: { key: 'robots' },
        })

        // Default content if not set
        const content = (settings?.value as string) || `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml`

        return new Response(content, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'public, s-max-age=3600, stale-while-revalidate=59',
            },
        })
    } catch (error) {
        console.error('Error serving robots.txt:', error)
        return new Response('User-agent: *\nAllow: /', {
            headers: {
                'Content-Type': 'text/plain',
            },
        })
    }
}
