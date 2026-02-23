import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react"
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
                            {footer.social?.behance && (
                                <Link href={footer.social.behance} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 7h-7v-2h7v2zm1.726 10c-.002 1.296-.566 1.834-1.296 2.059l-9.338.002c-.736-.213-1.074-.755-1.092-2.061h11.726zm-10.613-2h4.561c.071-1.376-.803-1.896-1.503-1.996-1.554.01-1.467.434-3.058 1.996zm6.332-6.319c-1.42 0-2.31 1.051-2.31 2.379 0 1.259.982 2.193 2.33 2.193 1.348 0 2.308-.87 2.308-2.193 0-1.218-.888-2.379-2.328-2.379zm-7.904 4.319h11v2h-11v-2zm0-4h11v2h-11v-2zm-2.459 2.193c0-1.564 1.229-2.736 2.87-2.736 1.549 0 2.768 1.139 2.768 2.736 0 1.553-1.129 2.736-2.678 2.736-1.631 0-2.96-1.183-2.96-2.736zm4.195 0c-.004-.848-.601-1.487-1.325-1.487-.768 0-1.375.647-1.375 1.487 0 .848.6 1.487 1.375 1.487.732 0 1.329-.648 1.325-1.487z" /></svg>
                                    <span className="sr-only">Behance</span>
                                </Link>
                            )}
                            {footer.social?.youtube && (
                                <Link href={footer.social.youtube} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                    <Youtube className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">{productsTitle}</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/mailer-boxes" className="hover:text-white">Mailer Boxes</Link></li>
                            <li><Link href="/rigid-boxes" className="hover:text-white">Rigid Boxes</Link></li>
                            <li><Link href="/folding-cartons" className="hover:text-white">Folding Cartons</Link></li>
                            <li><Link href="/display-boxes" className="hover:text-white">Display Boxes</Link></li>
                            <li><Link href="/eco-friendly" className="hover:text-white">Eco-Friendly</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">{companyTitle}</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
                            <li><Link href="/contact-us" className="hover:text-white">Contact Us</Link></li>
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
                                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8 mt-12">
                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                        {/* Copyright */}
                        <p className="text-sm text-gray-500 text-center md:text-left">
                            {footer.copyrightText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
                        </p>

                        {/* Payment Methods Image */}
                        {footer.paymentMethodsImage && (
                            <div className="flex items-center justify-center md:justify-end">
                                <img
                                    src={footer.paymentMethodsImage}
                                    alt="Payment Methods"
                                    className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}
