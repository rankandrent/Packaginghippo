import prisma from "@/lib/db"

export type MerchantProduct = {
    image: string
    name: string
    price: string
    link: string
}

export function slugifyName(name: string): string {
    return String(name || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

// Merchant prices are display strings like "0.39" or "Starting at $5".
export function parsePrice(price: unknown): number {
    const n = parseFloat(String(price ?? "").replace(/[^0-9.]/g, ""))
    return Number.isFinite(n) && n > 0 ? n : 0
}

export async function getMerchantProducts(): Promise<MerchantProduct[]> {
    try {
        const section = await prisma.homepageSection.findFirst({
            where: { sectionKey: "merchant_products" },
        })
        const content = section?.content as any
        const products = Array.isArray(content?.products) ? content.products : []
        return products.filter((p: any) => p && p.name)
    } catch {
        return []
    }
}

export async function getMerchantProductBySlug(slug: string): Promise<MerchantProduct | null> {
    const products = await getMerchantProducts()
    return products.find((p) => slugifyName(p.name) === slug) || null
}
