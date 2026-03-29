import type { ReactNode } from "react";

interface Differentiator {
  icon: ReactNode;
  text: string;
}

const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: (
      <svg className="h-5 w-5 text-biq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.702a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.69" />
      </svg>
    ),
    text: "Findings connected to business meaning",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-biq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    text: "Operational and executive surfaces produced",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-biq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: "Remediation governed and tracked",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-biq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    text: "Evidence and decisions preserved",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-biq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    text: "Metric confidence legible over time",
  },
];

export default function BayesIQDifference() {
  return (
    <section className="mt-12" data-testid="bayesiq-difference">
      <h2 className="text-lg font-bold tracking-tight text-biq-text-primary mb-4">
        What makes BayesIQ different
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DIFFERENTIATORS.map((d) => (
          <div
            key={d.text}
            className="flex items-start gap-3 rounded-lg border border-biq-border-subtle bg-biq-surface-1/50 px-4 py-3"
          >
            <span className="flex-shrink-0 mt-0.5" aria-hidden="true">{d.icon}</span>
            <p className="text-sm text-biq-text-secondary leading-snug">{d.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
