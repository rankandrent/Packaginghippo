import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function constructMetadataTitle(title?: string | null, siteName: string = "Packaging Hippo") {
  if (!title) return undefined;
  if (title.toLowerCase().includes(siteName.toLowerCase())) {
    return { absolute: title };
  }
  return title;
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://packaginghippo.com"
  ).replace(/\/$/, "")
}

export function stripHtml(value?: string | null, maxLength?: number) {
  if (!value) return undefined

  const plainText = value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim()

  if (!maxLength || plainText.length <= maxLength) {
    return plainText
  }

  return `${plainText.slice(0, Math.max(0, maxLength - 3)).trim()}...`
}

const INTERNAL_LINK_HOSTS = new Set(["packaginghippo.com", "www.packaginghippo.com"])

function isInternalHref(href: string) {
  if (!href) return false
  if (href.startsWith("/") || href.startsWith("#")) return true

  try {
    const url = new URL(href)
    return INTERNAL_LINK_HOSTS.has(url.hostname.toLowerCase())
  } catch {
    return false
  }
}

export function sanitizeInternalLinkRel(html?: string | null) {
  if (!html) return ""

  return html.replace(/<a\b[^>]*>/gi, (tag) => {
    const href = tag.match(/href\s*=\s*(["'])([^"']*)\1/i)?.[2] || ""
    if (!isInternalHref(href)) return tag

    return tag.replace(/\srel\s*=\s*(["'])([^"']*)\1/i, (_match, quote, value) => {
      const relValues = value
        .split(/\s+/)
        .filter(Boolean)
        .filter((item: string) => item.toLowerCase() !== "nofollow")

      return relValues.length ? ` rel=${quote}${relValues.join(" ")}${quote}` : ""
    })
  })
}
