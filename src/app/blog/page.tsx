import Link from "next/link"
import { Metadata } from "next"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn, constructMetadataTitle } from "@/lib/utils"

import prisma from "@/lib/db"

async function getBlogs(category?: string, author?: string) {
    const where: any = { isPublished: true }
    if (category) {
        where.category = { slug: category }
    }
    if (author) {
        where.author = { slug: author }
    }

    const posts = await prisma.blogPost.findMany({
        where,
        include: { author: true, category: true },
        orderBy: { createdAt: 'desc' }
    })
    return posts
}

async function getCategories() {
    return prisma.blogCategory.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: constructMetadataTitle("Packaging Insights Blog | Trends & Packaging Solutions"),
        description: "Explore the latest packaging trends, industry insights, and expert advice for custom branded boxes and shipping solutions.",
        alternates: {
            canonical: '/blog',
        },
        openGraph: {
            title: "Packaging Insights Blog | Trends & Packaging Solutions",
            description: "Expert packaging advice and industry trends.",
            type: 'website',
            url: '/blog',
        },
        twitter: {
            card: 'summary_large_image',
            title: "Packaging Insights Blog",
            description: "Expert packaging advice and industry trends.",
        }
    }
}

export default async function BlogListingPage({ searchParams }: { searchParams: Promise<{ category?: string; author?: string }> }) {
    const { category, author } = await searchParams
    const [posts, categories, authorData] = await Promise.all([
        getBlogs(category, author),
        getCategories(),
        author ? prisma.author.findUnique({ where: { slug: author } }) : Promise.resolve(null)
    ])

    const isFiltering = !!(category || author)
    const featuredPost = isFiltering ? null : posts[0]
    const remainingPosts = isFiltering ? posts : posts.slice(1)

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 md:pt-32">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1">OUR BLOG</Badge>
                        <h1 className="text-4xl md:text-6xl font-black text-blue-900 mb-6 uppercase tracking-tight">
                            {authorData ? `Posts by ${authorData.name}` : (category ? `${category} Insights` : "Packaging Insights")}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {authorData ? authorData.bio : "Expert advice, industry trends, and premium packaging solutions to help your brand stand out."}
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        <Link
                            href="/blog"
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                                !category ? "bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-900/20" : "bg-white text-gray-500 border-gray-200 hover:border-blue-900 hover:text-blue-900"
                            )}
                        >
                            All Posts
                        </Link>
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                href={`/blog?category=${cat.slug}`}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all border uppercase",
                                    category === cat.slug ? "bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-900/20" : "bg-white text-gray-500 border-gray-200 hover:border-blue-900 hover:text-blue-900"
                                )}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                    {/* Featured Post */}
                    {featuredPost && (
                        <Link href={`/blog/${featuredPost.slug}`} className="group relative block mb-20">
                            <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 min-h-[450px]">
                                <div className="relative overflow-hidden aspect-video lg:aspect-auto bg-gray-100">
                                    {featuredPost.mainImage && (
                                        <img src={featuredPost.mainImage} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    )}
                                    <div className="absolute top-6 left-6">
                                        <Badge className="bg-yellow-500 text-gray-900 border-none font-black uppercase">Featured</Badge>
                                    </div>
                                </div>
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
                                        <span>{new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{featuredPost.author?.name || 'Admin'}</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-6 group-hover:text-blue-700 transition-colors uppercase leading-tight">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                                        {featuredPost.excerpt || "Expert insights on premium packaging solutions and brand development strategies to help you scale your business."}
                                    </p>
                                    <div className="flex items-center text-blue-900 font-black uppercase tracking-wider text-sm">
                                        Read Featured Article <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {remainingPosts.map((post: any) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col">
                                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                    {post.mainImage ? (
                                        <img src={post.mainImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author?.name || 'Admin'}</span>
                                    </div>
                                    <h2 className="text-xl font-black text-blue-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2 uppercase leading-snug">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {post.excerpt || "Discover expert packaging strategies and industry trends tailored for modern brand success."}
                                    </p>
                                    <div className="flex items-center text-blue-900 font-black uppercase tracking-wider text-xs">
                                        Read More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
                            <p className="text-lg font-bold">No blog posts found in this category.</p>
                            <Link href="/blog" className="text-blue-900 underline mt-4 inline-block font-bold">View all posts</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
