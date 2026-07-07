"use client"

import { useEffect } from "react"

declare global {
    interface Window {
        __tawkLoaded?: boolean
        Tawk_API?: unknown
        Tawk_LoadStart?: Date
    }
}

const TAWK_SRC = "https://embed.tawk.to/66fc04b2e5982d6c7bb7336c/1i9474n3p"

/**
 * Loads Tawk.to right after the page finishes loading (mirrors Next.js's
 * `Script strategy="lazyOnload"`, which is what this project used originally).
 *
 * A prior "performance" change gated this behind either a user interaction
 * (scroll/click/keydown/touch) or a 20-28s fallback timer. Visitors who
 * browsed without interacting and left within that window meant Tawk never
 * loaded at all, so the owner never got a "visitor on site" notification and
 * no chat could even start. Loading promptly on mount fixes that regression.
 */
export function TawkChatLoader() {
    useEffect(() => {
        if (typeof window === "undefined" || window.__tawkLoaded) return

        const loadTawk = () => {
            if (window.__tawkLoaded) return
            window.__tawkLoaded = true
            window.Tawk_API = window.Tawk_API || {}
            window.Tawk_LoadStart = new Date()

            const script = document.createElement("script")
            script.async = true
            script.src = TAWK_SRC
            script.charset = "UTF-8"
            script.setAttribute("crossorigin", "*")
            document.body.appendChild(script)
        }

        if (document.readyState === "complete") {
            loadTawk()
            return
        }

        window.addEventListener("load", loadTawk, { once: true })
        return () => window.removeEventListener("load", loadTawk)
    }, [])

    return null
}
