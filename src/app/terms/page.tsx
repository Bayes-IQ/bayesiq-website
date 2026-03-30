/**
 * Terms of Service page.
 * Content derived from: docs/product/terms.md
 * Keep section headings and ordering in sync with that source-of-truth document.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for BayesIQ consulting engagements, platform services, and website use.",
  openGraph: {
    title: "Terms of Service — BayesIQ",
    description:
      "Terms of service for BayesIQ consulting engagements, platform services, and website use.",
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
          Effective: 2026-03-30
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-biq-text-secondary">
          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">Overview</h2>
            <p className="mt-3">
              BayesIQ provides governed analytics consulting services and a
              software platform for data governance, audit, and remediation
              workflows. These terms govern your use of our website, our
              consulting engagements, and the BayesIQ Platform.
            </p>
            <p className="mt-3">
              BayesIQ operates two lines of business:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-biq-text-primary">Consulting</strong> —
                data quality auditing, telemetry validation, and analytics
                pipeline consulting, delivered under a statement of work (SOW)
                agreed upon with each client.
              </li>
              <li>
                <strong className="text-biq-text-primary">Platform</strong> — a
                software-as-a-service (SaaS) governance platform that produces
                auditable chains from raw data to approved deliverables, with
                evidence-backed completion and governed workflows.
              </li>
            </ol>
            <p className="mt-3">
              These terms apply to both. Where a section applies to only one, it
              is noted.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Website use
            </h2>
            <p className="mt-3">
              This website provides informational content, interactive
              demonstrations, and an inquiry channel. You may browse freely. The
              self-assessment tool and golden flows demonstrations are provided
              for evaluation purposes and do not create a service relationship.
              Content on this site — including copy, structure, and visual
              design — is owned by BayesIQ and may not be reproduced without
              permission.
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
              any SOW. In the event of a conflict between these terms and an SOW,
              the SOW governs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Platform services
            </h2>
            <p className="mt-3">
              Access to the BayesIQ Platform is governed by a subscription
              agreement or an engagement SOW that includes platform access.
              Platform terms include:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-biq-text-primary">Availability.</strong>{" "}
                We target high availability but do not guarantee uninterrupted
                service. Planned maintenance will be communicated in advance.
              </li>
              <li>
                <strong className="text-biq-text-primary">Your data.</strong>{" "}
                You retain ownership of all data you upload or generate through
                the platform. BayesIQ does not use your data for purposes other
                than providing the service.
              </li>
              <li>
                <strong className="text-biq-text-primary">Data portability.</strong>{" "}
                You may export your data at any time in standard formats. Upon
                termination, we will provide a reasonable window for data export
                before deletion.
              </li>
              <li>
                <strong className="text-biq-text-primary">Account security.</strong>{" "}
                You are responsible for maintaining the security of your account
                credentials. Notify us immediately if you suspect unauthorized
                access.
              </li>
              <li>
                <strong className="text-biq-text-primary">Termination.</strong>{" "}
                Either party may terminate platform access with 30 days written
                notice. Upon termination, we will provide data export access for
                30 days, after which your data will be deleted.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Confidentiality
            </h2>
            <p className="mt-3">
              We treat all client data and systems as confidential. We are happy
              to sign NDAs before any engagement. We do not retain client data
              beyond what is necessary to provide the service, and we do not
              share client information with third parties except as required to
              deliver the service (e.g., cloud infrastructure providers) or as
              required by law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Data access
            </h2>
            <p className="mt-3">
              For consulting engagements, our auditing process uses read-only
              access to your data systems where required. We do not make changes
              to production systems unless explicitly agreed in the SOW. We do
              not require access to personally identifiable information (PII) to
              conduct most audits.
            </p>
            <p className="mt-3">
              For platform services, data access is limited to what is necessary
              to operate the platform. All data is encrypted in transit and at
              rest.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Intellectual property
            </h2>
            <p className="mt-3">
              Deliverables produced during a consulting engagement (audit
              reports, fix recommendations, architecture documents) are owned by
              the client upon payment in full. Data and configurations you create
              within the platform are yours.
            </p>
            <p className="mt-3">
              BayesIQ retains ownership of its proprietary tools, methods,
              analysis frameworks, and the platform software itself.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Limitation of liability
            </h2>
            <p className="mt-3">
              BayesIQ provides analysis, recommendations, and software tools
              based on the data and access provided. We do not guarantee specific
              outcomes. Our liability is limited to the fees paid for the
              specific engagement or subscription period in question. BayesIQ is
              not liable for indirect, incidental, or consequential damages.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Governing law
            </h2>
            <p className="mt-3">
              These terms are governed by applicable law. Specific jurisdiction
              will be established in the SOW or subscription agreement for each
              engagement.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Changes to these terms
            </h2>
            <p className="mt-3">
              We may update these terms from time to time. Material changes will
              be communicated via email to active clients and platform users.
              Continued use of our services after notification constitutes
              acceptance of the updated terms.
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
