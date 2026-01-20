import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-zinc-950 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-500/10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl font-black mb-6">About Packaging Hippo</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We are the architects of your brand's first impression. Delivering premium, sustainable, and custom packaging solutions globally.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-yellow-500">Our Story</h2>
                        <div className="prose prose-lg text-gray-600">
                            <p>
                                Founded with a vision to revolutionize the packaging industry, Packaging Hippo has grown from a small local press to a global manufacturing powerhouse. We believe that packaging is more than just a box—it's a powerful marketing tool that tells your brand's story.
                            </p>
                            <p>
                                Our state-of-the-art facilities in New York and California allow us to produce millions of boxes annually while maintaining strict quality control and eco-friendly practices.
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            {["100% Recyclable Materials", "Offset & Digital Printing", "Free 3D Design Support", "Global Shipping"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 font-medium">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    {item}
                                </div>
                            ))}
                        </div>

                        <Button variant="yellow" size="lg" className="mt-8" asChild>
                            <Link href="/contact">Contact Our Team</Link>
                        </Button>
                    </div>

                    <div className="bg-gray-100 rounded-3xl p-12 relative">
                        <div className="absolute inset-0 border-4 border-yellow-500 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
                        {/* Placeholder for About Image */}
                        <div className="aspect-[4/5] bg-gray-300 rounded-xl flex items-center justify-center text-gray-500 font-bold">
                            Factory / Team Image Placeholder
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
