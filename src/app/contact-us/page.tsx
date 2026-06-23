import { Mail, Phone, MapPin } from "lucide-react"
import { ContactForm } from "@/components/public/ContactForm"
import prisma from "@/lib/db"
import { constructMetadataTitle } from "@/lib/utils"

export async function generateMetadata() {
    return {
        title: constructMetadataTitle('Contact Us | Reach Our Packaging Experts'),
        description: 'Get in touch with PackagingHippo for your custom packaging needs. Fill out our form or call us directly to speak to one of our expert packaging designers.',
        alternates: {
            canonical: '/contact-us',
        },
    }
}

async function getContactSettings() {
    try {
        const settings = await prisma.siteSettings.findMany({
            where: {
                key: 'general'
            }
        })

        const general = settings.find(s => s.key === 'general')?.value as any || {}
        return general
    } catch (e) {
        return {}
    }
}

export default async function ContactPage() {
    const general = await getContactSettings()

    const phone = general.phone || "(445) 447-7678"
    const email = general.email || "sales@packaginghippo.com"
    const address = general.address || "1946 W 3rd Street, 1st Floor, Brooklyn, NY 11223"

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-stretch">
                        {/* Info Section */}
                        <div className="space-y-8 flex flex-col">
                            <div>
                                <span className="brand-eyebrow mb-3">Get In Touch</span>
                                <h1 className="text-4xl md:text-5xl font-black text-[#011f7b] mb-4 mt-3 uppercase">Contact Us</h1>
                                <p className="text-lg text-[#212529]/70 leading-relaxed">
                                    Have questions about our custom packaging solutions? Reach out to our experts today.
                                </p>
                            </div>

                            <div className="space-y-4 flex-grow">
                                <a href={`tel:${phone}`} className="brand-card flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 bg-[#DAA520]/15 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-[#011f7b]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#011f7b]">Phone</h3>
                                        <span className="text-[#212529]/70">{phone}</span>
                                    </div>
                                </a>

                                <a href={`mailto:${email}`} className="brand-card flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 bg-[#DAA520]/15 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-[#011f7b]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#011f7b]">Email</h3>
                                        <span className="text-[#212529]/70 break-all">{email}</span>
                                    </div>
                                </a>

                                <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 bg-[#DAA520]/15 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-[#011f7b]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#011f7b]">Address</h3>
                                        <p className="text-[#212529]/70 leading-snug">{address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="flex flex-col">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
