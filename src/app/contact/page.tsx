import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import ContactContextCTA from "@/components/ContactContextCTA";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to us about your data challenges.",
  openGraph: {
    title: "Contact — BayesIQ",
    description: "Talk to us about your data challenges.",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact BayesIQ",
  description: "Talk to us about your data challenges.",
  publisher: { "@type": "Organization", name: "BayesIQ", url: "https://bayes-iq.com" },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      {/* ── Hero messaging ── */}
      <section className="bg-biq-surface-1/60 px-6 py-32 md:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <ContactContextCTA />
        </div>
      </section>

      {/* ── Two-column: value props + form ── */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-20 md:grid-cols-2">
            {/* Left: value propositions */}
            <div className="space-y-10">
              <div>
                <p className="text-base font-semibold text-biq-text-primary">
                  Free data health check
                </p>
                <p className="mt-2 text-base leading-relaxed text-biq-text-secondary">
                  A 30-minute conversation where we review your data
                  architecture and identify the most likely problem areas. No
                  commitment, no sales pressure.
                </p>
              </div>
              <div>
                <p className="text-base font-semibold text-biq-text-primary">
                  Fast response
                </p>
                <p className="mt-2 text-base leading-relaxed text-biq-text-secondary">
                  We respond to every inquiry within one business day. Most
                  hear back within a few hours.
                </p>
              </div>
              <div>
                <p className="text-base font-semibold text-biq-text-primary">
                  Honest assessment
                </p>
                <p className="mt-2 text-base leading-relaxed text-biq-text-secondary">
                  We will tell you honestly if your problem is something we can
                  help with, or if there is a better approach. No pitch, just
                  perspective.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Calendly embed ── */}
      <section className="border-t border-biq-border bg-biq-surface-1/40 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <CalendlyEmbed />
        </div>
      </section>
    </>
  );
}
