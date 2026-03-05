"use client";

import { useActionState } from "react";
import { track } from "@vercel/analytics";
import {
  subscribeToNewsletter,
  type NewsletterActionResult,
} from "@/app/actions/newsletter";

const initialState: NewsletterActionResult | null = null;

function errorMessage(errorType: string): string {
  switch (errorType) {
    case "invalid_email":
      return "Please enter a valid email address.";
    case "config_error":
      return "Newsletter signup is temporarily unavailable. Please try again later.";
    case "resend_error":
    case "unknown":
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function NewsletterSignup() {
  const [state, formAction, isPending] = useActionState(
    async (prev: NewsletterActionResult | null, formData: FormData) => {
      track("newsletter_signup_started");
      const result = await subscribeToNewsletter(prev, formData);
      if (result.ok) {
        track("newsletter_signup_success");
      } else {
        track("newsletter_signup_error", { error_type: result.errorType });
      }
      return result;
    },
    initialState,
  );

  if (state?.ok === true) {
    return (
      <div className="rounded-xl border border-bayesiq-200 bg-bayesiq-50 px-6 py-5">
        <p className="text-sm font-semibold text-bayesiq-900">You&apos;re subscribed.</p>
        <p className="mt-1 text-xs text-bayesiq-500">
          Look out for telemetry tips and audit checklists — no spam.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-3"
      aria-label="Newsletter signup"
    >
      {state?.ok === false && (
        <p role="alert" className="text-xs text-red-600">
          {errorMessage(state.errorType)}
        </p>
      )}

      <div>
        <label htmlFor="newsletter-email" className="block text-sm font-medium text-bayesiq-700">
          Email address
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="email"
            id="newsletter-email"
            name="email"
            required
            autoComplete="email"
            disabled={isPending}
            className="min-w-0 flex-1 rounded-lg border border-bayesiq-300 px-4 py-2.5 text-sm text-bayesiq-900 placeholder-bayesiq-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
            placeholder="you@company.com"
          />
          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="shrink-0 rounded-lg bg-bayesiq-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800 disabled:opacity-50"
          >
            {isPending ? "Subscribing…" : "Subscribe"}
          </button>
        </div>
      </div>

      <p className="text-xs text-bayesiq-400">
        Telemetry tips and audit checklists, roughly twice a month. No spam —
        unsubscribe any time. See our{" "}
        <a href="/privacy" className="underline hover:text-bayesiq-600">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
