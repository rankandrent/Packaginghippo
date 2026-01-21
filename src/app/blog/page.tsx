import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

async function getBlogs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cms/blogs?publishedOnly=true`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
}

export default async function BlogListingPage() {
    const posts = await getBlogs()

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 md:pt-32">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-4 uppercase">Packaging Insights</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Expert advice, industry trends, and packaging solutions to help your brand grow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col">
                                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                    {post.mainImage ? (
                                        <img src={post.mainImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author?.name || 'Admin'}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors line-clamp-2 uppercase">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                        {post.excerpt || (post.content?.substring(0, 150) + '...')}
                                    </p>
                                    <div className="flex items-center text-blue-900 font-bold text-sm">
                                        Read More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border">
                            <p className="text-gray-500">No blog posts found. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
