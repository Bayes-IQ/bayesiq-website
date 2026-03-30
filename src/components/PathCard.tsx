import Link from "next/link";

interface PathCardProps {
  /** Card headline in display font */
  headline: string;
  /** 1-2 line description */
  description: string;
  /** Target audience label */
  audience: string;
  /** Link destination (must be /consulting or /platform) */
  href: "/consulting" | "/platform";
  /** CTA button text */
  cta: string;
  /** Visual variant: primary gets more visual weight */
  variant?: "primary" | "secondary";
}

export default function PathCard({
  headline,
  description,
  audience,
  href,
  cta,
  variant = "primary",
}: PathCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      data-testid="path-card"
      className="flex flex-col justify-between rounded-biq-lg border border-biq-border bg-biq-surface-0 p-8 shadow-biq-sm transition-shadow hover:shadow-biq-md md:p-10"
    >
      <div>
        <h3 className="font-display text-2xl font-bold tracking-tight text-biq-text-primary md:text-3xl">
          {headline}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-biq-text-secondary">
          {description}
        </p>
        <p className="mt-4 text-sm font-medium text-biq-text-muted">
          {audience}
        </p>
      </div>
      <div className="mt-8">
        <Link
          href={href}
          className="inline-block rounded-lg bg-biq-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-biq-primary-hover"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
