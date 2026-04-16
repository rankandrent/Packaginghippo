import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import prisma from "@/lib/db";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { TawkChatLoader } from "@/components/layout/TawkChatLoader";
import { CartProvider } from "@/context/CartContext";
import { BRAND_FAVICON } from "@/lib/brand";

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
    icons: {
      icon: [
        { url: BRAND_FAVICON, type: 'image/png' },
      ],
      shortcut: [BRAND_FAVICON],
      apple: [
        { url: BRAND_FAVICON },
      ],
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
  const footerSettings = settings.footer || {};
  const menuSettings = settings.menu || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          <Suspense fallback={null}>
            <Navbar settings={generalSettings} menuData={menuSettings} />
          </Suspense>
          <main>{children}</main>
          <Footer general={generalSettings} footer={footerSettings} />
        </CartProvider>
        <WhatsAppButton whatsappNumber={generalSettings.whatsapp || null} />
        <TawkChatLoader />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wcssypnaig");
          `}
        </Script>
      </body>
    </html>
  );
}
