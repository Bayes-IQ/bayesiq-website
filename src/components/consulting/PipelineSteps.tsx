/**
 * 6-stage methodology pipeline.
 * Adapted from /approach page pipeline steps.
 * Server component.
 */

interface PipelineStep {
  number: string;
  label: string;
  description: string;
}

const defaultSteps: PipelineStep[] = [
  {
    number: "01",
    label: "Ingest",
    description:
      "Connect to your warehouse and load datasets. Read-only access, no production changes.",
  },
  {
    number: "02",
    label: "Profile",
    description:
      "Scan schemas, column types, null rates, cardinality, and distributions across every table.",
  },
  {
    number: "03",
    label: "Check",
    description:
      "Run 40+ automated quality checks: uniqueness, referential integrity, accepted values, freshness, near-duplicate detection.",
  },
  {
    number: "04",
    label: "Validate",
    description:
      "Recompute KPIs from source data and compare against production dashboards. Flag every metric that diverges.",
  },
  {
    number: "05",
    label: "Score",
    description:
      "Assign a 0-100 reliability score based on check results, weighted by severity and business impact.",
  },
  {
    number: "06",
    label: "Generate",
    description:
      "Produce the audit report, dbt project, metric contracts, and interactive dashboards from validated data.",
  },
];

interface PipelineStepsProps {
  steps?: PipelineStep[];
}

export default function PipelineSteps({
  steps = defaultSteps,
}: PipelineStepsProps) {
  return (
    <div className="relative">
      {/* Connector line */}
      <div
        className="absolute left-5 top-0 hidden h-full w-px bg-biq-surface-2 md:block"
        aria-hidden="true"
      />
      <ol className="space-y-8">
        {steps.map((step) => (
          <li key={step.number} className="relative md:pl-14">
            {/* Step number circle */}
            <div className="mb-2 flex items-center gap-3 md:absolute md:left-0 md:top-0 md:mb-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bayesiq-900 font-mono text-sm font-medium text-white">
                {step.number}
              </span>
              <h3 className="font-display text-lg font-semibold text-biq-text-primary md:hidden">
                {step.label}
              </h3>
            </div>
            <div>
              <h3 className="hidden font-display text-lg font-semibold text-biq-text-primary md:block">
                {step.label}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-biq-text-secondary">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
