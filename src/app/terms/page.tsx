/**
 * Terms of Service page.
 * Content derived from: docs/product/terms.md
 * Keep section headings and ordering in sync with that source-of-truth document.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for BayesIQ consulting engagements and website use.",
  openGraph: {
    title: "Terms of Service — BayesIQ",
    description:
      "Terms of service for BayesIQ consulting engagements and website use.",
  },
};

export default function TermsPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-biq-text-primary">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-biq-text-muted">
          Effective: 2026-03-05
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-biq-text-secondary">
          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">Overview</h2>
            <p className="mt-3">
              BayesIQ provides data quality auditing, telemetry validation, and
              analytics pipeline consulting services. These terms govern your use
              of our website and any consulting engagement.
            </p>
            <p className="mt-3">
              BayesIQ is a services firm. We do not provide software-as-a-service,
              user accounts, or a consumer product. Our website is an informational
              site and inquiry channel. All substantive work is conducted under a
              separate statement of work (SOW) agreed upon with each client.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Website use
            </h2>
            <p className="mt-3">
              This website is provided for informational purposes. You may browse
              freely. Content on this site is owned by BayesIQ and may not be
              reproduced without permission.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Consulting engagements
            </h2>
            <p className="mt-3">
              All consulting engagements are governed by a separate statement of
              work (SOW) agreed upon before work begins. The SOW defines scope,
              timeline, deliverables, and fees. These terms apply in addition to
              any SOW.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Confidentiality
            </h2>
            <p className="mt-3">
              We treat all client data and systems as confidential. We are happy
              to sign NDAs before any engagement. We do not retain client data
              beyond what is necessary to complete the engagement, and we do not
              share client information with third parties.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Data access
            </h2>
            <p className="mt-3">
              Our auditing process uses read-only access to your data systems
              where required. We do not make changes to production systems unless
              explicitly agreed in the SOW. We do not require access to personally
              identifiable information (PII) to conduct most audits.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Intellectual property
            </h2>
            <p className="mt-3">
              Deliverables produced during an engagement (audit reports, fix
              recommendations, architecture documents) are owned by the client
              upon payment in full. BayesIQ retains ownership of its proprietary
              tools, methods, and analysis frameworks.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Limitation of liability
            </h2>
            <p className="mt-3">
              BayesIQ provides analysis and recommendations based on the data and
              access provided. We do not guarantee specific outcomes. Our
              liability is limited to the fees paid for the specific engagement
              in question.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Governing law
            </h2>
            <p className="mt-3">
              These terms are governed by applicable law. Specific jurisdiction
              will be established in the SOW for each engagement.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">Contact</h2>
            <p className="mt-3">
              Questions about these terms? Email us at{" "}
              <a
                href="mailto:hello@bayes-iq.com"
                className="text-biq-text-primary underline hover:text-accent"
              >
                hello@bayes-iq.com
              </a>{" "}
              or use our{" "}
              <Link
                href="/contact"
                className="text-biq-text-primary underline hover:text-accent"
              >
                contact form
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
