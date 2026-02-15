
import prisma from "@/lib/db"

async function getSettings() {
    try {
        const settings = await prisma.siteSettings.findMany({
            where: {
                key: { in: ['general', 'footer'] }
            }
        })
        const general = settings.find(s => s.key === 'general')?.value as any || {}
        return general
    } catch (e) {
        return {}
    }
}

export async function HomeSchema() {
    const general = await getSettings()

    // Fallbacks or real values
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://packaginghippo.com"
    const siteName = general.siteName || "Packaging Hippo"
    const phone = general.phone || "+1 (510) 500-9533"
    const email = general.email || "sales@packaginghippo.com"
    const logoUrl = `${siteUrl}/logo.png`

    // Extract address details if possible
    const rawAddress = general.address || "123 Packaging Street, Industrial District, NY 10001"

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": siteName,
        "url": siteUrl,
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
        "sameAs": [
            "https://www.facebook.com/packaginghippo",
            "https://twitter.com/packaginghippo",
            "https://www.instagram.com/packaginghippo",
            "https://www.linkedin.com/company/packaginghippo"
        ]
    }

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": siteUrl,
        "name": siteName,
        "image": [
            `${siteUrl}/images/packaging-hero.webp`,
            `${siteUrl}/images/custom-boxes-wholesale.webp`
        ],
        "logo": logoUrl,
        "url": siteUrl,
        "telephone": phone,
        "email": email,
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": rawAddress,
            "addressCountry": "US"
        },
        "description": "Premium custom packaging boxes with logo at wholesale prices. Packaging Hippo offers high-quality custom made boxes with fast turnaround across the USA.",
        "brand": { "@id": `${siteUrl}/#organization` }
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
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    )
}
