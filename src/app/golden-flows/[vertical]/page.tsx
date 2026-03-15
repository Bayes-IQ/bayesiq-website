import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getVerticalBySlug,
  getVerticals,
  getAllVerticalSlugs,
  getAllHookMetrics,
} from "@/lib/golden-flows";
import VerticalSelector from "@/components/golden-flows/VerticalSelector";

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

  const verticals = getVerticals();
  const hookMetrics = getAllHookMetrics();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <VerticalSelector
        verticals={verticals}
        hookMetrics={hookMetrics}
        currentSlug={slug}
      />

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-bayesiq-900 sm:text-4xl">
        {vertical.display_name}
      </h1>

      <div className="mt-8 rounded-xl border border-bayesiq-200 bg-bayesiq-50 p-8">
        <p className="text-bayesiq-600">
          {vertical.status === "ready"
            ? "Landing state (GF-5), cascade viewer (GF-9), and status-quo comparison (GF-6) will render here."
            : "This vertical is in development. Results will be available when ready."}
        </p>
      </div>
    </main>
  );
}
