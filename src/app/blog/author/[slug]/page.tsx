import Link from "next/link"
import { Metadata } from "next"
import { Calendar, ArrowRight, User, GraduationCap, MapPin, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { constructMetadataTitle } from "@/lib/utils"

async function getAuthor(slug: string) {
    return prisma.author.findUnique({
        where: { slug },
        include: {
            posts: {
                where: { isPublished: true },
                orderBy: { createdAt: 'desc' },
                include: { category: true }
            }
        }
    })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const author = await getAuthor(slug)
    if (!author) return { title: 'Author Not Found' }

    return {
        title: constructMetadataTitle(author.seoTitle || `${author.name} | Packaging Expert Profile`),
        description: author.seoDesc || author.bio || `Read articles and professional insights from ${author.name}, a featured packaging expert at Packaging Hippo.`,
    }
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const author = await getAuthor(slug)

    if (!author) notFound()

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 md:pt-32">
            {/* Author Header Section */}
            <div className="bg-gray-50 border-y py-16 mb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                        {/* Profile Image */}
                        <div className="w-40 h-40 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl shrink-0">
                            {author.image ? (
                                <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-900 font-black text-5xl uppercase">
                                    {author.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-blue-900 uppercase tracking-tight mb-2">{author.name}</h1>
                                <p className="text-xl font-bold text-blue-700 uppercase tracking-widest">{author.role || 'Packaging Expert'}</p>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed italic">
                                "{author.bio || `Senior contributor at Packaging Hippo specializing in ${author.role || 'industrial packaging solutions'} and brand growth.`}"
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    <MapPin className="w-4 h-4 text-blue-900" /> Global Expert
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    <GraduationCap className="w-4 h-4 text-blue-900" /> {author.posts.length} Articles Published
                                </div>
                            </div>

                            {/* Social Links */}
                            {author.socialLinks && (author.socialLinks as any).twitter || (author.socialLinks as any).linkedin || (author.socialLinks as any).website ? (
                                <div className="flex justify-center md:justify-start gap-4 pt-4 border-t w-fit mx-auto md:mx-0">
                                    {(author.socialLinks as any).linkedin && (
                                        <Link href={(author.socialLinks as any).linkedin} target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                    )}
                                    {(author.socialLinks as any).twitter && (
                                        <Link href={(author.socialLinks as any).twitter} target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                    )}
                                    {(author.socialLinks as any).website && (
                                        <Link href={(author.socialLinks as any).website} target="_blank" className="text-gray-400 hover:text-blue-900 transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* Author's Posts Section */}
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12 border-b pb-6">
                        <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Expert Articles By {author.name}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {author.posts.map((post: any) => (
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
                                        {post.category && <span className="text-blue-900 font-black">{post.category.name}</span>}
                                    </div>
                                    <h3 className="text-xl font-black text-blue-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2 uppercase leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {post.excerpt || "Discover expert packaging strategies and industry trends tailored for modern brand success."}
                                    </p>
                                    <div className="flex items-center text-blue-900 font-black uppercase tracking-wider text-xs">
                                        Read Full Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {author.posts.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed text-gray-400">
                            <p className="text-lg font-bold uppercase tracking-tight">No Articles Found Yet</p>
                            <Link href="/blog" className="text-blue-900 underline mt-4 inline-block font-bold uppercase">View all insights</Link>
                        </div>
                    )}

                    {/* Back to Blog */}
                    <div className="mt-20 text-center">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-black text-blue-900 uppercase hover:text-blue-700 transition-colors border-2 border-blue-900 px-8 py-3 rounded-xl"
                        >
                            View All Blog Articles
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
