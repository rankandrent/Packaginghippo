const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const sectionKey = 'featured_blogs'

    const existing = await prisma.homepageSection.findUnique({
        where: { sectionKey }
    })

    if (!existing) {
        console.log(`Creating ${sectionKey} section...`)
        await prisma.homepageSection.create({
            data: {
                sectionKey,
                title: 'Featured Blogs',
                content: {},
                order: 99, // Put it at the end
                isActive: true
            }
        })
        console.log('Created.')
    } else {
        console.log(`${sectionKey} section already exists.`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
