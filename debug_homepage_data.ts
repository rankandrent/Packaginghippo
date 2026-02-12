
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getHomepageData() {
    console.log("Fetching Homepage Sections...")
    try {
        const sections = await prisma.homepageSection.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        })
        console.log(`Fetched ${sections.length} active sections.`)
        sections.forEach(s => console.log(`- [${s.order}] ${s.sectionKey}`))
        return sections
    } catch (error) {
        console.error("Error fetching homepage data:", error)
        return []
    }
}

async function getFeaturedBlogs() {
    console.log("\nFetching Featured Blogs...")
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                isPublished: true,
                isFeatured: true
            },
            include: {
                author: { select: { name: true, image: true } },
                category: { select: { name: true, slug: true } }
            },
            orderBy: { publishedAt: 'desc' },
            take: 3
        })
        console.log(`Fetched ${posts.length} featured blogs.`)
        posts.forEach(p => console.log(`- ${p.title} (Published: ${p.isPublished}, Featured: ${p.isFeatured})`))
        return posts
    } catch (error) {
        console.error("Error fetching featured blogs:", error)
        return []
    }
}

async function main() {
    const sections = await getHomepageData()
    const blogs = await getFeaturedBlogs()

    const hasFeaturedSection = sections.some(s => s.sectionKey === 'featured_blogs')
    const hasBlogs = blogs.length > 0

    console.log("\n--- DIAGNOSIS ---")
    console.log(`Featured Blogs Section Present: ${hasFeaturedSection}`)
    console.log(`Featured Blogs Data Present: ${hasBlogs}`)

    if (hasFeaturedSection && hasBlogs) {
        console.log("SUCCESS: Both section and data are present. The issue might be in React rendering or CSS.")
    } else {
        console.log("FAILURE: Missing section or data.")
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
