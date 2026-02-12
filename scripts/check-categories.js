const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const categories = await prisma.productCategory.findMany({
        select: { name: true, imageUrl: true }
    })
    console.log('Categories:', categories)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
