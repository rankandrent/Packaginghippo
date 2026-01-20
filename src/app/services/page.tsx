import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Box, Leaf, ShoppingBag, Truck } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/db"

export const revalidate = 60

async function getServices() {
    try {
        // In this schema, Product Categories serve as services
        const categories = await prisma.productCategory.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        })
        return categories
    } catch (e) {
        return []
    }
}

export default async function ServicesPage() {
    const services = await getServices()

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-black text-white pt-32 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-4 text-yellow-500">Our Services</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        From structural design to final production, we offer end-to-end packaging solutions for every industry.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <Link href={`/services/${service.slug}`} key={i} className="group">
                            <Card className="h-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-yellow-400 transition-all duration-300">
                                <CardContent className="p-8 space-y-4">
                                    <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                        <Box className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                                    <p className="text-gray-500 leading-relaxed">{service.description}</p>
                                    <div className="pt-4 flex items-center text-sm font-bold text-yellow-600 group-hover:gap-2 transition-all">
                                        Learn More <ArrowRight className="ml-1 w-4 h-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Custom Solution CTA */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl font-bold">Can't Find What You Need?</h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        We specialize in completely custom projects. If you have unique requirements, our engineering team is ready to help.
                    </p>
                    <Button variant="default" size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold" asChild>
                        <Link href="/contact">Contact Custom Team</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
