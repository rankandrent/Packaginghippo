import Link from "next/link"
import { Calendar, User, Share2, Facebook, Twitter, Linkedin, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"

async function getBlogPost(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cms/blogs?slug=${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
}

export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug)

    if (!post) notFound()

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
                            <div className="flex items-center gap-2 text-sm text-gray-500">
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
                        <div className="sticky top-32 space-y-6">
                            <h3 className="font-bold text-blue-900 uppercase tracking-wider text-sm border-b pb-2">Table of Contents</h3>
                            <nav className="space-y-4">
                                {/* This would normally be dynamically generated from HTML content */}
                                <ul className="space-y-3 text-sm text-gray-500 font-medium">
                                    <li className="hover:text-blue-900 transition-colors cursor-pointer">Quick Overview</li>
                                    <li className="hover:text-blue-900 transition-colors cursor-pointer">Key Benefits</li>
                                    <li className="hover:text-blue-900 transition-colors cursor-pointer">Design Strategies</li>
                                    <li className="hover:text-blue-900 transition-colors cursor-pointer">Conclusion</li>
                                </ul>
                            </nav>

                            <div className="pt-8 space-y-4">
                                <h3 className="font-bold text-blue-900 uppercase tracking-wider text-sm border-b pb-2">Share This Post</h3>
                                <div className="flex gap-3">
                                    <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-4 h-4" /></button>
                                    <button className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-all"><Twitter className="w-4 h-4" /></button>
                                    <button className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-700 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></button>
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

                        {/* Social Share Mobile */}
                        <div className="lg:hidden mt-8 flex flex-col items-center gap-4">
                            <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">Share This Article</p>
                            <div className="flex gap-4">
                                <button className="p-3 bg-gray-100 rounded-full"><Facebook className="w-5 h-5 text-blue-600" /></button>
                                <button className="p-3 bg-gray-100 rounded-full"><Twitter className="w-5 h-5 text-blue-400" /></button>
                                <button className="p-3 bg-gray-100 rounded-full"><Linkedin className="w-5 h-5 text-blue-700" /></button>
                                <button className="p-3 bg-gray-100 rounded-full"><Share2 className="w-5 h-5 text-gray-600" /></button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-900 py-16 text-white text-center">
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
