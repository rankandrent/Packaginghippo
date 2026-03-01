
export const CLOUDINARY_CLOUD_NAME = 'da9culaxt'

/**
 * Transforms a raw Cloudinary URL into a local SEO-friendly URL
 * e.g. https://res.cloudinary.com/da9culaxt/image/upload/v123/products/my-image.jpg 
 *   -> /images/v123/products/my-image.jpg
 * 
 * This makes the image appear to be served from:
 *   packaginghippo.com/images/v123/products/my-image.jpg
 */
export function getSeoImageUrl(url: string | null | undefined): string {
    if (!url) return ''

    // Only rewrite specific Cloudinary URLs
    if (url.includes(`res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`)) {
        return url.replace(`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`, '/images')
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

/**
 * Converts a filename or keyword into an SEO-friendly slug
 * e.g. "What Are Bagged Packaged Goods" -> "what-are-bagged-packaged-goods"
 */
export function slugifyFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with single
        .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
        || 'image'
}
