import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-neutral-900 border-t border-neutral-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-yellow-500 uppercase">PackagingHippo</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted partner for premium custom packaging solutions. We deliver excellence in every box.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">Products</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/products/mailer-boxes" className="hover:text-white">Mailer Boxes</Link></li>
                            <li><Link href="/products/rigid-boxes" className="hover:text-white">Rigid Boxes</Link></li>
                            <li><Link href="/products/folding-cartons" className="hover:text-white">Folding Cartons</Link></li>
                            <li><Link href="/products/display-boxes" className="hover:text-white">Display Boxes</Link></li>
                            <li><Link href="/products/eco-friendly" className="hover:text-white">Eco-Friendly</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                            <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-500">Get in Touch</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>123 Packaging Street, Industrial District, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>(510) 500-9533</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>sales@packaginghippo.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Packaging Hippo. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
