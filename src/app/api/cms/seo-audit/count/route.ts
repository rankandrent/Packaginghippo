import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const [posts, products, categories, pages] = await Promise.all([
            prisma.blogPost.findMany({
                where: { isPublished: true },
                select: { seoTitle: true, seoDesc: true }
            }),
            prisma.product.findMany({
                where: { isActive: true },
                select: { seoTitle: true, seoDesc: true }
            }),
            prisma.productCategory.findMany({
                where: { isActive: true },
                select: { seoTitle: true, seoDesc: true }
            }),
            prisma.page.findMany({
                where: { isPublished: true },
                select: { seoTitle: true, seoDesc: true }
            })
        ])

        let count = 0

        posts.forEach((p: any) => { if (!p.seoTitle || !p.seoDesc) count++ })
        products.forEach((p: any) => { if (!p.seoTitle || !p.seoDesc) count++ })
        categories.forEach((c: any) => { if (!c.seoTitle || !c.seoDesc) count++ })
        pages.forEach((p: any) => { if (!p.seoTitle || !p.seoDesc) count++ })

        return NextResponse.json({ count })
    } catch (error) {
        console.error("SEO Audit Count Error:", error)
        return NextResponse.json({ count: 0 }, { status: 500 })
    }
}
