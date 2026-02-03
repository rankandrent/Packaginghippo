
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { generateProductTestimonials, generateCategoryTestimonials } from "@/lib/ai-testimonial"

export async function POST(request: NextRequest) {
    try {
        const { type, id, count = 3 } = await request.json() // type: 'product' | 'category' | 'all'

        if (type === 'product' && id) {
            const product = await prisma.product.findUnique({ where: { id } })
            if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })

            const reviews = await generateProductTestimonials(product.name, product.shortDesc || product.description || "", count)

            // Save to DB
            const created = await Promise.all(reviews.map(r => prisma.testimonial.create({
                data: {
                    name: r.name,
                    role: r.role,
                    content: r.content,
                    rating: r.rating,
                    productId: product.id,
                    isActive: true
                }
            })))

            return NextResponse.json({ created: created.length })
        }

        if (type === 'category' && id) {
            const category = await prisma.productCategory.findUnique({ where: { id } })
            if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 })

            const reviews = await generateCategoryTestimonials(category.name, category.description || "", count)

            // Save to DB
            const created = await Promise.all(reviews.map(r => prisma.testimonial.create({
                data: {
                    name: r.name,
                    role: r.role,
                    content: r.content,
                    rating: r.rating,
                    categoryId: category.id,
                    isActive: true
                }
            })))

            return NextResponse.json({ created: created.length })
        }

        if (type === 'all') {
            // Bulk generation for everything missing reviews
            // This might take long, so in a real app would be a background job.
            // For now we'll do 1 of each just to test, or loop small batch.

            // 1. Find products without testimonials
            // (Prisma doesn't easily support "where relation is empty" in findMany directly effectively without simple logic, 
            // but we can just fetch all and check or fetch those with 0 count logic if we had aggregates)

            // Simplified: Fetch active products, limit to 5 for now to avoid timeout
            const products = await prisma.product.findMany({
                where: { isActive: true },
                take: 5
            })

            let totalCreated = 0
            // Parallelize product processing
            const productResults = await Promise.all(products.map(async (p) => {
                const count = await prisma.testimonial.count({ where: { productId: p.id } })
                if (count < 2) {
                    try {
                        const reviews = await generateProductTestimonials(p.name, p.shortDesc || "", 3)
                        await Promise.all(reviews.map(r => prisma.testimonial.create({
                            data: {
                                name: r.name,
                                role: r.role,
                                content: r.content,
                                rating: r.rating,
                                productId: p.id,
                                isActive: true
                            }
                        })))
                        return reviews.length
                    } catch (e) {
                        console.error(`Failed to gen for product ${p.name}`, e)
                        return 0
                    }
                }
                return 0
            }))
            totalCreated += productResults.reduce((a, b) => a + b, 0)

            // Same for categories
            const categories = await prisma.productCategory.findMany({ where: { isActive: true }, take: 5 })
            // Parallelize category processing
            const categoryResults = await Promise.all(categories.map(async (c) => {
                const count = await prisma.testimonial.count({ where: { categoryId: c.id } })
                if (count < 2) {
                    try {
                        const reviews = await generateCategoryTestimonials(c.name, c.description || "", 3)
                        await Promise.all(reviews.map(r => prisma.testimonial.create({
                            data: {
                                name: r.name,
                                role: r.role,
                                content: r.content,
                                rating: r.rating,
                                categoryId: c.id,
                                isActive: true
                            }
                        })))
                        return reviews.length
                    } catch (e) {
                        console.error(`Failed to gen for category ${c.name}`, e)
                        return 0
                    }
                }
                return 0
            }))
            totalCreated += categoryResults.reduce((a, b) => a + b, 0)

            return NextResponse.json({ created: totalCreated, message: "Processed batch of 5 products/categories" })
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    } catch (error: any) {
        console.error("Generator Error:", error)
        return NextResponse.json({
            error: error.message || "Unknown error",
            message: error.message || "Failed to generate reviews"
        }, { status: 500 })
    }
}
