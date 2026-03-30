"use client";

import { useState, useEffect, type ReactNode } from "react";

type TabKey = "dashboard" | "report" | "workflow";

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "report", label: "Board Report" },
  { key: "workflow", label: "Workflow" },
  { key: "dashboard", label: "Dashboard" },
];

interface VerticalTabsProps {
  dashboard: ReactNode;
  report: ReactNode;
  workflow: ReactNode;
  initialTab?: TabKey;
}

function hashToTab(hash: string): TabKey | null {
  const key = hash.replace("#", "") as TabKey;
  if (TABS.some((t) => t.key === key)) return key;
  return null;
}

export default function VerticalTabs({
  dashboard,
  report,
  workflow,
  initialTab = "report",
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // Sync from URL hash on mount (C-014: useEffect guard for SSR)
  useEffect(() => {
    const fromHash = hashToTab(window.location.hash);
    if (fromHash) setActiveTab(fromHash);
  }, []);

  function handleTabClick(key: TabKey) {
    setActiveTab(key);
    history.replaceState(null, "", `#${key}`);
  }

  const content: Record<TabKey, ReactNode> = { dashboard, report, workflow };

  return (
    <div className="mt-10">
      {/* Tab bar */}
      <div className="border-b border-biq-border" role="tablist">
        <div className="flex gap-0 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-biq-dark-surface-1 text-biq-text-primary"
                  : "text-biq-text-muted hover:text-biq-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6" role="tabpanel">
        {content[activeTab]}
      </div>
    </div>
  );
}
