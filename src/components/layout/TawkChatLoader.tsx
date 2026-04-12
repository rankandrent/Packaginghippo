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

        const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"]
        const fallbackTimer = window.setTimeout(loadTawk, 20000)
        const idleId =
            "requestIdleCallback" in window
                ? window.requestIdleCallback(() => {
                    window.setTimeout(loadTawk, 8000)
                })
                : null

        const handleInteraction = () => {
            loadTawk()
            cleanup()
        }

        const cleanup = () => {
            window.clearTimeout(fallbackTimer)
            if (idleId && "cancelIdleCallback" in window) {
                window.cancelIdleCallback(idleId)
            }
            events.forEach((eventName) => {
                window.removeEventListener(eventName, handleInteraction)
            })
        }

        events.forEach((eventName) => {
            window.addEventListener(eventName, handleInteraction, { passive: true, once: true })
        })

        return cleanup
    }, [])

    return null
}
