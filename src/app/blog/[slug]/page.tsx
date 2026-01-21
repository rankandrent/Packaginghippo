import Link from "next/link"
import { Calendar, User, Share2, Facebook, Twitter, Linkedin, ChevronRight, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import { DynamicTOC } from "@/components/blog/DynamicTOC"

async function getBlogPost(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cms/blogs?slug=${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug)
    if (!post) return { title: 'Post Not Found' }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDesc || post.excerpt,
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

async function getRelatedPosts(categoryId: string, currentId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cms/blogs?publishedOnly=true`, { cache: 'no-store' })
    if (!res.ok) return []
    const all = await res.json()
    return Array.isArray(all)
        ? all.filter((p: any) => p.categoryId === categoryId && p.id !== currentId).slice(0, 3)
        : []
}

export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug)
    if (!post) notFound()

    const relatedPosts = await getRelatedPosts(post.categoryId, post.id)

    // Simple reading time calc
    const wordCount = post.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    return (
        <div className="min-h-screen bg-white">
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.seoTitle || post.title,
                        "description": post.seoDesc || post.excerpt,
                        "image": post.mainImage,
                        "author": {
                            "@type": "Person",
                            "name": post.author?.name || "Admin"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Packaging Hippo",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://packaginghippo.com/logo.png"
                            }
                        },
                        "datePublished": post.publishedAt || post.createdAt
                    })
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
                            <DynamicTOC />

                            <div className="pt-8 space-y-4 border-t">
                                <h3 className="font-bold text-blue-900 uppercase tracking-wider text-xs border-b pb-2 text-center md:text-left">Share This Post</h3>
                                <div className="flex gap-3 justify-center md:justify-start">
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        <Facebook className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-all"
                                    >
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-700 hover:text-white transition-all"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {post.mainImage && (
                            <img src={post.mainImage} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-12 shadow-lg" />
                        )}

                        <div
                            className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-headings:uppercase prose-headings:font-black prose-a:text-blue-600"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

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
                                    <Link href="#" className="font-bold text-sm text-blue-900 hover:underline">View Profile</Link>
                                    <Link href="#" className="font-bold text-sm text-blue-900 hover:underline">All Posts</Link>
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden mt-8 flex flex-col items-center gap-4">
                            <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">Share This Article</p>
                            <div className="flex gap-4">
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition-all text-blue-600"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-100 rounded-full hover:bg-blue-400 hover:text-white transition-all text-blue-400"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a
                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-100 rounded-full hover:bg-blue-700 hover:text-white transition-all text-blue-700"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`)}
                                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-600 hover:text-white transition-all text-gray-600"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
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
