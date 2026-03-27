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
      <section className="bg-bayesiq-50/60 px-6 py-32 md:py-40">
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
                <p className="text-base font-semibold text-bayesiq-900">
                  Free data health check
                </p>
                <p className="mt-2 text-base leading-relaxed text-bayesiq-600">
                  A 30-minute conversation where we review your data
                  architecture and identify the most likely problem areas. No
                  commitment, no sales pressure.
                </p>
              </div>
              <div>
                <p className="text-base font-semibold text-bayesiq-900">
                  Fast response
                </p>
                <p className="mt-2 text-base leading-relaxed text-bayesiq-600">
                  We respond to every inquiry within one business day. Most
                  hear back within a few hours.
                </p>
              </div>
              <div>
                <p className="text-base font-semibold text-bayesiq-900">
                  Honest assessment
                </p>
                <p className="mt-2 text-base leading-relaxed text-bayesiq-600">
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
      <section className="border-t border-bayesiq-200 bg-bayesiq-50/40 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <CalendlyEmbed />
        </div>
      </section>
    </>
  );
}
