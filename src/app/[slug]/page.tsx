
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { RichTextEditor } from "@/components/admin/RichTextEditor" // We might need a read-only viewer, or just render HTML

// Allow caching for 60 seconds
export const revalidate = 60

type Props = {
    params: Promise<{ slug: string }>
}

async function getPage(slug: string) {
    const { data, error } = await supabase
        .from("cms_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

    if (error || !data) {
        return null
    }
    return data
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
        title: page.seo_title || page.title,
        description: page.meta_description,
        alternates: {
            canonical: `/${slug}`,
        },
    }
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params
    const page = await getPage(slug)

    if (!page) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

            {/* Search Engine Schema */}
            {page.schema_json && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema_json) }}
                />
            )}

            {/* Content Rendering */}
            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: typeof page.content === 'string' ? page.content : '' }} // Handle JSON if needed
            />
        </div>
    )
}
