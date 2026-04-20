import prisma from "@/lib/db"
import { BRAND_LOGO_MENU } from "@/lib/brand"
import { getSeoImageUrl } from "@/lib/image-seo"
import { getPublicContactEmail } from "@/lib/contact"
import { getSiteUrl } from "@/lib/utils"

function toAbsoluteUrl(url: string | null | undefined, siteUrl: string) {
    if (!url) return null

    const normalized = getSeoImageUrl(url)
    if (!normalized) return null

    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
        return normalized
    }

    return `${siteUrl}${normalized.startsWith("/") ? normalized : `/${normalized}`}`
}

function isLogoAssetUrl(url: string | null | undefined, logoUrl: string) {
    if (!url) return false

    return url === logoUrl ||
        url.includes("/brand/Logo-") ||
        url.includes("/brand/favicon") ||
        url.includes("packaginghippo-logo")
}

function parsePostalAddress(rawAddress: string) {
    const normalized = rawAddress.replace(/\s+/g, " ").trim()
    const commaParts = normalized.split(",").map(part => part.trim()).filter(Boolean)

    const fullAddress = {
        "@type": "PostalAddress",
        "streetAddress": normalized,
        "addressCountry": "US"
    } as Record<string, string>

    if (commaParts.length >= 3) {
        const streetAddress = commaParts.slice(0, -2).join(", ")
        const city = commaParts[commaParts.length - 2]
        const regionPart = commaParts[commaParts.length - 1]
        const regionMatch = regionPart.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i)

        return {
            "@type": "PostalAddress",
            "streetAddress": streetAddress || normalized,
            ...(city ? { "addressLocality": city } : {}),
            ...(regionMatch ? { "addressRegion": regionMatch[1].toUpperCase() } : {}),
            ...(regionMatch ? { "postalCode": regionMatch[2] } : {}),
            "addressCountry": "US"
        }
    }

    const compactMatch = normalized.match(/^(.*?)(?:,\s*|\s+)([A-Za-z .'-]+)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/)
    if (compactMatch) {
        return {
            "@type": "PostalAddress",
            "streetAddress": compactMatch[1].trim(),
            "addressLocality": compactMatch[2].trim(),
            "addressRegion": compactMatch[3].toUpperCase(),
            "postalCode": compactMatch[4],
            "addressCountry": "US"
        }
    }

    return fullAddress
}

function normalizeOpeningHours(openingHours: unknown) {
    if (!openingHours) return undefined

    if (typeof openingHours === "string" && openingHours.trim()) {
        return openingHours.trim()
    }

    if (Array.isArray(openingHours)) {
        const values = openingHours
            .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
            .map(value => value.trim())

        if (values.length > 0) {
            return values
        }
    }

    return undefined
}

function getGeoCoordinates(general: Record<string, any>) {
    const latitude = general.latitude ?? general.lat
    const longitude = general.longitude ?? general.lng ?? general.long

    if (latitude === undefined || longitude === undefined) {
        return undefined
    }

    return {
        "@type": "GeoCoordinates",
        "latitude": String(latitude),
        "longitude": String(longitude)
    }
}

async function getHomeSchemaData() {
    try {
        const [settings, categories, heroSection] = await Promise.all([
            prisma.siteSettings.findMany({
                where: {
                    key: { in: ["general", "footer", "seo"] }
                }
            }),
            prisma.productCategory.findMany({
                where: {
                    isActive: true,
                    imageUrl: { not: null }
                },
                orderBy: [
                    { order: "asc" },
                    { updatedAt: "desc" }
                ],
                take: 12,
                select: {
                    imageUrl: true
                }
            }),
            prisma.homepageSection.findFirst({
                where: {
                    sectionKey: "hero",
                    isActive: true
                },
                select: {
                    content: true
                }
            })
        ])

        const general = settings.find(s => s.key === "general")?.value as any || {}
        const footer = settings.find(s => s.key === "footer")?.value as any || {}
        const seo = settings.find(s => s.key === "seo")?.value as any || {}

        return {
            general,
            footer,
            seo,
            categoryImages: categories.map(category => category.imageUrl).filter(Boolean),
            heroImage: (heroSection?.content as any)?.hero_image || null
        }
    } catch (e) {
        return {
            general: {},
            footer: {},
            seo: {},
            categoryImages: [],
            heroImage: null
        }
    }
}

export async function HomeSchema() {
    const { general, footer, seo, categoryImages, heroImage } = await getHomeSchemaData()
    const siteUrl = getSiteUrl()
    const siteName = general.siteName || "Packaging Hippo"
    const phone = general.phone || "+1 (510) 500-9533"
    const email = getPublicContactEmail(general.email)
    const description = seo.defaultDescription || general.tagline || "Premium custom packaging boxes with logo at wholesale prices across the USA."
    const logoUrl = `${siteUrl}${BRAND_LOGO_MENU}`
    const rawAddress = general.address || "123 Packaging Street, Industrial District, NY 10001"
    const address = parsePostalAddress(rawAddress)
    const socialLinks = [
        footer?.social?.facebook,
        footer?.social?.instagram,
        footer?.social?.linkedin,
        footer?.social?.twitter,
        footer?.social?.behance,
        footer?.social?.youtube,
    ].filter(Boolean)
    const defaultSocialLinks = [
        "https://www.facebook.com/packaginghippo",
        "https://twitter.com/packaginghippo",
        "https://www.instagram.com/packaginghippo",
        "https://www.linkedin.com/company/packaginghippo"
    ]
    const sameAs = socialLinks.length > 0 ? socialLinks : defaultSocialLinks
    const mapUrl = general.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawAddress)}`
    const openingHours = normalizeOpeningHours(general.openingHours)
    const geo = getGeoCoordinates(general)
    const imageUrls = Array.from(
        new Set(
            [
                toAbsoluteUrl(seo.ogImage, siteUrl),
                toAbsoluteUrl(heroImage, siteUrl),
                ...categoryImages.map((imageUrl: string | null) => toAbsoluteUrl(imageUrl, siteUrl))
            ]
                .filter(Boolean)
                .filter((imageUrl) => !isLogoAssetUrl(imageUrl, logoUrl))
        )
    ).slice(0, 20)

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": siteName,
        "url": siteUrl,
        "description": description,
        "logo": {
            "@type": "ImageObject",
            "url": logoUrl,
            "width": "200",
            "height": "60"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": phone,
            "contactType": "customer service",
            "areaServed": "US",
            "availableLanguage": "en"
        },
        "email": email,
        "sameAs": sameAs
    }

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#localbusiness`,
        "name": siteName,
        ...(imageUrls.length > 0 ? { "image": imageUrls } : {}),
        "priceRange": general.priceRange || "$1 - $50",
        "address": address,
        "parentOrganization": { "@id": `${siteUrl}/#organization` },
        "hasMap": mapUrl,
        ...(openingHours ? { "openingHours": openingHours } : {}),
        ...(geo ? { "geo": geo } : {})
    }

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": siteName,
        "publisher": { "@id": `${siteUrl}/#organization` },
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/products?search={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    }

    const homePageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        "url": siteUrl,
        "name": siteName,
        "isPartOf": {
            "@id": `${siteUrl}/#website`
        },
        "about": {
            "@id": `${siteUrl}/#organization`
        },
        "breadcrumb": {
            "@id": `${siteUrl}/#breadcrumb`
        },
        ...(imageUrls[0] ? {
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": imageUrls[0]
            }
        } : {})
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the minimum order quantity (MOQ) for custom boxes?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Packaging Hippo offers flexible MOQs, starting as low as 100 units for most custom box types, making it ideal for both startups and established brands."
                }
            },
            {
                "@type": "Question",
                "name": "How long does shipping take for custom packaging?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Standard production takes 10-12 business days. Shipping times vary by location, but we offer expedited options to ensure you get your packaging when you need it."
                }
            },
            {
                "@type": "Question",
                "name": "Can I get a custom quote for bulk orders?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! We specialize in wholesale and bulk orders. You can request a custom quote through our website or contact our sales team directly for competitive pricing."
                }
            },
            {
                "@type": "Question",
                "name": "What printing options do you provide?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer a variety of printing methods including CMYK, PMS (Pantone matching), Digital printing, and high-end finishes like Foil Stamping and Spot UV."
                }
            }
        ]
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    )
}
