import { MetadataRoute } from 'next'
import prisma from '@/lib/db'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    try {
        // Fetch everything in parallel
        const [products, categories, posts, pages] = await Promise.all([
            prisma.product.findMany({
                where: { isActive: true },
                select: { slug: true, updatedAt: true }
            }).catch(() => []),
            prisma.productCategory.findMany({
                where: { isActive: true },
                select: { slug: true, updatedAt: true }
            }).catch(() => []),
            (prisma as any).blogPost.findMany({
                where: { isPublished: true },
                select: { slug: true, updatedAt: true }
            }).catch(() => []),
            prisma.page.findMany({
                where: { isPublished: true },
                select: { slug: true, updatedAt: true }
            }).catch(() => [])
        ])

        const staticRoutes: MetadataRoute.Sitemap = [
            { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
            { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
            { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
            { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
            { url: `${baseUrl}/quote`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
            { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        ]

        const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
            url: `${baseUrl}/products/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

        const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
            url: `${baseUrl}/services/${c.slug}`,
            lastModified: c.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.9,
        }))

        const blogEntries: MetadataRoute.Sitemap = posts.map((p: any) => ({
            url: `${baseUrl}/blog/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.7,
        }))

        const pageEntries: MetadataRoute.Sitemap = pages.map((p) => ({
            url: `${baseUrl}/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.5,
        }))

        return [
            ...staticRoutes,
            ...categoryEntries,
            ...productEntries,
            ...blogEntries,
            ...pageEntries,
        ]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Fallback to minimal sitemap if everything fails
        return [
            { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }
        ]
    }
}
