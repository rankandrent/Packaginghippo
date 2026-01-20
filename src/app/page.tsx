import prisma from "@/lib/db"
import HomePageClient from "@/components/home/HomePageClient"

// Revalidate data every 60 seconds (ISR)
export const revalidate = 60

async function getHomepageData() {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    const formattedData: Record<string, any> = {}
    sections.forEach((section) => {
      formattedData[section.sectionKey] = section.content
    })

    return formattedData
  } catch (error) {
    console.error("Error fetching homepage data:", error)
    return {}
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

export async function generateMetadata() {
  const settings = await getSiteSettings()
  const seo = settings.seo || {}

  return {
    title: seo.defaultTitle || 'Packaging Hippo | Custom Boxes & Packaging Solutions',
    description: seo.defaultDescription || 'Premium custom packaging boxes with your logo.',
    keywords: seo.defaultKeywords,
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  }
}

export default async function Home() {
  const data = await getHomepageData()
  return <HomePageClient data={data as any} />
}
