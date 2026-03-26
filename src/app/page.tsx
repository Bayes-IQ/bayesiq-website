import type { Metadata } from "next";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import PathCard from "@/components/PathCard";
import ProofStrip from "@/components/ProofStrip";
import GovernanceChain from "@/components/GovernanceChain";
import { SHOW_SOCIAL_PROOF } from "@/lib/flags";

export const metadata: Metadata = {
  title: "BayesIQ — Governed Analytics",
  description:
    "BayesIQ delivers governed analytics consulting and a platform for teams that need trustworthy metrics, auditable pipelines, and evidence-backed decisions.",
};

export default function HomePage() {
  return (
    <>
      {/* ──────────────────────────────────────────────
          Section 1: Hero
          ──────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-bayesiq-900 md:text-6xl">
            Your data tells a story.
            <br />
            Make sure it&apos;s the right one.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-bayesiq-600">
            BayesIQ delivers governed analytics — whether you need us hands-on
            or want the platform embedded in your workflow. Every finding
            reviewed. Every decision attributed.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/assessment"
              className="rounded-lg bg-bayesiq-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Take the Assessment
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              Talk to Us &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          Section 2: Two-Path Cards
          ──────────────────────────────────────────── */}
      <section className="bg-bayesiq-50 px-6 py-20 md:py-24">
        <SectionReveal>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              <PathCard
                headline="Fix Your Metrics"
                description="Audit-first analytics. We find it, fix it, prove it."
                audience="For data team leads, VPs Analytics, and CFOs"
                href="/consulting"
                cta="Explore Consulting"
                variant="primary"
              />
              <PathCard
                headline="Govern Your AI Outputs"
                description="The governance layer that produces an auditable chain from raw AI output to approved deliverable."
                audience="For CTOs, compliance leads, and technical operators"
                href="/platform"
                cta="Explore the Platform"
                variant="secondary"
              />
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ──────────────────────────────────────────────
          Section 3: Proof Strip
          ──────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-24">
        <SectionReveal>
          <div className="mx-auto max-w-4xl">
            <ProofStrip />
          </div>
        </SectionReveal>
      </section>

      {/* ──────────────────────────────────────────────
          Section 4: Governance Chain
          ──────────────────────────────────────────── */}
      <section className="bg-bayesiq-900 px-6 py-20 md:py-24">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <GovernanceChain variant="simple" theme="light" />
            <p className="mt-10 text-lg leading-relaxed text-bayesiq-300">
              Every finding reviewed. Every decision attributed.
              <br className="hidden sm:inline" />
              Every transition evidence-backed.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* ──────────────────────────────────────────────
          Section 5: Assessment CTA
          ──────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-24">
        <SectionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-bayesiq-900 md:text-4xl">
              How reliable is your data?
            </h2>
            <p className="mt-4 text-lg text-bayesiq-600">
              Find out in 2 minutes.
            </p>
            <Link
              href="/assessment"
              className="mt-8 inline-block rounded-lg bg-bayesiq-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Take the Assessment
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* ──────────────────────────────────────────────
          Section 6: Social Proof (hidden until content ready)
          ──────────────────────────────────────────── */}
      <section
        data-testid="social-proof"
        className={`bg-bayesiq-50 px-6 py-20 md:py-24 ${
          SHOW_SOCIAL_PROOF ? "" : "hidden"
        }`}
        aria-hidden={!SHOW_SOCIAL_PROOF}
      >
        <div className="mx-auto max-w-5xl">
          {/* Logo bar placeholder */}
          <div className="flex items-center justify-center gap-12">
            <span className="text-sm text-bayesiq-400">
              Client logos will appear here
            </span>
          </div>

          {/* Quote pull placeholder */}
          <blockquote className="mt-12 text-center">
            <p className="text-lg italic text-bayesiq-600">
              &ldquo;Quote placeholder&rdquo;
            </p>
            <footer className="mt-4 text-sm text-bayesiq-400">
              — Name, Title, Company
            </footer>
          </blockquote>
        </div>
      </section>
    </>
  );
}
