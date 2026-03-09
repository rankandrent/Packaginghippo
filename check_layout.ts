import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function run() {
    const cats = await prisma.productCategory.findMany({ select: { slug: true, layout: true } })
    console.log(JSON.stringify(cats.filter(c => c.layout != null)))
}
run().finally(() => prisma.$disconnect())
