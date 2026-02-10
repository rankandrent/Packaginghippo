import prisma from "@/lib/db"
import HomePageClient from "@/components/home/HomePageClient"

// Revalidate data every 60 seconds (ISR)
export const revalidate = 0

async function getHomepageData() {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    console.log(`[Home] Fetched ${sections.length} active sections:`, sections.map(s => s.sectionKey))

    // Return array directly to preserve order
    return sections.map(s => ({
      key: s.sectionKey,
      content: s.content
    }))
  } catch (error) {
    console.error("Error fetching homepage data:", error)
    return []
  }
}

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findMany()
    const formatted: Record<string, any> = {}
    settings.forEach((s) => {
      formatted[s.key] = s.value
    })
    return formatted
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return {}
  }
}

async function getTopProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isTopProduct: true,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
      },
      take: 10, // Limit to 10 products as per user request/design
      orderBy: { updatedAt: 'desc' }
    })
    return products
  } catch (error) {
    console.error("Error fetching top products:", error)
    return []
  }
}

export async function generateMetadata() {
  const settings = await getSiteSettings()
  const seo = settings.seo || {}

  return {
    title: seo.defaultTitle || 'Packaging Hippo | Custom Boxes & Packaging Solutions',
    description: seo.defaultDescription || 'Premium custom packaging boxes with your logo.',
    keywords: seo.defaultKeywords,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    }
  }
}

async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    })
    return testimonials
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

import { HomeSchema } from "@/components/home/HomeSchema"

async function getCategories() {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        description: true
      }
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function Home() {
  const sections = await getHomepageData()
  const settings = await getSiteSettings()
  const topProducts = await getTopProducts()
  const testimonials = await getTestimonials()
  const categories = await getCategories()

  return (
    <main>
      <HomeSchema />
      <HomePageClient
        sections={sections as any}
        settings={settings}
        topProducts={topProducts}
        testimonials={testimonials}
        categories={categories}
      />
    </main>
  )
}
