import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us | Get a Quote",
    description: "Contact Packaging Hippo for custom packaging solutions. Get a free quote, call us at (445) 447-7678, or visit our Brooklyn, NY location.",
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: "Contact Us | Get a Quote | Packaging Hippo",
        description: "Contact Packaging Hippo for custom packaging solutions. Get a free quote, call us at (445) 447-7678.",
        type: 'website',
        url: '/contact',
    },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
