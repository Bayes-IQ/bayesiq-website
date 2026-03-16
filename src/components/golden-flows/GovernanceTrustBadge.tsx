"use client";

import type { ApprovalStatusValue } from "@/lib/governance";
import TrustBadge from "./TrustBadge";
import { useGovernanceDetail } from "./GovernanceDetailProvider";

interface GovernanceTrustBadgeProps {
  status: ApprovalStatusValue | null;
  size?: "sm" | "md";
  objectId?: string;
  objectType?: "finding" | "question";
}

/**
 * Client-side wrapper that connects TrustBadge to the GovernanceDetailProvider.
 * Use this inside server components that need clickable trust badges.
 * Falls back to a plain (non-clickable) TrustBadge when objectId is not provided
 * or when outside a GovernanceDetailProvider.
 */
export default function GovernanceTrustBadge({
  status,
  size = "sm",
  objectId,
  objectType = "finding",
}: GovernanceTrustBadgeProps) {
  const { openGovernanceDetail } = useGovernanceDetail();

  return (
    <TrustBadge
      status={status}
      size={size}
      onClick={objectId
        ? (e) => {
            e?.preventDefault();
            e?.stopPropagation();
            openGovernanceDetail(objectId, objectType);
          }
        : undefined
      }
    />
  );
}
