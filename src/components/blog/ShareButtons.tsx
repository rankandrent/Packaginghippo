"use client"

import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ShareButtonsProps {
    title: string
    slug: string
    variant?: 'sidebar' | 'bottom'
}

export function ShareButtons({ title, slug, variant = 'sidebar' }: ShareButtonsProps) {
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : ""

    const copyToClipboard = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(shareUrl)
            toast.success("Link copied to clipboard!")
        }
    }

    if (variant === 'bottom') {
        return (
            <div className="flex gap-4">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition-all text-blue-600"
                >
                    <Facebook className="w-5 h-5" />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 rounded-full hover:bg-blue-400 hover:text-white transition-all text-blue-400"
                >
                    <Twitter className="w-5 h-5" />
                </a>
                <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 rounded-full hover:bg-blue-700 hover:text-white transition-all text-blue-700"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
                <button
                    onClick={copyToClipboard}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-600 hover:text-white transition-all text-gray-600"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
        )
    }

    return (
        <div className="flex gap-3 justify-center md:justify-start">
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
                <Facebook className="w-4 h-4" />
            </a>
            <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-all"
            >
                <Twitter className="w-4 h-4" />
            </a>
            <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-700 hover:text-white transition-all"
            >
                <Linkedin className="w-4 h-4" />
            </a>
            <button
                onClick={copyToClipboard}
                className="p-2 bg-blue-50 text-gray-600 rounded-full hover:bg-gray-600 hover:text-white transition-all"
            >
                <Share2 className="w-4 h-4" />
            </button>
        </div>
    )
}
