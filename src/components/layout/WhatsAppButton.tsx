"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)

    useEffect(() => {
        // Fetch settings to context or just fetch here if it's not available globally
        // For simplicity and to avoid prop drilling if layout is server component, 
        // we can fetch or better yet, read from a context provider if one exists.
        // Assuming no global settings context yet, let's fetch. 
        // Ideally this should be passed from the server layout.

        async function fetchSettings() {
            try {
                const res = await fetch('/api/cms/settings')
                const data = await res.json()
                const general = data.settings?.find((s: any) => s.key === 'general')?.value
                if (general?.whatsapp) {
                    setWhatsappNumber(general.whatsapp)
                }
            } catch (error) {
                console.error("Error fetching whatsapp settings:", error)
            }
        }

        fetchSettings()
    }, [])

    if (!whatsappNumber) return null

    // Remove any non-numeric characters for the link
    let cleanNumber = whatsappNumber.replace(/\D/g, '')

    // Heuristic: If number starts with 0 (e.g. 0320...), replace with 92 for Pakistan
    if (cleanNumber.startsWith('0')) {
        cleanNumber = '92' + cleanNumber.substring(1)
    }

    return (
        <a
            href={`https://wa.me/${cleanNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 animate-in fade-in zoom-in duration-300 group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 text-white fill-current" />
            <span className="sr-only">Chat on WhatsApp</span>

            {/* Tooltip */}
            <div className="absolute left-16 bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us
            </div>
        </a>
    )
}
