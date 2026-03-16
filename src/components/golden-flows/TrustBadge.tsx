import type { ApprovalStatusValue } from "@/lib/governance";

interface TrustBadgeProps {
  status: ApprovalStatusValue | null;
  size?: "sm" | "md";
  showLabel?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

const STATUS_CONFIG: Record<
  ApprovalStatusValue,
  { label: string; bg: string; text: string; iconPath: string }
> = {
  approved: {
    label: "Approved",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    // Checkmark circle
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    // Clock circle
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-700",
    // X circle
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z",
  },
  deferred: {
    label: "Deferred",
    bg: "bg-gray-100",
    text: "text-gray-500",
    // Minus circle
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z",
  },
};

export default function TrustBadge({
  status,
  size = "md",
  showLabel = true,
  onClick,
}: TrustBadgeProps) {
  if (status === null) return null;

  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  const badge = (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${textSize} font-medium ${config.bg} ${config.text}`}
      aria-label={config.label}
      data-testid="trust-badge"
    >
      <svg
        className={`${iconSize} shrink-0`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d={config.iconPath} clipRule="evenodd" />
      </svg>
      {showLabel && <span>{config.label}</span>}
    </span>
  );

  if (onClick) {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(undefined); } }}
        className="cursor-pointer hover:ring-2 hover:ring-bayesiq-300 rounded-full inline-flex"
        aria-haspopup="dialog"
        data-testid="trust-badge-button"
      >
        {badge}
      </span>
    );
  }

  return badge;
}

/** Exported for testing */
export { STATUS_CONFIG };
export type { TrustBadgeProps };
