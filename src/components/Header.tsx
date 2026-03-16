"use client";

import Link from "next/link";
import { useState } from "react";

const playgroundEnabled =
  process.env.NEXT_PUBLIC_ENABLE_PLAYGROUND === "true";
const goldenFlowsLive =
  process.env.NEXT_PUBLIC_GOLDEN_FLOWS_STATE === "live";

const navItems = [
  { label: "See It Work", path: "/golden-flows" },
  { label: "Products", path: "/services" },
  { label: "Approach", path: "/approach" },
  ...(playgroundEnabled
    ? [{ label: "Playground", path: "/playground" }]
    : []),
  { label: "Case Studies", path: "/case-studies" },
  { label: "Blog", path: "/blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-bayesiq-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-bayesiq-900">
          BayesIQ
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-sm text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-lg bg-bayesiq-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
          >
            Get in Touch
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6 text-bayesiq-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-bayesiq-200 px-6 py-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block py-2 text-sm text-bayesiq-600"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 block rounded-lg bg-bayesiq-900 px-4 py-2 text-center text-sm font-medium text-white"
            onClick={() => setMenuOpen(false)}
          >
            Get in Touch
          </Link>
        </nav>
      )}
    </header>
  );
}
