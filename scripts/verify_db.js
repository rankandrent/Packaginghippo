
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const sections = await prisma.homepageSection.findMany({
        orderBy: { order: 'asc' },
        select: { sectionKey: true, isActive: true, order: true }
    })
    console.log('--- Current DB State ---')
    console.table(sections)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
