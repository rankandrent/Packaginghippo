import { getSeoImageUrl } from "@/lib/image-seo"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
    siteName?: string
    logoUrl?: string | null
    variant?: "full" | "mark"
    theme?: "default" | "light"
    size?: "sm" | "md" | "lg"
    className?: string
}

function BrandMark({ color = "#123B9F", className }: { color?: string, className?: string }) {
    return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
            <polygon
                points="60,8 98,30 98,78 60,100 22,78 22,30"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinejoin="round"
            />
            <path fill={color} d="M37 52L58 34L85 45L67 58L57 51L45 60Z" />
            <path fill={color} d="M42 66L56 58L56 83L42 75Z" />
            <path fill={color} d="M60 66L78 50L91 57L82 65L90 72L75 85L67 78L74 71L60 75Z" />
            <polygon fill="white" points="43,57 56,49 67,56 54,64" />
            <polygon fill="white" points="43,66 54,60 54,80 43,74" />
            <polygon fill="white" points="65,67 77,56 81,59 74,65 81,69 69,79 65,76 71,70 65,71" />
        </svg>
    )
}

function resolveLogoUrl(logoUrl?: string | null) {
    if (!logoUrl || logoUrl === "/logo.png") {
        return "/logo-horizontal.svg"
    }

    return getSeoImageUrl(logoUrl)
}

export function BrandLogo({
    siteName = "Packaging Hippo",
    logoUrl,
    variant = "full",
    theme = "default",
    size = "md",
    className,
}: BrandLogoProps) {
    const primaryText = theme === "light" ? "text-white" : "text-[#123B9F]"
    const accentText = "text-[#E7B11E]"
    const markColor = theme === "light" ? "#FFFFFF" : "#123B9F"
    const markSize = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11"
    const packagingSize = size === "sm" ? "text-lg" : size === "lg" ? "text-[2rem]" : "text-2xl"
    const hippoSize = size === "sm" ? "text-lg" : size === "lg" ? "text-[2rem]" : "text-2xl"
    const words = siteName.trim().split(/\s+/)
    const firstLine = words[0] || "Packaging"
    const secondLine = words.slice(1).join(" ") || "Hippo"
    const resolvedLogoUrl = resolveLogoUrl(logoUrl)

    if (resolvedLogoUrl) {
        return (
            <div className={cn("inline-flex items-center", className)}>
                <img
                    src={resolvedLogoUrl}
                    alt={siteName}
                    className={cn(
                        "h-auto w-auto object-contain",
                        variant === "mark"
                            ? size === "sm"
                                ? "max-h-9"
                                : size === "lg"
                                  ? "max-h-14"
                                  : "max-h-11"
                            : size === "sm"
                              ? "max-h-10"
                              : size === "lg"
                                ? "max-h-16"
                                : "max-h-12"
                    )}
                />
            </div>
        )
    }

    return (
        <div className={cn("inline-flex items-center gap-3", className)}>
            <BrandMark color={markColor} className={cn("shrink-0", markSize)} />
            {variant === "full" ? (
                <div className="leading-[0.92]">
                    <div className={cn("font-black uppercase", packagingSize, primaryText)}>
                        {firstLine}
                    </div>
                    <div className={cn("font-black uppercase", hippoSize, accentText)}>
                        {secondLine}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
