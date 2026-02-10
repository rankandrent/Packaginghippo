
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const counts = {
            products: await prisma.product.count(),
            categories: await prisma.productCategory.count(),
            inquiries: await prisma.inquiry.count(),
            blogPosts: await prisma.blogPost.count(),
            pages: await prisma.page.count(),
            siteSettings: await prisma.siteSettings.count(),
            homepageSections: await prisma.homepageSection.count(),
        }

        return NextResponse.json({ counts })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
