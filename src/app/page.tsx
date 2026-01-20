
import { supabase } from "@/lib/supabase"
import HomePageClient from "@/components/home/HomePageClient"

// Revalidate data every 60 seconds (ISR)
export const revalidate = 60

async function getHomepageData() {
  try {
    const { data, error } = await supabase.from('cms_homepage').select('*')

    if (error) {
      console.error("Error fetching homepage data:", error)
      return {}
    }

    const formattedData: Record<string, any> = {}
    data?.forEach((item) => {
      formattedData[item.section_key] = item.content
    })

    return formattedData
  } catch (error) {
    console.error("Unexpected error:", error)
    return {}
  }
}

export default async function Home() {
  const data = await getHomepageData()
  return <HomePageClient data={data} />
}
