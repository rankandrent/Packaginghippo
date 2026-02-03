import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { RichTextEditor } from "@/components/admin/RichTextEditor" // We might need a read-only viewer, or just render HTML
import { PageSchema } from "@/components/schema/PageSchema"

// Allow caching for 60 seconds
export const revalidate = 60

type Props = {
    params: Promise<{ slug: string }>
}

async function getPage(slug: string) {
    try {
        const page = await prisma.page.findUnique({
            where: { slug }
        })

        if (!page || !page.isPublished) {
            return null
        }
        return page
    } catch (error) {
        console.error("Error fetching page:", error)
        return null
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const page = await getPage(slug)

    if (!page) {
        return {
            title: "Page Not Found",
        }
    }

    return {
        title: page.seoTitle || page.title,
        description: page.seoDesc || undefined,
        alternates: {
            canonical: `/${slug}`,
        },
        openGraph: {
            title: page.seoTitle || page.title,
            description: page.seoDesc || undefined,
            type: 'website',
            url: `/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: page.seoTitle || page.title,
            description: page.seoDesc || undefined,
        }
    }
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params
    const page = await getPage(slug)

    if (!page) {
        notFound()
    }

    // specific handling for Json content if needed, trusting it's string-compat or handle Tiptap
    const htmlContent = typeof page.content === 'string' ? page.content : JSON.stringify(page.content)

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

            <PageSchema page={page} />

            {/* Content Rendering */}
            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    )
}
