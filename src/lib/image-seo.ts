
export const CLOUDINARY_CLOUD_NAME = 'da9culaxt'

function normalizeCloudinaryPath(pathname: string) {
    const uploadMarker = "/image/upload/"
    const uploadIndex = pathname.indexOf(uploadMarker)

    if (uploadIndex === -1) return null

    const remainder = pathname.slice(uploadIndex + uploadMarker.length)
    const parts = remainder.split("/").filter(Boolean)

    if (parts[0] && /^v\d+$/.test(parts[0])) {
        parts.shift()
    }

    return parts.join("/")
}

/**
 * Transforms a raw Cloudinary URL into a local SEO-friendly URL
 * e.g. https://res.cloudinary.com/da9culaxt/image/upload/v123/products/my-image.jpg
 *   -> /assets/products/my-image.jpg
 * 
 * This makes the image appear to be served from:
 *   packaginghippo.com/assets/products/my-image.jpg
 */
export function getSeoImageUrl(url: string | null | undefined): string {
    if (!url) return ''

    if (url.startsWith("/images/")) {
        const parts = url.replace(/^\/images\//, "").split("/").filter(Boolean)
        if (parts[0] && /^v\d+$/.test(parts[0])) {
            parts.shift()
        }
        return `/assets/${parts.join("/")}`
    }

    if (url.startsWith("/assets/")) {
        return url
    }

    if (url.includes(`res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`)) {
        try {
            const parsed = new URL(url)
            const normalizedPath = normalizeCloudinaryPath(parsed.pathname)
            if (normalizedPath) {
                return `/assets/${normalizedPath}`
            }
        } catch {
            return url
        }
    }

    if (url.includes("/image/upload/")) {
        try {
            const parsed = new URL(url)
            const normalizedPath = normalizeCloudinaryPath(parsed.pathname)
            if (normalizedPath) {
                return `/assets/${normalizedPath}`
            }
        } catch {
            return url
        }
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
 * Extracts a human-readable alt text from an image URL.
 * e.g. https://i.ibb.co/abc/custom-medicine-boxes-png.webp -> "Custom Medicine Boxes Png"
 * e.g. /images/v123/products/kraft-box.jpg -> "Kraft Box"
 */
export function getAltFromUrl(url: string | null | undefined, fallback: string = 'Custom Packaging Box'): string {
    if (!url) return fallback

    try {
        // Decode percent-encoded characters first
        const decoded = decodeURIComponent(url)

        // Get last path segment (filename)
        let filename = decoded.split('/').pop() || ''

        // Strip query string
        filename = filename.split('?')[0]

        // Remove extension (.jpg, .webp, .png, etc.)
        filename = filename.replace(/\.[^.]+$/, '')

        // Remove version prefixes like v1234567890
        filename = filename.replace(/^v\d+$/, '')

        // If empty, too short, or looks like a hash/random ID, use fallback
        if (!filename || filename.length < 3 || /^[a-f0-9]{8,}$/i.test(filename)) {
            return fallback
        }

        // Convert hyphens and underscores to spaces, then title-case
        return filename
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
            .trim()
    } catch {
        return fallback
    }
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
