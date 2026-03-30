import type { Metadata } from "next";
import PlatformSection from "@/components/platform/PlatformSection";
import ThreeTruthLayers from "@/components/platform/ThreeTruthLayers";
import GovernanceChainExpanded from "@/components/platform/GovernanceChainExpanded";
import PlatformCTA from "@/components/platform/PlatformCTA";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "BayesIQ is the governance layer that produces an auditable chain from raw output to approved deliverable. Every finding reviewed, every decision attributed, every transition evidence-backed.",
  openGraph: {
    title: "Platform -- BayesIQ",
    description:
      "The governance layer for AI-driven delivery. Three truth layers, executor-neutral contracts, evidence-backed completion.",
  },
};

const platformJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BayesIQ Platform",
  applicationCategory: "BusinessApplication",
  description:
    "Governance platform that produces an auditable chain from raw output to approved deliverable with evidence-backed completion.",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/PreOrder",
  },
};

const notList = [
  {
    label: "Not a dashboard tool",
    detail:
      "Dashboards show you what happened. BayesIQ governs what happens next -- who approved it, what evidence backed it, and whether the transition was valid.",
  },
  {
    label: "Not an AI wrapper",
    detail:
      "AI wrappers add a UI on top of model calls. BayesIQ owns the governance chain around any execution engine, including ones that use no AI at all.",
  },
  {
    label: "Not a passive audit log",
    detail:
      "Audit logs record events after the fact. BayesIQ enforces gates before consequential state changes. The audit trail is a byproduct of active governance, not a bolt-on.",
  },
];

export default function PlatformPage() {
  return (
    <div className="bg-biq-dark-surface-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformJsonLd) }}
      />

      {/* Section 1: The Problem */}
      <PlatformSection className="pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            AI outputs are increasingly consequential.
          </h1>
          <p className="mt-6 font-display text-2xl font-medium text-accent md:text-3xl">
            Nobody can prove who approved what, or why.
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-biq-dark-text-secondary">
            Models generate insights, recommendations, and actions at a pace
            that outstrips any human review process. The gap between what AI
            produces and what a responsible organization can defend is growing
            every quarter.
          </p>
        </div>
      </PlatformSection>

      {/* Section 2: The Thesis */}
      <PlatformSection className="border-t border-biq-dark-border bg-biq-dark-surface-1">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-biq-dark-text-secondary">
            The thesis
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-white md:text-3xl">
            BayesIQ is the governance layer that produces an auditable chain
            from raw output to approved deliverable.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-biq-dark-text-primary">
            Every finding reviewed. Every decision attributed. Every transition
            evidence-backed. Not a policy document -- a running system that
            enforces the chain in real time.
          </p>
        </div>
      </PlatformSection>

      {/* Section 3: Three Truth Layers */}
      <PlatformSection
        id="truth-layers"
        className="border-t border-biq-dark-border"
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-biq-dark-text-secondary">
            The architecture
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-3xl">
            Three layers of truth
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-biq-dark-text-secondary">
            Every piece of information moves through three distinct layers.
            Nothing reaches operational state without explicit human acceptance.
            The layers are the invariant -- they apply to every engagement, every
            pipeline, every decision.
          </p>
        </div>
        <ThreeTruthLayers />
      </PlatformSection>

      {/* Section 4: Executor-Neutral */}
      <PlatformSection className="border-t border-biq-dark-border bg-biq-dark-surface-1">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-biq-dark-text-secondary">
            Executor-neutral
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-3xl">
            The contract is portable. The audit trail is the product.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-biq-dark-text-secondary">
            BayesIQ works with any execution engine -- your AI pipeline, a
            coding assistant, a contractor, a CI job. The work is defined in
            portable, human-readable contracts. Any compliant engine can consume
            the same contract and return evidence through the same completion
            protocol.
          </p>
        </div>
        <GovernanceChainExpanded />
      </PlatformSection>

      {/* Section 5: What Makes This Different */}
      <PlatformSection className="border-t border-biq-dark-border">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-biq-dark-text-secondary">
            Differentiation
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-3xl">
            What this is not
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-biq-dark-text-secondary">
            The only system that joins ingestion, extraction, triage, governed
            transitions, and evidence-backed completion in one loop.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {notList.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-biq-dark-border bg-biq-dark-surface-1 p-6"
            >
              <h3 className="text-sm font-bold text-accent">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-biq-dark-text-secondary">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </PlatformSection>

      {/* Section 6: Built By a Consultant */}
      <PlatformSection className="border-t border-biq-dark-border bg-biq-dark-surface-1">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-biq-dark-text-secondary">
            Origin
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-3xl">
            Built by a consultant, for consultants
          </h2>
          <p className="mt-6 text-base leading-relaxed text-biq-dark-text-primary">
            We built this because we needed it. Managing multiple client
            engagements with scattered emails, half-tracked commitments, and no
            single surface to prove what was promised and what was delivered.
          </p>
          <p className="mt-4 text-base leading-relaxed text-biq-dark-text-primary">
            One place to track engagements. One governed surface for client
            interactions. Contracts with evidence-backed completion -- so when a
            client asks &ldquo;what happened?&rdquo; you have the answer, not a
            guess.
          </p>
        </div>
      </PlatformSection>

      {/* Section 7: Regulated-Ready */}
      <PlatformSection className="border-t border-biq-dark-border">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-biq-dark-text-secondary">
            Compliance
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-3xl">
            Regulation built in, not bolted on
          </h2>
          <p className="mt-6 text-base leading-relaxed text-biq-dark-text-primary">
            The same governance chain that makes day-to-day operations
            trustworthy also satisfies regulated environments. Every state
            transition carries an attestation. Every decision links to its
            evidence. Every approval identifies its actor.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[
              "Attestation model",
              "Cryptographic verification",
              "Full audit lineage",
              "Evidence-backed gates",
            ].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-biq-dark-border px-4 py-1.5 text-xs font-medium text-biq-dark-text-primary"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </PlatformSection>

      {/* Section 8: CTA */}
      <PlatformSection className="border-t border-biq-dark-border bg-biq-dark-surface-1">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            See it in action
          </h2>
          <p className="mt-4 text-base leading-relaxed text-biq-dark-text-primary">
            Explore a live engagement walkthrough, or talk to us about how the
            platform fits your operation.
          </p>
          <div className="mt-10">
            <PlatformCTA />
          </div>
        </div>
      </PlatformSection>
    </div>
  );
}
