"use client";

import { useState } from "react";

interface ScreenshotInfo {
  url: string;
  alt_text: string;
  type: string;
}

interface Props {
  screenshot: ScreenshotInfo | null;
}

/**
 * Browser-chrome frame for a dashboard screenshot.
 * C-013: Uses plain <img> with onError fallback, not Next/Image.
 */
export default function DashboardScreenshot({ screenshot }: Props) {
  const [hasError, setHasError] = useState(false);

  // Only show screenshots where type === "dashboard"
  if (screenshot && screenshot.type !== "dashboard") return null;

  const showPlaceholder = !screenshot || hasError;

  return (
    <div className="overflow-hidden rounded-xl shadow-lg" data-testid="dashboard-screenshot">
      {/* Browser chrome title bar */}
      <div className="flex items-center gap-2 bg-gray-200 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-gray-500">
          {screenshot?.alt_text ?? "Dashboard"}
        </span>
      </div>

      {/* Screenshot content */}
      {showPlaceholder ? (
        <div className="flex h-48 items-center justify-center bg-gray-100 text-sm text-biq-text-muted">
          Dashboard preview coming soon
        </div>
      ) : (
        <img
          src={screenshot.url}
          alt={screenshot.alt_text}
          className="w-full"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
