"use client"

import { Star } from "lucide-react"

interface Review {
    name: string
    role?: string
    rating: number
    text: string
    image?: string
}

export function CustomerReviews({ data }: { data: any }) {
    const heading = data?.heading || "What Our Customers Say"
    const subheading = data?.subheading || "Trusted by thousands of businesses worldwide"
    const reviews: Review[] = data?.items || []

    if (reviews.length === 0) return null

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {heading}
                    </h2>
                    {subheading && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {subheading}
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < (review.rating || 5)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-200 text-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{review.text}"
                            </p>

                            {/* Reviewer */}
                            <div className="flex items-center gap-3">
                                {review.image ? (
                                    <img
                                        src={review.image}
                                        alt={review.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-lg font-semibold text-primary">
                                            {review.name?.charAt(0)?.toUpperCase() || "?"}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{review.name}</p>
                                    {review.role && (
                                        <p className="text-sm text-gray-500">{review.role}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
