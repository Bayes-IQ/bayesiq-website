import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getVerticalBySlug,
  getVerticals,
  getAllVerticalSlugs,
  getAllHookMetrics,
  getNarrative,
  getExecutiveQuestions,
  getTrajectory,
  getCascadeData,
} from "@/lib/golden-flows";
import VerticalSelector from "@/components/golden-flows/VerticalSelector";
import StatusQuoComparison from "@/components/golden-flows/StatusQuoComparison";
import VerticalLanding from "@/components/golden-flows/VerticalLanding";
import AskButtons from "@/components/golden-flows/AskButtons";
import AskAndCascadeSection from "@/components/golden-flows/AskAndCascadeSection";
import GoldenFlowsCTA from "@/components/golden-flows/GoldenFlowsCTA";

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
  const narrative = getNarrative(slug);
  const executiveQuestions = getExecutiveQuestions(slug);
  const trajectory = getTrajectory(slug);
  const cascadeData = getCascadeData(slug);

  const hasCascades = cascadeData && Object.keys(cascadeData.cascades).length > 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <VerticalSelector
        verticals={verticals}
        hookMetrics={hookMetrics}
        currentSlug={slug}
      />

      {trajectory && executiveQuestions && (
        <VerticalLanding
          trajectory={trajectory}
          questions={executiveQuestions.questions}
          verticalName={vertical.display_name}
        />
      )}

      {narrative && <StatusQuoComparison narrative={narrative} />}

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-bayesiq-900 sm:text-4xl">
        {vertical.display_name}
      </h1>

      {/* If cascade data exists, render combined ask+cascade section;
          otherwise fall back to ask buttons only */}
      {executiveQuestions && hasCascades ? (
        <AskAndCascadeSection
          questions={executiveQuestions.questions}
          cascades={cascadeData.cascades}
        />
      ) : executiveQuestions ? (
        <AskButtons questions={executiveQuestions.questions} />
      ) : null}

      <GoldenFlowsCTA
        ctaLabel={narrative?.cta_label}
        vertical={vertical.display_name}
      />
    </main>
  );
}
