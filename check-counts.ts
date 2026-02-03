
import prisma from "@/lib/db"

async function main() {
    const pCount = await prisma.product.count()
    const cCount = await prisma.productCategory.count()
    const tCount = await prisma.testimonial.count()
    console.log(`Products: ${pCount}`)
    console.log(`Categories: ${cCount}`)
    console.log(`Testimonials: ${tCount}`)

    if (pCount === 0 && cCount === 0) {
        console.log("WARNING: No products or categories found. AI generation has nothing to write about.")
    }
}

main()
