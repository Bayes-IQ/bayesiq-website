interface CaseStudyCardProps {
  industry: string;
  title: string;
  problem: string;
  found: string;
  fix: string;
  result: string;
}

export default function CaseStudyCard({
  industry,
  title,
  problem,
  found,
  fix,
  result,
}: CaseStudyCardProps) {
  return (
    <div className="rounded-xl border border-bayesiq-200 p-8">
      <span className="text-xs font-medium uppercase tracking-wider text-accent">
        {industry}
      </span>
      <h3 className="mt-2 text-xl font-semibold text-bayesiq-900">{title}</h3>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">Problem</p>
          <p className="mt-1 text-sm text-bayesiq-700">{problem}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">What We Found</p>
          <p className="mt-1 text-sm text-bayesiq-700">{found}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">Fix</p>
          <p className="mt-1 text-sm text-bayesiq-700">{fix}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">Result</p>
          <p className="mt-1 text-sm font-medium text-bayesiq-900">{result}</p>
        </div>
      </div>
    </div>
  );
}
