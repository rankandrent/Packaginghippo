import { QuoteForm } from "@/components/forms/QuoteForm"

export function QuoteSection({ data }: { data: any }) {
    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <QuoteForm
                    theme="dark"
                    title={data?.heading || "Get Your Instant Quote"}
                    subtitle={data?.subheading || "Experience premium service with our fast response team."}
                    pageSource="Homepage Section"
                />
            </div>
        </section>
    )
}
