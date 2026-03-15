"use client";

import { trackVerticalClick } from "@/lib/gf-analytics";

export function VerticalClickTracker({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <div onClick={() => trackVerticalClick(slug)}>{children}</div>
  );
}
