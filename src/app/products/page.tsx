import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Package } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/db"

// Revalidate every minute
export const revalidate = 60

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-black text-white pt-32 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-4 text-yellow-500">Our Products</h1>
                    <p className="text-xl text-gray-400">Explore our wide range of custom packaging solutions.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <Link href={`/products/${cat.slug}`} key={cat.id} className="group">
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
