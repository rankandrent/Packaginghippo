
import prisma from "@/lib/db"

interface PageSchemaProps {
    page: {
        title: string
        slug: string
        seoDesc?: string | null
    }
}

export async function PageSchema({ page }: PageSchemaProps) {
    const siteUrl = "https://packaginghippo.com"
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
        "name": page.title,
        "description": page.seoDesc || `Read about ${page.title} at Packaging Hippo.`,
        "url": `${siteUrl}/${page.slug}`,
        "breadcrumb": breadcrumbSchema,
        "publisher": {
            "@type": "Organization",
            "name": "Packaging Hippo",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
            />
        </>
    )
}
