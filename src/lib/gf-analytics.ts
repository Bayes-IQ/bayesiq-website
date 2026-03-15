"use client";

import { track } from "@vercel/analytics";

export function trackVerticalClick(vertical: string) {
  track("gf_vertical_click", { vertical });
}

export function trackCtaClick(variant: string, vertical: string) {
  track("gf_cta_click", { variant, vertical });
}
