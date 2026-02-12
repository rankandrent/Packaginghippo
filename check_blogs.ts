
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
    console.log("Checking Homepage Sections...")
    const sections = await prisma.homepageSection.findMany({
        where: { isActive: true },
        select: { sectionKey: true, order: true }
    })
    console.log("Active Sections:", sections)

    const featuredBlogsSection = sections.find(s => s.sectionKey === 'featured_blogs')
    if (!featuredBlogsSection) {
        console.log("WARNING: 'featured_blogs' section is MISSING or INACTIVE in HomepageSection table.")
    } else {
        console.log("SUCCESS: 'featured_blogs' section is present and active.")
    }

    console.log("\nChecking Featured Blogs...")
    const blogs = await prisma.blogPost.findMany({
        where: { isPublished: true, isFeatured: true },
        select: { title: true, slug: true }
    })
    console.log(`Found ${blogs.length} featured & published blogs:`)
    blogs.forEach(b => console.log(`- ${b.title} (${b.slug})`))

    if (blogs.length === 0) {
        console.log("WARNING: No blogs are marked as 'isFeatured' and 'isPublished'. The section will be hidden.")
    }
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
