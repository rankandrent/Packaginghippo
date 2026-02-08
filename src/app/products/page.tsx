import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Package, ShieldCheck, Truck, Leaf, Palette } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/db"
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema"

export const metadata: Metadata = {
    title: "Custom Packaging Products | Mailer, Rigid & Gift Boxes",
    description: "Explore our wide range of custom packaging solutions including mailer boxes, rigid boxes, gift boxes, and eco-friendly packaging. Get a free quote today!",
    alternates: {
        canonical: '/products',
    },
    openGraph: {
        title: "Custom Packaging Products | Mailer, Rigid & Gift Boxes | Packaging Hippo",
        description: "Explore our wide range of custom packaging solutions including mailer boxes, rigid boxes, gift boxes, and eco-friendly packaging.",
        type: 'website',
        url: '/products',
    },
}

// Revalidate every minute
export const revalidate = 0

async function getCategories() {
    try {
        const categories = await prisma.productCategory.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        })
        return categories
    } catch (e) {
        return []
    }
}

export default async function ProductsPage() {
    const categories = await getCategories()

    const benefits = [
        { icon: ShieldCheck, title: "Premium Quality", desc: "High-grade materials for maximum protection" },
        { icon: Palette, title: "Full Customization", desc: "Your logo, colors, and design" },
        { icon: Leaf, title: "Eco-Friendly Options", desc: "Sustainable and recyclable materials" },
        { icon: Truck, title: "Fast Delivery", desc: "Quick turnaround across the USA" },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Products", url: "/products" }
            ]} />

            <div className="bg-black text-white pt-32 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-4 text-yellow-500">Our Products</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Discover premium custom packaging solutions designed to elevate your brand and protect your products.
                    </p>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="text-center p-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <benefit.icon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                            <p className="text-sm text-gray-600">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Intro Content */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Packaging Solutions for Every Business</h2>
                    <p className="text-gray-600 leading-relaxed">
                        At Packaging Hippo, we offer a comprehensive range of custom packaging products tailored to your specific needs.
                        Whether you're a small business looking for professional mailer boxes, a luxury brand seeking premium rigid boxes,
                        or an eco-conscious company requiring sustainable packaging options, we have you covered.
                        Our expert team works with you to create packaging that not only protects your products but also enhances your brand identity.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <Link href={`/services/${cat.slug}`} key={cat.id} className="group">
                                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="aspect-square bg-white relative flex items-center justify-center p-8 group-hover:bg-yellow-50 transition-colors">
                                        <Package className="w-20 h-20 text-gray-200 group-hover:text-yellow-500 transition-colors" />
                                    </div>
                                    <CardContent className="p-6 bg-white border-t group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                        <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                                        <p className="text-sm opacity-60 flex items-center gap-2">
                                            View Details <ArrowRight className="w-3 h-3" />
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No products found. Please add products from the dashboard.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

