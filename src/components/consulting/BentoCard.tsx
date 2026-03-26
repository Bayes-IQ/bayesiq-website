/**
 * Individual bento card for the deliverables grid.
 * Server component.
 */

interface BentoCardProps {
  title: string;
  description: string;
  /** 1 = standard (1 col), 2 = large (spans 2 cols) */
  span?: 1 | 2;
}

export default function BentoCard({
  title,
  description,
  span = 1,
}: BentoCardProps) {
  return (
    <div
      className={`rounded-xl border border-biq-border bg-white p-5 ${
        span === 2 ? "sm:col-span-2" : ""
      }`}
    >
      <h3 className="font-mono text-sm font-semibold text-biq-text-primary">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-biq-text-secondary">
        {description}
      </p>
    </div>
  );
}
