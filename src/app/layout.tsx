import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import prisma from "@/lib/db";

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

  return {
    title: seo.defaultTitle || "Packaging Hippo | Custom Boxes & Packaging Solutions",
    description: seo.defaultDescription || "Premium custom packaging boxes with your logo. Get a free quote today.",
    keywords: seo.defaultKeywords,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const generalSettings = settings.general || {};

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar settings={generalSettings} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
