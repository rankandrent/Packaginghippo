import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import prisma from "@/lib/db";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

// export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate layout-level data every hour

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
      canonical: baseUrl,
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
        <CartProvider>
          <Suspense fallback={null}>
            <Navbar settings={generalSettings} menuData={menuSettings} />
          </Suspense>
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <WhatsAppButton />
        {/* Tawk.to Live Chat Integration */}
        <Script
          id="tawk-to"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/66fc04b2e5982d6c7bb7336c/1i9474n3p';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
