import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import prisma from "@/lib/db";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"] });

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findMany();
    const formatted: Record<string, any> = {};
    settings.forEach((s) => {
      formatted[s.key] = s.value;
    });
    return formatted;
  } catch (e) {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const seo = settings.seo || {};

  // Use host from headers to ensure canonicals match the current environment (fixed staging canonical issue)
  const headerList = await headers();
  const host = headerList.get('host') || 'packaginghippo.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: seo.defaultTitle || "Packaging Hippo | Custom Boxes & Packaging Solutions",
      template: `%s | ${seo.siteName || "Packaging Hippo"}`
    },
    description: seo.defaultDescription || "Premium custom packaging boxes with your logo. Get a free quote today.",
    keywords: seo.defaultKeywords,
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: seo.siteName || "Packaging Hippo",
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: 'tN09cpHIVr6FO5LCFC__PzhMtihqEmX2TXdZnsenlw0',
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const generalSettings = settings.general || {};
  const menuSettings = settings.menu || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Packaging Hippo",
            "url": "https://packaginghippo.com",
            "logo": "https://packaginghippo.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-445-447-7678",
              "contactType": "customer service",
              "email": "sales@packaginghippo.com"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1946 W 3rd Street 1st Floor",
              "addressLocality": "Brooklyn",
              "addressRegion": "NY",
              "postalCode": "11223",
              "addressCountry": "US"
            }
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Packaging Hippo",
            "url": "https://packaginghippo.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://packaginghippo.com/products?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Packaging Hippo",
            "image": "https://packaginghippo.com/logo.png",
            "url": "https://packaginghippo.com",
            "telephone": "+1-445-447-7678",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1946 W 3rd Street 1st Floor",
              "addressLocality": "Brooklyn",
              "addressRegion": "NY",
              "postalCode": "11223",
              "addressCountry": "US"
            },
            "priceRange": "$$"
          }}
        />
        <Navbar settings={generalSettings} menuData={menuSettings} />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <LiveChatWidget />
      </body>
    </html>
  );
}
