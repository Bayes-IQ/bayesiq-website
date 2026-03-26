interface InlineEvidenceProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps finding IDs, file names, scores, and other evidence artifacts
 * in JetBrains Mono (font-mono) with a subtle background.
 */
export default function InlineEvidence({
  children,
  className = "",
}: InlineEvidenceProps) {
  return (
    <code
      className={`rounded bg-biq-surface-2 px-1.5 py-0.5 font-mono text-xs font-medium ${className}`}
    >
      {children}
    </code>
  );
}
