import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const slug = searchParams.get('slug')
        const category = searchParams.get('category')
        const publishedOnly = searchParams.get('publishedOnly') === 'true'

        if (id) {
            const post = await prisma.blogPost.findUnique({
                where: { id },
                include: { author: true, category: true }
            })
            return NextResponse.json(post)
        }

        if (slug) {
            const post = await prisma.blogPost.findUnique({
                where: { slug },
                include: { author: true, category: true }
            })
            return NextResponse.json(post)
        }

        const where: any = {}
        if (publishedOnly) where.isPublished = true
        if (category) where.category = { slug: category }

        const posts = await prisma.blogPost.findMany({
            where,
            include: { author: true, category: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error("GET /api/cms/blogs error:", error)
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const post = await prisma.blogPost.create({
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.excerpt,
                mainImage: body.mainImage,
                authorId: body.authorId,
                categoryId: body.categoryId,
                seoTitle: body.seoTitle,
                seoDesc: body.seoDesc,
                seoKeywords: body.seoKeywords,
                isPublished: body.isPublished,
                publishedAt: body.isPublished ? new Date() : null,
            }
        })
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, author, category, createdAt, updatedAt, ...data } = body

        if (data.isPublished && !data.publishedAt) {
            data.publishedAt = new Date()
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data
        })
        return NextResponse.json(post)
    } catch (error) {
        console.error("PUT /api/cms/blogs error:", error)
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.blogPost.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
    }
}
