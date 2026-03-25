"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const contextContent = {
  consulting: {
    headline: "Book a diagnostic sprint conversation.",
    subtext:
      "Start with a free data health check. We review your data architecture, identify the most likely problem areas, and tell you what we would look at first. Thirty minutes, no commitment.",
  },
  platform: {
    headline: "Ask about the platform.",
    subtext:
      "Governed analytics infrastructure built for teams that need trustworthy metrics. Tell us about your stack and we will walk you through how evidence-backed governance works in practice.",
  },
  default: {
    headline: "Let\u2019s talk about your data.",
    subtext:
      "Tell us what\u2019s going on with your data systems. We\u2019ll tell you what we\u2019d look at, what we\u2019d expect to find, and whether we can help.",
  },
} as const;

type ContextKey = keyof typeof contextContent;

function ContactHeading() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const key: ContextKey =
    from === "consulting" || from === "platform" ? from : "default";
  const { headline, subtext } = contextContent[key];

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
        {headline}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-bayesiq-600 md:text-xl">
        {subtext}
      </p>
    </div>
  );
}

export default function ContactContextCTA() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            {contextContent.default.headline}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600 md:text-xl">
            {contextContent.default.subtext}
          </p>
        </div>
      }
    >
      <ContactHeading />
    </Suspense>
  );
}
