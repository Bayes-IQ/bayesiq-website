"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";

export type NewsletterActionResult =
  | { ok: true }
  | { ok: false; errorType: "invalid_email" | "config_error" | "resend_error" | "unknown" };

export async function subscribeToNewsletter(
  _prev: NewsletterActionResult | null,
  formData: FormData,
): Promise<NewsletterActionResult> {
  const email = (formData.get("email") as string)?.trim();

  if (!email || email.length > 254) {
    return { ok: false, errorType: "invalid_email" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, errorType: "invalid_email" };
  }

  if (!AUDIENCE_ID) {
    return { ok: false, errorType: "config_error" };
  }

  try {
    await resend.contacts.create({
      audienceId: AUDIENCE_ID,
      email,
    });

    return { ok: true };
  } catch {
    return { ok: false, errorType: "resend_error" };
  }
}
