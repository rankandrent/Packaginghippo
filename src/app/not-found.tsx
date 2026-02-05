import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative">
                    <h1 className="text-9xl font-black text-gray-100 italic">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-3xl font-black text-blue-900 uppercase">Page Not Found</h2>
                    </div>
                </div>

                <p className="text-gray-600">
                    The packaging you're looking for seems to have been misplaced.
                    Don't worry, we can help you find what you need.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white font-bold uppercase rounded-lg hover:bg-blue-800 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Home
                    </Link>
                    <Link
                        href="/products"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-900 text-blue-900 font-bold uppercase rounded-lg hover:bg-blue-50 transition-all"
                    >
                        <Search className="w-5 h-5" />
                        Browse Products
                    </Link>
                </div>

                <div className="pt-8 border-t">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Popular Categories</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/services/custom-rigid-boxes" className="text-xs font-bold text-gray-600 hover:text-blue-900 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Rigid Boxes</Link>
                        <Link href="/services/gift-boxes" className="text-xs font-bold text-gray-600 hover:text-blue-900 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Gift Boxes</Link>
                        <Link href="/blog" className="text-xs font-bold text-gray-600 hover:text-blue-900 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Packaging Guide</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
