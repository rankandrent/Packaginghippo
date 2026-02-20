import prisma from "@/lib/db"
import { GallerySection } from "@/components/home/sections/GallerySection"
import { Metadata } from "next"
import { constructMetadataTitle } from "@/lib/utils"

// Revalidate every 60 seconds
export const revalidate = 60

async function getGalleryData() {
    try {
        // Fetch the active gallery section from homepage sections
        const gallerySection = await prisma.homepageSection.findFirst({
            where: {
                sectionKey: 'gallery_section',
                isActive: true
            }
        })
        return gallerySection?.content || null
    } catch (error) {
        console.error("Error fetching gallery data:", error)
        return null
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getGalleryData() as any

    return {
        title: constructMetadataTitle(data?.heading || 'Our Gallery | Packaging Hippo'),
        description: data?.subheading || 'Explore our custom packaging designs and recent work.',
        openGraph: {
            title: data?.heading || 'Our Gallery | Packaging Hippo',
            description: data?.subheading || 'Explore our custom packaging designs and recent work.',
            images: data?.items?.[0]?.url ? [{ url: data.items[0].url }] : []
        }
    }
}

export default async function GalleryPage() {
    const data = await getGalleryData() as any

    if (!data || !data.items || data.items.length === 0) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Gallery</h1>
                    <p className="text-muted-foreground">No images found. Please check back later.</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-20">
            <GallerySection data={data} />
        </main>
    )
}
