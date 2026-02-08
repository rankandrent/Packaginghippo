interface BreadcrumbItem {
    name: string
    url?: string
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const siteUrl = "https://packaginghippo.com"

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url ? (item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`) : undefined
        })).filter(item => item.item !== undefined || items.indexOf(items[items.length - 1]) === items.length - 1)
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    )
}
