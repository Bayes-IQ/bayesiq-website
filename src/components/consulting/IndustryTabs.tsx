"use client";

/**
 * Tab bar + content switcher for 4 industry verticals.
 * Client component (tab state + URL param sync).
 * Implements WAI-ARIA Tabs pattern with full keyboard navigation.
 */

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  verticals,
  VERTICAL_IDS,
  DEFAULT_VERTICAL_ID,
} from "@/lib/industry-data";
import type { VerticalData } from "@/lib/industry-data";
import BeforeAfter from "./BeforeAfter";

function resolveVerticalId(param: string | null): string {
  if (param && VERTICAL_IDS.includes(param)) return param;
  return DEFAULT_VERTICAL_ID;
}

function IndustryTabsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const paramValue = searchParams.get("vertical");
  const [activeId, setActiveId] = useState(() => resolveVerticalId(paramValue));

  // Sync with URL changes
  useEffect(() => {
    setActiveId(resolveVerticalId(searchParams.get("vertical")));
  }, [searchParams]);

  const selectTab = useCallback(
    (id: string, focusIndex: number) => {
      setActiveId(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("vertical", id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      tabRefs.current[focusIndex]?.focus();
    },
    [searchParams, router, pathname]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const count = verticals.length;
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = (currentIndex + 1) % count;
          break;
        case "ArrowLeft":
          nextIndex = (currentIndex - 1 + count) % count;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = count - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      selectTab(verticals[nextIndex].id, nextIndex);
    },
    [selectTab]
  );

  const activeVertical = verticals.find((v) => v.id === activeId) ?? verticals[0];
  const activeIndex = verticals.findIndex((v) => v.id === activeId);

  return (
    <div>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Industry verticals"
        className="flex gap-1 overflow-x-auto border-b border-biq-border"
      >
        {verticals.map((vertical, index) => (
          <button
            key={vertical.id}
            id={`tab-${vertical.id}`}
            role="tab"
            aria-selected={vertical.id === activeId}
            aria-controls={`panel-${vertical.id}`}
            tabIndex={vertical.id === activeId ? 0 : -1}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => selectTab(vertical.id, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              vertical.id === activeId
                ? "border-bayesiq-900 text-biq-text-primary"
                : "border-transparent text-biq-text-muted hover:text-biq-text-secondary"
            }`}
          >
            {vertical.displayName}
          </button>
        ))}
      </div>

      {/* Tab panels — all rendered, only active visible */}
      {verticals.map((vertical, index) => (
        <div
          key={vertical.id}
          id={`panel-${vertical.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${vertical.id}`}
          tabIndex={0}
          className={vertical.id === activeId ? "" : "hidden"}
        >
          <VerticalPanel vertical={vertical} />
        </div>
      ))}
    </div>
  );
}

function VerticalPanel({ vertical }: { vertical: VerticalData }) {
  return (
    <div className="space-y-10 py-8">
      {/* Headline problem */}
      <p className="text-lg font-medium text-biq-text-primary">
        {vertical.headline}
      </p>

      {/* Failure patterns */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-biq-text-muted">
          Common failure patterns
        </h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vertical.failurePatterns.map((pattern) => (
            <div key={pattern.title}>
              <h4 className="text-sm font-semibold text-biq-text-primary">
                {pattern.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-biq-text-secondary">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Representative finding */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-biq-text-muted">
          Representative finding
        </h3>
        <div className="mt-4">
          <BeforeAfter
            beforeLabel={vertical.finding.beforeLabel}
            beforeValue={vertical.finding.beforeValue}
            afterLabel={vertical.finding.afterLabel}
            afterValue={vertical.finding.afterValue}
            annotation={vertical.finding.annotation}
          />
        </div>
      </div>

      {/* Score result */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-biq-text-muted">
          Result
        </h3>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-3xl font-bold text-biq-status-error">
              {vertical.result.scoreBefore}
            </span>
            <span className="text-biq-text-muted" aria-hidden="true">
              &rarr;
            </span>
            <span className="font-mono text-3xl font-bold text-biq-status-success">
              {vertical.result.scoreAfter}
            </span>
          </div>
          <span className="text-xs text-biq-text-muted">Reliability Score</span>
        </div>
        <p className="mt-2 text-sm text-biq-text-secondary">
          {vertical.result.summary}
        </p>
      </div>

      {/* CTA */}
      <a
        href="/contact"
        className="inline-block rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
      >
        {vertical.ctaLabel}
      </a>
    </div>
  );
}

export default function IndustryTabs() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center text-sm text-biq-text-muted">
          Loading...
        </div>
      }
    >
      <IndustryTabsInner />
    </Suspense>
  );
}
