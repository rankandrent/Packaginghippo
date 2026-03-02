import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
    try {
        const [posts, products, categories, pages] = await Promise.all([
            prisma.blogPost.findMany({
                where: { isPublished: true },
                select: { id: true, title: true, slug: true, seoTitle: true, seoDesc: true, mainImage: true }
            }),
            prisma.product.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true, seoTitle: true, seoDesc: true, images: true }
            }),
            prisma.productCategory.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true, seoTitle: true, seoDesc: true, imageUrl: true }
            }),
            prisma.page.findMany({
                where: { isPublished: true },
                select: { id: true, title: true, slug: true, seoTitle: true, seoDesc: true }
            })
        ])

        const issues: any[] = []

        posts.forEach((p: any) => {
            const missing = []
            if (!p.seoTitle) { missing.push('Meta Title', 'og:title') }
            if (!p.seoDesc) { missing.push('Meta Description', 'og:description') }
            if (!p.mainImage) { missing.push('Main Image', 'og:image', 'Image Alt Text') }

            if (missing.length > 0) {
                issues.push({
                    id: p.id,
                    type: 'Blog Post',
                    name: p.title,
                    slug: p.slug,
                    editUrl: `/dashboard/blog/${p.id}`,
                    missing
                })
            }
        })

        products.forEach((p: any) => {
            const missing = []
            if (!p.seoTitle) { missing.push('Meta Title', 'og:title') }
            if (!p.seoDesc) { missing.push('Meta Description', 'og:description') }
            if (!p.images || p.images.length === 0) { missing.push('Main Image', 'og:image', 'Image Alt Text') }

            if (missing.length > 0) {
                issues.push({
                    id: p.id,
                    type: 'Product',
                    name: p.name,
                    slug: p.slug,
                    editUrl: `/dashboard/products/${p.id}`,
                    missing
                })
            }
        })

        categories.forEach((c: any) => {
            const missing = []
            if (!c.seoTitle) { missing.push('Meta Title', 'og:title') }
            if (!c.seoDesc) { missing.push('Meta Description', 'og:description') }
            if (!c.imageUrl) { missing.push('Main Image', 'og:image', 'Image Alt Text') }

            if (missing.length > 0) {
                issues.push({
                    id: c.id,
                    type: 'Product Category',
                    name: c.name,
                    slug: c.slug,
                    editUrl: `/dashboard/categories/${c.id}`,
                    missing
                })
            }
        })

        pages.forEach((p: any) => {
            const missing = []
            if (!p.seoTitle) { missing.push('Meta Title', 'og:title') }
            if (!p.seoDesc) { missing.push('Meta Description', 'og:description') }

            if (missing.length > 0) {
                issues.push({
                    id: p.id,
                    type: 'Page',
                    name: p.title,
                    slug: p.slug,
                    editUrl: `/dashboard/pages/${p.id}`,
                    missing
                })
            }
        })

        return NextResponse.json({ issues })
    } catch (error) {
        console.error("SEO Audit Error:", error)
        return NextResponse.json({ error: "Failed to perform audit" }, { status: 500 })
    }
}
