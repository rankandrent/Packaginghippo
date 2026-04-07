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
