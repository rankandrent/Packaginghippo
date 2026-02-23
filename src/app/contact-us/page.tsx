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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 md:pt-32">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-stretch">
                        {/* Info Section */}
                        <div className="space-y-8 flex flex-col">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-4 uppercase">Contact Us</h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Have questions about our custom packaging solutions? Reach out to our experts today.
                                </p>
                            </div>

                            <div className="space-y-6 flex-grow">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-blue-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Phone</h3>
                                        <a href={`tel:${phone}`} className="text-gray-600 hover:text-blue-900 transition-colors inline-block">{phone}</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-blue-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Email</h3>
                                        <a href={`mailto:${email}`} className="text-gray-600 hover:text-blue-900 transition-colors inline-block">{email}</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Address</h3>
                                        <p className="text-gray-600 leading-snug">{address}</p>
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
