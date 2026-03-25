/**
 * Reusable bento grid layout wrapper.
 * Responsive: 1-col mobile, 2-col tablet, 4-col desktop.
 * Server component.
 */

interface BentoGridProps {
  children: React.ReactNode;
}

export default function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}
