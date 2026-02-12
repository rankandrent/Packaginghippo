"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type BlogPost = {
    id: string
    title: string
    slug: string
    excerpt: string | null
    mainImage: string | null
    publishedAt: string | null
    author?: { name: string; image?: string | null }
    category?: { name: string; slug: string }
}

export function FeaturedBlogs({ posts }: { posts: BlogPost[] }) {
    if (!posts || posts.length === 0) return null

    return (
        <section className="py-16 bg-muted/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Latest Insights
                        </h2>
                        <p className="text-muted-foreground md:text-xl/relaxed max-w-[600px]">
                            Expert tips, packaging trends, and business guides.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="hidden md:inline-flex">
                        <Link href="/blog">
                            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Card key={post.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="relative h-48 w-full overflow-hidden">
                                {post.mainImage ? (
                                    <Image
                                        src={post.mainImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                                {post.category && (
                                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground hover:bg-background/100 backdrop-blur-sm">
                                        {post.category.name}
                                    </Badge>
                                )}
                            </div>
                            <CardHeader className="space-y-2 p-6">
                                <div className="flex items-center text-xs text-muted-foreground gap-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                                        </span>
                                    </div>
                                    {post.author && (
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            <span>{post.author.name}</span>
                                        </div>
                                    )}
                                </div>
                                <Link href={`/blog/${post.slug}`} className="hover:underline">
                                    <h3 className="font-bold text-xl leading-tight line-clamp-2">
                                        {post.title}
                                    </h3>
                                </Link>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 flex-grow">
                                <p className="text-muted-foreground line-clamp-3">
                                    {post.excerpt || "Read more about this topic in our latest blog post..."}
                                </p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button variant="link" className="px-0 text-primary" asChild>
                                    <Link href={`/blog/${post.slug}`}>
                                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/blog">
                            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
