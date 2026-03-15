import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "The BayesIQ Platform — governed data delivery with policy gates, approval workflows, audit trails, and executor-neutral contracts across 11 tool namespaces.",
  openGraph: {
    title: "Platform — BayesIQ",
    description:
      "Governed data delivery with policy gates, approval workflows, audit trails, and executor-neutral contracts across 11 tool namespaces.",
  },
};

const platformJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BayesIQ",
  url: "https://bayes-iq.com",
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "BayesIQ Platform",
        description:
          "Governed data delivery platform with policy gates, approval workflows, audit trails, and executor-neutral contracts across 11 tool namespaces.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "BayesIQ Data Audit Kit",
        description:
          "An automated pipeline that audits any dataset and generates production-ready artifacts including dbt projects, Streamlit dashboards, and documentation.",
      },
    },
  ],
};

const truthLayers = [
  {
    layer: "Layer 1",
    title: "Raw Evidence",
    description:
      "Immutable inputs — pipeline outputs, test results, call transcripts, emails, Slack messages. The ground truth your decisions rest on.",
    style: "rounded-xl border border-bayesiq-200 bg-bayesiq-50 p-6",
    labelStyle:
      "text-xs font-semibold uppercase tracking-wider text-bayesiq-400",
  },
  {
    layer: "Layer 2",
    title: "LLM Interpretation",
    description:
      "AI-generated proposals — extracted tasks, priority assessments, summaries. Always labeled as interpretation. Never auto-promoted to operational state.",
    style: "rounded-xl border border-bayesiq-200 bg-white p-6",
    labelStyle:
      "text-xs font-semibold uppercase tracking-wider text-bayesiq-400",
  },
  {
    layer: "Layer 3",
    title: "Human-Accepted State",
    description:
      "The only layer that drives dashboards, deadlines, and work state. Requires explicit human acceptance. This is your single source of governed truth.",
    style: "rounded-xl border border-accent/20 bg-accent/5 p-6",
    labelStyle: "text-xs font-semibold uppercase tracking-wider text-accent",
  },
];

const engagementPipeline = [
  {
    step: "01",
    title: "Interaction Capture",
    desc: "Calls, emails, Slack messages, meeting notes, and documents flow into the engagement ledger as raw evidence.",
  },
  {
    step: "02",
    title: "Evidence Extraction",
    desc: "LLM-powered extraction identifies tasks, commitments, scope changes, and KPI discussions — labeled as interpretation, never auto-promoted.",
  },
  {
    step: "03",
    title: "Triage & Review",
    desc: "Extracted candidates surface on a human review dashboard. Accept, reject, or defer. Nothing becomes governed work without explicit sign-off.",
  },
  {
    step: "04",
    title: "Governed Work",
    desc: "Accepted items become tracked commitments with deadlines, owners, phase gates, and promotion rules. Visible across all client engagements.",
  },
  {
    step: "05",
    title: "Execution",
    desc: "Executor-neutral contracts drive delivery — consumed by the Audit Kit, Claude Code, contractors, or CI systems. Same governed loop applies.",
  },
  {
    step: "06",
    title: "Approval & Evidence",
    desc: "Every completion claim is backed by auditable evidence. Phase progression requires gate evaluation. Clients review via projected surfaces.",
  },
];

const guidedBuilderFeatures = [
  {
    title: "Elicitation Engine",
    description:
      "Structured question flows extract domain knowledge, quality expectations, and business rules from stakeholders — before any pipeline runs.",
  },
  {
    title: "Profile-Driven Configuration",
    description:
      "Industry-specific profiles (fintech, healthcare, SaaS) pre-load relevant checks, thresholds, and compliance requirements. Customize from a known-good baseline.",
  },
  {
    title: "Pack Assembly",
    description:
      "Answers compile into executable configuration packs — vertical bundles of checks, thresholds, and output templates that any executor can consume.",
  },
];

const projectionSurfaces = [
  {
    title: "Client Dashboards",
    description:
      "Real-time visibility into engagement status, deliverable progress, and quality metrics. Clients see governed state — not internal chatter.",
  },
  {
    title: "Operational Views",
    description:
      "Internal dashboards for engagement managers showing pipeline health, blocked items, upcoming gates, and resource allocation across engagements.",
  },
  {
    title: "Audit Trails",
    description:
      "Every decision, approval, and state change is logged with timestamp, actor, and evidence. Exportable for compliance and post-mortem analysis.",
  },
];

const toolArchFeatures = [
  {
    title: "11 Tool Namespaces",
    description:
      "Calendar, GitHub, Sonos, memory, notifications, data ops, pipeline orchestration, and more. Each namespace is self-describing with JSON manifests.",
  },
  {
    title: "Handler Purity",
    description:
      "Tool handlers import only the error module — no database access, no side-channel state. Pure functions with validated I/O schemas.",
  },
  {
    title: "Executor-Neutral Contracts",
    description:
      "Work items are defined as contracts, not scripts. The same contract can be executed by the Audit Kit, Claude Code, a human contractor, or a CI pipeline.",
  },
  {
    title: "Pack Abstraction",
    description:
      "Vertical configuration packs bundle checks, thresholds, and output templates for specific domains. Packs are composable and version-controlled.",
  },
];

const safetyFeatures = [
  {
    title: "Policy Engine",
    description:
      "YAML role config with tool-specific overrides — volume caps, repo allowlists, execution modes. Constraints are explicit, not implicit.",
  },
  {
    title: "Approval Gateway",
    description:
      "Single entry point: schema validation, policy check, human approval, execution, logging. No action runs without a trace.",
  },
  {
    title: "51 Governed Entities",
    description:
      "Every entity in the platform — tools, policies, roles, packs, engagement records — is registered, versioned, and auditable.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformJsonLd) }}
      />

      {/* Hero */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            Governed data delivery.
            <br />
            <span className="text-bayesiq-500">From intent to evidence.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            The BayesIQ Platform turns scattered interactions into tracked
            commitments, auditable decisions, and governed deliverables. Policy
            gates enforce what can happen. Approval workflows control when.
            Audit trails prove it did.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#truth-layers"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              See How It Works
            </a>
            <Link
              href="/audit-kit"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              Start with the Audit Kit &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Three Truth Layers */}
      <section
        id="truth-layers"
        className="border-t border-bayesiq-200 px-6 py-20"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Three layers of truth
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every piece of information moves through three distinct layers.
            Nothing reaches operational state without human sign-off.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {truthLayers.map((layer) => (
              <div key={layer.title} className={layer.style}>
                <p className={layer.labelStyle}>{layer.layer}</p>
                <h3 className="mt-2 text-lg font-bold text-bayesiq-900">
                  {layer.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {layer.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Engagement Pipeline */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Client engagement pipeline
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every engagement follows the same path: raw evidence in, governed
            deliverables out. No shortcuts, no untracked decisions.
          </p>
          <div className="mt-12 space-y-8">
            {engagementPipeline.map((item) => (
              <div key={item.step} className="flex gap-6">
                <span className="text-2xl font-bold text-bayesiq-300">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-bayesiq-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-bayesiq-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guided Builder */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Guided builder
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Capture domain knowledge before pipelines run — not after they fail.
            The guided builder turns stakeholder input into executable
            configuration.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {guidedBuilderFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-bayesiq-200 bg-bayesiq-50 p-6"
              >
                <h3 className="text-base font-bold text-bayesiq-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projection Surfaces */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Projection surfaces
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Different stakeholders see different views — all derived from the
            same governed state. No copy-paste dashboards, no stale status
            decks.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {projectionSurfaces.map((surface) => (
              <div
                key={surface.title}
                className="rounded-lg border border-bayesiq-200 bg-white p-6"
              >
                <h3 className="text-base font-bold text-bayesiq-900">
                  {surface.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {surface.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Architecture */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Tool architecture
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every capability in the platform is a registered tool with a JSON
            manifest, validated I/O, and policy enforcement. No implicit
            behavior, no undocumented side effects.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {toolArchFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-bayesiq-200 bg-bayesiq-50 p-6"
              >
                <h3 className="text-base font-bold text-bayesiq-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety by Default */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Safety by default
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            The platform is restrictive by design. Every action requires policy
            clearance and leaves an audit trail. Constraints are explicit, not
            bolted on.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {safetyFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-bayesiq-200 bg-white p-6"
              >
                <h3 className="text-base font-bold text-bayesiq-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridge to Audit Kit */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
            Where to start
          </p>
          <h2 className="mt-2 text-2xl font-bold text-bayesiq-900">
            Platform or Audit Kit?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-bayesiq-600">
            The <strong>Audit Kit</strong> is the fastest way to prove value —
            drop a CSV, get a scored audit, a dbt project, and a dashboard. No
            contracts, no setup.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-bayesiq-600">
            The <strong>Platform</strong> is for organizations that need
            governed delivery across multiple engagements — policy enforcement,
            approval workflows, and audit trails at scale.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/audit-kit"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Try the Audit Kit
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              Book a platform walkthrough &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTA
        headline="See the platform in action"
        description="Start with a data audit or book a call to scope a governed engagement."
        buttonText="Book a Call"
      />
    </>
  );
}
