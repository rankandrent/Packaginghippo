
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
    const siteUrl = "https://packaginghippo.com" // Or get from env
    const siteName = general.siteName || "Packaging Hippo"
    const phone = general.phone || "+1 (510) 500-9533" // Default from footer
    const email = general.email || "sales@packaginghippo.com"
    const logoUrl = `${siteUrl}/logo.png` // Assumption

    // Address parsing (simple heuristic if it's a string)
    const rawAddress = general.address || "123 Packaging Street, Industrial District, NY 10001"
    // We'll leave the placeholders if we can't parse it well, or just output the raw string in one field if possible. 
    // Schema prefers structured. 
    // Let's use the placeholders the user gave but fill what we can.

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": siteUrl,
        "name": siteName,
        "hasMap": "CHANGE THIS GOOGLE MAPS URL", // User didn't provide
        "logo": logoUrl,
        "telephone": phone,
        "email": email,
        "url": siteUrl,
        "image": [
            `${siteUrl}/images/packaging-1.webp`, // Placeholders
            `${siteUrl}/images/packaging-2.webp`,
            `${siteUrl}/images/packaging-3.webp`
        ],
        "priceRange": "$0.1 - $50",
        "description": "Order your custom packaging boxes with logo at affordable wholesale prices. Packaging Hippo provides custom made boxes with premium printing and fast turnaround in the USA.",

        "address": {
            "@type": "PostalAddress",
            "addressCountry": "USA",
            "addressLocality": "CHANGE THIS CITY",
            "addressRegion": "CHANGE THIS STATE",
            "postalCode": "CHANGE THIS ZIP",
            "streetAddress": rawAddress // Use the full string here at least
        },

        "geo": {
            "@type": "GeoCoordinates",
            "longitude": "CHANGE THIS LONGITUDE",
            "latitude": "CHANGE THIS LATITUDE"
        },

        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search/?keyword={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What materials are commonly used in custom packaging boxes?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Custom packaging boxes are commonly made from kraft paper, cardstock, corrugated cardboard, rigid stock, chipboard, and paperboard."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer other packaging types, sizes, or colors?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Packaging Hippo offers fully customizable packaging including sizes, colors, shapes, printing styles, and finishing options."
                }
            },
            {
                "@type": "Question",
                "name": "Can I order a sample before placing a full production run?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide 3D mockups and physical samples for selected products to help finalize designs before bulk production."
                }
            },
            {
                "@type": "Question",
                "name": "How long is the production time?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our standard production turnaround time is 10 to 12 business days after design approval, including production and quality checks."
                }
            },
            {
                "@type": "Question",
                "name": "Where can I find eco-friendly custom box manufacturers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Packaging Hippo offers eco-friendly custom packaging solutions using recyclable and sustainable materials across the USA."
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
