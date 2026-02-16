
export const CLOUDINARY_CLOUD_NAME = 'da9culaxt'

/**
 * Transforms a raw Cloudinary URL into a local SEO-friendly URL
 * e.g. https://res.cloudinary.com/da9culaxt/image/upload/v123/img.jpg 
 *   -> /cdn/image/v123/img.jpg
 */
export function getSeoImageUrl(url: string | null | undefined): string {
    if (!url) return ''

    // Only rewrite specific Cloudinary URLs
    if (url.includes(`res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`)) {
        return url.replace(`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`, '/cdn/image')
    }

    return url
}

/**
 * Generates descriptive Alt text from available data
 */
export function getSeoAltText(data: any, fallback: string = 'Custom Packaging Box'): string {
    if (!data) return fallback

    // Try to find a good descriptive text
    const text = data.heading || data.name || data.title || data.badge_text

    if (text && typeof text === 'string') {
        // Strip HTML tags if any (e.g. <br/> in headings)
        return text.replace(/<[^>]*>?/gm, ' ').trim()
    }

    return fallback
}
