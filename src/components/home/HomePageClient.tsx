"use client"

import { DEFAULT_HOME_DATA } from "@/lib/data/home-content"
import { Hero } from "./sections/Hero"
import { Intro } from "./sections/Intro"
import { ServicesList } from "./sections/ServicesList"
import { Benefits } from "./sections/Benefits"
import { HowItWorks } from "./sections/HowItWorks"
import { EcoFriendly } from "./sections/EcoFriendly"
import { PopularProducts } from "./sections/PopularProducts"
import { Printing } from "./sections/Printing"
import { Industries } from "./sections/Industries"
import { Steps } from "./sections/Steps"
import { OrderingProcess } from "./sections/OrderingProcess"
import { WhyChooseUs } from "./sections/WhyChooseUs"
import { FAQ } from "./sections/FAQ"
import { CTA } from "./sections/CTA"
import { LogoLoop } from "./sections/LogoLoop"
import { SeoContent } from "./sections/SeoContent"
import { CustomerReviews } from "./sections/CustomerReviews"
import { FeaturesBar } from "./sections/FeaturesBar"
import { QuoteSection } from "./sections/QuoteSection"

type HomepageData = Record<string, any>

type Section = {
    key: string
    content: any
}

const SECTION_COMPONENTS: Record<string, React.FC<{ data: any }>> = {
    hero: Hero,
    intro: Intro,
    services_list: ServicesList,
    benefits: Benefits,
    how_it_works: HowItWorks,
    eco_friendly: EcoFriendly,
    popular_products: PopularProducts,
    printing: Printing,
    industries: Industries,
    steps: Steps,
    ordering_process: OrderingProcess,
    why_choose_us: WhyChooseUs,
    faq: FAQ,
    cta: CTA,
    logo_loop: LogoLoop,
    seo_content: SeoContent,
    customer_reviews: CustomerReviews,
    features_bar: FeaturesBar,
    quote_form: QuoteSection,
}

export default function HomePageClient({ sections, settings }: { sections: Section[], settings?: any }) {
    // If no sections from DB, you might want to show defaults or nothing.
    // Ideally we seed the DB. If strictly nothing, page will be empty.

    // Fallback? If strict CMS, no fallback. But for dev experience let's keep it safe.
    // If sections is empty, maybe we should render defaults? 
    // The user said "Remove existing sections... Develop new". 
    // Let's assume the DB is/will be populated.

    return (
        <div className="flex flex-col min-h-screen">
            {sections.map((section, index) => {
                const Component = SECTION_COMPONENTS[section.key]
                if (!Component) {
                    console.warn(`No component found for section key: ${section.key}`)
                    return null
                }
                return <Component key={`${section.key}-${index}`} data={section.content} />
            })}
        </div>
    )
}
