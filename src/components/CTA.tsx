import Link from "next/link";

interface CTAProps {
  headline: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

export default function CTA({
  headline,
  description,
  buttonText = "Get in Touch",
  href = "/contact",
}: CTAProps) {
  return (
    <section className="bg-bayesiq-900 px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">{headline}</h2>
        {description && (
          <p className="mt-4 text-lg text-bayesiq-300">{description}</p>
        )}
        <Link
          href={href}
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-biq-text-primary transition-colors hover:bg-biq-surface-2"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
