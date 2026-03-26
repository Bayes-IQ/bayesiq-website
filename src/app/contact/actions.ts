"use server";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "jamey.mcdowell@bayes-iq.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "website@bayesiq.com";

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254;
const MAX_COMPANY_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export type ContactFormState = {
  success: boolean;
  error: string | null;
};

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { success: false, error: "Name is too long." };
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return { success: false, error: "Email is too long." };
  }
  if (company && company.length > MAX_COMPANY_LENGTH) {
    return { success: false, error: "Company name is too long." };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { success: false, error: "Message is too long." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!resend) {
    return {
      success: false,
      error: "Contact form is not configured yet. Please email jamey.mcdowell@bayes-iq.com directly.",
    };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `BayesIQ inquiry from ${name}${company ? ` (${company})` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : null,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    return { success: true, error: null };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again or email us directly.",
    };
  }
}
