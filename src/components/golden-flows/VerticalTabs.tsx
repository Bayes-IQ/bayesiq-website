"use client";

import { useState, useEffect, type ReactNode } from "react";

type TabKey = "dashboard" | "report" | "workflow";

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "report", label: "Board Report" },
  { key: "workflow", label: "Workflow" },
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
  initialTab = "dashboard",
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
      <div className="border-b border-bayesiq-200" role="tablist">
        <div className="flex gap-0 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-bayesiq-900 text-bayesiq-900"
                  : "text-bayesiq-500 hover:text-bayesiq-700"
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
