
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
    const blogs = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 3
    })

    if (blogs.length === 0) {
        console.log("No published blogs found to feature.")
        return
    }

    console.log(`Found ${blogs.length} blogs. Marking as featured...`)

    for (const blog of blogs) {
        await prisma.blogPost.update({
            where: { id: blog.id },
            data: { isFeatured: true }
        })
        console.log(`- Marked '${blog.title}' as featured.`)
    }
}

run()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
