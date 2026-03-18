"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function EditProductFallback() {
    const router = useRouter()
    
    useEffect(() => {
        // Redirect to the products list since this page is currently empty
        router.push('/dashboard/products')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                <h1 className="text-xl font-bold text-gray-900">Loading product editor...</h1>
                <p className="text-gray-500 mt-2">Redirecting you to the products list.</p>
            </div>
        </div>
    )
}
