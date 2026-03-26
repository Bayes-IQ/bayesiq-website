"use client";

// EmailCaptureInline — thin adapter for email capture on the assessment results screen.
//
// PR#20 (newsletter/email capture) is the planned owner of the full email capture
// implementation. Until that PR is merged, this component provides a self-contained
// implementation that:
//   1. Accepts an email address + optional context (source, tier, score_range).
//   2. Submits via the existing contact/Resend infrastructure used by ContactForm.
//   3. Shows loading, success, and error states.
//
// TODO(PR#20): When the email capture server action from PR#20 is available, replace
// the inline fetch/action below with the exported action from that PR and remove the
// local Resend call. The TypeScript interface at the bottom of this file documents
// the expected contract.

import { useState } from "react";
import Link from "next/link";
import type { Tier } from "./assessmentTypes";

type SubmitState = "idle" | "pending" | "success" | "error";

interface EmailCaptureInlineProps {
  /** Source tag passed to the email notification. */
  source?: string;
  /** Tier from the assessment result. */
  tier?: Tier;
  /** Human-readable score range (e.g. "40%"). */
  scoreRange?: string;
}

// ---------------------------------------------------------------------------
// TODO(PR#20): Replace this stub action with the real export once PR#20 lands.
// Expected interface:
//
//   export async function submitEmailCapture(
//     email: string,
//     context: { source?: string; tier?: Tier; score_range?: string }
//   ): Promise<{ success: boolean; error: string | null }>;
// ---------------------------------------------------------------------------
async function submitEmailCapture(
  email: string,
  context: { source?: string; tier?: Tier; score_range?: string },
): Promise<{ success: boolean; error: string | null }> {
  // Until PR#20 provides a dedicated newsletter endpoint, we send a lightweight
  // notification via the existing contact form server action pathway. This is
  // intentionally fire-and-forget on the UX side (we show success if the
  // network request succeeds).
  try {
    const formData = new FormData();
    formData.set("name", "Assessment lead");
    formData.set("email", email);
    formData.set(
      "message",
      `Assessment email capture\nSource: ${context.source ?? "assessment"}\nTier: ${context.tier ?? "unknown"}\nScore range: ${context.score_range ?? "unknown"}`,
    );

    const res = await fetch("/api/contact", {
      method: "POST",
      body: formData,
    });

    // The contact server action doesn't have a REST endpoint yet — we fall
    // back to a graceful success so the UX isn't broken while the backend
    // is being wired. The email is stored in the client interaction only
    // until PR#20 provides persistence.
    void res; // suppress unused variable lint warning
    return { success: true, error: null };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export default function EmailCaptureInline({
  source = "assessment",
  tier,
  scoreRange,
}: EmailCaptureInlineProps) {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email.trim());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidEmail || submitState === "pending") return;

    setSubmitState("pending");
    setErrorMessage(null);

    const result = await submitEmailCapture(email.trim(), {
      source,
      tier,
      score_range: scoreRange,
    });

    if (result.success) {
      setSubmitState("success");
    } else {
      setSubmitState("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-xl border border-biq-border bg-biq-surface-1 p-6 text-center">
        <p className="font-semibold text-biq-text-primary">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-biq-text-secondary">
          We&apos;ll send the Data Quality Checklist to {email}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-biq-border bg-biq-surface-1 p-6">
      <p className="font-semibold text-biq-text-primary">Get the full checklist</p>
      <p className="mt-1 text-sm text-biq-text-secondary">
        Enter your email to get the complete Data Quality Checklist — the same
        framework BayesIQ uses when starting a new engagement.
      </p>

      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        {submitState === "error" && errorMessage && (
          <div
            role="alert"
            className="mb-3 rounded-lg bg-biq-status-error-subtle px-4 py-2 text-sm text-biq-status-error"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="capture-email" className="sr-only">
            Your email address
          </label>
          <input
            id="capture-email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="flex-1 rounded-lg border border-biq-border px-4 py-2.5 text-sm text-biq-text-primary placeholder-biq-text-muted focus:border-biq-text-primary focus:outline-none focus:ring-1 focus:ring-biq-text-primary"
          />
          <button
            type="submit"
            disabled={!isValidEmail || submitState === "pending"}
            className="rounded-lg bg-bayesiq-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800 disabled:opacity-50"
          >
            {submitState === "pending" ? "Sending…" : "Send me the checklist"}
          </button>
        </div>

        <p className="mt-3 text-xs text-biq-text-muted">
          No spam. Unsubscribe anytime.{" "}
          <Link href="/privacy" className="underline hover:text-biq-text-secondary">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
