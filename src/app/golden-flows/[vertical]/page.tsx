import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getVerticalBySlug,
  getAllVerticalSlugs,
} from "@/lib/golden-flows";

interface Props {
  params: Promise<{ vertical: string }>;
}

export async function generateStaticParams() {
  return getAllVerticalSlugs().map((slug) => ({ vertical: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical: slug } = await params;
  const vertical = getVerticalBySlug(slug);
  if (!vertical) return {};

  return {
    title: `${vertical.display_name} — Golden Flows — BayesIQ`,
    description: `See what BayesIQ found auditing ${vertical.display_name.toLowerCase()} data. Governed results, executive-ready.`,
    openGraph: {
      title: `${vertical.display_name} — Golden Flows — BayesIQ`,
      description: `See what BayesIQ found auditing ${vertical.display_name.toLowerCase()} data. Governed results, executive-ready.`,
    },
  };
}

export default async function VerticalPage({ params }: Props) {
  const { vertical: slug } = await params;
  const vertical = getVerticalBySlug(slug);

  if (!vertical) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <nav className="mb-8">
        <Link
          href="/golden-flows"
          className="text-sm text-bayesiq-500 hover:text-bayesiq-700"
        >
          ← All Verticals
        </Link>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-bayesiq-900 sm:text-4xl">
        {vertical.display_name}
      </h1>

      <div className="mt-8 rounded-xl border border-bayesiq-200 bg-bayesiq-50 p-8">
        <p className="text-bayesiq-600">
          {vertical.status === "ready"
            ? "Audit results will render here. Selector cards (GF-4), landing state (GF-5), and cascade viewer (GF-9) build on this shell."
            : "This vertical is in development. Results will be available when ready."}
        </p>
      </div>
    </main>
  );
}
