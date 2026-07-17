import { getMerchantProducts, slugifyName, parsePrice, merchantHref } from '@/lib/merchant'
import { getSeoImageUrl } from '@/lib/image-seo'

// Google Merchant Center product feed (RSS 2.0 + g: namespace) built from the
// homepage "Featured Products" (merchant_products) section. Each item links to
// its own buyable landing page (/buy/<slug>) which has a functioning Buy button,
// quantity selector and checkout. Submit this URL in GMC as a scheduled fetch:
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

function absImage(url: string): string {
    const u = getSeoImageUrl(url)
    if (!u) return ''
    return u.startsWith('http') ? u : `${SITE}${u.startsWith('/') ? '' : '/'}${u}`
}

export async function GET() {
    let items = ''
    try {
        const products = await getMerchantProducts()
        items = products
            .map((p) => {
                const slug = slugifyName(p.name)
                const price = parsePrice(p.price)
                if (!slug || price <= 0) return ''
                const img = absImage(p.image)
                const href = merchantHref(p)
                const link = href.startsWith('http') ? href : `${SITE}${href}`
                return `
    <item>
      <g:id>${xmlEscape(slug)}</g:id>
      <g:title>${xmlEscape(p.name)}</g:title>
      <g:description>${xmlEscape(`Custom ${p.name} by Packaging Hippo.`)}</g:description>
      <g:link>${xmlEscape(link)}</g:link>
      ${img ? `<g:image_link>${xmlEscape(img)}</g:image_link>` : ''}
      <g:availability>in_stock</g:availability>
      <g:price>${price.toFixed(2)} USD</g:price>
      <g:condition>new</g:condition>
      <g:brand>Packaging Hippo</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`
            })
            .filter(Boolean)
            .join('')
    } catch {
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
