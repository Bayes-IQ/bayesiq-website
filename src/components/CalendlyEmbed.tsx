"use client";

/**
 * CalendlyEmbed — Inline Calendly booking widget.
 *
 * Scheduling URL: update CALENDLY_URL below to change the booking link.
 * Loaded lazily via next/script to avoid blocking initial render.
 * Falls back to a direct link if the widget script fails or is blocked.
 */

import Script from "next/script";
import { track } from "@vercel/analytics";

// ─── Configuration ────────────────────────────────────────────────────────────
// Update this URL when the Calendly event type link changes.
const CALENDLY_URL = "https://calendly.com/jamey-mcdowell-bayes-iq/30min";
const CALENDLY_EMBED_URL = `${CALENDLY_URL}?hide_gdpr_banner=1&hide_landing_page_details=1`;
// ──────────────────────────────────────────────────────────────────────────────

function handleBookClick() {
  track("cta_click", { location: "contact_booking" });
}

export default function CalendlyEmbed() {
  return (
    <section
      className="mt-20 border-t border-biq-border-subtle pt-16"
      aria-labelledby="book-a-call-heading"
    >
      {/* Section header + CTA button */}
      <div className="mb-8 text-center">
        <h2
          id="book-a-call-heading"
          className="text-3xl font-bold tracking-tight text-biq-text-primary"
        >
          Book a call
        </h2>
        <p className="mt-3 text-lg text-biq-text-secondary">
          Book 20&ndash;30 minutes to walk through your telemetry or data
          quality situation. No commitment — we&apos;ll tell you honestly what
          we see.
        </p>
        {/* CTA button that fires the analytics event and scrolls to the embed */}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBookClick}
          className="mt-6 inline-block rounded-lg bg-biq-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-biq-primary-hover focus:outline-none focus:ring-2 focus:ring-biq-text-primary focus:ring-offset-2"
          aria-label="Book a call on Calendly (opens in new tab)"
        >
          Book a call
        </a>
      </div>

      {/*
       * Calendly inline embed container.
       * The stable min-height prevents CLS while the widget loads.
       * The fallback link inside is always visible as an accessible
       * alternative in case the widget script is blocked or fails.
       */}
      <div
        data-theme="light"
        className="calendly-inline-widget rounded-xl border border-biq-border-subtle bg-white"
        data-url={CALENDLY_EMBED_URL}
        style={{ minHeight: "950px", width: "100%" }}
        role="region"
        aria-label="Calendly booking calendar"
      >
        {/* Fallback: visible if widget.js doesn't initialise */}
        <noscript>
          <p className="p-6 text-center text-sm text-biq-text-secondary">
            JavaScript is required to display the booking calendar.{" "}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-biq-text-primary"
            >
              Book directly on Calendly →
            </a>
          </p>
        </noscript>
        <p className="fallback-link p-6 text-center text-sm text-biq-text-secondary">
          If the calendar doesn&apos;t load,{" "}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-biq-text-primary"
          >
            book directly on Calendly →
          </a>
        </p>
      </div>

      {/*
       * Load Calendly widget.js lazily so it never blocks the initial render.
       * next/script with strategy="lazyOnload" deduplicates across re-renders
       * automatically — safe to include in a client component.
       */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
