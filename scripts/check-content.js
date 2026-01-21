const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Checking Categories ---')
    const categories = await prisma.productCategory.findMany()
    categories.forEach(c => console.log(`Category: ${c.name} -> Slug: ${c.slug}`))

    console.log('\n--- Checking Static Pages ---')
    const pages = await prisma.page.findMany()
    pages.forEach(p => console.log(`Page: ${p.title} -> Slug: ${p.slug}`))

    console.log('\n--- Checking Products (Top 5) ---')
    const products = await prisma.product.findMany({ take: 5 })
    products.forEach(p => console.log(`Product: ${p.name} -> Slug: ${p.slug}`))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
