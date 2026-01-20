export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface HomepageSection {
    id: string
    section_key: string
    content: any
    updated_at?: string
}

export interface CmsCategory {
    id: string
    name: string
    slug: string
    description?: string | null
    image_url?: string | null
    seo_title?: string | null
    seo_description?: string | null
    content?: string | null // Rich text or JSON for extra content
    created_at: string
}

export interface CmsProduct {
    id: string
    name: string
    slug: string
    price?: number | null
    description?: string | null
    short_description?: string | null
    images: string[]
    category_id: string | null
    specifications?: Record<string, string> | null
    benefits?: string[] | null // Array of strings
    features?: string[] | null // Array of strings
    faq?: Array<{ q: string; a: string }> | null
    seo_title?: string | null
    meta_description?: string | null
    is_featured?: boolean
    created_at?: string
    updated_at?: string
}

// Section specific types for stricter typing if needed
export interface HeroSectionContent {
    heading: string
    subheading: string
    cta_text: string
    cta_link: string
    background_image?: string
}

export interface ValuesSectionContent {
    heading: string
    items: Array<{
        title: string
        description: string
        icon: string
    }>
}
