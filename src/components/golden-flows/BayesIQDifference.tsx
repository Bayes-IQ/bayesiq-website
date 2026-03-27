const DIFFERENTIATORS = [
  {
    icon: "🔗",
    text: "Findings connected to business meaning",
  },
  {
    icon: "📊",
    text: "Operational and executive surfaces produced",
  },
  {
    icon: "✓",
    text: "Remediation governed and tracked",
  },
  {
    icon: "📋",
    text: "Evidence and decisions preserved",
  },
  {
    icon: "📈",
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
            <span className="text-lg flex-shrink-0" aria-hidden="true">{d.icon}</span>
            <p className="text-sm text-biq-text-secondary leading-snug">{d.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
