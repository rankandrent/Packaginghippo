import Link from "next/link"
import { Calendar, User, ChevronRight, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { DynamicTOC } from "@/components/blog/DynamicTOC"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { QuoteForm } from "@/components/forms/QuoteForm"
import { JsonLd } from "@/components/seo/JsonLd"

async function getBlogPost(slug: string) {
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true, category: true }
    })
    return post
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getBlogPost(slug)
    if (!post) return { title: 'Post Not Found' }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDesc || post.excerpt,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDesc || post.excerpt,
            images: post.mainImage ? [{ url: post.mainImage }] : [],
            type: 'article',
            publishedTime: post.publishedAt || post.createdAt,
            authors: [post.author?.name || 'Admin'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seoTitle || post.title,
            description: post.seoDesc || post.excerpt,
            images: post.mainImage ? [post.mainImage] : [],
        }
    }
}

async function getRelatedPosts(categoryId: string | null, currentId: string) {
    if (!categoryId) return []
    const posts = await prisma.blogPost.findMany({
        where: {
            categoryId,
            id: { not: currentId },
            isPublished: true
        },
        include: { author: true, category: true },
        take: 3,
        orderBy: { createdAt: 'desc' }
    })
    return posts
}

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getBlogPost(slug)
    if (!post) notFound()

    const relatedPosts = await getRelatedPosts(post.categoryId, post.id)

    // Simple reading time calc
    const wordCount = post.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    return (
        <div className="min-h-screen bg-white">
            {/* Structured Data for SEO */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "@id": `https://packaginghippo.com/blog/${post.slug}`,
                    "headline": post.seoTitle || post.title,
                    "description": post.seoDesc || post.excerpt,
                    "image": post.mainImage ? [post.mainImage] : [],
                    "author": {
                        "@type": "Person",
                        "name": post.author?.name || "Admin",
                        "url": post.author?.slug ? `https://packaginghippo.com/blog/author/${post.author.slug}` : undefined
                    },
                    "publisher": {
                        "@id": "https://packaginghippo.com/#organization"
                    },
                    "datePublished": post.publishedAt || post.createdAt,
                    "dateModified": post.updatedAt || post.publishedAt || post.createdAt,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `https://packaginghippo.com/blog/${post.slug}`
                    }
                }}
            />

            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://packaginghippo.com" },
                        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://packaginghippo.com/blog" },
                        { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://packaginghippo.com/blog/${post.slug}` }
                    ]
                }}
            />

            {/* Header / Hero */}
            <div className="bg-gray-50 pt-24 pb-12 md:pt-32 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                            <Link href="/" className="hover:text-blue-900">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link href="/blog" className="hover:text-blue-900">Blog</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="truncate">{post.title}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-blue-900 uppercase mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 border">
                                    {post.author?.image && <img src={post.author.image} alt={post.author.name} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{post.author?.name || 'Admin'}</p>
                                    <p className="text-xs text-gray-500">{post.author?.role || 'Packaging Expert'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 border-l pl-6">
                                <Clock className="w-4 h-4" />
                                {readingTime} min read
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 border-l pl-6">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Left Sidebar - Table of Contents */}
                    <div className="hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <DynamicTOC selector=".rich-text" />

                            <div className="pt-8 space-y-4 border-t">
                                <h3 className="font-bold text-blue-900 uppercase tracking-wider text-xs border-b pb-2 text-center md:text-left">Share This Post</h3>
                                <ShareButtons title={post.title} slug={post.slug} />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {post.mainImage && (
                            <img src={post.mainImage} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-12 shadow-lg" />
                        )}

                        <div
                            className="rich-text max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* RFQ Form */}
                        <div className="mt-16 pt-16 border-t">
                            <QuoteForm
                                theme="light"
                                title="Custom Packaging Quote"
                                subtitle="Interested in similar packaging? Get a custom quote for your business today."
                                pageSource={`Blog: ${post.title}`}
                            />
                        </div>

                        {/* Author Info (EEAT) */}
                        <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border shrink-0">
                                {post.author?.image && <img src={post.author.image} alt={post.author.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-xl font-bold text-blue-900 uppercase">Written by {post.author?.name || 'Admin'}</h4>
                                    <p className="text-sm font-semibold text-gray-500">{post.author?.role || 'Packaging Expert'}</p>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {post.author?.bio || "Expert in custom packaging solutions, sustainability, and brand development with years of experience in the industrial packaging sector."}
                                </p>
                                <div className="flex justify-center md:justify-start gap-4 pt-2">
                                    <Link href={`/blog/author/${post.author?.slug}`} className="font-bold text-sm text-blue-900 hover:underline">View Profile</Link>
                                    <Link href={`/blog?author=${post.author?.slug}`} className="font-bold text-sm text-blue-900 hover:underline">All Posts</Link>
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden mt-8 flex flex-col items-center gap-4">
                            <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">Share This Article</p>
                            <ShareButtons title={post.title} slug={post.slug} variant="bottom" />
                        </div>
                    </div>

                </div>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-24 pt-16 border-t max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-black text-blue-900 uppercase">Related Articles</h2>
                            <Link href="/blog" className="text-sm font-bold text-blue-900 hover:underline flex items-center gap-2">View All Posts <ChevronRight className="w-4 h-4" /></Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map((rp: any) => (
                                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group space-y-4">
                                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border relative">
                                        {rp.mainImage && <img src={rp.mainImage} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-gray-900 leading-snug group-hover:text-blue-900 transition-colors uppercase line-clamp-2">{rp.title}</h4>
                                        <p className="text-xs text-gray-500">{new Date(rp.publishedAt || rp.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-blue-900 py-20 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">Need Custom Packaging Solutions?</h2>
                    <p className="text-blue-100 mb-10 max-w-2xl mx-auto">Get a personalized quote for your business today. Our experts are ready to help.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 text-gray-900">
                        <Link href="/quote" className="px-10 py-4 bg-yellow-500 hover:bg-yellow-400 font-black uppercase rounded-lg transition-all shadow-lg shadow-yellow-500/10">Get A Quote</Link>
                        <Link href="/contact" className="px-10 py-4 bg-white hover:bg-gray-100 font-black uppercase rounded-lg transition-all">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
