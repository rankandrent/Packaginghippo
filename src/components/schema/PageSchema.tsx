import { getSiteUrl } from "@/lib/utils"

interface PageSchemaProps {
    page: {
        title: string
        slug: string
        seoDesc?: string | null
    }
}

export async function PageSchema({ page }: PageSchemaProps) {
    const siteUrl = getSiteUrl()
    const isAbout = page.slug === 'about-us' || page.slug === 'about'
    const isContact = page.slug === 'contact-us' || page.slug === 'contact'

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": page.title,
                "item": `${siteUrl}/${page.slug}`
            }
        ]
    }

    const webpageSchema = {
        "@context": "https://schema.org",
        "@type": isAbout ? "AboutPage" : isContact ? "ContactPage" : "WebPage",
        "@id": `${siteUrl}/${page.slug}#webpage`,
        "name": page.title,
        "description": page.seoDesc || `Read about ${page.title} at Packaging Hippo.`,
        "url": `${siteUrl}/${page.slug}`,
        "isPartOf": {
            "@id": `${siteUrl}/#website`
        },
        "breadcrumb": {
            "@id": `${siteUrl}/${page.slug}#breadcrumb`
        },
        "publisher": {
            "@id": `${siteUrl}/#organization`
        }
    }

    const enrichedBreadcrumbSchema = {
        ...breadcrumbSchema,
        "@id": `${siteUrl}/${page.slug}#breadcrumb`
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(enrichedBreadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
            />
        </>
    )
}
