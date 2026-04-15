"use client"

import { Star } from "lucide-react"

type Testimonial = {
    id: string
    name: string
    role?: string
    content: string
    rating: number
    image?: string
}

type AggregateRating = {
    ratingValue: number
    bestRating: number
    ratingCount: number
}

export default function TestimonialsSection({
    testimonials,
    aggregateRating,
}: {
    testimonials: Testimonial[]
    aggregateRating?: AggregateRating
}) {
    if ((!testimonials || testimonials.length === 0) && !aggregateRating) return null

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We take pride in our work and the relationships we've built. Here's what some of our happy customers have to say about their experience.
                    </p>
                    {aggregateRating && (
                        <div className="mt-6 flex justify-center">
                            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[...Array(5)].map((_, index) => (
                                        <Star key={index} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                                <span className="font-bold text-gray-900">
                                    {aggregateRating.ratingValue}/{aggregateRating.bestRating}
                                </span>
                                <span className="text-gray-600">
                                    based on {aggregateRating.ratingCount} reviews
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {testimonials && testimonials.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(testimonial.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600 font-medium">{testimonial.rating}</span>
                                </div>
                                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                                    "{testimonial.content}"
                                </blockquote>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mr-4">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        {testimonial.role && (
                                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
