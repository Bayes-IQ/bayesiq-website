/**
 * Privacy Policy page.
 * Content derived from: docs/product/privacy.md
 * Keep section headings and ordering in sync with that source-of-truth document.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BayesIQ collects, uses, and protects your data.",
  openGraph: {
    title: "Privacy Policy — BayesIQ",
    description: "How BayesIQ collects, uses, and protects your data.",
  },
};

export default function PrivacyPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-biq-text-primary">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-biq-text-muted">
          Effective: 2026-03-05
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-biq-text-secondary">
          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              What we collect
            </h2>
            <p className="mt-3">
              When you submit our contact form, we collect the information you
              provide: your name, email address, company name (optional), and
              message. We use this solely to respond to your inquiry.
            </p>
            <p className="mt-3">
              BayesIQ is a consulting firm. There are no user accounts on this
              site. We do not collect payment information, passwords, or any
              sensitive personal data via the website. We also collect basic
              server and performance logs via our hosting provider (Vercel) as
              a standard part of operating any website.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Analytics
            </h2>
            <p className="mt-3">
              We use Vercel Analytics to understand how visitors use our site.
              Vercel Analytics is privacy-friendly and does not use cookies or
              collect personally identifiable information. It tracks aggregate
              page views and performance metrics only.
            </p>
            <p className="mt-3">
              We do not use Google Analytics, Meta Pixel, or other third-party
              behavioral tracking tools.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              How we use your data
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>To respond to your contact form submission</li>
              <li>To understand aggregate site usage via analytics</li>
              <li>
                We do not sell, share, or provide your personal information to
                third parties for marketing purposes
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Third-party services
            </h2>
            <p className="mt-3">We use the following services to operate this site:</p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>
                <strong>Vercel</strong> — hosting and analytics
              </li>
              <li>
                <strong>Resend</strong> — contact form email delivery
              </li>
            </ul>
            <p className="mt-3">
              Each service processes data in accordance with their own privacy
              policies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Data retention
            </h2>
            <p className="mt-3">
              Contact form submissions are retained for as long as necessary to
              respond to your inquiry and for our business records. You can
              request deletion of your data at any time by contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">
              Your rights
            </h2>
            <p className="mt-3">
              You have the right to request access to, correction of, or
              deletion of your personal data. To make a request, contact us at{" "}
              <a
                href="mailto:privacy@bayes-iq.com"
                className="text-biq-text-primary underline hover:text-accent"
              >
                privacy@bayes-iq.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-biq-text-primary">Contact</h2>
            <p className="mt-3">
              Questions about this privacy policy? Email us at{" "}
              <a
                href="mailto:privacy@bayes-iq.com"
                className="text-biq-text-primary underline hover:text-accent"
              >
                privacy@bayes-iq.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
