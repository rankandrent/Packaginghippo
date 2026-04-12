"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton({ whatsappNumber }: { whatsappNumber?: string | null }) {

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
