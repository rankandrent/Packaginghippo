import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

// Revalidate every hour
export const revalidate = 3600

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers()
    const host = headersList.get('host') || 'packaginghippo.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/*.html$',
                    '/*.htm$',
                    '/*.jpg$',
                    '/*.jpeg$',
                    '/*.gif$',
                    '/*.png$',
                    '/*.css$',
                    '/*.js$'
                ],
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/private/',
                    '/*.json$',
                ],
                crawlDelay: 2,
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
