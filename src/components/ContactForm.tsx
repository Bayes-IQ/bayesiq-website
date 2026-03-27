"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { success: false, error: null };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="rounded-xl border border-bayesiq-200 p-8 text-center">
        <p className="text-lg font-semibold text-bayesiq-900">Thanks for reaching out.</p>
        <p className="mt-2 text-sm text-bayesiq-600">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-bayesiq-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-bayesiq-300 px-4 py-2.5 text-sm text-bayesiq-900 placeholder-bayesiq-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-bayesiq-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 w-full rounded-lg border border-bayesiq-300 px-4 py-2.5 text-sm text-bayesiq-900 placeholder-bayesiq-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-bayesiq-700">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="mt-1 w-full rounded-lg border border-bayesiq-300 px-4 py-2.5 text-sm text-bayesiq-900 placeholder-bayesiq-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Your company"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-bayesiq-700">
          What data challenges are you facing?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 w-full rounded-lg border border-bayesiq-300 px-4 py-2.5 text-sm text-bayesiq-900 placeholder-bayesiq-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Tell us about your data systems and what's not working..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800 disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
