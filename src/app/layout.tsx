import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const SITE_URL = "https://bayesiq.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BayesIQ — AI-Powered Data Auditing",
    template: "%s — BayesIQ",
  },
  description:
    "BayesIQ audits telemetry, analytics pipelines, and business metrics so you can trust your data.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "BayesIQ",
    title: "BayesIQ — AI-Powered Data Auditing",
    description:
      "BayesIQ audits telemetry, analytics pipelines, and business metrics so you can trust your data.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BayesIQ",
  url: SITE_URL,
  description:
    "AI-powered data auditing consultancy. We audit telemetry, analytics pipelines, and business metrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
