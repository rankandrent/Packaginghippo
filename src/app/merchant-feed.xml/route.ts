import prisma from '@/lib/db'
import { getSeoImageUrl } from '@/lib/image-seo'

// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Only products explicitly marked "Enable Buy Button" (isEcommerce) with a
// selling price are included, and each links to its own buyable product page
// (which has a functioning Buy button / quantity / checkout). Submit this URL
// in GMC: Data sources -> Add product source -> scheduled fetch:
//   https://packaginghippo.com/merchant-feed.xml
export const revalidate = 3600

const SITE = 'https://packaginghippo.com'

function xmlEscape(s: string): string {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

function stripHtml(s: string): string {
    return String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function absImage(url: string): string {
    const u = getSeoImageUrl(url)
    if (!u) return ''
    if (u.startsWith('http')) return u
    return `${SITE}${u.startsWith('/') ? '' : '/'}${u}`
}

export async function GET() {
    let items = ''
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                isEcommerce: true,
                ecommercePrice: { not: null, gt: 0 },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                shortDesc: true,
                seoDesc: true,
                description: true,
                images: true,
                ecommercePrice: true,
                stockStatus: true,
            },
        })

        items = products
            .map((p) => {
                const price = (p.ecommercePrice || 0).toFixed(2)
                const desc = stripHtml(p.shortDesc || p.seoDesc || p.description || p.name).slice(0, 4000)
                const img = absImage(p.images?.[0] || '')
                const availability = p.stockStatus === 'OUT_OF_STOCK' ? 'out_of_stock' : 'in_stock'
                return `
    <item>
      <g:id>${xmlEscape(p.slug)}</g:id>
      <g:title>${xmlEscape(p.name)}</g:title>
      <g:description>${xmlEscape(desc)}</g:description>
      <g:link>${SITE}/${xmlEscape(p.slug)}</g:link>
      ${img ? `<g:image_link>${xmlEscape(img)}</g:image_link>` : ''}
      <g:availability>${availability}</g:availability>
      <g:price>${price} USD</g:price>
      <g:condition>new</g:condition>
      <g:brand>Packaging Hippo</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`
            })
            .join('')
    } catch (e) {
        // Return a valid (empty) feed rather than erroring out.
        items = ''
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Packaging Hippo</title>
    <link>${SITE}</link>
    <description>Custom packaging boxes</description>${items}
  </channel>
</rss>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    })
}
