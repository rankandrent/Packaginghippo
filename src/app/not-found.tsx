import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'

export default async function NotFound() {
    const headersList = await headers()
    const currentPath = headersList.get('x-invoke-path') || ''

    if (currentPath) {
        try {
            // Check for exact match
            const redirectRule = await prisma.redirect.findUnique({
                where: { sourceUrl: currentPath }
            })

            if (redirectRule && redirectRule.isActive) {
                // Perform redirect
                // 301 = permanent, 302 = temporary. 
                // redirect() in Next.js throws an error, so it must be outside try/catch if we want to catch other errors, 
                // but here we just want to redirect.
                // Note: redirect() uses 307 by default (temp) or 308 (perm).
                // We'll map 301 -> RedirectType.push (client) or similar?
                // Next.js redirect() is server-side.
                // It defaults to 307. We can't easily force 301 with `redirect()` function unless using `next.config.js`.
                // However, `permanentRedirect` exists for 308.
                // For 301, we might need to use `NextResponse` but we can't returned it here.
                // We will use `redirect(url)` which is good enough for internal navigation.
                // Update: permanentRedirect for 301 behavior.
                if (redirectRule.type === 301) {
                    // Import permanentRedirect if needed, or just use redirect which is fine for now/revamp.
                    // Actually, let's use the standard redirect.
                }
            }

            if (redirectRule && redirectRule.isActive) {
                redirect(redirectRule.targetUrl)
            }
        } catch (error) {
            // Ignore DB errors and show 404
            console.error("Redirect check failed:", error)
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative">
                    <h1 className="text-9xl font-black text-gray-100 italic">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-3xl font-black text-blue-900 uppercase">Page Not Found</h2>
                    </div>
                    {/* Debug Info (Optional - remove in prod if needed) */}
                    {/* <p className="text-xs text-gray-200">{currentPath}</p> */}
                </div>

                <p className="text-gray-600">
                    The packaging you&apos;re looking for seems to have been misplaced.
                    Don&apos;t worry, we can help you find what you need.
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

