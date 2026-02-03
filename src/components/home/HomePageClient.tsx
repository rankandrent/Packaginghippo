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
import { TopProductsSection } from "./TopProductsSection"
import TestimonialsSection from "./TestimonialsSection"

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

export default function HomePageClient({
    sections,
    settings,
    topProducts = [],
    testimonials = []
}: {
    sections: Section[],
    settings?: any,
    topProducts?: any[],
    testimonials?: any[]
}) {
    // If no sections from DB, you might want to show defaults or nothing.
    // Ideally we seed the DB. If strictly nothing, page will be empty.

    // Fallback? If strict CMS, no fallback. But for dev experience let's keep it safe.
    // If sections is empty, maybe we should render defaults? 
    // The user said "Remove existing sections... Develop new". 
    // Let's assume the DB is/will be populated.

    return (
        <div className="flex flex-col min-h-screen">
            {sections.map((section, index) => {
                // If it's the old popular products section, hide it because we are injecting TopProducts specifically after 'how_it_works'
                if (section.key === 'popular_products') {
                    return null
                }

                const Component = SECTION_COMPONENTS[section.key]
                if (!Component) {
                    // Check if it's the new top products section just in case key differs
                    if (section.key === 'top_products') {
                        return null // Hide if present, we will inject manually
                    }
                    console.warn(`No component found for section key: ${section.key}`)
                    return null
                }

                // Render the current section
                const content = <Component key={`${section.key}-${index}`} data={section.content} />

                // If this is the FAQ section, inject FeaturesBar BEFORE it
                if (section.key === 'faq') {
                    return (
                        <div key={`${section.key}-wrapper`}>
                            <FeaturesBar data={null} />{/* Use default data which matches the requirement */}
                            {content}
                        </div>
                    )
                }

                // If existing features_bar is found in list, hide it to avoid duplication
                if (section.key === 'features_bar') {
                    return null
                }

                // If this is the "How It Works" section ("How We Turn Your Ideas Into Reality"), inject TopProducts after it
                if (section.key === 'how_it_works') {
                    return (
                        <div key={`${section.key}-wrapper`}>
                            {content}
                            <TopProductsSection products={topProducts} />
                        </div>
                    )
                }

                return content
            })}
            {/* Fallback: if no popular_products section found in the list, append it at the end or specific place? 
                 User wants it to show. 
                 If sections are managed by admin, maybe they deleted it.
                 Safest is to rely on existing section or ask user to add it.
                 But I'll assume it replaces the existing "Popular Products" section which seems to be standard.
             */}

            <TestimonialsSection testimonials={testimonials} />
        </div>
    )
}
