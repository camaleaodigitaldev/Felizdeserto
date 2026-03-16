import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/constants";
import VLibras from "@/components/VLibras";
import AccessibilityWidget from "@/components/layout/AccessibilityWidget";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CookieBanner from "@/components/layout/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Prefeitura de Feliz Deserto",
    "Feliz Deserto Alagoas",
    "prefeitura municipal",
    "governo",
    "transparência",
    "notícias",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: SITE.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-800 antialiased">
        <AnalyticsTracker />
        {children}
        <AccessibilityWidget />
        <VLibras />
        <CookieBanner />
      </body>
    </html>
  );
}
