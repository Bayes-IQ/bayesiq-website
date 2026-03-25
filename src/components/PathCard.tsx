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
      className={`flex flex-col justify-between rounded-2xl border p-8 transition-shadow hover:shadow-lg md:p-10 ${
        isPrimary
          ? "border-bayesiq-200 bg-white"
          : "border-bayesiq-200 bg-bayesiq-50"
      }`}
    >
      <div>
        <h3 className="font-display text-2xl font-bold tracking-tight text-bayesiq-900 md:text-3xl">
          {headline}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-bayesiq-600">
          {description}
        </p>
        <p className="mt-4 text-sm font-medium text-bayesiq-400">
          {audience}
        </p>
      </div>
      <div className="mt-8">
        <Link
          href={href}
          className={`inline-block rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
            isPrimary
              ? "bg-bayesiq-900 text-white hover:bg-bayesiq-800"
              : "border border-bayesiq-300 bg-white text-bayesiq-900 hover:bg-bayesiq-50"
          }`}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
