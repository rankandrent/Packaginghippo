import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import prisma from "@/lib/db"


async function getSettings() {
    try {
        const settings = await prisma.siteSettings.findMany({
            where: {
                key: { in: ['general', 'footer'] }
            }
        })

        const general = settings.find(s => s.key === 'general')?.value as any || {}
        const footer = settings.find(s => s.key === 'footer')?.value as any || {}

        return { general, footer }
    } catch (e) {
        return { general: {}, footer: {} }
    }
}

export async function Footer() {
    const { general, footer } = await getSettings()

    const siteName = general.siteName || "PackagingHippo"
    const phone = general.phone || "(510) 500-9533"
    const email = general.email || "sales@packaginghippo.com"
    const address = general.address || "123 Packaging Street, Industrial District, NY 10001"
    const tagline = footer.description || general.tagline || "Your trusted partner for premium custom packaging solutions."

    // Column Titles
    const productsTitle = footer.columns?.productsTitle || "Products"
    const companyTitle = footer.columns?.companyTitle || "Company"
    const contactTitle = footer.columns?.contactTitle || "Get in Touch"

    return (
        <footer className="site-footer bg-neutral-900 border-t border-neutral-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-yellow-500 uppercase">{siteName}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {tagline}
                        </p>
                        <div className="flex gap-4">
                            {footer.social?.facebook && (
                                <Link href={footer.social.facebook} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                    <Facebook className="w-4 h-4" />
                                </Link>
                            )}
                            {footer.social?.instagram && (
                                <Link href={footer.social.instagram} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                    <Instagram className="w-4 h-4" />
                                </Link>
                            )}
                            {footer.social?.linkedin && (
                                <Link href={footer.social.linkedin} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                    <Linkedin className="w-4 h-4" />
                                </Link>
                            )}
                            {footer.social?.twitter && (
                                <Link href={footer.social.twitter} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                    <Twitter className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">{productsTitle}</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/services/mailer-boxes" className="hover:text-white">Mailer Boxes</Link></li>
                            <li><Link href="/services/rigid-boxes" className="hover:text-white">Rigid Boxes</Link></li>
                            <li><Link href="/services/folding-cartons" className="hover:text-white">Folding Cartons</Link></li>
                            <li><Link href="/services/display-boxes" className="hover:text-white">Display Boxes</Link></li>
                            <li><Link href="/services/eco-friendly" className="hover:text-white">Eco-Friendly</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">{companyTitle}</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                            <li><Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">{contactTitle}</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>{address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    {footer.copyrightText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
                </div>
            </div>
        </footer>
    )
}
