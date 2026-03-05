import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to us about your data challenges.",
  openGraph: {
    title: "Contact — BayesIQ",
    description: "Talk to us about your data challenges.",
  },
};

export default function ContactPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Left: messaging */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
              Let&apos;s talk about your data.
            </h1>
            <p className="mt-4 text-lg text-bayesiq-600">
              Tell us what&apos;s going on with your data systems. We&apos;ll
              tell you what we&apos;d look at, what we&apos;d expect to find,
              and whether we can help.
            </p>

            <div className="mt-12 space-y-6">
              <div>
                <p className="text-sm font-medium text-bayesiq-900">
                  Free data health check
                </p>
                <p className="mt-1 text-sm text-bayesiq-600">
                  A 30-minute conversation where we review your data
                  architecture and identify the most likely problem areas. No
                  commitment.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-bayesiq-900">
                  Fast response
                </p>
                <p className="mt-1 text-sm text-bayesiq-600">
                  We respond to every inquiry within one business day.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-bayesiq-900">
                  No sales pressure
                </p>
                <p className="mt-1 text-sm text-bayesiq-600">
                  We&apos;ll tell you honestly if your problem is something we
                  can help with — or if there&apos;s a better approach.
                </p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
