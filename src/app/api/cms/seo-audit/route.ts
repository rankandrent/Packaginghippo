import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
    try {
        const [posts, products, categories, pages] = await Promise.all([
            prisma.blogPost.findMany({
                where: { isPublished: true },
                select: { id: true, title: true, slug: true, seoTitle: true, seoDesc: true }
            }),
            prisma.product.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true, seoTitle: true, seoDesc: true }
            }),
            prisma.productCategory.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true, seoTitle: true, seoDesc: true }
            }),
            prisma.page.findMany({
                where: { isPublished: true },
                select: { id: true, title: true, slug: true, seoTitle: true, seoDesc: true }
            })
        ])

        const issues: any[] = []

        posts.forEach((p: any) => {
            if (!p.seoTitle || !p.seoDesc) {
                issues.push({
                    id: p.id,
                    type: 'Blog Post',
                    name: p.title,
                    slug: p.slug,
                    editUrl: `/dashboard/blog/${p.id}`,
                    missing: [!p.seoTitle && 'Meta Title', !p.seoDesc && 'Meta Description'].filter(Boolean) as string[]
                })
            }
        })

        products.forEach((p: any) => {
            if (!p.seoTitle || !p.seoDesc) {
                issues.push({
                    id: p.id,
                    type: 'Product',
                    name: p.name,
                    slug: p.slug,
                    editUrl: `/dashboard/products/${p.id}`,
                    missing: [!p.seoTitle && 'Meta Title', !p.seoDesc && 'Meta Description'].filter(Boolean) as string[]
                })
            }
        })

        categories.forEach((c: any) => {
            if (!c.seoTitle || !c.seoDesc) {
                issues.push({
                    id: c.id,
                    type: 'Product Category',
                    name: c.name,
                    slug: c.slug,
                    editUrl: `/dashboard/categories/${c.id}`,
                    missing: [!c.seoTitle && 'Meta Title', !c.seoDesc && 'Meta Description'].filter(Boolean) as string[]
                })
            }
        })

        pages.forEach((p: any) => {
            if (!p.seoTitle || !p.seoDesc) {
                issues.push({
                    id: p.id,
                    type: 'Page',
                    name: p.title,
                    slug: p.slug,
                    editUrl: `/dashboard/pages/${p.id}`,
                    missing: [!p.seoTitle && 'Meta Title', !p.seoDesc && 'Meta Description'].filter(Boolean) as string[]
                })
            }
        })

        return NextResponse.json({ issues })
    } catch (error) {
        console.error("SEO Audit Error:", error)
        return NextResponse.json({ error: "Failed to perform audit" }, { status: 500 })
    }
}
