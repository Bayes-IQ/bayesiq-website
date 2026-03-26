/**
 * Lightweight loading skeleton shown as the <Suspense> fallback
 * while AssessmentContent resolves useSearchParams.
 */
export default function AssessmentLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="flex flex-col items-center gap-6">
        {/* Dot placeholders */}
        <div className="flex gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="block h-2.5 w-2.5 rounded-full bg-biq-surface-2"
            />
          ))}
        </div>
        {/* Question text placeholder */}
        <div className="w-full space-y-3">
          <div className="h-6 w-3/4 animate-pulse rounded bg-biq-surface-2" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-biq-surface-1" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-biq-surface-1" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-biq-surface-1" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-biq-surface-1" />
        </div>
      </div>
    </div>
  );
}
