import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

const playgroundEnabled =
  process.env.NEXT_PUBLIC_ENABLE_PLAYGROUND === "true";

export default function Footer() {
  return (
    <footer className="border-t border-bayesiq-200 bg-bayesiq-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Newsletter signup */}
        <div className="mb-10 rounded-xl border border-bayesiq-200 bg-white px-6 py-8 md:px-8">
          <div className="md:flex md:items-start md:justify-between md:gap-12">
            <div className="mb-6 md:mb-0 md:max-w-xs">
              <p className="text-sm font-semibold text-bayesiq-900">
                Data insights, twice a month.
              </p>
              <p className="mt-1 text-xs text-bayesiq-500">
                Telemetry tips, audit checklists, and short case notes for
                practitioners who care about metric integrity.
              </p>
            </div>
            <div className="flex-1">
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Brand + nav */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-bold text-bayesiq-900">BayesIQ</p>
            <p className="mt-1 text-sm text-bayesiq-500">
              Automated data audit tooling and expert services for teams that can&apos;t afford bad metrics.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6">
            <Link href="/services" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Products
            </Link>
            <Link href="/approach" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Approach
            </Link>
            {playgroundEnabled && (
              <Link href="/playground" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
                Playground
              </Link>
            )}
            <Link href="/case-studies" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Live Demo
            </Link>
            <Link href="/blog" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Blog
            </Link>
            <Link href="/contact" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Terms of Service
            </Link>
          </nav>
        </div>

        {/* Legal */}
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-bayesiq-400">
            &copy; {new Date().getFullYear()} BayesIQ. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-bayesiq-400 hover:text-bayesiq-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-bayesiq-400 hover:text-bayesiq-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
