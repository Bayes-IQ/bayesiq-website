import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  href?: string;
}

export default function ServiceCard({ title, description, href = "/services" }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-bayesiq-200 p-6 transition-all hover:border-bayesiq-400 hover:shadow-sm"
    >
      <h3 className="text-lg font-semibold text-bayesiq-900 group-hover:text-accent-dark">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">{description}</p>
    </Link>
  );
}
