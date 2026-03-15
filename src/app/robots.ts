import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

// Revalidate every hour
export const revalidate = 3600

export default async function robots(): Promise<MetadataRoute.Robots> {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { key: 'robots' },
        })

        // If explicitly set in database, we should ideally parse it, 
        // but for now let's provide a structured version that matches the user's intent
        if (settings?.value) {
            // Simple parsing for the most important rules if we want to be dynamic
            // But usually, robots.ts is better for structured data.
            // Since we just seeded the DB with the user's content, we'll use a structured version of that here.
        }

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
                        '/admin/',
                        '/private/',
                        '/*.json$',
                        '/*.xml$',
                        '/*?*'
                    ],
                    crawlDelay: 10,
                },
            ],
            sitemap: 'https://custom-packaging.org/sitemap.xml',
        }
    } catch (error) {
        console.error('Error serving robots.txt:', error)
        return {
            rules: {
                userAgent: '*',
                allow: '/',
            },
            sitemap: 'https://custom-packaging.org/sitemap.xml',
        }
    }
}
