
import prisma from "@/lib/db"

export const revalidate = 60 // ISR

export async function getCategory(slug: string) {
    const category = await prisma.productCategory.findUnique({
        where: { slug, isActive: true },
        include: {
            products: {
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    shortDesc: true,
                    images: true,
                    price: true
                }
            }
        }
    })
    return category
}

export async function getProduct(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug, isActive: true },
        include: { category: true }
    })
    return product
}

export async function getPage(slug: string) {
    const page = await prisma.page.findUnique({
        where: { slug, isPublished: true }
    })
    return page
}

export async function getTestimonials(categoryId?: string, productId?: string) {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: {
                isActive: true,
                OR: [
                    { productId: productId },
                    { categoryId: categoryId },
                    { productId: null, categoryId: null }
                ]
            },
            take: 6
        })

        return testimonials.sort((a: any, b: any) => {
            // Prioritize specific matches
            if (productId) {
                if (a.productId === productId && b.productId !== productId) return -1
                if (a.productId !== productId && b.productId === productId) return 1
            }
            if (categoryId) {
                if (a.categoryId === categoryId && b.categoryId !== categoryId) return -1
                if (a.categoryId !== categoryId && b.categoryId === categoryId) return 1
            }
            return 0
        }).map((t: any) => ({
            ...t,
            rating: t.rating
        }))
    } catch (error) {
        console.error("Error fetching testimonials:", error)
        return []
    }
}

export async function getRelatedCategories(currentSlug: string) {
    const categories = await prisma.productCategory.findMany({
        where: {
            isActive: true,
            slug: { not: currentSlug }
        },
        take: 4,
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            description: true
        }
    });
    return categories;
}

export async function getPopularProducts(categoryId: string) {
    const products = await prisma.product.findMany({
        where: {
            categoryId: categoryId,
            isActive: true,
            isFeaturedInCategory: true
        },
        take: 8,
        select: {
            id: true,
            name: true,
            slug: true,
            shortDesc: true,
            images: true,
            price: true
        }
    });

    if (products.length === 0) {
        return await prisma.product.findMany({
            where: {
                categoryId: categoryId,
                isActive: true
            },
            take: 4,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                shortDesc: true,
                images: true,
                price: true
            }
        })
    }

    return products;
}

export async function getQuoteFormImage() {
    try {
        const section = await prisma.homepageSection.findFirst({
            where: {
                sectionKey: 'custom_quote_form',
                isActive: true
            }
        })
        return (section?.content as any)?.image || null
    } catch (error) {
        console.error("Error fetching quote form image:", error)
        return null
    }
}

export async function getFeaturedBlogs() {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                isPublished: true,
                isFeatured: true
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                category: {
                    select: {
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: {
                publishedAt: 'desc'
            },
            take: 3
        })
        return posts.map(post => ({
            ...post,
            publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null
        }))
    } catch (error) {
        console.error("Error fetching featured blogs:", error)
        return []
    }
}
